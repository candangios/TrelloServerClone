import { StatusCodes } from "http-status-codes"
import { invitationService } from "~/services/invitationService"

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const newInvitation = await invitationService.createNewBoardInvitation(userId, req.body)
    res.status(StatusCodes.OK).json(newInvitation)
  } catch (error) {
    next(error)
  }
}
const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page = 0, itemsPerPage = 12 } = req.query
    const invitations = await invitationService.getInvitations(userId)
    res.status(StatusCodes.OK).json(invitations)
  } catch (error) {
    next(error)
  }
}
const updateInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const { status } = req.body
    const invitation = await invitationService.updateInvitation(userId, invitationId, status)
    res.status(StatusCodes.OK).json(invitation)
  } catch (error) {
    next(error)
  }
}
export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateInvitation
}
