import { hash } from 'bcrypt'
import { env } from '../env'
import { UsersRepository } from '../repositories/users-repository'
import { JwtService } from '../services/jwt'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

interface RecoverPasswordUseCaseRequest {
  token: string
  password: string
}

export class RecoverPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ token, password }: RecoverPasswordUseCaseRequest) {
    const isTokenValid = await this.jwtService.verify({
      jwtToken: token,
      secret: env.JWT_SECRET_EMAIL_SERVICE,
    })

    if (!isTokenValid) {
      throw new InvalidCredentialsError()
    }

    const isUserById = await this.usersRepository.findById(isTokenValid.userId)

    if (!isUserById) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)
    await this.usersRepository.updatePassword(passwordHash)
  }
}
