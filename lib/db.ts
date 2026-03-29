// Base de données en mémoire partagée entre les routes API
// À remplacer par Supabase/PostgreSQL en production

export interface User {
  id: string
  email: string
  password: string
  name: string
  plan: 'free' | 'starter' | 'pro' | 'business'
  fichesUsed: number
  fichesResetDate: string // ISO date du prochain reset mensuel
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

// Singleton global pour persister entre les hot-reloads en dev
declare global {
  // eslint-disable-next-line no-var
  var __USERS__: User[]
}

if (!global.__USERS__) {
  global.__USERS__ = []
}

export const USERS = global.__USERS__

export function findUserByEmail(email: string): User | undefined {
  return USERS.find(u => u.email === email)
}

export function findUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id)
}

export function findUserByStripeCustomerId(customerId: string): User | undefined {
  return USERS.find(u => u.stripeCustomerId === customerId)
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const idx = USERS.findIndex(u => u.id === id)
  if (idx === -1) return null
  USERS[idx] = { ...USERS[idx], ...updates }
  return USERS[idx]
}

export const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  starter: 50,
  pro: 200,
  business: 9999,
}
