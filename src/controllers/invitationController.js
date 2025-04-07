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
export const invitationController = {
  createNewBoardInvitation
}
