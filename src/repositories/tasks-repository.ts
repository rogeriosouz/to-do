import { tasks } from '../db/schema'

export type Task = typeof tasks.$inferSelect
export type TaskInsert = typeof tasks.$inferInsert

export interface TasksRepository {
  findByTitle(title: string): Promise<Task | null>
  create(taskData: TaskInsert): Promise<Task>
}
