import type { User } from '@fantasy/shared'
import { db } from './db'

export function getUserById(id: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

export function createUser(user: Pick<User, 'name' | 'email' | 'password'>) {
  return db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
  ).run(user.name, user.email, user.password)
}

export function deleteUserById(id: string) {
  return db.prepare('DELETE FROM users WHERE id = ?').run(id)
}