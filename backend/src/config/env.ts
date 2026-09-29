const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? 3001)
  return Number.isInteger(port) && port > 0 ? port : 3001
}

export const env = {
  port: parsePort(process.env.PORT),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}
