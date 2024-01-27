import { relations, sql } from 'drizzle-orm'
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { tasks } from './tasks'

export const users = pgTable('users', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}))
