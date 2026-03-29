import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import stripe from '../../lib/stripe'
import { findUserByEmail } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) return res.status(401).json({ error: 'Non connecté' })

  const user = findUserByEmail(session.user.email)
  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: 'Pas d\'abonnement actif' })
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/profil`,
    })

    res.status(200).json({ url: portalSession.url })
  } catch (err) {
    console.error('Portal error:', err)
    res.status(500).json({ error: 'Erreur portail de facturation' })
  }
}
