import { users } from '../db/schema'

type User = typeof users.$inferSelect

export interface AuthenticationRepository {
  findByEmail(email: string): Promise<User | null>
}
