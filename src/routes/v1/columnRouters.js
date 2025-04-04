import express from 'express'
import { columnController } from '~/controllers/columnController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/')
  .post(authMiddleWare.isAuthorized, columnValidation.createNew, columnController.createNew)
Router.route('/:id')
  .put(authMiddleWare.isAuthorized, columnValidation.update, columnController.update)

export const columnRouters = Router