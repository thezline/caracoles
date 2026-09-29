import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { snailPayRouter } from './routes/snailpay.routes.js'

export const createApp = () => {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors({ origin: [env.frontendUrl, 'http://127.0.0.1:5173'] }))
  app.use(express.json({ limit: '20kb' }))

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.use('/api/snailpay', snailPayRouter)

  app.use((_request, response) => {
    response.status(404).json({
      error: 'not_found',
      message: 'El recurso solicitado no existe',
    })
  })

  app.use(errorHandler)

  return app
}
