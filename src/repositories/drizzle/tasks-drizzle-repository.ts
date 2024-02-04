import {
  DataUpdateTask,
  FindAllTasksRequest,
  TaskInsert,
  TasksRepository,
} from '../tasks-repository'
import { db } from '../../db/connection'
import { tasks } from '../../db/schema'
import { eq, and, like } from 'drizzle-orm'

export class TasksDrizzleRepository implements TasksRepository {
  async update(id: string, data: DataUpdateTask) {
    if (data.content && data.title) {
      await db.update(tasks).set(data).where(eq(tasks.id, id))
    }

    if (data.content) {
      await db
        .update(tasks)
        .set({ content: data.content })
        .where(eq(tasks.id, id))
      return
    }

    if (data.title) {
      await db.update(tasks).set({ title: data.title }).where(eq(tasks.id, id))
    }
  }

  async findById(id: string) {
    const isTaskById = await db.select().from(tasks).where(eq(tasks.id, id))

    if (isTaskById.length <= 1) {
      return isTaskById[0]
    }

    return null
  }

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
