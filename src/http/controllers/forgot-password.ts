import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UsersDrizzleRepository } from '../../repositories/drizzle/users-drizzle-repository'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'
import { EmailNodemailerService } from '../../services/nodemailer/email-nodemailer'
import { ForgotPasswordUseCase } from '../../use-cases/forgot-password'
import { JwtJsonwebtokenService } from '../../services/jsonwebtoken/jwt-jsonwebtoken'

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schemaForgotPassword = z.object({
    email: z.string().email(),
  })

  const { email } = schemaForgotPassword.parse(request.body)

  try {
    const usersDrizzleRepository = new UsersDrizzleRepository()
    const emailNodemailerService = new EmailNodemailerService()
    const jwtJsonwebtokenService = new JwtJsonwebtokenService()

    const forgotPasswordUseCase = new ForgotPasswordUseCase(
      usersDrizzleRepository,
      emailNodemailerService,
      jwtJsonwebtokenService,
    )

    await forgotPasswordUseCase.execute({ email })

    return {
      message:
        'an email has been sent to you with instructions to reset your password',
    }
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
