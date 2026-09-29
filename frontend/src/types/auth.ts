export interface User {
  id: string
  fullName: string
  email: string
  balance: number
}

export interface StoredUser extends User {
  passwordHash: string
  passwordSalt: string
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}
