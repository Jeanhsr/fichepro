import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import styles from '../styles/Dashboard.module.css'
import { exportToPDF } from '../utils/exportPDF'

interface Avis {
  nom: string
  note: number
  commentaire: string
  date: string
}

interface ScoreCritere {
  label: string
  score: number
  conseil: string
}

interface ScoreSeo {
  total: number
  criteres: ScoreCritere[]
}

interface FaqItem {
  question: string
  reponse: string
}

interface FicheVariante {
  label: string
  titre_seo: string
  description_courte: string
  description_longue: string
  points_forts: string[]
  meta_description: string
  avis_clients: Avis[]
  tags_seo: string[]
}

interface FicheResult {
  titre_seo: string
  description_courte: string
  description_longue: string
  points_forts: string[]
  meta_description: string
  avis_clients: Avis[]
  tags_seo: string[]
  variantes: FicheVariante[]
  score_seo: ScoreSeo
  faq: FaqItem[]
}

interface HistoriqueItem {
  id: string
  date: string
  productName: string
  category: string
  language: string
  platform: string
  result: FicheResult
}

const LANGUAGES = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  { code: 'pt', flag: '🇵🇹', label: 'Português' },
]

const PLATFORMS = [
  { code: 'generic', label: 'Générique', icon: '🛒' },
  { code: 'shopify', label: 'Shopify', icon: '🟢' },
  { code: 'amazon', label: 'Amazon', icon: '📦' },
  { code: 'etsy', label: 'Etsy', icon: '🎨' },
  { code: 'prestashop', label: 'Prestashop', icon: '🔵' },
  { code: 'leboncoin', label: 'Leboncoin', icon: '🟠' },
]

const CATEGORY_FIELDS: Record<string, { key: string; label: string }[]> = {
  mode: [
    { key: 'matiere', label: 'Matière' },
    { key: 'couleur', label: 'Couleur' },
    { key: 'taille', label: 'Tailles disponibles' },
    { key: 'coupe', label: 'Coupe' },
    { key: 'entretien', label: 'Entretien' },
    { key: 'origine', label: 'Origine' },
  ],
  electronique: [
    { key: 'marque', label: 'Marque' },
    { key: 'modele', label: 'Modèle' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'poids', label: 'Poids' },
    { key: 'connectivite', label: 'Connectivité' },
    { key: 'autonomie', label: 'Autonomie' },
    { key: 'garantie', label: 'Garantie' },
  ],
  maison: [
    { key: 'matiere', label: 'Matière' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'couleur', label: 'Couleur' },
    { key: 'style', label: 'Style' },
    { key: 'poids', label: 'Poids' },
    { key: 'assemblage', label: 'Assemblage' },
  ],
  beaute: [
    { key: 'type_peau', label: 'Type de peau' },
    { key: 'contenance', label: 'Contenance' },
    { key: 'composition', label: 'Composition' },
    { key: 'parfum', label: 'Parfum / Senteur' },
    { key: 'utilisation', label: 'Utilisation' },
    { key: 'certifications', label: 'Certifications' },
  ],
  sport: [
    { key: 'sport', label: 'Sport pratiqué' },
    { key: 'taille', label: 'Tailles disponibles' },
    { key: 'matiere', label: 'Matière' },
    { key: 'niveau', label: 'Niveau' },
    { key: 'couleur', label: 'Couleur' },
    { key: 'technologie', label: 'Technologie' },
  ],
  alimentaire: [
    { key: 'poids', label: 'Poids / Volume' },
    { key: 'ingredients', label: 'Ingrédients principaux' },
    { key: 'allergenes', label: 'Allergènes' },
    { key: 'conservation', label: 'Conservation' },
    { key: 'origine', label: 'Origine' },
    { key: 'bio', label: 'Labels' },
  ],
  autre: [
    { key: 'matiere', label: 'Matière' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'couleur', label: 'Couleur' },
    { key: 'poids', label: 'Poids' },
    { key: 'origine', label: 'Origine' },
  ],
}

interface Caracteristique {
  id: string
  label: string
  value: string
  isCustom?: boolean
}

