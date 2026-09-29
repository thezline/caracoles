const encoder = new TextEncoder()

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

export const createSalt = (): string => bytesToHex(crypto.getRandomValues(new Uint8Array(16)))

export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(salt),
      iterations: 120_000,
    },
    key,
    256,
  )
  return bytesToHex(new Uint8Array(derived))
}
