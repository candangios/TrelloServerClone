
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  cover: Joi.string().default(null),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ),
  comments: Joi.array().items({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    userAvatar: Joi.string(),
    userDisplayName: Joi.string(),
    content: Joi.string(),
    // note can not used Joi.date().timestamp('javascript').default(Date.now) because $push when add comment is not working
    commentedAt: Joi.date().timestamp()
  }),


  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELD = ['_id', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    await validateBeforeCreate(data)
    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne({ ...data, boardId: new ObjectId(data.boardId), columnId: new ObjectId(data.columnId) })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
    _id: new ObjectId(id)
  })
}
const update = async (userId, cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELD.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const updatedCard = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updatedCard || null

  } catch (error) {
    throw error
  }
}
const unshiftnewComment = async (cardId, commentdata) => {
  try {
    const updatedCard = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $push: { comments: { $each: [commentdata], $position: 0 } } },
      { returnDocument: 'after' }
    )
    console.log(updatedCard)
    return updatedCard
  } catch (error) {
    console.log(error)
    throw error
  }
}
const deleteManyCardByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany(
      { columnId: new ObjectId(columnId) },
    )
    return result
  } catch (error) {
    throw error
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  unshiftnewComment,
  deleteManyCardByColumnId
}