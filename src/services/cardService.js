import { ObjectId } from "mongodb"
import { cardModel } from "~/models/cardModel"
import { columnModel } from "~/models/columnModel"
const createNew = async (reqBody) => {
  try {
    const newcard = {
      ...reqBody,
    }
    const createcard = await cardModel.createNew(newcard)
    const result = await cardModel.findOneById(createcard.insertedId)
    await columnModel.pushCardOrderIds(result)
    return result
  } catch (error) {
    throw error
  }
}

export const cardService = { createNew }