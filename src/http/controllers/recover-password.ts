import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UsersDrizzleRepository } from '../../repositories/drizzle/users-drizzle-repository'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'
import { JwtJsonwebtokenService } from '../../services/jsonwebtoken/jwt-jsonwebtoken'
import { RecoverPasswordUseCase } from '../../use-cases/recover-password'

export async function recoverPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schemaRecoverPassword = z
    .object({
      token: z.string(),
      password: z.string().min(4),
      repeatPassword: z.string(),
    })
    .refine(
      ({ password, repeatPassword }) => password === repeatPassword,
      'the password must be the same',
    )

  const { token, password } = schemaRecoverPassword.parse(request.body)

  try {
    const usersDrizzleRepository = new UsersDrizzleRepository()
    const jwtJsonwebtokenService = new JwtJsonwebtokenService()

    const forgotPasswordUseCase = new RecoverPasswordUseCase(
      usersDrizzleRepository,
      jwtJsonwebtokenService,
    )

    await forgotPasswordUseCase.execute({ token, password })

    return {
      message: 'password reset successfully',
    }
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
