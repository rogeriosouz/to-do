import { TaskInsert, TasksRepository } from '../tasks-repository'
import { db } from '../../db/connection'
import { tasks } from '../../db/schema'
import { eq } from 'drizzle-orm'

export class TasksDrizzleRepository implements TasksRepository {
  async findByTitle(title: string) {
    const isTaskByName = await db
      .select()
      .from(tasks)
      .where(eq(tasks.title, title))

    if (isTaskByName.length >= 1) {
      return isTaskByName[0]
    }

    return null
  }

  async create(taskData: TaskInsert) {
    const listTask = await db.insert(tasks).values(taskData).returning()

    return listTask[0]
  }
}
