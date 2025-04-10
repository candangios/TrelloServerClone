import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleWare.isAuthorized, invitationController.getInvitations)
  .post(authMiddleWare.isAuthorized, invitationValidation.createNewBoardInvitation, invitationController.createNewBoardInvitation)


Router.route('/board/:invitationId')
  .put(authMiddleWare.isAuthorized, invitationController.updateInvitation)




export const invitationRouters = Router