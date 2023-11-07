import type { SmileUserType } from '.'

export type SmileResponseType<T> = {
  flag: boolean
  message?: string
  data?: T
}

export type LoginDataType = {
  token: string
  userInfo: SmileUserType
}
