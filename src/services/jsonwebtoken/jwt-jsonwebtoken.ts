import { CreateTypeRequest, JwtService, VerifyTypeRequest } from '../jwt'
import jwt from 'jsonwebtoken'

export class JwtJsonwebtokenService implements JwtService {
  async verify({ jwtToken, secret }: VerifyTypeRequest) {
    try {
      const token = jwt.verify(jwtToken, secret) as { id: string }

      return { userId: token.id }
    } catch (error) {
      return null
    }
  }

  async create({ secret, payload, config }: CreateTypeRequest) {
    const token = jwt.sign(payload, secret, config)

    return { jwt: token }
  }
}
