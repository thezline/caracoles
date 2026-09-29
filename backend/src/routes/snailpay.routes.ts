import { Router } from 'express'
import { createCharge } from '../controllers/snailpay.controller.js'
import { validateBody } from '../middleware/validate.js'
import { chargeSchema } from '../validations/snailpay.validation.js'

export const snailPayRouter = Router()

snailPayRouter.post('/charges', validateBody(chargeSchema), createCharge)
