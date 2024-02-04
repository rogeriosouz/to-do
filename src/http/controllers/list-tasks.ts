import { z } from 'zod'
import { TasksDrizzleRepository } from '../../repositories/drizzle/tasks-drizzle-repository'
import { ListTasksUseCase } from '../../use-cases/list-tasks'
import { CustomAuthMiddlewareFastifyRequest } from '../middlewares/auth'
import { env } from '../../env'

export async function listTasks(request: CustomAuthMiddlewareFastifyRequest) {
  const schemaForgotPassword = z.object({
    page: z.coerce.number().or(z.null()).default(null),
    pageSize: z.coerce.number().or(z.null()).default(null),
    search: z.string().or(z.null()).default(null),
  })

  const { page, pageSize, search } = schemaForgotPassword.parse(request.query)

  try {
    const tasksDrizzleRepository = new TasksDrizzleRepository()
    const listTasksUseCase = new ListTasksUseCase(tasksDrizzleRepository)

    const ownerId = request.userId as string

    const { tasks } = await listTasksUseCase.execute({
      ownerId,
      page,
      pageSize,
      search,
    })

    return tasks
  } catch (err) {
    if (env.NODE_ENV === 'dev') {
      console.log(err)
    }
    throw err
  }
}
