import { users } from '../db/schema'

type User = typeof users.$inferSelect
type UserInsert = typeof users.$inferInsert

export interface RegisterRepository {
  findByEmail(email: string): Promise<boolean>
  create(userCreateData: UserInsert): Promise<User>
}
