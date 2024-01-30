import { SignOptions } from 'jsonwebtoken'

export type CreateTypeRequest = {
  payload: string | object | Buffer
  secret: string
  config: Partial<SignOptions> | undefined
}

export type VerifyTypeRequest = {
  jwtToken: string
  secret: string
}

export interface JwtService {
  create({
    secret,
    payload,
    config,
  }: CreateTypeRequest): Promise<{ jwt: string }>

  verify({
    jwtToken,
    secret,
  }: VerifyTypeRequest): Promise<{ userId: string } | null>
}
