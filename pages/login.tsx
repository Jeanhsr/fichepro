import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from '../styles/Auth.module.css'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Remplissez tous les champs.'); return }
    if (mode === 'register' && !name) { setError('Entrez votre prénom.'); return }
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }

    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      name,
      action: mode,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Head>
        <title>{mode === 'login' ? 'Connexion' : 'Créer un compte'} — FichePro</title>
      </Head>

      <div className={styles.page}>
        {/* BG ORBS */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        <div className={styles.card}>
          {/* LOGO */}
          <Link href="/" className={styles.logo}>
            Fiche<span>Pro</span>
          </Link>

          {/* TOGGLE */}
          <div className={styles.toggle}>
            <button
              className={`${styles.toggleBtn} ${mode === 'login' ? styles.toggleActive : ''}`}
              onClick={() => { setMode('login'); setError('') }}
            >
              Connexion
            </button>
            <button
              className={`${styles.toggleBtn} ${mode === 'register' ? styles.toggleActive : ''}`}
              onClick={() => { setMode('register'); setError('') }}
            >
              Créer un compte
            </button>
          </div>

          <h1 className={styles.title}>
            {mode === 'login' ? 'Bon retour 👋' : 'Commencer gratuitement'}
          </h1>
          <p className={styles.subtitle}>
            {mode === 'login'
              ? 'Connectez-vous pour accéder à vos fiches.'
              : '5 fiches offertes · Sans CB · Sans engagement'}
          </p>

          <div className={styles.form}>
            {mode === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>Prénom</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ex: Sophie"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="vous@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus={mode === 'login'}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Mot de passe</label>
              <input
                className={styles.input}
                type="password"
                placeholder="6 caractères minimum"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              className={styles.btnSubmit}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><span className={styles.spinner} /> {mode === 'login' ? 'Connexion...' : 'Création...'}</>
              ) : (
                mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'
              )}
            </button>
          </div>

          {mode === 'login' && (
            <p className={styles.switch}>
              Pas encore de compte ?{' '}
              <button className={styles.switchBtn} onClick={() => { setMode('register'); setError('') }}>
                Créer un compte gratuit
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p className={styles.switch}>
              Déjà un compte ?{' '}
              <button className={styles.switchBtn} onClick={() => { setMode('login'); setError('') }}>
                Se connecter
              </button>
            </p>
          )}

          <p className={styles.legal}>
            En continuant, vous acceptez nos{' '}
            <Link href="/cgu">CGU</Link> et notre{' '}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </>
  )
}
