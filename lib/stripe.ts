import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante dans .env.local')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export default stripe

// Plans et leurs Price IDs Stripe (à remplacer avec tes vrais IDs)
export const PLANS = {
  starter: {
    label: 'Starter',
    price: 19,
    fiches: 50,
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
    color: '#ff5c00',
    features: ['50 fiches / mois', '7 langues', 'Export PDF', 'Score SEO'],
  },
  pro: {
    label: 'Pro',
    price: 49,
    fiches: 200,
    priceId: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
    color: '#ffb800',
    features: ['200 fiches / mois', '7 langues', 'Export PDF', 'Score SEO', 'FAQ automatique', 'Variantes illimitées'],
  },
  business: {
    label: 'Business',
    price: 99,
    fiches: 9999,
    priceId: process.env.STRIPE_PRICE_BUSINESS || 'price_business_placeholder',
    color: '#00c87a',
    features: ['Fiches illimitées', '7 langues', 'Export PDF', 'Score SEO', 'FAQ automatique', 'Support prioritaire', 'API access'],
  },
}
