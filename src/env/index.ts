import 'dotenv/config'
import { z } from 'zod'

const schemaEnv = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  JWT_SECRET_EMAIL_SERVICE: z.string(),
  PORT: z.coerce.number().default(3333),
  USER_MAILTRAP: z.string(),
  PASS_MAILTRAP: z.string(),
})

const _env = schemaEnv.safeParse(process.env)

if (_env.success === false) {
  console.error('Erros variables not found', _env.error.format())

  throw new Error('Erros variables not found')
}

export const env = _env.data
