import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import styles from '../styles/Success.module.css'

const PLAN_DATA: Record<string, { label: string; fiches: number; color: string; emoji: string }> = {
  starter: { label: 'Starter', fiches: 50, color: '#ff5c00', emoji: '⚡' },
  pro: { label: 'Pro', fiches: 200, color: '#ffb800', emoji: '🚀' },
  business: { label: 'Business', fiches: 9999, color: '#00c87a', emoji: '💎' },
}

export default function Success() {
  const router = useRouter()
  const { data: session } = useSession()
  const [counted, setCounted] = useState(false)

  const plan = router.query.plan as string
  const planData = PLAN_DATA[plan] || PLAN_DATA.starter

  useEffect(() => {
    const t = setTimeout(() => setCounted(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Head><title>Paiement confirmé — FichePro</title></Head>
      <div className={styles.page}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        <div className={styles.card}>
          {/* CHECKMARK ANIMÉ */}
          <div className={styles.checkWrap}>
            <svg className={styles.checkSvg} viewBox="0 0 52 52">
              <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none" />
              <path className={styles.checkMark} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          <div className={styles.planBadge} style={{ color: planData.color, borderColor: planData.color }}>
            {planData.emoji} Plan {planData.label}
          </div>

          <h1 className={styles.title}>Paiement confirmé !</h1>
          <p className={styles.subtitle}>
            Bienvenue dans FichePro {planData.label}.<br />
            {session?.user?.name ? `${session.user.name}, vous` : 'Vous'} avez désormais accès à{' '}
            <strong style={{ color: planData.color }}>
              {planData.fiches === 9999 ? 'fiches illimitées' : `${planData.fiches} fiches par mois`}
            </strong>.
          </p>

          <div className={styles.features}>
            <div className={`${styles.feature} ${counted ? styles.featureIn : ''}`} style={{ transitionDelay: '0.1s' }}>
              <span className={styles.featureIcon}>⚡</span>
              <div>
                <div className={styles.featureTitle}>Génération IA activée</div>
                <div className={styles.featureText}>Fiches produit en 10 secondes</div>
              </div>
            </div>
            <div className={`${styles.feature} ${counted ? styles.featureIn : ''}`} style={{ transitionDelay: '0.2s' }}>
              <span className={styles.featureIcon}>🌍</span>
              <div>
                <div className={styles.featureTitle}>7 langues disponibles</div>
                <div className={styles.featureText}>FR, EN, ES, IT, DE, NL, PT</div>
              </div>
            </div>
            <div className={`${styles.feature} ${counted ? styles.featureIn : ''}`} style={{ transitionDelay: '0.3s' }}>
              <span className={styles.featureIcon}>📄</span>
              <div>
                <div className={styles.featureTitle}>Export PDF inclus</div>
                <div className={styles.featureText}>Téléchargez vos fiches en PDF</div>
              </div>
            </div>
          </div>

          <Link href="/dashboard" className={styles.btnDashboard}>
            Aller au dashboard →
          </Link>

          <p className={styles.hint}>
            Une facture vous a été envoyée par email. Gérez votre abonnement depuis{' '}
            <Link href="/profil">votre profil</Link>.
          </p>
        </div>
      </div>
    </>
  )
}
