import { StatusCodes } from "http-status-codes"
import ms from "ms"
import { userService } from "~/services/userService"
import ApiError from "~/utils/apiError"
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
const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ logout: true })
  } catch (error) {
    next(error)
  }

}
const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In!'))
  }
}
const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    const updateUser = await userService.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updateUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  logout,
  update
}