import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('✅ checkout appelé', req.method, req.body)
  
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const { plan } = req.body
    
    const PRICE_IDS: Record<string, string> = {
      starter: process.env.STRIPE_PRICE_STARTER!,
      pro: process.env.STRIPE_PRICE_PRO!,
      business: process.env.STRIPE_PRICE_BUSINESS!,
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/success?plan=${plan}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
      locale: 'fr',
    })
    
    console.log('✅ session créée:', session.url)
    res.status(200).json({ url: session.url })
  } catch (err: any) {
    console.error('❌ Stripe error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
