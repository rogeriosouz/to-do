import { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterUseCase } from '../../use-cases/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/UserAlreadyExistsError'
import { z } from 'zod'
import { UsersDrizzleRepository } from '../../repositories/drizzle/users-drizzle-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const schemaCreateUser = z.object({
    name: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(4),
  })

  const { name, email, password } = schemaCreateUser.parse(request.body)

  try {
    const usersDrizzleRepository = new UsersDrizzleRepository()
    const registerUseCase = new RegisterUseCase(usersDrizzleRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })

    return {
      message: 'Success created user',
    }
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
