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


const START_SERVER = async () => {
  const app = express()
  // parser json
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)
  app.listen(env.APP_PORT, env.APP_HOST, () => {
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
