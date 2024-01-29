import { eq } from 'drizzle-orm'
import { db } from '../../db/connection'
import { users } from '../../db/schema'
import { AuthenticationRepository } from '../authentication-repository'

export class AuthenticationDrizzleRepository
  implements AuthenticationRepository
{
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
}
