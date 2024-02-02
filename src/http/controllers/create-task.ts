import { FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../use-cases/errors/UserAlreadyExistsError'
import { UsersDrizzleRepository } from '../../repositories/drizzle/users-drizzle-repository'
import { TasksDrizzleRepository } from '../../repositories/drizzle/tasks-drizzle-repository'
import { CreateTaskUseCase } from '../../use-cases/create-task'
import { CustomAuthMiddlewareFastifyRequest } from '../middlewares/auth'
import { TaskAlreadyExistsError } from '../../use-cases/errors/TaskAlreadyExistsError'

export async function createTask(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const schemaCreateTaskBody = z.object({
    title: z.string().min(2),
    content: z.string().min(3),
  })

  const ownerId = z.string().uuid().parse(request.userId)

  const { title, content } = schemaCreateTaskBody.parse(request.body)

  try {
    const usersDrizzleRepository = new UsersDrizzleRepository()
    const tasksDrizzleRepository = new TasksDrizzleRepository()

    const createTask = new CreateTaskUseCase(
      usersDrizzleRepository,
      tasksDrizzleRepository,
    )

    await createTask.execute({
      content,
      ownerId,
      title,
    })

    return {
      message: 'success create task',
    }
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof TaskAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
