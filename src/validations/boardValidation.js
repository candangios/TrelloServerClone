import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiError"
import { BOARD_TYPE } from "~/utils/constants"


const createNew = async (req, res, next) => {
  const conrrectCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(50).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
  })
  try {
    await conrrectCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // MiddleWear handle error
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}
export const boardValidation = {
  createNew
}