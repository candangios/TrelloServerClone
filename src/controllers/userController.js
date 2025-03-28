import { StatusCodes } from "http-status-codes"
import { userService } from "~/services/userService"
const createNew = async (req, res, next) => {
  try {
    const newUser = await userService.createNew(req.body)
    res.status(StatusCodes.OK).json(newUser)
  } catch (error) {
    next(error)
  }

}

export const userController = {
  createNew,
}