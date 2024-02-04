import { z } from 'zod'
import { TasksDrizzleRepository } from '../../repositories/drizzle/tasks-drizzle-repository'
import { CustomAuthMiddlewareFastifyRequest } from '../middlewares/auth'
import { TaskAlreadyExistsError } from '../../use-cases/errors/TaskAlreadyExistsError'
import { FastifyReply } from 'fastify'
import { UserNotCreatorTaskError } from '../../use-cases/errors/UserNotCreatorTaskError'
import { DeleteTaskUseCase } from '../../use-cases/delete-task'

export async function deleteTask(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z
    .object({
      id: z.string().uuid(),
    })
    .parse(request.params)

  try {
    const tasksDrizzleRepository = new TasksDrizzleRepository()
    const deleteTaskUseCase = new DeleteTaskUseCase(tasksDrizzleRepository)

    const userId = request.userId as string

    await deleteTaskUseCase.execute({
      taskId: id,
      userId,
    })

    return {
      message: 'delete task success',
    }
  } catch (err) {
    if (err instanceof TaskAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof UserNotCreatorTaskError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
