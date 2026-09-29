import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { AppError } from '../errors/app-error.js'

export const validateBody = (schema: ZodType) => (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  const result = schema.safeParse(request.body)

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Los datos enviados no son válidos'
    next(new AppError(400, 'validation_error', message))
    return
  }

  request.body = result.data
  next()
}
