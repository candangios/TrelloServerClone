import { StatusCodes } from "http-status-codes"
import { ObjectId } from "mongodb"
import { userModel } from "~/models/userModel"
import ApiError from "~/utils/apiError"
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { pick } from "lodash"
import { JwtProvider } from "~/providers/JwtProvider"
import { env } from "~/config/environment"
import ms from 'ms'


const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) throw new ApiError(StatusCodes.CONFLICT, 'Email already existed!')

    const nameFromEmail = reqBody.email.split("@")[0]
    const newuser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayname: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.createNew(newuser)
    const result = await userModel.findOneById(createdUser.insertedId)
    const verifycationLink = `http://localhost:5173/account/verification?email=${result.email}&token=${result.verifyToken}`
    const customSubject = 'Please verify your email befor using our service'
    const htmlContent = `
      <h3>Here is your verify link:</h3>
      <h3>${verifycationLink}</h3>
    `

    await BrevoProvider.sendEmail(result.email, customSubject, htmlContent)
    return pickUser(result)
  } catch (error) {
    throw error
  }

}
const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already active!')
    const result = await userModel.update(existUser._id, { isActive: true })
    return pickUser(result)
  } catch (error) {
    throw error
  }

}
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email or Password is incorrect')
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, ms(env.ACCESS_TOKEN_LIFE))
    const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, ms(env.REFRESH_TOKEN_LIFE))
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw error
  }
}

const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'displayname', 'avatar', 'rold', 'isActive', 'createdAt', 'updatedAt'])
}
export const userService = { createNew, verifyAccount, login };
