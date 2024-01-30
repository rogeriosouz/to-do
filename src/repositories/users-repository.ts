import { users } from '../db/schema'

type User = typeof users.$inferSelect
type UserInsert = typeof users.$inferInsert

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(userCreateData: UserInsert): Promise<User>
  updatePassword(passwordHash: string): Promise<User>
}
