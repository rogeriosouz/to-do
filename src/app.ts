import Fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
import jwtFastify from '@fastify/jwt'

export const app = Fastify()

app.register(appRoutes)

app.register(jwtFastify, {
  secret: env.JWT_SECRET,
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'error internal server' })
})
