import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { login } from './controllers/login'
import { forgotPassword } from './controllers/forgot-password'
import { recoverPassword } from './controllers/recover-password'
import { createTask } from './controllers/create-task'
import { authMiddleware } from './middlewares/auth'
import { listTasks } from './controllers/list-tasks'
import { updateTask } from './controllers/update-task'
import { deleteTask } from './controllers/delete-task'
import { updateUser } from './controllers/update-user'

export async function appRoutes(app: FastifyInstance) {
  // auth
  app.post('/auth/login', login)
  app.post('/auth/register', register)
  app.post('/auth/forgot-password', forgotPassword)
  app.patch('/auth/recover-password', recoverPassword)
  app.put('/users', { preHandler: authMiddleware }, updateUser)

  // tasks
  app.get('/tasks', { preHandler: authMiddleware }, listTasks)
  app.post('/tasks', { preHandler: authMiddleware }, createTask)
  app.put('/tasks/:id', { preHandler: authMiddleware }, updateTask)
  app.delete('/tasks/:id', { preHandler: authMiddleware }, deleteTask)
}
