export type SmileUserType = {
  id?: number
  username: string
  email: string
  nickname?: string
  roles: string
  enabled: boolean
}

export type NewSmileUserType = {
  password: string
  confirmPassword: string
} & SmileUserType
