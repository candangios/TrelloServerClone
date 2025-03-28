import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secrestSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secrestSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}
const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}
export const JwtProvider = { generateToken, verifyToken }