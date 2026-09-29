export interface ChargeInput {
  card_number: string
  expiration_date: string
  cvv: string
  cardholder_name: string
  transaction_amount: number
  payer_id: string
  payer_email: string
}

export type ChargeStatus = 'approved' | 'rejected' | 'error'

export interface ChargeResponse {
  id: string
  status: ChargeStatus
  status_detail: string
  transaction_amount: number
  date_created: string
  authorization_code: string | null
  reference: string
  payer_id: string
  payer_email: string
  card_number: string
  cvv: string
}
