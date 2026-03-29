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

const TEMOIGNAGES = [
  {
    nom: 'Sophie M.',
    role: 'Boutique Shopify — Mode femme',
    avatar: 'S',
    note: 5,
    texte: 'J\'avais 200 produits à rédiger pour le lancement de ma boutique. FichePro m\'a sauvé la mise — 3 jours de travail réduits à 2 heures. Les fiches sont vraiment mieux que ce que j\'aurais écrit moi-même.',
    stat: '200 fiches en 2h',
  },
  {
    nom: 'Thomas R.',
    role: 'Vendeur Amazon — High-tech',
    avatar: 'T',
    note: 5,
    texte: 'Ce qui m\'a convaincu c\'est l\'adaptation automatique à Amazon. Les bullet points sont parfaits, le titre respecte les limites de caractères. Mon taux de conversion a augmenté de 23% en un mois.',
    stat: '+23% de conversion',
  },
  {
    nom: 'Amira B.',
    role: 'Créatrice Etsy — Bijoux faits main',
    avatar: 'A',
    note: 5,
    texte: 'Je vendais en français seulement. Avec FichePro j\'ai traduit tout mon catalogue en anglais, espagnol et allemand en une après-midi. Mes ventes internationales ont doublé.',
    stat: 'Ventes x2 en 3 mois',
  },
  {
    nom: 'Marc L.',
    role: 'Dropshippeur — Maison & Déco',
    avatar: 'M',
    note: 5,
    texte: 'J\'ajoute 30 nouveaux produits par semaine. Avant FichePro je passais mes nuits à rédiger. Maintenant c\'est 10 minutes de boulot. Je me concentre enfin sur ce qui compte : trouver des produits.',
    stat: '30 fiches/semaine automatisées',
  },
]

