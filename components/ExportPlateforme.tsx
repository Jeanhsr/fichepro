import { useState } from 'react'
import styles from './ExportPlateforme.module.css'

interface FicheResult {
  titre_seo: string
  description_courte: string
  description_longue: string
  points_forts: string[]
  meta_description: string
  tags_seo: string[]
  faq?: { question: string; reponse: string }[]
}

interface ExportPlateformeProps {
  result: FicheResult
  productName: string
  price: string
}

const PLATEFORMES = [
  {
    id: 'shopify',
    label: 'Shopify',
    emoji: '🛒',
    color: '#96bf48',
    desc: 'Titre + description HTML + tags',
  },
  {
    id: 'amazon',
    label: 'Amazon',
    emoji: '📦',
    color: '#ff9900',
    desc: 'Titre + 5 bullet points + description',
  },
  {
    id: 'etsy',
    label: 'Etsy',
    emoji: '🎨',
    color: '#f56400',
    desc: 'Titre + description storytelling + tags',
  },
  {
    id: 'prestashop',
    label: 'Prestashop',
    emoji: '🏪',
    color: '#df0067',
    desc: 'Résumé court + description complète',
  },
  {
    id: 'leboncoin',
    label: 'Leboncoin',
    emoji: '🔶',
    color: '#f56b2a',
    desc: 'Titre court + description simple',
  },
]

function formatForPlateforme(id: string, result: FicheResult, productName: string, price: string): string {
  const bullets = result.points_forts.map(p => `• ${p}`).join('\n')
  const tags = result.tags_seo.join(', ')
  const faqText = result.faq ? result.faq.map(f => `Q: ${f.question}\nR: ${f.reponse}`).join('\n\n') : ''
  const priceStr = price ? ` — ${price}` : ''

  switch (id) {
    case 'shopify':
      return `TITRE:\n${result.titre_seo}\n\nDESCRIPTION COURTE:\n${result.description_courte}\n\nDESCRIPTION COMPLÈTE:\n${result.description_longue}\n\nPOINTS FORTS:\n${bullets}\n\nMÉTA-DESCRIPTION:\n${result.meta_description}\n\nTAGS:\n${tags}${faqText ? '\n\nFAQ:\n' + faqText : ''}`

    case 'amazon':
      return `TITRE (max 200 car.):\n${result.titre_seo.slice(0, 200)}\n\nBULLET POINTS:\n${result.points_forts.slice(0, 5).map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nDESCRIPTION:\n${result.description_longue}\n\nMOTS-CLÉS:\n${tags}`

    case 'etsy':
      return `TITRE (max 140 car.):\n${result.titre_seo.slice(0, 140)}\n\nDESCRIPTION:\n${result.description_courte}\n\n${result.description_longue}\n\n${bullets}\n\nTAGS (max 13):\n${result.tags_seo.slice(0, 13).join(', ')}`

    case 'prestashop':
      return `RÉSUMÉ COURT:\n${result.description_courte}\n\nDESCRIPTION COMPLÈTE:\n${result.description_longue}\n\nPOINTS FORTS:\n${bullets}\n\nMÉTA-TITLE:\n${result.titre_seo}\n\nMÉTA-DESCRIPTION:\n${result.meta_description}`

    case 'leboncoin':
      return `TITRE:\n${result.titre_seo.slice(0, 70)}\n\nDESCRIPTION:\n${result.description_courte}\n\n${result.points_forts.slice(0, 3).map(p => `✓ ${p}`).join('\n')}${priceStr ? '\n\nPRIX:\n' + price : ''}`

    default:
      return `${result.titre_seo}\n\n${result.description_longue}\n\n${bullets}`
  }
}

export default function ExportPlateforme({ result, productName, price }: ExportPlateformeProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (id: string) => {
    const text = formatForPlateforme(id, result, productName, price)
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>📋 Copier pour votre plateforme</div>
      <div className={styles.grid}>
        {PLATEFORMES.map((p) => (
          <button
            key={p.id}
            className={`${styles.btn} ${copied === p.id ? styles.btnCopied : ''}`}
            onClick={() => handleCopy(p.id)}
            style={{ '--p-color': p.color } as React.CSSProperties}
          >
            <span className={styles.emoji}>{p.emoji}</span>
            <span className={styles.label}>{copied === p.id ? '✅ Copié !' : p.label}</span>
            <span className={styles.desc}>{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
