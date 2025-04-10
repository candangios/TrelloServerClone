import { pickUser } from "./userService";

const { StatusCodes } = require("http-status-codes");
const { boardModel } = require("~/models/boardModel");
const { invitationModel } = require("~/models/invitationModel");
const { userModel } = require("~/models/userModel");
const { default: ApiError } = require("~/utils/apiError");
const { BOARD_INVITATION_STATUS, INVITATION_TYPE } = require("~/utils/constants");


const createNewBoardInvitation = async (userId, reqBody) => {
  try {
    const inviter = await userModel.findOneById(userId)
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    const board = await boardModel.findOneById(reqBody.boardId)
    if (!invitee || !inviter || !board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or Board not found!')
    }
    const newInvitationData = {
      inviterId: inviter._id.toString(),
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPE.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }
    const createInvite = await invitationModel.createNewBoardInvitation(newInvitationData)
    const result = await invitationModel.findOneById(createInvite.insertedId)
    const resInvitation = {
      ...result,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return result
  } catch (error) {
    throw error;
  }
}
const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUserId(userId)
    const resInvitations = getInvitations.map(i => {
      return { ...i, inviter: i.inviter[0] || {}, invitee: i.invitee[0] || {}, board: i.board[0] || {} }
    })

    return resInvitations
  } catch (error) {
    throw error
  }

}
const updateInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')


    const getBoard = await boardModel.findOneById(getInvitation.boardInvitation.boardId)
    if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    const boardOwnerAndMemberIds = [...getBoard.ownIds, ...getBoard.memberIds].toString()
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You are alreadly a member of this board')
    }
    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status
      },
      updatedAt: Date.now()
    }
    const updatedInvitation = await invitationModel.update(invitationId, updateData)
    if (updatedInvitation.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(userId, getBoard._id)
    }
    return updatedInvitation

  } catch (error) {
    throw error
  }


}
export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateInvitation
}