import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtJsonwebtokenService } from '../../services/jsonwebtoken/jwt-jsonwebtoken'
import { env } from '../../env'

export interface CustomAuthMiddlewareFastifyRequest extends FastifyRequest {
  userId?: string
}

export async function authMiddleware(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const isCookieToken = request.headers.cookie

  if (!isCookieToken) {
    return reply.status(401).send({
      message: 'token invalid',
    })
  }

  const authToken = isCookieToken.replace('authUser=', '')

  const jwtJsonwebtokenService = new JwtJsonwebtokenService()
  const isTokenValid = await jwtJsonwebtokenService.verify({
    jwtToken: authToken,
    secret: env.JWT_SECRET,
  })

  if (!isTokenValid) {
    return reply.status(401).send({
      message: 'token invalid',
    })
  }

  request.userId = isTokenValid.userId
}
