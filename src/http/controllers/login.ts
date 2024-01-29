import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AuthenticationDrizzleRepository } from '../../repositories/drizzle/authentication-drizzle-repository'
import { AuthenticationUseCase } from '../../use-cases/authentication'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const schemaCreateUser = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  })

  const { email, password } = schemaCreateUser.parse(request.body)

  try {
    const authenticationDrizzleRepository =
      new AuthenticationDrizzleRepository()
    const authenticationUseCase = new AuthenticationUseCase(
      authenticationDrizzleRepository,
    )

    const { user, token } = await authenticationUseCase.execute({
      email,
      password,
    })

    const cookie = `authUser=${token}; HttpOnly; Secure; SameSite=None; Path=/`

    return reply
      .status(200)
      .headers({
        'set-cookie': cookie,
      })
      .send({
        message: 'Success authenticated user',
        user,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
