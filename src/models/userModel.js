
import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PASSWORD_RULE } from '~/utils/validators'


const USER_ROLD = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

const INVALID_UPDATE_FIELD = ["_id, email, username,createdAt"]
// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),

  username: Joi.string().required().trim().strict(),
  displayname: Joi.string().required().trim().strict(),

  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLD.ADMIN, USER_ROLD.CLIENT).default(USER_ROLD.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {

    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(await validateBeforeCreate(data))
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
    _id: new ObjectId(id)
  })
}

const findOneByEmail = async (emailValue) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
    email: emailValue
  })
}
const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELD.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB.collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLD,
  createNew,
  findOneById,
  findOneByEmail,
  update
}