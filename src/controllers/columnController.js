import { StatusCodes } from "http-status-codes"
import { columnService } from "~/services/columnService"
const createNew = async (req, res, next) => {
  try {
    const newColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.OK).json(newColumn)
  } catch (error) {
    next(error)
  }

}
const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const columnId = req.params.id
    const newColumn = await columnService.update(userId, columnId, req.body)
    res.status(StatusCodes.OK).json(newColumn)
  } catch (error) {
    next(error)
  }

}

export const columnController = {
  createNew,
  update
}