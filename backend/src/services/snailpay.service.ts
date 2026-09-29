import { randomBytes, randomUUID } from 'node:crypto'
import type { SnailPayChargeInput, SnailPayResponse, SnailPayStatus } from '../types/snailpay.js'

interface ResultDefinition {
  status: SnailPayStatus
  statusDetail: string
  authorizationCode: string | null
}

const buildResponse = (input: SnailPayChargeInput, result: ResultDefinition): SnailPayResponse => ({
  id: randomUUID(),
  status: result.status,
  status_detail: result.statusDetail,
  transaction_amount: input.transaction_amount,
  date_created: new Date().toISOString(),
  authorization_code: result.authorizationCode,
  reference: `SNP-${Date.now()}-${randomBytes(2).toString('hex').toUpperCase()}`,
  payer_id: input.payer_id,
  payer_email: input.payer_email,
  card_number: input.card_number,
  cvv: input.cvv,
})

export class SnailPayService {
  createCharge(input: SnailPayChargeInput): SnailPayResponse {
    if (input.card_number.endsWith('0000')) {
      return buildResponse(input, {
        status: 'error',
        statusDetail: 'internal_service_error',
        authorizationCode: null,
      })
    }

    const isApproved =
      input.card_number === '1234123412341234' &&
      input.expiration_date === '12/26' &&
      input.cvv === '543'

    if (!isApproved) {
      return buildResponse(input, {
        status: 'rejected',
        statusDetail: 'card_data_mismatch',
        authorizationCode: null,
      })
    }

    return buildResponse(input, {
      status: 'approved',
      statusDetail: 'accredited',
      authorizationCode: randomBytes(4).toString('hex').toUpperCase(),
    })
  }
}
