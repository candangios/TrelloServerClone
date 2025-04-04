import { StatusCodes } from "http-status-codes"
import { broadService } from "~/services/boardService"
const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const newBoard = await broadService.createNew(userId, req.body)
    res.status(StatusCodes.OK).json(newBoard)
  } catch (error) {
    next(error)
  }

}
const boardDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const board = await broadService.boardDetails(userId, boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }

}
const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page = 0, itemsPerPage = 12 } = req.query
    const boards = await broadService.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }

}
const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const updatedBoard = await broadService.update(userId, boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNew,
  boardDetails,
  getBoards,
  update
}