import { ObjectId } from "mongodb"
import { GET_DB } from "~/config/mongodb"
import { BOARD_INVITATION_STATUS, INVITATION_TYPE } from "~/utils/constants"
import { userModel } from "./userModel"
import { boardModel } from "./boardModel"

const Joi = require("joi")
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("~/utils/validators")


const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required().valid(...Object.values(INVITATION_TYPE)),
  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS))
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELD = ["_id", "inviterId", "inviteeId", "createdAt", "type"]
const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}


const createNewBoardInvitation = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    let newInvitationData = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId)
    }
    if (validData.boardInvitation) {
      newInvitationData.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId)
      }
    }

    return await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationData)
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (invitationId) => {
  try {
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({ _id: new ObjectId(invitationId) })
  } catch (error) {
    throw error
  }
}

const update = async (invitationId, updateData) => {

  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELD.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result

  } catch (error) {
    throw new Error(error)
  }
}
const findByUserId = async (userId) => {
  try {
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).aggregate([
      {
        $match: { $and: [{ inviteeId: new ObjectId(userId) }, { _destroy: false }] }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviter',
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'invitee',
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
        }
      },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: 'boardInvitation.boardId',
          foreignField: '_id',
          as: 'board',
        }
      }

    ]).toArray()
    return result ?? []
  } catch (error) {
    throw new Error(error)
  }

}
export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  update,
  findByUserId
}
