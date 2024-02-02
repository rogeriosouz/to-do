import { tasks } from '../db/schema'

export type Task = typeof tasks.$inferSelect
export type TaskInsert = typeof tasks.$inferInsert

export type FindAllTasksRequest = {
  ownerId: string
  page: number | null
  pageSize: number | null
  search: string | null
}

type FindAllTasksResponse = {
  tasks: Task[]
  totalTasks: number
  totalPages: number
}

export interface TasksRepository {
  findAllTasks({
    ownerId,
    page,
    pageSize,
    search,
  }: FindAllTasksRequest): Promise<FindAllTasksResponse>
  findByTitle(title: string): Promise<Task | null>
  create(taskData: TaskInsert): Promise<Task>
}
