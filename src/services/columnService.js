
import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel"

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    }
    const createColumn = await columnModel.createNew(newColumn)
    const result = await columnModel.findOneById(createColumn.insertedId)
    await boardModel.pushColumnOrderIds(result)
    return result
  } catch (error) {
    throw error
  }
}
const update = async (userId, columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const result = await columnModel.update(userId, columnId, updateData)
    return result
  } catch (error) {
    throw error
  }
}

export const columnService = { createNew, update }