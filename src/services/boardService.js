import { cloneDeep } from "lodash"
import { ObjectId } from "mongodb"
import { boardModel } from "~/models/boardModel"
import { slugify } from "~/utils/formatters"

const { StatusCodes } = require("http-status-codes")
const { default: ApiError } = require("~/utils/apiError")

const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    }
    const createdBoard = await boardModel.createNew(userId, newBoard)
    const result = await boardModel.findOneById(createdBoard.insertedId)
    return result
  } catch (error) {
    throw error
  }
}
const boardDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.boardDetail(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      if (!column.cardOrderIds) {
        column.cardOrderIds = column.cards.map(card => card._id)
      }
    });

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}
const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const boards = await boardModel.getBoards(userId, page, itemsPerPage)
    return boards
  } catch (error) {
    throw error
  }
}
const update = async (userId, boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(userId, boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

export const broadService = {
  createNew,
  boardDetails,
  getBoards,
  update
}