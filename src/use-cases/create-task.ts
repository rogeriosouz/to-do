import { TasksRepository } from '../repositories/tasks-repository'
import { UsersRepository } from '../repositories/users-repository'
import { TaskAlreadyExistsError } from './errors/TaskAlreadyExistsError'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

interface CreateTaskUseCaseRequest {
  title: string
  content: string
  ownerId: string
}

export class CreateTaskUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tasksRepository: TasksRepository,
  ) {}

  async execute({ title, content, ownerId }: CreateTaskUseCaseRequest) {
    const isUser = await this.usersRepository.findById(ownerId)

    if (!isUser) {
      throw new UserAlreadyExistsError()
    }

    const isTasksByTitle = await this.tasksRepository.findByTitle(title)

    if (isTasksByTitle) {
      throw new TaskAlreadyExistsError()
    }

    const task = await this.tasksRepository.create({
      title,
      content,
      ownerId,
    })

    return {
      task,
    }
  }
}
