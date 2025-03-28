import { StatusCodes } from "http-status-codes"
import ms from "ms"
import { userService } from "~/services/userService"
const createNew = async (req, res, next) => {
  try {
    const newUser = await userService.createNew(req.body)
    res.status(StatusCodes.OK).json(newUser)
  } catch (error) {
    next(error)
  }

}
const login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body)
    res.cookie("accessToken", user.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms('14 days')
    })
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }

}
const verifyAccount = async (req, res, next) => {
  try {
    const newUser = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(newUser)
  } catch (error) {
    next(error)
  }

}

export const userController = {
  createNew,
  verifyAccount,
  login
}