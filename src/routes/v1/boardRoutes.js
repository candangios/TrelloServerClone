import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleWare.isAuthorized, boardController.getBoards)
  .post(authMiddleWare.isAuthorized, boardValidation.createNew, boardController.createNew)


Router.route('/:id')
  .get(authMiddleWare.isAuthorized, boardController.boardDetails)
  .put(authMiddleWare.isAuthorized, boardValidation.update, boardController.update)
export const boardRouters = Router