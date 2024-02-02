import {
  FindAllTasksRequest,
  TaskInsert,
  TasksRepository,
} from '../tasks-repository'
import { db } from '../../db/connection'
import { tasks } from '../../db/schema'
import { eq, and, like } from 'drizzle-orm'

export class TasksDrizzleRepository implements TasksRepository {
  async findAllTasks({ ownerId, page, pageSize, search }: FindAllTasksRequest) {
    const offset = page && pageSize ? (page - 1) * pageSize : (1 - 1) * 10

    const listTasks = await db
      .select()
      .from(tasks)
      .where(
        search
          ? and(eq(tasks.ownerId, ownerId), like(tasks.title, `%${search}%`))
          : eq(tasks.ownerId, ownerId),
      )
      .limit(pageSize ?? 10)
      .offset(offset)

    const totalCount = (await db.select().from(tasks)).length

    const totalPages = Math.ceil(totalCount / (pageSize ?? 10))

    return {
      tasks: listTasks,
      totalPages,
      totalTasks: totalCount,
    }
  }

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
