import { z } from 'zod'
import { TasksDrizzleRepository } from '../../repositories/drizzle/tasks-drizzle-repository'
import { CustomAuthMiddlewareFastifyRequest } from '../middlewares/auth'
import { UpdateTaskUseCase } from '../../use-cases/update-task'
import { TaskAlreadyExistsError } from '../../use-cases/errors/TaskAlreadyExistsError'
import { FastifyReply } from 'fastify'
import { UserNotCreatorTaskError } from '../../use-cases/errors/UserNotCreatorTaskError'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export async function updateTask(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const schemaUpdateTask = z.object({
    content: z.string().or(z.null()).default(null),
    title: z.string().or(z.null()).default(null),
  })

  const { content, title } = schemaUpdateTask.parse(request.body)

  const { id } = z
    .object({
      id: z.string().uuid(),
    })
    .parse(request.params)

  try {
    const tasksDrizzleRepository = new TasksDrizzleRepository()
    const updateTaskUseCase = new UpdateTaskUseCase(tasksDrizzleRepository)

    const userId = request.userId as string

    await updateTaskUseCase.execute({
      taskId: id,
      userId,
      dataUpdateTask: { content, title },
    })

    return {
      message: 'update tasks success',
    }
  } catch (err) {
    if (err instanceof TaskAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof UserNotCreatorTaskError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
