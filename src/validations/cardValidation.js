import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiError"
import { BOARD_TYPE } from "~/utils/constants"
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"


const createNew = async (req, res, next) => {
  const conrrectCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().optional(),
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  })
  try {
    await conrrectCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // MiddleWear handle error
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}
export const cardValidation = {
  createNew
}