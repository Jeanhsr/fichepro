import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL requise' })

  try {
    // Fetch the boutique page content
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FichePro/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    const html = await pageRes.text()

    // Strip HTML tags to get readable text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Analyse le contenu de cette boutique en ligne et détermine son style de communication.

Contenu de la boutique :
${text}

Réponds UNIQUEMENT en JSON sans markdown :
{
  "tone": "professionnel|enthousiaste|luxe|simple",
  "style_notes": "courte description du style en 1 phrase"
}

Choisis le ton le plus proche parmi : professionnel, enthousiaste, luxe, simple.`
      }]
    })

    const raw = (message.content[0] as { type: string; text: string }).text
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Erreur analyse URL:', error)
    // Retourne un ton par défaut si l'analyse échoue
    return res.status(200).json({ tone: 'professionnel', style_notes: 'Style par défaut appliqué' })
  }
}
