import { cloneDeep } from "lodash"
import { boardModel } from "~/models/boardModel"
import { slugify } from "~/utils/formatters"

const { StatusCodes } = require("http-status-codes")
const { default: ApiError } = require("~/utils/apiError")

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    const result = await boardModel.findOneById(createdBoard.insertedId)
    return result
  } catch (error) {
    throw error
  }
}
const boardDetails = async (id) => {
  try {
    const board = await boardModel.boardDetail(id)
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

export const broadService = { createNew, boardDetails }