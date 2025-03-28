
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

export const columnService = { createNew }