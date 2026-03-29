import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

const EXAMPLES = [
  {
    input: 'Nike Air Max 90, blanc/noir, taille 42, semelle Air',
    output: 'Nike Air Max 90 Blanc/Noir — Le Confort Iconique qui Traverse les Générations',
  },
  {
    input: 'Canapé velours vert, 3 places, pieds dorés, style moderne',
    output: 'Canapé Velours Vert Émeraude 3 Places — Élégance & Confort au Cœur de Votre Salon',
  },
  {
    input: 'Montre connectée, suivi sport, autonomie 7 jours, GPS',
    output: 'Montre Connectée GPS Sport — 7 Jours d\'Autonomie pour Ne Manquer Aucune Performance',
  },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  const handleCheckout = async (planKey: string) => {
    if (!session) { router.push('/login'); return }
    setCheckoutLoading(planKey)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey }),
    })
    const data = await res.json()
    setCheckoutLoading(null)
    if (data.url) window.location.href = data.url
  }

  // Parallax on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const y = window.scrollY
        heroRef.current.style.transform = `translateY(${y * 0.3}px)`
        heroRef.current.style.opacity = `${1 - y * 0.002}`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Head>
        <title>FichePro — Arrêtez d'écrire. Commencez à vendre.</title>
        <meta name="description" content="Générez des fiches produit optimisées SEO en 10 secondes grâce à l'IA. Pour e-commerçants européens." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>

        {/* ANIMATED BG */}
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgOrb3} />

        {/* HERO */}
        <section className={styles.hero}>
          <div ref={heroRef} className={styles.heroInner}>
            <div className={`${styles.heroTag} reveal`}>
              <span className={styles.dot} />
              Propulsé par l'IA · 100% Européen
            </div>
            <h1 className={`${styles.heroTitle} reveal reveal-delay-1`}>
              Arrêtez d'écrire.<br />
              <em className={styles.heroAccent}>Commencez à vendre.</em>
            </h1>
            <p className={`${styles.heroSub} reveal reveal-delay-2`}>
              Générez des fiches produit optimisées SEO en <strong>10 secondes</strong> grâce à l'IA.<br />
              Prêtes à publier sur Shopify, Amazon, Etsy, Prestashop.
            </p>
            <div className={`${styles.heroCta} reveal reveal-delay-3`}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                <span>Générer mes premières fiches gratuitement</span>
                <span className={styles.btnArrow}>→</span>
              </Link>
              <p className={styles.heroNote}>5 fiches offertes · Sans CB · Sans engagement</p>
            </div>
          </div>

          {/* FLOATING CARDS */}
          <div className={styles.floatingCards}>
            <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
              <div className={styles.fcIcon}>⚡</div>
              <div className={styles.fcText}>Fiche générée en <strong>10s</strong></div>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
              <div className={styles.fcIcon}>🌍</div>
              <div className={styles.fcText}><strong>7 langues</strong> supportées</div>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCard3}`}>
              <div className={styles.fcIcon}>✅</div>
              <div className={styles.fcText}>SEO <strong>optimisé</strong></div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.stats}>
          {[
            { num: 10, suffix: 's', label: 'Par fiche générée' },
            { num: 5, suffix: '×', label: 'Plus de conversions' },
            { num: 0, suffix: '€', label: 'Pour démarrer' },
            { num: 7, suffix: '', label: 'Langues supportées' },
          ].map((s, i) => (
            <div key={s.label} className={`${styles.stat} reveal reveal-delay-${i + 1}`}>
              <div
                className={styles.statNum}
                data-counter
                data-target={s.num}
                data-suffix={s.suffix}
              >
                {s.num}{s.suffix}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* PLATFORMS BAR */}
        <section className={`${styles.platformsBar} reveal`}>
          <p className={styles.platformsLabel}>Compatible avec toutes vos plateformes</p>
          <div className={styles.platformsList}>
            {['🟢 Shopify', '📦 Amazon', '🎨 Etsy', '🔵 Prestashop', '🟠 Leboncoin', '🛒 WooCommerce'].map(p => (
              <div key={p} className={styles.platformPill}>{p}</div>
            ))}
          </div>
        </section>

        {/* EXAMPLES */}
        <section className={styles.section}>
          <div className={`${styles.sectionTag} reveal`}>Exemples</div>
          <h2 className={`${styles.sectionTitle} reveal`}>Voyez la différence</h2>
          <div className={styles.examples}>
            {EXAMPLES.map((ex, i) => (
              <div key={i} className={`${styles.example} reveal reveal-delay-${i + 1}`}>
                <div className={styles.exampleBefore}>
                  <div className={styles.exLabel}>❌ Avant</div>
                  <p>{ex.input}</p>
                </div>
                <div className={styles.arrow}>↓</div>
                <div className={styles.exampleAfter}>
                  <div className={styles.exLabel}>✅ Après</div>
                  <p>{ex.output}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.section}>
          <div className={`${styles.sectionTag} reveal`}>Comment ça marche</div>
          <h2 className={`${styles.sectionTitle} reveal`}>Simple comme bonjour</h2>
          <div className={styles.steps}>
            {[
              { n: '01', title: 'Entrez vos infos', desc: 'Nom du produit, caractéristiques, catégorie. 30 secondes maximum.' },
              { n: '02', title: "L'IA génère", desc: "Notre IA analyse et crée une fiche complète optimisée SEO en 10 secondes." },
              { n: '03', title: 'Copiez et publiez', desc: "Copiez la fiche en un clic et collez-la sur votre boutique. C'est tout." },
            ].map((step, i) => (
              <div key={step.n} className={`${styles.step} reveal reveal-delay-${i + 1}`}>
                <div className={styles.stepNum}>{step.n}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className={styles.section}>
          <div className={`${styles.sectionTag} reveal`}>Témoignages</div>
          <h2 className={`${styles.sectionTitle} reveal`}>Ils ont arrêté d'écrire</h2>
          <div className={styles.testimonials}>
            {[
              { name: 'Sophie M.', role: 'Boutique Shopify · Mode', text: "J'avais 200 produits à décrire. Avec FichePro, j'ai tout fini en une matinée. Mes ventes ont augmenté de 30% le mois suivant.", avatar: 'S', color: '#667eea' },
              { name: 'Thomas B.', role: 'Vendeur Amazon · Électronique', text: "Les fiches sont parfaitement optimisées pour Amazon. Le titre avec les bons mots-clés dès le début, c'est exactement ce qu'il faut.", avatar: 'T', color: '#f093fb' },
              { name: 'Marie L.', role: 'Créatrice Etsy · Artisanat', text: "Le ton artisanal généré est parfait pour Etsy. On dirait que j'ai écrit moi-même, mais en 10 fois mieux et 100 fois plus vite.", avatar: 'M', color: '#4facfe' },
            ].map((t, i) => (
              <div key={t.name} className={`${styles.testimonial} reveal reveal-delay-${i + 1}`}>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className={styles.section} id="pricing">
          <div className={`${styles.sectionTag} reveal`}>Tarifs</div>
          <h2 className={`${styles.sectionTitle} reveal`}>Simple et transparent</h2>
          <div className={styles.plans}>
            {[
              { name: 'Starter', planKey: 'starter', price: '19', fiches: '50 fiches/mois', features: ['Toutes les catégories', 'Export copier-coller', '7 langues', 'Support email'], delay: 1 },
              { name: 'Pro', planKey: 'pro', price: '49', fiches: '200 fiches/mois', features: ['Tout Starter +', 'Tons personnalisés', 'Historique 30 jours', 'Analyse URL boutique', 'Support prioritaire'], popular: true, delay: 2 },
              { name: 'Business', planKey: 'business', price: '99', fiches: 'Illimité', features: ['Tout Pro +', 'Accès API', 'Multi-utilisateurs', 'Onboarding dédié'], delay: 3 },
            ].map((plan) => (
              <div key={plan.name} className={`${styles.plan} ${plan.popular ? styles.planPopular : ''} reveal reveal-delay-${plan.delay}`}>
                {plan.popular && <div className={styles.popularBadge}>Le plus populaire</div>}
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  <span className={styles.planAmount}>{plan.price}€</span>
                  <span className={styles.planPer}>/mois</span>
                </div>
                <div className={styles.planFiches}>{plan.fiches}</div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((f) => (
                    <li key={f}><span>✓</span>{f}</li>
                  ))}
                </ul>
                <button
                  className={`${styles.planBtn} ${plan.popular ? styles.planBtnAccent : ''}`}
                  onClick={() => handleCheckout(plan.planKey)}
                  disabled={checkoutLoading === plan.planKey}
                >
                  {checkoutLoading === plan.planKey ? 'Chargement...' : 'Commencer →'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={`${styles.ctaSection} reveal`}>
          <div className={styles.ctaGlow} />
          <h2 className={styles.ctaTitle}>Prêt à gagner du temps ?</h2>
          <p className={styles.ctaSub}>5 fiches gratuites pour tester. Sans CB.</p>
          <Link href="/dashboard" className={`${styles.btnPrimary} ${styles.btnPrimaryLarge}`}>
            <span>Démarrer maintenant</span>
            <span className={styles.btnArrow}>→</span>
          </Link>
        </section>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Fiche<span>Pro</span></div>
        <p className={styles.footerText}>© 2026 FichePro</p>
      </footer>
    </>
  )
}
