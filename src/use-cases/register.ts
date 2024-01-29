import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'
import { hash } from 'bcrypt'
import { RegisterRepository } from '../repositories/register-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private RegisterRepository: RegisterRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const isUserByEmail = await this.RegisterRepository.findByEmail(email)

    if (isUserByEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.RegisterRepository.create({
      name,
      email,
      passwordHash,
    })

    return {
      user,
    }
  }
}
