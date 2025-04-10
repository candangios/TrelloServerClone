/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPE } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(...Object.keys(BOARD_TYPE)).required(),
  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  ownIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELD = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (userId, newBoard) => {
  try {
    const validData = await validateBeforeCreate(newBoard)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne({ ...validData, ownIds: [new ObjectId(userId)] })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
    _id: new ObjectId(id)
  })
}
const boardDetail = async (userId, boardId) => {

  const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
    {
      $match: {
        $and: [
          { _id: new ObjectId(boardId) },
          { _destroy: false },
          {
            $or: [
              { ownIds: { $all: [new ObjectId(userId)] } },
              { memberIds: { $all: [new ObjectId(userId)] } }
            ]
          }
        ]
      }
    },
    {
      $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      }
    },
    {
      $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      }
    },
    {
      $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'ownIds',
        foreignField: '_id',
        as: 'owners',
        pipeline: [{ '$project': { 'password': 0, 'verifyToken': 0 } }]
      }
    },
    {
      $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'memberIds',
        foreignField: '_id',
        as: 'members',
        pipeline: [{ '$project': { 'password': 0, 'verifyToken': 0 } }]
      }
    },
  ]).toArray()
  return result[0]
}

const pushColumnOrderIds = async (column) => {
  try {
    const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return board || null

  } catch (error) {
    throw error
  }
}
const getBoards = async (userId, page = 0, itemsPerPage = 12) => {
  const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate(
    [
      {
        $match: {
          $and: [
            {
              $or: [
                { ownIds: { $all: [new ObjectId(userId)] } },
                { memberIds: { $all: [new ObjectId(userId)] } }
              ]
            },
            { _destroy: false }
          ]
        }
      }, {
        // sort title board theo A->Z(mặc định B hoa sẽ đứng trước a thường theo bảng mã ASCII)
        $sort: { title: 1 }
      },
      // $facer để sử lý nhiều luồng trong 1 query
      {
        $facet: {
          'queryBoards': [
            {
              $skip: pagingSkipValue(page, itemsPerPage)
            },
            {
              $limit: itemsPerPage
            }
          ],
          'queryTotalBoards': [
            {
              $count: 'countedAllBoards'
            }
          ]
        },
      },
    ],
    {
      // khai báo thêm thuộc tính locale en để fix vụ B hoa a thường ở trên
      collation: { locale: 'en' }
    }
  ).toArray()
  const res = query[0]
  return {
    boards: res.queryBoards || [],
    totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
  }
}
const update = async (userId, boardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELD.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return board || null

  } catch (error) {
    throw error
  }
}

const pushMemberIds = async (userId, boardId) => {
  try {
    const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $push: { memberIds: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return board || null

  } catch (error) {
    throw error
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  boardDetail,
  pushColumnOrderIds,
  getBoards,
  update,
  pushMemberIds
}