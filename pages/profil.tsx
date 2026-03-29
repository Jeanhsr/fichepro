import Head from 'next/head'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import styles from '../styles/Profil.module.css'

const PLANS = [
  { id: 'free', label: 'Gratuit', fiches: 5, color: '#666' },
  { id: 'starter', label: 'Starter', fiches: 50, color: '#ff5c00' },
  { id: 'pro', label: 'Pro', fiches: 200, color: '#ffb800' },
  { id: 'business', label: 'Business', fiches: 999, color: '#00c87a' },
]

export default function Profil() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)

  const openBillingPortal = async () => {
    setBillingLoading(true)
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json()
    setBillingLoading(false)
    if (data.url) window.location.href = data.url
  }

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading' || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
      <div style={{ width: 40, height: 40, border: '2px solid rgba(255,92,0,0.2)', borderTopColor: '#ff5c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const userPlan = (session.user as { plan?: string }).plan || 'free'
  const fichesUsed = (session.user as { fichesUsed?: number }).fichesUsed || 0
  const plan = PLANS.find(p => p.id === userPlan) || PLANS[0]
  const fichesRestantes = Math.max(0, plan.fiches - fichesUsed)
  const pct = Math.min(100, (fichesUsed / plan.fiches) * 100)

  return (
    <>
      <Head><title>Mon profil — FichePro</title></Head>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>

          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.avatarLarge}>
              {session.user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{session.user?.name}</h1>
              <p className={styles.email}>{session.user?.email}</p>
              <div className={styles.planBadge} style={{ borderColor: plan.color, color: plan.color }}>
                {plan.label}
              </div>
            </div>
          </div>

          <div className={styles.grid}>

            {/* UTILISATION */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>📊 Utilisation ce mois-ci</div>
              <div className={styles.usageNumbers}>
                <span className={styles.usageUsed}>{fichesUsed}</span>
                <span className={styles.usageSep}>/</span>
                <span className={styles.usageTotal}>{plan.fiches === 999 ? '∞' : plan.fiches}</span>
                <span className={styles.usageLabel}>fiches</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${pct}%`,
                    background: pct > 80 ? '#ff4444' : pct > 50 ? '#ffb800' : '#00c87a'
                  }}
                />
              </div>
              <p className={styles.usageHint}>
                {fichesRestantes > 0
                  ? `${fichesRestantes} fiche${fichesRestantes > 1 ? 's' : ''} restante${fichesRestantes > 1 ? 's' : ''}`
                  : '⚠️ Quota atteint — passez au plan supérieur'}
              </p>
            </div>

            {/* PLAN */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>💳 Mon abonnement</div>
              <div className={styles.planInfo}>
                <div className={styles.planName} style={{ color: plan.color }}>{plan.label}</div>
                <div className={styles.planDetail}>
                  {plan.id === 'free' ? 'Gratuit — 5 fiches offertes' : `${plan.fiches} fiches / mois`}
                </div>
              </div>
              {plan.id === 'free' && (
                <Link href="/#pricing" className={styles.btnUpgrade}>
                  ⚡ Passer au plan payant →
                </Link>
              )}
              {plan.id !== 'free' && (
                <button className={styles.btnCancel} onClick={openBillingPortal} disabled={billingLoading}>
                {billingLoading ? 'Chargement...' : 'Gérer l\'abonnement'}
              </button>
              )}
            </div>

            {/* INFOS COMPTE */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>👤 Informations du compte</div>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Prénom</span>
                  <span className={styles.infoValue}>{session.user?.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{session.user?.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Mot de passe</span>
                  <span className={styles.infoValue}>••••••••</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>⚙️ Actions</div>
              <div className={styles.actions}>
                <Link href="/dashboard" className={styles.actionBtn}>
                  ⚡ Aller au dashboard
                </Link>
                <button
                  className={styles.actionBtnLogout}
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  → Se déconnecter
                </button>
                <button
                  className={styles.actionBtnDelete}
                  onClick={() => setConfirmDelete(true)}
                >
                  🗑 Supprimer mon compte
                </button>
              </div>
            </div>

          </div>

          {/* CONFIRM DELETE */}
          {confirmDelete && (
            <div className={styles.confirmOverlay}>
              <div className={styles.confirmBox}>
                <h3 className={styles.confirmTitle}>Supprimer votre compte ?</h3>
                <p className={styles.confirmText}>Cette action est irréversible. Toutes vos données seront supprimées définitivement.</p>
                <div className={styles.confirmBtns}>
                  <button className={styles.confirmCancel} onClick={() => setConfirmDelete(false)}>Annuler</button>
                  <button className={styles.confirmDelete} onClick={() => signOut({ callbackUrl: '/' })}>
                    Oui, supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
