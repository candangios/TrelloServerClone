import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouters } from './boardRoutes.js'
import { columnModel } from '~/models/columnModel.js'
import { columnRouters } from './columnRouters.js'
import { cardRouters } from './cardRouters.js'
import { userRouters } from './userRoutes.js'
import { invitationRouters } from './invitationRouters.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API v1' })
})
//BoardAPI
Router.use('/boards', boardRouters)
//ColumnAPI
Router.use('/columns', columnRouters)
//CardAPI
Router.use('/cards', cardRouters)
Router.use('/users', userRouters)
Router.use('/invitations', invitationRouters)

export const APIs_V1 = Router
