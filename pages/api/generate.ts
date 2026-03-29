import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français', en: 'anglais', es: 'espagnol',
  it: 'italien', de: 'allemand', nl: 'néerlandais', pt: 'portugais',
}

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  shopify: 'Optimise pour Shopify : description courte percutante, bullet points clairs, ton moderne.',
  amazon: 'Optimise pour Amazon : titre avec mots-clés importants en premier, bullet points avec avantages concrets.',
  etsy: 'Optimise pour Etsy : ton artisanal et authentique, storytelling personnel, met en avant l\'unicité.',
  prestashop: 'Optimise pour Prestashop : structure classique e-commerce, SEO technique, description complète.',
  leboncoin: 'Optimise pour Leboncoin : ton direct et simple, prix mis en avant, description courte.',
  generic: 'Optimise pour un site e-commerce générique : équilibre SEO et lisibilité.',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { productName, category, tone, features, price, pricePromo, promoPercent, language = 'fr', platform = 'generic', boutiqueUrl } = req.body

  if (!productName) return res.status(400).json({ error: 'Le nom du produit est requis' })

  const langName = LANGUAGE_NAMES[language] || 'français'
  const platformInstructions = PLATFORM_INSTRUCTIONS[platform] || PLATFORM_INSTRUCTIONS.generic

  const baseContext = `
PRODUIT :
- Nom : ${productName}
- Catégorie : ${category || 'Non spécifiée'}
- Caractéristiques : ${features || 'Non spécifiées'}
- Prix : ${price || 'Non spécifié'}${pricePromo ? `\n- Prix promotionnel : ${pricePromo} (-${promoPercent}%) — mets en avant cette promotion` : ''}
- Ton souhaité : ${tone || 'professionnel'}
PLATEFORME : ${platformInstructions}
LANGUE : Rédige TOUT en ${langName}.`

  const variantTones = [
    { label: 'Accrocheur', instruction: 'Ton percutant, émotionnel, donne envie d\'acheter immédiatement.' },
    { label: 'Professionnel', instruction: 'Ton informatif, expert, inspire confiance et crédibilité.' },
    { label: 'Storytelling', instruction: 'Ton narratif, raconte une histoire autour du produit.' },
  ]

  try {
    // 3 VARIANTES + SEO/FAQ EN PARALLÈLE
    const variantPromises = variantTones.map((v) =>
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `Tu es un expert copywriter e-commerce. Génère une fiche produit.
${baseContext}
STYLE DE CETTE VARIANTE : ${v.instruction}

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "titre_seo": "...",
  "description_courte": "...",
  "description_longue": "...",
  "points_forts": ["...", "...", "...", "...", "..."],
  "meta_description": "...",
  "avis_clients": [
    { "nom": "...", "note": 5, "commentaire": "...", "date": "..." },
    { "nom": "...", "note": 4, "commentaire": "...", "date": "..." },
    { "nom": "...", "note": 5, "commentaire": "...", "date": "..." }
  ],
  "tags_seo": ["...", "...", "...", "...", "..."]
}
Règles : Titre max 65 car. | Description courte 1-2 phrases | Description longue 3-4 phrases | Méta max 155 car. | TOUT en ${langName}`
        }],
      })
    )

    const seoFaqPromise = client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Tu es un expert SEO e-commerce. Analyse ce produit et génère un score SEO et une FAQ.
${baseContext}

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "score_seo": {
    "total": 82,
    "criteres": [
      { "label": "Titre optimisé", "score": 90, "conseil": "..." },
      { "label": "Mots-clés longue traîne", "score": 75, "conseil": "..." },
      { "label": "Richesse du contenu", "score": 80, "conseil": "..." },
      { "label": "Méta-description", "score": 85, "conseil": "..." },
      { "label": "Tags & catégorisation", "score": 70, "conseil": "..." }
    ]
  },
  "faq": [
    { "question": "...", "reponse": "..." },
    { "question": "...", "reponse": "..." },
    { "question": "...", "reponse": "..." },
    { "question": "...", "reponse": "..." },
    { "question": "...", "reponse": "..." }
  ]
}
Scores réalistes (50-95). Conseils concrets. FAQ en ${langName}.`
      }],
    })

    const [variantResults, seoFaqResult] = await Promise.all([
      Promise.all(variantPromises),
      seoFaqPromise,
    ])

    const variantes = variantResults.map((msg, i) => {
      const text = (msg.content[0] as { type: string; text: string }).text
      const clean = text.replace(/```json|```/g, '').trim()
      return { ...JSON.parse(clean), label: variantTones[i].label }
    })

    const seoFaqText = (seoFaqResult.content[0] as { type: string; text: string }).text
    const seoFaqClean = seoFaqText.replace(/```json|```/g, '').trim()
    const { score_seo, faq } = JSON.parse(seoFaqClean)

    return res.status(200).json({
      ...variantes[0],
      variantes,
      score_seo,
      faq,
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return res.status(500).json({ error: 'Erreur lors de la génération. Réessayez.' })
  }
}
