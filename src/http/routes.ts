import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { login } from './controllers/login'
import { forgotPassword } from './controllers/forgot-password'
import { recoverPassword } from './controllers/recover-password'
import { createTask } from './controllers/create-task'
import { authMiddleware } from './middlewares/auth'

export async function appRoutes(app: FastifyInstance) {
  //  auth
  app.post('/auth/login', login)
  app.post('/auth/register', register)
  app.post('/auth/forgot-password', forgotPassword)
  app.patch('/auth/recover-password', recoverPassword)

  // tasks

  app.addHook('preHandler', authMiddleware)
  app.post('/tasks', createTask)
}
