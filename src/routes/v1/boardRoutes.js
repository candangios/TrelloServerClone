import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => { res.status(StatusCodes.OK).json({ message: 'Note API get list board' }) })
  .post(boardValidation.createNew, boardController.createNew)
Router.route('/:id')
  .get(boardController.boardDetails)
export const boardRouters = Router