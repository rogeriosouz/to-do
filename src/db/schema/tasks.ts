import { relations, sql } from 'drizzle-orm'
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const tasks = pgTable('tasks', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  title: varchar('title').unique(),
  content: varchar('content'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id),

  createdAt: timestamp('created_at').defaultNow(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  owner: one(users, {
    fields: [tasks.ownerId],
    references: [users.id],
  }),
}))
