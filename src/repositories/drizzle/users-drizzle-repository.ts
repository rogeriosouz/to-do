import { UsersRepository } from '../users-repository'
import { db } from '../../db/connection'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

type UserInsert = typeof users.$inferInsert

export class UsersDrizzleRepository implements UsersRepository {
  async findByEmail(email: string) {
    const isUserByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (isUserByEmail.length >= 1) {
      return isUserByEmail[0]
    }

    return null
  }

  async create(userCreateData: UserInsert) {
    const usersCreate = await db
      .insert(users)
      .values(userCreateData)
      .returning()

    return usersCreate[0]
  }
}
