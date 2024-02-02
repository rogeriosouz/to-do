import { TasksRepository } from '../repositories/tasks-repository'

interface ListTasksUseCaseRequest {
  ownerId: string
  page: number | null
  pageSize: number | null
  search: string | null
}

export class ListTasksUseCase {
  constructor(private tasksRepository: TasksRepository) {}
  async execute({ ownerId, page, pageSize, search }: ListTasksUseCaseRequest) {
    const tasks = await this.tasksRepository.findAllTasks({
      ownerId,
      page,
      pageSize,
      search,
    })

    return {
      tasks,
    }
  }
}
