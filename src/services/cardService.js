import { ObjectId } from "mongodb"
import { cardModel } from "~/models/cardModel"
import { columnModel } from "~/models/columnModel"
import { CloudinaryProvider } from "~/providers/CloudinaryProvider"
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
const update = async (userInfo, cardId, cardCoverImageFile, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard
    if (cardCoverImageFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverImageFile.buffer, 'CardsImage')
      updatedCard = await cardModel.update(userInfo._id, cardId, { cover: uploadResult.secure_url })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        createdAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftnewComment(cardId, commentData)
    } else {
      updatedCard = await cardModel.update(userInfo._id, cardId, updateData)
    }
    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}