import { z } from 'zod'
import { CustomAuthMiddlewareFastifyRequest } from '../middlewares/auth'
import { FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { UpdateUserUseCase } from '../../use-cases/update-user'
import { UsersDrizzleRepository } from '../../repositories/drizzle/users-drizzle-repository'

export async function updateUser(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const schemaUpdateUser = z.object({
    name: z.string().min(3),
  })

  const { name } = schemaUpdateUser.parse(request.body)

  try {
    const usersDrizzleRepository = new UsersDrizzleRepository()
    const updateUserUseCase = new UpdateUserUseCase(usersDrizzleRepository)

    const userId = request.userId as string

    await updateUserUseCase.execute({
      userId,
      dataUpdateUser: { name },
    })

    return {
      message: 'update user success',
    }
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
