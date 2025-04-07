import { pickUser } from "./userService";

const { StatusCodes } = require("http-status-codes");
const { boardModel } = require("~/models/boardModel");
const { invitationModel } = require("~/models/invitationModel");
const { userModel } = require("~/models/userModel");
const { default: ApiError } = require("~/utils/apiError");
const { INVITATION_TYPE, INVITATION_STATUS } = require("~/utils/constants");


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
        status: INVITATION_STATUS.PEDDING
      }
    }
    const createInvite = await invitationModel.createNewBoardInvitation(newInvitationData)
    console.log(createInvite.insertedId)
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
export const invitationService = {
  createNewBoardInvitation
}