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

export const columnController = {
  createNew,
}