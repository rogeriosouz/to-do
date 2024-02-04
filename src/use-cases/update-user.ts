import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

type DataUpdateUser = {
  name: string
}

interface UpdateTaskUseCaseRequest {
  userId: string
  dataUpdateUser: DataUpdateUser
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, dataUpdateUser }: UpdateTaskUseCaseRequest) {
    const isUserById = await this.usersRepository.findById(userId)

    if (!isUserById) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.update(userId, dataUpdateUser)
  }
}
