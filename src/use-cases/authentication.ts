import { compare } from 'bcrypt'
import { AuthenticationRepository } from '../repositories/authentication-repository'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'
import { app } from '../app'

interface AuthenticationUseCaseRequest {
  email: string
  password: string
}

export class AuthenticationUseCase {
  constructor(private authenticationRepository: AuthenticationRepository) {}

  async execute({ email, password }: AuthenticationUseCaseRequest) {
    const user = await this.authenticationRepository.findByEmail(email)

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

    const token = app.jwt.sign(payloadJwt, {
      expiresIn: '6d',
    })

    return {
      user: payloadJwt,
      token,
    }
  }
}
