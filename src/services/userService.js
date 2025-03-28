import { StatusCodes } from "http-status-codes"
import { ObjectId } from "mongodb"
import { userModel } from "~/models/userModel"
import ApiError from "~/utils/apiError"
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { BrevoProvider } from '~/providers/BrevoProvider'


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
    // verify email todo ...
    return result
  } catch (error) {
    throw error
  }
}

export const userService = { createNew }