import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiError"
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"
import { BOARD_INVITATION_STATUS } from "~/utils/constants"


const createNewBoardInvitation = async (req, res, next) => {
  const conrrectCondition = Joi.object({
    inviteeEmail: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  })
  try {
    await conrrectCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // MiddleWear handle error
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateBoardInvitation = async (req, res, next) => {
  const conrrectCondition = Joi.object({
    status: Joi.string().required().pattern(BOARD_INVITATION_STATUS),
  })
  try {
    await conrrectCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // MiddleWear handle error
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}

export const invitationValidation = {
  createNewBoardInvitation,
  updateBoardInvitation
}