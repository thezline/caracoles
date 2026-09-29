import { z } from 'zod'

const currentYear = new Date().getFullYear() % 100
const currentMonth = new Date().getMonth() + 1

export const chargeSchema = z.object({
  card_number: z.string().regex(/^\d{16}$/, 'El número de tarjeta debe contener 16 dígitos'),
  expiration_date: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'La fecha debe tener formato MM/AA')
    .refine((value) => {
      const [monthValue, yearValue] = value.split('/')
      const month = Number(monthValue)
      const year = Number(yearValue)
      return year > currentYear || (year === currentYear && month >= currentMonth)
    }, 'La tarjeta está vencida'),
  cvv: z.string().regex(/^\d{3}$/, 'El CVV debe contener 3 dígitos'),
  cardholder_name: z.string().trim().min(2, 'Ingresa el nombre del titular').max(100),
  transaction_amount: z.number().finite().positive('El monto debe ser mayor a 0').max(100000, 'El monto máximo es $100,000'),
  payer_id: z.string().uuid('El ID del usuario no es válido'),
  payer_email: z.string().trim().email('El correo no es válido').max(254),
}).strict()

export type ChargePayload = z.infer<typeof chargeSchema>
