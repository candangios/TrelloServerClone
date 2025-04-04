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
const update = async (req, res, next) => {
  try {
    const userInfo = req.jwtDecoded
    const cardId = req.params.id
    const cardCoverImageFile = req.file
    const newColumn = await cardService.update(userInfo, cardId, cardCoverImageFile, req.body)
    res.status(StatusCodes.OK).json(newColumn)
  } catch (error) {
    next(error)
  }

}

export const cardController = {
  createNew,
  update
}