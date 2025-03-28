import { StatusCodes } from "http-status-codes"
import { broadService } from "~/services/boardService"
const createNew = async (req, res, next) => {
  try {
    const newBoard = await broadService.createNew(req.body)
    res.status(StatusCodes.OK).json(newBoard)
  } catch (error) {
    next(error)
  }

}
const boardDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await broadService.boardDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }

}
export const boardController = {
  createNew,
  boardDetails
}