import { StatusCodes } from "http-status-codes"
import { cardService } from "~/services/cardService"
const createNew = async (req, res, next) => {
  try {
    const newCard = await cardService.createNew(req.body)
    res.status(StatusCodes.OK).json(newCard)
  } catch (error) {
    next(error)
  }

}

export const cardController = {
  createNew,
}