import { describe, expect, it } from 'vitest'
import { SnailPayService } from './snailpay.service.js'
import type { SnailPayChargeInput } from '../types/snailpay.js'

const baseCharge: SnailPayChargeInput = {
  card_number: '1234123412341234',
  expiration_date: '12/26',
  cvv: '543',
  cardholder_name: 'Ada Lovelace',
  transaction_amount: 250,
  payer_id: '8ad535c3-bff0-4fd9-ae31-6962ad639294',
  payer_email: 'ada@example.com',
}

describe('SnailPayService', () => {
  const service = new SnailPayService()

  it('approves the documented card', () => {
    const result = service.createCharge(baseCharge)

    expect(result.status).toBe('approved')
    expect(result.status_detail).toBe('accredited')
    expect(result.transaction_amount).toBe(250)
    expect(result.authorization_code).not.toBeNull()
  })

  it('rejects mismatched card data', () => {
    const result = service.createCharge({ ...baseCharge, cvv: '111' })

    expect(result.status).toBe('rejected')
    expect(result.status_detail).toBe('card_data_mismatch')
    expect(result.authorization_code).toBeNull()
  })

  it('returns the deliberate internal error scenario', () => {
    const result = service.createCharge({ ...baseCharge, card_number: '1234123412340000' })

    expect(result.status).toBe('error')
    expect(result.status_detail).toBe('internal_service_error')
    expect(result.authorization_code).toBeNull()
  })
})
