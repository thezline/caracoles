import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/app-error.js'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    })
    return
  }

  response.status(500).json({
    error: 'internal_error',
    message: 'No fue posible procesar la solicitud',
  })
}
