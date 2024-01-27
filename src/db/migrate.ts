import { env } from '../env'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from './connection'

async function main() {
  try {
    await migrate(db, { migrationsFolder: './drizzle' })

    await client.end()
  } catch (err) {
    if (env.NODE_ENV === 'dev') {
      console.log(err)
    }
  }
}

main()
