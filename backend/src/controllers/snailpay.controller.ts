import type { NextFunction, Request, Response } from 'express'
import { SnailPayService } from '../services/snailpay.service.js'
import type { ChargePayload } from '../validations/snailpay.validation.js'

const snailPayService = new SnailPayService()

export const createCharge = (
  request: Request<unknown, unknown, ChargePayload>,
  response: Response,
  next: NextFunction,
): void => {
  try {
    const result = snailPayService.createCharge(request.body)
    const statusCode = result.status === 'approved' ? 201 : result.status === 'rejected' ? 422 : 500
    response.status(statusCode).json(result)
  } catch (error) {
    next(error)
  }
}
