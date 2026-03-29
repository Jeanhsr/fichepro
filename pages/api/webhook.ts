import { NextApiRequest, NextApiResponse } from 'next'
import stripe from '../../lib/stripe'
import { findUserByStripeCustomerId, updateUser } from '../../lib/db'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET manquant')
    return res.status(500).end()
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature invalide:', err)
    return res.status(400).json({ error: 'Webhook invalide' })
  }

  try {
    switch (event.type) {

      // Paiement réussi → activer le plan
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as 'starter' | 'pro' | 'business'
        const subscriptionId = session.subscription as string

        if (userId && plan) {
          updateUser(userId, {
            plan,
            stripeSubscriptionId: subscriptionId,
            fichesUsed: 0,
            fichesResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          console.log(`✅ Plan ${plan} activé pour user ${userId}`)
        }
        break
      }

      // Renouvellement mensuel → reset le compteur
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const user = findUserByStripeCustomerId(customerId)

        if (user && invoice.billing_reason === 'subscription_cycle') {
          updateUser(user.id, {
            fichesUsed: 0,
            fichesResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          console.log(`🔄 Fiches remises à zéro pour ${user.email}`)
        }
        break
      }

      // Abonnement annulé → repasser en free
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const user = findUserByStripeCustomerId(customerId)

        if (user) {
          updateUser(user.id, {
            plan: 'free',
            stripeSubscriptionId: undefined,
            fichesUsed: 0,
          })
          console.log(`❌ Abonnement annulé pour ${user.email}`)
        }
        break
      }

      // Échec de paiement
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn(`⚠️ Paiement échoué pour customer ${invoice.customer}`)
        break
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Erreur webhook:', err)
    res.status(500).json({ error: 'Erreur traitement webhook' })
  }
}
