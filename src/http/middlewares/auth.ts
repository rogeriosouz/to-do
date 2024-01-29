import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const isCookieToken = request.headers.cookie

  if (!isCookieToken) {
    return reply.status(401).send({
      message: 'token invalid',
    })
  }

  const authToken = isCookieToken.replace('authUser=', '')

  try {
    const isTokenValid = app.jwt.verify(authToken)
    console.log(isTokenValid)
  } catch (error) {
    console.log(error)
    return reply.status(401).send({
      message: 'token invalid',
    })
  }
}
