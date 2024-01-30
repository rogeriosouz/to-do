import { CreateTypeRequest, JwtService, VerifyTypeRequest } from '../jwt'
import jwt from 'jsonwebtoken'

export class JwtJsonwebtokenService implements JwtService {
  async verify({ jwtToken, secret }: VerifyTypeRequest) {
    try {
      jwt.verify(jwtToken, secret)

      return true
    } catch (error) {
      return false
    }
  }

  async create({ secret, payload, config }: CreateTypeRequest) {
    const token = jwt.sign(payload, secret, config)

    return { jwt: token }
  }
}