function CaracteristiquesEditor({ category, value, onChange }: {
  category: string
  value: Caracteristique[]
  onChange: (v: Caracteristique[]) => void
}) {
  const [customLabel, setCustomLabel] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const updateValue = (id: string, val: string) =>
    onChange(value.map(c => c.id === id ? { ...c, value: val } : c))

  const removeCustom = (id: string) =>
    onChange(value.filter(c => c.id !== id))

  const addCustom = () => {
    if (!customLabel.trim()) return
    onChange([...value, { id: `custom_${Date.now()}`, label: customLabel.trim(), value: '', isCustom: true }])
    setCustomLabel('')
    setShowCustomInput(false)
  }

  return (
    <div className={styles.caracEditor}>
      {value.map((c) => (
        <div key={c.id} className={styles.caracRow}>
          <label className={styles.caracLabel}>
            {c.label}
            {c.isCustom && <button className={styles.caracRemove} onClick={() => removeCustom(c.id)}>✕</button>}
          </label>
          <input className={styles.caracInput} type="text" placeholder="ex: ..." value={c.value} onChange={(e) => updateValue(c.id, e.target.value)} />
        </div>
      ))}
      {showCustomInput ? (
        <div className={styles.customInputRow}>
          <input className={styles.caracInput} type="text" placeholder="Nom de la caractéristique..." value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustom()} autoFocus />
          <button className={styles.btnAddConfirm} onClick={addCustom}>✓</button>
          <button className={styles.btnAddCancel} onClick={() => setShowCustomInput(false)}>✕</button>
        </div>
      ) : (
        <button className={styles.btnAddCarac} onClick={() => setShowCustomInput(true)}>+ Ajouter une caractéristique</button>
      )}
    </div>
  )
}

function StarRating({ note }: { note: number }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= note ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#00c87a' : score >= 60 ? '#ffb800' : '#ff4444'
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference
  return (
    <div className={styles.gaugeWrap}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx="45" cy="45" r="36" fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className={styles.gaugeScore} style={{ color }}>{score}</div>
    </div>
  )
}

