import { users } from '../db/schema'

type User = typeof users.$inferSelect
type UserInsert = typeof users.$inferInsert
export type DataUpdateUser = {
  name: string
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(userCreateData: UserInsert): Promise<User>
  update(id: string, dataUpdateUser: DataUpdateUser): Promise<void>
  updatePassword(userId: string, passwordHash: string): Promise<User>
}
