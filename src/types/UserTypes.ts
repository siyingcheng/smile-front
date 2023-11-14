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

export type UserAddressType = {
  id?: number
  fullAddress: string
  phone: string
  isDefault: boolean
}
