import { useState } from 'react'
import styles from './Onboarding.module.css'

interface OnboardingProps {
  onClose: () => void
}

const STEPS = [
  {
    icon: '👋',
    title: 'Bienvenue sur FichePro !',
    desc: 'Générez des fiches produit professionnelles en 10 secondes grâce à l\'IA. Voici comment ça marche.',
    tip: null,
  },
  {
    icon: '✍️',
    title: 'Étape 1 — Décrivez votre produit',
    desc: 'Entrez le nom de votre produit, sa catégorie et son prix. Plus vous donnez de détails, meilleure sera la fiche.',
    tip: 'Ex: "Nike Air Max 90, blanc/noir, taille 42, semelle Air, confort exceptionnel"',
  },
  {
    icon: '🌍',
    title: 'Étape 2 — Choisissez la langue et la plateforme',
    desc: 'FichePro adapte automatiquement le format selon la plateforme : Amazon, Shopify, Etsy...',
    tip: '7 langues disponibles : FR, EN, ES, IT, DE, NL, PT',
  },
  {
    icon: '⚡',
    title: 'Étape 3 — Générez et récupérez',
    desc: 'Cliquez sur "Générer" et en 10 secondes vous avez : titre SEO, description, points forts, FAQ et score SEO.',
    tip: 'Vous pouvez aussi exporter la fiche en PDF ou copier directement le texte.',
  },
  {
    icon: '🚀',
    title: 'C\'est parti !',
    desc: 'Vous avez 5 fiches gratuites pour tester. Commencez par votre produit le plus important.',
    tip: null,
  },
]

export default function Onboarding({ onClose }: OnboardingProps) {
  const [step, setStep] = useState(0)

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else onClose()
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  const current = STEPS[step]

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* PROGRESS */}
        <div className={styles.progress}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i <= step ? styles.progressDotActive : ''}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>

        {/* CONTENT */}
        <div className={styles.content} key={step}>
          <div className={styles.icon}>{current.icon}</div>
          <h2 className={styles.title}>{current.title}</h2>
          <p className={styles.desc}>{current.desc}</p>
          {current.tip && (
            <div className={styles.tip}>
              <span>💡</span> {current.tip}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.btnPrev} onClick={prev}>← Précédent</button>
          )}
          <button className={styles.btnNext} onClick={next}>
            {step < STEPS.length - 1 ? 'Suivant →' : '🚀 Commencer !'}
          </button>
        </div>

        {/* SKIP */}
        <button className={styles.skip} onClick={onClose}>
          Passer le tutoriel
        </button>
      </div>
    </div>
  )
}
