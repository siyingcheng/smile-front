export interface SmileResponseType {
  flag: boolean
  message?: string
  data?: object
}

export type SmileUserType = {
  email: string
  username: string
  enable?: boolean
  id?: number
  nickname?: string
  roles?: string
}

export enum Roles {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
}
