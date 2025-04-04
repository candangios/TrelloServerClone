import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authMiddleWare } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/')
  .post(authMiddleWare.isAuthorized, cardValidation.createNew, cardController.createNew)
Router.route('/:id')
  .put(authMiddleWare.isAuthorized,
    multerUploadMiddleware.upload.single('cardCover'),
    cardValidation.update,
    cardController.update)

export const cardRouters = Router