import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/')
  .post(authMiddleWare.isAuthorized, invitationValidation.createNewBoardInvitation, invitationController.createNewBoardInvitation)
  .put(authMiddleWare.isAuthorized)




export const invitationRouters = Router