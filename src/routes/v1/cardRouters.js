import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/')
  .post(authMiddleWare.isAuthorized, cardValidation.createNew, cardController.createNew)

export const cardRouters = Router