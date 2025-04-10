import express from 'express'
import { mapOrder } from '~/utils/sorts.js'
// import exitHook from 'exit-hook'
import { env } from './config/environment.js'
import 'dotenv/config'
import { APIs_V1 } from './routes/v1'

import { CLOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { corsOptions } from './config/cors.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import socketIo from 'socket.io'



const START_SERVER = async () => {
  const app = express()

  app.use(cookieParser())
  // parser json

  // fix cache-control
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  const server = http.createServer(app)
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    console.log(socket)
  })


  server.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello, I am running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // exitHook(() => {
  //   CLOSE_DB()
  // })
}
// (async () => {
//   try {
//     await CONNECT_DB()
//     START_SERVER()

//   } catch (error) {
//     console.log(error)
//     process.exit()

//   }
// })
CONNECT_DB()
  .then(() => console.log('Connected to MongoDB clould Atlast'))
  .then(() => START_SERVER())
  .catch((error) => console.log(error))
