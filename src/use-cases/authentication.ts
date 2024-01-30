import { compare } from 'bcrypt'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'
import { UsersRepository } from '../repositories/users-repository'
import { JwtService } from '../services/jwt'
import { env } from '../env'

interface AuthenticationUseCaseRequest {
  email: string
  password: string
}

export class AuthenticationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: AuthenticationUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const comparePassword = await compare(password, user.passwordHash)

    if (!comparePassword) {
      throw new InvalidCredentialsError()
    }

    const payloadJwt = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const { jwt } = await this.jwtService.create({
      payload: payloadJwt,
      secret: env.JWT_SECRET,
      config: { expiresIn: '6d' },
    })

    return {
      user: payloadJwt,
      jwt,
    }
  }
}