function ProductPreview({ result, productName, price, pricePromo, promoPercent, category }: {
  result: FicheResult
  productName: string
  price: string
  pricePromo: string | null
  promoPercent: number
  category: string
}) {
  const [activeTab, setActiveTab] = useState<'preview' | 'variantes' | 'seo' | 'faq' | 'raw'>('preview')
  const [activeVariante, setActiveVariante] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const currentFiche = result.variantes ? result.variantes[activeVariante] : result

  const copyAll = () => {
    const bullets = currentFiche.points_forts.map((p) => `✓ ${p}`).join('\n')
    const tags = currentFiche.tags_seo.join(', ')
    const avis = currentFiche.avis_clients.map(a => `${a.nom} (${a.note}/5) : ${a.commentaire}`).join('\n')
    const faqText = result.faq ? result.faq.map(f => `Q: ${f.question}\nR: ${f.reponse}`).join('\n\n') : ''
    const text = `TITRE SEO\n${currentFiche.titre_seo}\n\nDESCRIPTION COURTE\n${currentFiche.description_courte}\n\nDESCRIPTION LONGUE\n${currentFiche.description_longue}\n\nPOINTS FORTS\n${bullets}\n\nMÉTA-DESCRIPTION\n${currentFiche.meta_description}\n\nTAGS SEO\n${tags}\n\nAVIS CLIENTS\n${avis}${faqText ? `\n\nFAQ\n${faqText}` : ''}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const avgNote = currentFiche.avis_clients.reduce((a, b) => a + b.note, 0) / currentFiche.avis_clients.length

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`} onClick={() => setActiveTab('preview')}>👁 Aperçu</button>
        {result.variantes && <button className={`${styles.tab} ${activeTab === 'variantes' ? styles.tabActive : ''}`} onClick={() => setActiveTab('variantes')}>✨ Variantes</button>}
        {result.score_seo && <button className={`${styles.tab} ${activeTab === 'seo' ? styles.tabActive : ''}`} onClick={() => setActiveTab('seo')}>📊 Score SEO</button>}
        {result.faq && <button className={`${styles.tab} ${activeTab === 'faq' ? styles.tabActive : ''}`} onClick={() => setActiveTab('faq')}>❓ FAQ</button>}
        <button className={`${styles.tab} ${activeTab === 'raw' ? styles.tabActive : ''}`} onClick={() => setActiveTab('raw')}>📋 Brut</button>
      </div>

      {/* PREVIEW */}
      {activeTab === 'preview' && (
        <div className={styles.productCard}>
          <div className={styles.productTop}>
            <div className={styles.productImageWrap}>
              <div className={styles.productImage}>
                <span className={styles.productImageIcon}>📷</span>
                <p className={styles.productImageText}>Image produit</p>
              </div>
              <div className={styles.productThumbs}>
                {[1, 2, 3].map(i => <div key={i} className={styles.productThumb} />)}
              </div>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productCategory}>{category || 'Catégorie'}</div>
              <h2 className={styles.productTitle}>{currentFiche.titre_seo}</h2>
              <div className={styles.productRating}>
                <StarRating note={Math.round(avgNote)} />
                <span className={styles.productRatingCount}>({currentFiche.avis_clients.length} avis)</span>
              </div>
              <div className={styles.productPrice}>
                {pricePromo ? (
                  <>
                    <span className={styles.promoPriceNewPreview}>{pricePromo}</span>
                    <span className={styles.promoPriceOldPreview}>{price}</span>
                    <span className={styles.promoBadgePreview}>-{promoPercent}%</span>
                  </>
                ) : (price || '–')}
              </div>
              <p className={styles.productShort}>{currentFiche.description_courte}</p>
              <ul className={styles.productBullets}>
                {currentFiche.points_forts.map((pt, i) => (
                  <li key={i}><span className={styles.bulletCheck}>✓</span>{pt}</li>
                ))}
              </ul>
              <div className={styles.productOptions}>
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>Taille</label>
                  <div className={styles.optionBtns}>
                    {['XS', 'S', 'M', 'L', 'XL'].map(s => <button key={s} className={styles.optionBtn}>{s}</button>)}
                  </div>
                </div>
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>Couleur</label>
                  <div className={styles.colorDots}>
                    {['#1a1a1a', '#f5f3ee', '#ff5c00', '#2563eb'].map(c => (
                      <div key={c} className={styles.colorDot} style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.productAvailability}>
                <span className={styles.availDot} />En stock · Expédition sous 24h
              </div>
              <button className={`${styles.addToCart} ${addedToCart ? styles.addedToCart : ''}`} onClick={() => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000) }}>
                {addedToCart ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
              </button>
              <div className={styles.reassurance}>
                <div className={styles.reassuranceItem}>🚚 Livraison gratuite</div>
                <div className={styles.reassuranceItem}>↩ Retour 30j</div>
                <div className={styles.reassuranceItem}>🔒 Paiement sécurisé</div>
              </div>
            </div>
          </div>
          <div className={styles.productDesc}>
            <h3 className={styles.productDescTitle}>Description</h3>
            <p className={styles.productDescText}>{currentFiche.description_longue}</p>
          </div>
          <div className={styles.productTags}>
            {currentFiche.tags_seo.map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}
          </div>
          {result.faq && result.faq.length > 0 && (
            <div className={styles.previewFaq}>
              <h3 className={styles.productDescTitle}>Questions fréquentes</h3>
              {result.faq.map((f, i) => (
                <div key={i} className={styles.previewFaqItem}>
                  <button className={styles.previewFaqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.question}</span>
                    <span>{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && <div className={styles.previewFaqA}>{f.reponse}</div>}
                </div>
              ))}
            </div>
          )}
          <div className={styles.productReviews}>
            <h3 className={styles.reviewsTitle}>Avis clients <span className={styles.reviewsAvg}>{avgNote.toFixed(1)} / 5</span></h3>
            <div className={styles.reviewsList}>
              {currentFiche.avis_clients.map((avis, i) => (
                <div key={i} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>{avis.nom[0]}</div>
                    <div><div className={styles.reviewName}>{avis.nom}</div><div className={styles.reviewDate}>{avis.date}</div></div>
                    <StarRating note={avis.note} />
                  </div>
                  <p className={styles.reviewText}>{avis.commentaire}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.metaPreview}>
            <div className={styles.metaPreviewLabel}>👁 Aperçu Google</div>
            <div className={styles.metaPreviewBox}>
              <div className={styles.metaUrl}>www.votreboutique.fr › {productName.toLowerCase().replace(/\s+/g, '-')}</div>
              <div className={styles.metaTitle}>{currentFiche.titre_seo}</div>
              <div className={styles.metaDesc}>{currentFiche.meta_description}</div>
            </div>
          </div>
        </div>
      )}

      {/* VARIANTES */}
      {activeTab === 'variantes' && result.variantes && (
        <div className={styles.variantesWrap}>
          <p className={styles.variantesIntro}>3 versions générées par l'IA. Choisissez celle qui correspond le mieux à votre style.</p>
          <div className={styles.variantesTabs}>
            {result.variantes.map((v, i) => (
              <button
                key={i}
                className={`${styles.varianteTab} ${activeVariante === i ? styles.varianteTabActive : ''}`}
                onClick={() => setActiveVariante(i)}
              >
                <span className={styles.varianteIcon}>{i === 0 ? '🔥' : i === 1 ? '💼' : '📖'}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.varianteCard}>
            <div className={styles.varianteField}>
              <div className={styles.varianteFieldLabel}>Titre SEO</div>
              <div className={styles.varianteFieldValue}>{result.variantes[activeVariante].titre_seo}</div>
            </div>
            <div className={styles.varianteField}>
              <div className={styles.varianteFieldLabel}>Description courte</div>
              <div className={styles.varianteFieldValue}>{result.variantes[activeVariante].description_courte}</div>
            </div>
            <div className={styles.varianteField}>
              <div className={styles.varianteFieldLabel}>Description longue</div>
              <div className={styles.varianteFieldValue}>{result.variantes[activeVariante].description_longue}</div>
            </div>
            <div className={styles.varianteField}>
              <div className={styles.varianteFieldLabel}>Points forts</div>
              <ul className={styles.varianteBullets}>
                {result.variantes[activeVariante].points_forts.map((p, i) => <li key={i}><span>✓</span>{p}</li>)}
              </ul>
            </div>
            <button
              className={styles.btnUseVariante}
              onClick={() => { setActiveVariante(activeVariante); setActiveTab('preview') }}
            >
              Utiliser cette variante →
            </button>
          </div>
        </div>
      )}

      {/* SCORE SEO */}
      {activeTab === 'seo' && result.score_seo && (
        <div className={styles.seoWrap}>
          <div className={styles.seoHeader}>
            <ScoreGauge score={result.score_seo.total} />
            <div className={styles.seoHeaderText}>
              <div className={styles.seoTotalLabel}>Score SEO global</div>
              <div className={styles.seoTotalDesc}>
                {result.score_seo.total >= 80 ? '🟢 Excellent — prête à publier' : result.score_seo.total >= 60 ? '🟡 Bon — quelques améliorations possibles' : '🔴 À améliorer'}
              </div>
            </div>
          </div>
          <div className={styles.seoCriteres}>
            {result.score_seo.criteres.map((c, i) => {
              const color = c.score >= 80 ? '#00c87a' : c.score >= 60 ? '#ffb800' : '#ff4444'
              return (
                <div key={i} className={styles.seoCritere}>
                  <div className={styles.seoCritereTop}>
                    <span className={styles.seoCritereLabel}>{c.label}</span>
                    <span className={styles.seoCritereScore} style={{ color }}>{c.score}/100</span>
                  </div>
                  <div className={styles.seoCritereBar}>
                    <div className={styles.seoCritereBarFill} style={{ width: `${c.score}%`, background: color }} />
                  </div>
                  <div className={styles.seoCritereConseil}>💡 {c.conseil}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeTab === 'faq' && result.faq && (
        <div className={styles.faqWrap}>
          <p className={styles.faqIntro}>FAQ générée automatiquement. Prête à copier sur votre fiche produit.</p>
          {result.faq.map((f, i) => (
            <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ''}`}>
              <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.question}</span>
                <span className={styles.faqArrow}>{openFaq === i ? '▲' : '▼'}</span>
              </button>
              {openFaq === i && <div className={styles.faqAnswer}>{f.reponse}</div>}
            </div>
          ))}
        </div>
      )}

      {/* RAW */}
      {activeTab === 'raw' && (
        <div className={styles.rawContent}>
          <div className={styles.rawSection}><div className={styles.rawLabel}>Titre SEO</div><div className={styles.rawText}>{currentFiche.titre_seo}</div></div>
          <div className={styles.rawSection}><div className={styles.rawLabel}>Description courte</div><div className={styles.rawText}>{currentFiche.description_courte}</div></div>
          <div className={styles.rawSection}><div className={styles.rawLabel}>Description longue</div><div className={styles.rawText}>{currentFiche.description_longue}</div></div>
          <div className={styles.rawSection}>
            <div className={styles.rawLabel}>Points forts</div>
            <ul className={styles.rawBullets}>{currentFiche.points_forts.map((pt, i) => <li key={i}>{pt}</li>)}</ul>
          </div>
          <div className={styles.rawSection}><div className={styles.rawLabel}>Méta-description</div><div className={styles.rawMeta}>{currentFiche.meta_description}</div></div>
          <div className={styles.rawSection}>
            <div className={styles.rawLabel}>Tags SEO</div>
            <div className={styles.rawTagsList}>{currentFiche.tags_seo.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}</div>
          </div>
          {result.faq && (
            <div className={styles.rawSection}>
              <div className={styles.rawLabel}>FAQ</div>
              {result.faq.map((f, i) => (
                <div key={i} className={styles.rawFaqItem}>
                  <div className={styles.rawFaqQ}>Q : {f.question}</div>
                  <div className={styles.rawFaqA}>R : {f.reponse}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button className={`${styles.btnCopy} ${copied ? styles.btnCopied : ''}`} onClick={copyAll}>
        {copied ? '✅ Copié !' : '📋 Copier toute la fiche'}
      </button>
      <button
        className={styles.btnPDF}
        onClick={() => exportToPDF(currentFiche, productName, price, pricePromo, promoPercent)}
      >
        📄 Exporter en PDF
      </button>
    </div>
  )
}

function Historique({ items, onSelect, onDelete }: {
  items: HistoriqueItem[]
  onSelect: (item: HistoriqueItem) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) return (
    <div className={styles.histoEmpty}>
      <div className={styles.histoEmptyIcon}>🕐</div>
      <p>Aucune fiche générée pour l'instant</p>
    </div>
  )

  return (
    <div className={styles.histoList}>
      {items.map((item) => (
        <div key={item.id} className={styles.histoItem}>
          <div className={styles.histoInfo} onClick={() => onSelect(item)}>
            <div className={styles.histoName}>{item.productName}</div>
            <div className={styles.histoMeta}>
              <span>{item.category}</span>
              <span>·</span>
              <span>{LANGUAGES.find(l => l.code === item.language)?.flag}</span>
              <span>·</span>
              <span>{item.date}</span>
            </div>
          </div>
          <button className={styles.histoDelete} onClick={() => onDelete(item.id)}>🗑</button>
        </div>
      ))}
    </div>
  )
}

function LoadingStep({ delay, text }: { delay: number; text: string }) {
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay)
    const t2 = setTimeout(() => setDone(true), delay + 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay])

  if (!visible) return null
  return (
    <div className={`${styles.loadingStep} ${done ? styles.loadingStepDone : styles.loadingStepActive}`}>
      <span className={styles.loadingStepIcon}>{done ? '✓' : <span className={styles.spinnerSm} />}</span>
      <span>{text}</span>
    </div>
  )
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading' || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
      <div style={{ width: 40, height: 40, border: '2px solid rgba(255,92,0,0.2)', borderTopColor: '#ff5c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
  const [activeView, setActiveView] = useState<'generate' | 'historique'>('generate')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('mode')
  const [tone, setTone] = useState('professionnel')
  const [caracteristiques, setCaracteristiques] = useState<Caracteristique[]>(
    CATEGORY_FIELDS['mode'].map(f => ({ id: f.key, label: f.label, value: '' }))
  )
  const [price, setPrice] = useState('')
  const [promoActive, setPromoActive] = useState(false)
  const [promoPercent, setPromoPercent] = useState(0)
  const [language, setLanguage] = useState('fr')
  const [platform, setPlatform] = useState('generic')
  const [boutiqueUrl, setBoutiqueUrl] = useState('')
  const [analysingUrl, setAnalysingUrl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FicheResult | null>(null)
  const [error, setError] = useState('')
  const [historique, setHistorique] = useState<HistoriqueItem[]>([])

  // Charger historique depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fichepro_historique')
      if (saved) setHistorique(JSON.parse(saved))
    } catch {}
  }, [])

  const saveToHistorique = (res: FicheResult) => {
    const item: HistoriqueItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      productName,
      category,
      language,
      platform,
      result: res,
    }
    const updated = [item, ...historique].slice(0, 50)
    setHistorique(updated)
    try { localStorage.setItem('fichepro_historique', JSON.stringify(updated)) } catch {}
  }

  const deleteFromHistorique = (id: string) => {
    const updated = historique.filter(h => h.id !== id)
    setHistorique(updated)
    try { localStorage.setItem('fichepro_historique', JSON.stringify(updated)) } catch {}
  }

  const loadFromHistorique = (item: HistoriqueItem) => {
    setProductName(item.productName)
    setCategory(item.category)
    setLanguage(item.language)
    setPlatform(item.platform)
    setResult(item.result)
    setActiveView('generate')
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    setCaracteristiques(CATEGORY_FIELDS[newCategory].map(f => ({ id: f.key, label: f.label, value: '' })))
  }

  const analyseUrl = async () => {
    if (!boutiqueUrl.trim()) return
    setAnalysingUrl(true)
    try {
      const res = await fetch('/api/analyse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: boutiqueUrl }),
      })
      const data = await res.json()
      if (data.tone) setTone(data.tone)
    } catch {}
    setAnalysingUrl(false)
  }

  const generate = async () => {
    if (!productName.trim()) { setError('Veuillez entrer le nom du produit.'); return }
    if (!price.trim()) { setError('Veuillez entrer le prix du produit.'); return }
    setError('')
    setLoading(true)
    setResult(null)

    const featuresText = caracteristiques
      .filter(c => c.value.trim())
      .map(c => `${c.label}: ${c.value}`)
      .join('\n')

    // Calcul prix promo
    const pricePromo = promoActive && promoPercent > 0 ? (() => {
      const num = parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.'))
      const reduced = num * (1 - promoPercent / 100)
      return isNaN(reduced) ? null : reduced.toFixed(2).replace('.', ',') + '€'
    })() : null

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, category, tone, features: featuresText, price, pricePromo, promoPercent: promoActive ? promoPercent : 0, language, platform, boutiqueUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      setResult(data)
      saveToHistorique(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Dashboard — FichePro</title></Head>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.layout}>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>

            {/* NAV TABS */}
            <div className={styles.sidebarNav}>
              <button className={`${styles.sidebarNavBtn} ${activeView === 'generate' ? styles.sidebarNavActive : ''}`} onClick={() => setActiveView('generate')}>
                ⚡ Générer
              </button>
              <button className={`${styles.sidebarNavBtn} ${activeView === 'historique' ? styles.sidebarNavActive : ''}`} onClick={() => setActiveView('historique')}>
                🕐 Historique {historique.length > 0 && <span className={styles.histoBadge}>{historique.length}</span>}
              </button>
            </div>

            {activeView === 'historique' ? (
              <Historique items={historique} onSelect={loadFromHistorique} onDelete={deleteFromHistorique} />
            ) : (
              <>
                {/* LANGUE */}
                <div className={styles.field}>
                  <label className={styles.label}>🌍 Langue</label>
                  <div className={styles.langGrid}>
                    {LANGUAGES.map(lang => (
                      <button key={lang.code} className={`${styles.langBtn} ${language === lang.code ? styles.langBtnActive : ''}`} onClick={() => setLanguage(lang.code)}>
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PLATEFORME */}
                <div className={styles.field}>
                  <label className={styles.label}>🎯 Plateforme</label>
                  <div className={styles.platformGrid}>
                    {PLATFORMS.map(p => (
                      <button key={p.code} className={`${styles.platformBtn} ${platform === p.code ? styles.platformBtnActive : ''}`} onClick={() => setPlatform(p.code)}>
                        <span>{p.icon}</span><span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL BOUTIQUE */}
                <div className={styles.field}>
                  <label className={styles.label}>🏪 Adapter au style de votre boutique</label>
                  <div className={styles.urlRow}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="https://votreboutique.com"
                      value={boutiqueUrl}
                      onChange={(e) => setBoutiqueUrl(e.target.value)}
                    />
                    <button className={styles.btnAnalyse} onClick={analyseUrl} disabled={analysingUrl || !boutiqueUrl}>
                      {analysingUrl ? <span className={styles.spinnerSm} /> : '→'}
                    </button>
                  </div>
                  {analysingUrl && <p className={styles.urlHint}>Analyse du style en cours...</p>}
                  {!analysingUrl && boutiqueUrl && <p className={styles.urlHint}>✓ Style analysé et appliqué</p>}
                </div>

                <div className={styles.divider} />

                {/* PRODUIT */}
                <div className={styles.field}>
                  <label className={styles.label}>Nom du produit *</label>
                  <input className={styles.input} type="text" placeholder="ex: Nike Air Max 90 Blanc/Noir" value={productName} onChange={(e) => setProductName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && generate()} />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Catégorie</label>
                    <select className={styles.select} value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                      <option value="mode">Mode & Vêtements</option>
                      <option value="electronique">Électronique</option>
                      <option value="maison">Maison & Déco</option>
                      <option value="beaute">Beauté & Bien-être</option>
                      <option value="sport">Sport & Loisirs</option>
                      <option value="alimentaire">Alimentaire</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Ton</label>
                    <select className={styles.select} value={tone} onChange={(e) => setTone(e.target.value)}>
                      <option value="professionnel">Professionnel</option>
                      <option value="enthousiaste">Enthousiaste</option>
                      <option value="luxe">Luxe & Premium</option>
                      <option value="simple">Simple & Direct</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Caractéristiques</label>
                  <CaracteristiquesEditor category={category} value={caracteristiques} onChange={setCaracteristiques} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Prix *</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="ex: 149,99€"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* PROMO */}
                <div className={styles.promoSection}>
                  <button
                    className={`${styles.promoToggle} ${promoActive ? styles.promoToggleActive : ''}`}
                    onClick={() => setPromoActive(!promoActive)}
                  >
                    <span>🏷️ Ajouter une promotion</span>
                    <span className={styles.promoArrow}>{promoActive ? '▲' : '▼'}</span>
                  </button>
                  {promoActive && (
                    <div className={styles.promoPanel}>
                      <label className={styles.label}>Réduction</label>
                      <div className={styles.promoRow}>
                        {[10, 15, 20, 25, 30, 50].map(pct => (
                          <button
                            key={pct}
                            className={`${styles.promoPct} ${promoPercent === pct ? styles.promoPctActive : ''}`}
                            onClick={() => setPromoPercent(pct)}
                          >
                            -{pct}%
                          </button>
                        ))}
                      </div>
                      <div className={styles.promoCustomRow}>
                        <span className={styles.promoCustomLabel}>Personnalisé :</span>
                        <input
                          className={styles.promoCustomInput}
                          type="number"
                          min="1"
                          max="90"
                          placeholder="ex: 35"
                          value={promoPercent || ''}
                          onChange={(e) => setPromoPercent(Number(e.target.value))}
                        />
                        <span className={styles.promoCustomSuffix}>%</span>
                      </div>
                      {price && promoPercent > 0 && (
                        <div className={styles.promoPreview}>
                          <span className={styles.promoPriceOld}>{price}</span>
                          <span className={styles.promoPriceNew}>
                            {(() => {
                              const num = parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.'))
                              const reduced = num * (1 - promoPercent / 100)
                              return isNaN(reduced) ? '–' : reduced.toFixed(2).replace('.', ',') + '€'
                            })()}
                          </span>
                          <span className={styles.promoBadge}>-{promoPercent}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {error && (
                  <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <div className={styles.errorContent}>
                      <div className={styles.errorTitle}>Une erreur est survenue</div>
                      <div className={styles.errorMsg}>{error}</div>
                    </div>
                    <button className={styles.errorClose} onClick={() => setError('')}>✕</button>
                  </div>
                )}

                <button className={styles.btnGenerate} onClick={generate} disabled={loading}>
                  {loading ? <><span className={styles.spinner} />Génération...</> : <>⚡ Générer la fiche</>}
                </button>
              </>
            )}
          </aside>

          {/* MAIN */}
          <main className={styles.main}>
            {!result && !loading && (
              <div className={styles.empty}>
                <div className={styles.emptyVisual}>
                  <div className={styles.emptyOrb} />
                  <div className={styles.emptyCard}>
                    <div className={styles.emptyCardLine} style={{ width: '60%' }} />
                    <div className={styles.emptyCardLine} style={{ width: '90%' }} />
                    <div className={styles.emptyCardLine} style={{ width: '75%' }} />
                    <div className={styles.emptyCardDivider} />
                    <div className={styles.emptyCardBullets}>
                      {[80, 95, 70, 85, 60].map((w, i) => (
                        <div key={i} className={styles.emptyCardBullet}>
                          <div className={styles.emptyCardBulletDot} />
                          <div className={styles.emptyCardLine} style={{ width: `${w}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className={styles.emptyCardDivider} />
                    <div className={styles.emptyCardTags}>
                      {[40, 55, 35, 50].map((w, i) => (
                        <div key={i} className={styles.emptyCardTag} style={{ width: `${w}px` }} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.emptyBadge}>
                    <span className={styles.emptyBadgeDot} />
                    Prêt à générer
                  </div>
                </div>
                <h3 className={styles.emptyTitle}>Votre fiche produit ici</h3>
                <p className={styles.emptyText}>
                  Renseignez le nom et le prix de votre produit à gauche,<br />
                  puis cliquez sur <strong>⚡ Générer la fiche</strong>
                </p>
                <div className={styles.emptyFeatures}>
                  <div className={styles.emptyFeature}><span>✨</span>3 variantes de texte</div>
                  <div className={styles.emptyFeature}><span>📊</span>Score SEO</div>
                  <div className={styles.emptyFeature}><span>❓</span>FAQ automatique</div>
                  <div className={styles.emptyFeature}><span>🌍</span>7 langues</div>
                </div>
              </div>
            )}
            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingOrb} />
                <div className={styles.loadingSteps}>
                  <LoadingStep delay={0} text="Analyse du produit..." />
                  <LoadingStep delay={1200} text="Rédaction des descriptions..." />
                  <LoadingStep delay={2400} text="Optimisation SEO..." />
                  <LoadingStep delay={3600} text="Génération des variantes..." />
                  <LoadingStep delay={4800} text="Création de la FAQ..." />
                </div>
              </div>
            )}
            {result && <ProductPreview result={result} productName={productName} price={price} pricePromo={promoActive && promoPercent > 0 ? (() => { const num = parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.')); const r = num * (1 - promoPercent / 100); return isNaN(r) ? null : r.toFixed(2).replace('.', ',') + '€' })() : null} promoPercent={promoActive ? promoPercent : 0} category={category} />}
          </main>

        </div>
      </div>
    </>
  )
}
