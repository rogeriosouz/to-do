import { TasksRepository } from '../repositories/tasks-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { TaskAlreadyExistsError } from './errors/TaskAlreadyExistsError'
import { UserNotCreatorTaskError } from './errors/UserNotCreatorTaskError'

type DataUpdateTask = {
  content: string | null
  title: string | null
}

interface UpdateTaskUseCaseRequest {
  taskId: string
  userId: string
  dataUpdateTask: DataUpdateTask
}

export class UpdateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({ taskId, userId, dataUpdateTask }: UpdateTaskUseCaseRequest) {
    const isTaskById = await this.tasksRepository.findById(taskId)

    if (!isTaskById) {
      throw new TaskAlreadyExistsError()
    }

    if (isTaskById.ownerId !== userId) {
      throw new UserNotCreatorTaskError()
    }

    if (!dataUpdateTask.content && !dataUpdateTask.title) {
      throw new ResourceNotFoundError()
    }

    await this.tasksRepository.update(taskId, dataUpdateTask)
  }
}
