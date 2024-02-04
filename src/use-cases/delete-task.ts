import { TasksRepository } from '../repositories/tasks-repository'
import { TaskAlreadyExistsError } from './errors/TaskAlreadyExistsError'
import { UserNotCreatorTaskError } from './errors/UserNotCreatorTaskError'

interface DeleteTaskUseCaseRequest {
  userId: string
  taskId: string
}

export class DeleteTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({ taskId, userId }: DeleteTaskUseCaseRequest) {
    const isTaskById = await this.tasksRepository.findById(taskId)

    if (!isTaskById) {
      throw new TaskAlreadyExistsError()
    }

    if (isTaskById.ownerId !== userId) {
      throw new UserNotCreatorTaskError()
    }

    await this.tasksRepository.delete(taskId)
  }
}