const STATS = [
  { value: 12000, suffix: '+', label: 'Fiches générées' },
  { value: 7, suffix: '', label: 'Langues supportées' },
  { value: 98, suffix: '%', label: 'Clients satisfaits' },
  { value: 10, suffix: 's', label: 'Par fiche en moyenne' },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [activeExample, setActiveExample] = useState(0)
  const [activeTemoignage, setActiveTemoignage] = useState(0)

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

  // Auto-rotate examples
  useEffect(() => {
    const t = setInterval(() => setActiveExample(i => (i + 1) % EXAMPLES.length), 3500)
    return () => clearInterval(t)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTemoignage(i => (i + 1) % TEMOIGNAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Head>
        <title>FichePro — Fiches produit IA pour e-commerçants</title>
        <meta name="description" content="Générez des fiches produit optimisées SEO en 10 secondes grâce à l'IA. 7 langues, 6 plateformes, export PDF." />
      </Head>

      <Navbar />

      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />

          <div className={styles.heroContent} ref={heroRef}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              IA propulsée par Claude · Anthropic
            </div>

            <h1 className={styles.heroTitle}>
              Arrêtez d'écrire.<br />
              <span className={styles.heroAccent}>Commencez à vendre.</span>
            </h1>

            <p className={styles.heroSub}>
              Générez des fiches produit professionnelles en 10 secondes.<br />
              SEO optimisé · 7 langues · 6 plateformes · Export PDF
            </p>

            <div className={styles.heroCtas}>
              <Link href="/login" className={styles.btnPrimary}>
                <span>Essayer gratuitement</span>
                <span className={styles.btnArrow}>→</span>
              </Link>
              <Link href="#comment" className={styles.btnSecondary}>
                Voir comment ça marche
              </Link>
            </div>

            <p className={styles.heroHint}>5 fiches offertes · Sans CB · Sans engagement</p>

            {/* FLOATING CARDS */}
            <div className={styles.floatingCards}>
              <div className={`${styles.floatingCard} ${styles.fc1}`}>
                <span>⚡</span> Généré en 10s
              </div>
              <div className={`${styles.floatingCard} ${styles.fc2}`}>
                <span>🌍</span> 7 langues
              </div>
              <div className={`${styles.floatingCard} ${styles.fc3}`}>
                <span>📊</span> SEO optimisé
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statValue} data-counter data-target={s.value} data-suffix={s.suffix}>
                  0{s.suffix}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* AVANT / APRÈS */}
        <section className={`${styles.exampleSection} reveal`} id="comment">
          <h2 className={styles.sectionTitle}>De l'idée à la fiche parfaite</h2>
          <p className={styles.sectionSub}>Entrez juste quelques mots — FichePro fait le reste</p>

          <div className={styles.exampleTabs}>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className={`${styles.exampleTab} ${activeExample === i ? styles.exampleTabActive : ''}`}
                onClick={() => setActiveExample(i)}
              >
                Exemple {i + 1}
              </button>
            ))}
          </div>

          <div className={styles.exampleBox}>
            <div className={styles.exampleBefore}>
              <div className={styles.exampleLabel}>Vous tapez</div>
              <div className={styles.exampleText}>{EXAMPLES[activeExample].input}</div>
            </div>
            <div className={styles.exampleArrow}>→</div>
            <div className={styles.exampleAfter}>
              <div className={styles.exampleLabel}>FichePro génère</div>
              <div className={styles.exampleText}>{EXAMPLES[activeExample].output}</div>
              <div className={styles.exampleMore}>+ description complète, points forts, FAQ, méta SEO…</div>
            </div>
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section className={`${styles.featuresSection} reveal`}>
          <h2 className={styles.sectionTitle}>Tout ce dont vous avez besoin</h2>
          <div className={styles.featuresGrid}>
            {[
              { icon: '⚡', title: 'Génération en 10 secondes', desc: 'IA Claude d\'Anthropic pour des textes naturels, convaincants et sans fautes.' },
              { icon: '🌍', title: '7 langues européennes', desc: 'FR, EN, ES, IT, DE, NL, PT — touchez tous vos marchés sans traducteur.' },
              { icon: '🎯', title: 'Adapté à votre plateforme', desc: 'Shopify, Amazon, Etsy, Prestashop, Leboncoin — format optimisé pour chaque site.' },
              { icon: '📊', title: 'Score SEO intégré', desc: 'Analyse en temps réel avec conseils concrets pour mieux ranker sur Google.' },
              { icon: '❓', title: 'FAQ automatique', desc: '5 questions/réponses générées pour rassurer vos acheteurs et booster le SEO.' },
              { icon: '📄', title: 'Export PDF professionnel', desc: 'Téléchargez vos fiches en PDF pour les envoyer à des clients ou les archiver.' },
            ].map((f) => (
              <div key={f.title} className={`${styles.featureCard} reveal`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section className={`${styles.temoSection} reveal`}>
          <h2 className={styles.sectionTitle}>Ils ont adopté FichePro</h2>
          <p className={styles.sectionSub}>Des e-commerçants qui ont repris le contrôle de leur temps</p>

          <div className={styles.temoGrid}>
            {TEMOIGNAGES.map((t, i) => (
              <div
                key={i}
                className={`${styles.temoCard} ${activeTemoignage === i ? styles.temoCardActive : ''}`}
                onClick={() => setActiveTemoignage(i)}
              >
                <div className={styles.temoHeader}>
                  <div className={styles.temoAvatar}>{t.avatar}</div>
                  <div>
                    <div className={styles.temoNom}>{t.nom}</div>
                    <div className={styles.temoRole}>{t.role}</div>
                  </div>
                  <div className={styles.temoStat}>{t.stat}</div>
                </div>
                <div className={styles.temoNote}>{'★'.repeat(t.note)}</div>
                <p className={styles.temoTexte}>"{t.texte}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className={`${styles.pricingSection} reveal`} id="pricing">
          <h2 className={styles.sectionTitle}>Simple et transparent</h2>
          <p className={styles.sectionSub}>Commencez gratuitement, payez quand vous êtes convaincu</p>

          <div className={styles.plans}>
            {[
              {
                name: 'Starter', planKey: 'starter', price: '19', fiches: '50 fiches/mois',
                features: ['Toutes les catégories', 'Export PDF', '7 langues', 'Score SEO', 'Support email'],
                delay: 1
              },
              {
                name: 'Pro', planKey: 'pro', price: '49', fiches: '200 fiches/mois',
                features: ['Tout Starter +', 'FAQ automatique', '3 variantes de texte', 'Analyse URL boutique', 'Support prioritaire'],
                popular: true, delay: 2
              },
              {
                name: 'Business', planKey: 'business', price: '99', fiches: 'Illimité',
                features: ['Tout Pro +', 'Fiches illimitées', 'Accès API', 'Multi-utilisateurs', 'Onboarding dédié'],
                delay: 3
              },
            ].map((plan) => (
              <div key={plan.name} className={`${styles.plan} ${plan.popular ? styles.planPopular : ''} reveal reveal-delay-${plan.delay}`}>
                {plan.popular && <div className={styles.popularBadge}>⭐ Le plus populaire</div>}
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

          <p className={styles.pricingNote}>
            🔒 Paiement sécurisé par Stripe · Résiliez à tout moment · Facture automatique
          </p>
        </section>

        {/* FAQ */}
        <section className={`${styles.faqSection} reveal`}>
          <h2 className={styles.sectionTitle}>Questions fréquentes</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'Les fiches sont-elles vraiment uniques ?', r: 'Oui, chaque fiche est générée à la demande par l\'IA — jamais copiée-collée depuis une base de données.' },
              { q: 'Puis-je modifier les fiches générées ?', r: 'Absolument. Vous copiez le texte et l\'adaptez comme vous voulez. Le contenu vous appartient à 100%.' },
              { q: 'Quelles plateformes sont supportées ?', r: 'Shopify, Amazon, Etsy, Prestashop, Leboncoin et un format générique pour tout autre site.' },
              { q: 'Est-ce que ça marche vraiment en 10 secondes ?', r: 'Oui — l\'IA génère en parallèle le titre, la description, les points forts, le score SEO et la FAQ en une seule requête.' },
            ].map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <div className={styles.faqQ}>{item.q}</div>
                <div className={styles.faqR}>{item.r}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className={`${styles.ctaSection} reveal`}>
          <div className={styles.ctaGlow} />
          <h2 className={styles.ctaTitle}>Prêt à gagner du temps ?</h2>
          <p className={styles.ctaSub}>5 fiches gratuites pour tester. Sans CB. Sans engagement.</p>
          <Link href="/login" className={`${styles.btnPrimary} ${styles.btnPrimaryLarge}`}>
            <span>Démarrer maintenant</span>
            <span className={styles.btnArrow}>→</span>
          </Link>
          <p className={styles.ctaNote}>Déjà plus de 500 e-commerçants nous font confiance</p>
        </section>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>Fiche<span>Pro</span></div>
          <div className={styles.footerLinks}>
            <Link href="/cgu">CGU</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="mailto:contact@mafichepro.fr">Contact</Link>
          </div>
        </div>
        <p className={styles.footerText}>© 2026 FichePro · Propulsé par Claude AI</p>
      </footer>
    </>
  )
}
