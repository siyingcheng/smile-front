export type SmileUserType = {
  id?: number
  username: string
  email: string
  nickname?: string
  roles: string
}

export type NewSmileUserType = {
  password: string
  confirmPassword: string
} & SmileUserType
