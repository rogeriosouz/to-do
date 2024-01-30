import { env } from '../env'
import { UsersRepository } from '../repositories/users-repository'
import { EmailService } from '../services/email'
import { JwtService } from '../services/jwt'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'

interface ForgotPasswordRequest {
  email: string
}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async execute({ email }: ForgotPasswordRequest) {
    const isUserByEmail = await this.usersRepository.findByEmail(email)

    if (!isUserByEmail) {
      throw new InvalidCredentialsError()
    }

    const { jwt } = await this.jwtService.create({
      payload: { userId: isUserByEmail.id },
      config: { expiresIn: '10m' },
      secret: env.JWT_SECRET_EMAIL_SERVICE,
    })

    await this.emailService.sendEmail(email, `<h1>Hello world ${jwt}</h1>`)
  }
}
