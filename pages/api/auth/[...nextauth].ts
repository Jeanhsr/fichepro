import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Base de données en mémoire pour le MVP
// À remplacer par Supabase/PostgreSQL plus tard
const USERS: { id: string; email: string; password: string; name: string; plan: string; fichesUsed: number }[] = []

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
        name: { label: 'Nom', type: 'text' },
        action: { label: 'Action', type: 'text' }, // 'login' ou 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { email, password, name, action } = credentials

        if (action === 'register') {
          // Vérifier si l'email existe déjà
          const existing = USERS.find(u => u.email === email)
          if (existing) throw new Error('Cet email est déjà utilisé.')

          // Créer l'utilisateur
          const hashed = await bcrypt.hash(password, 10)
          const newUser = {
            id: Date.now().toString(),
            email,
            password: hashed,
            name: name || email.split('@')[0],
            plan: 'free',
            fichesUsed: 0,
          }
          USERS.push(newUser)
          return { id: newUser.id, email: newUser.email, name: newUser.name, plan: newUser.plan, fichesUsed: newUser.fichesUsed }
        }

        // Login
        const user = USERS.find(u => u.email === email)
        if (!user) throw new Error('Aucun compte trouvé avec cet email.')

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new Error('Mot de passe incorrect.')

        return { id: user.id, email: user.email, name: user.name, plan: user.plan, fichesUsed: user.fichesUsed }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = (user as { plan?: string }).plan
        token.fichesUsed = (user as { fichesUsed?: number }).fichesUsed
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { plan?: string }).plan = token.plan as string
        ;(session.user as { fichesUsed?: number }).fichesUsed = token.fichesUsed as number
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'fichepro-secret-dev-key-change-in-prod',
}

export default NextAuth(authOptions)
