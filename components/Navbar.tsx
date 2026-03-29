import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const isDashboard = router.pathname === '/dashboard'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Fiche<span>Pro</span>
      </Link>
      <div className={styles.right}>
        {session ? (
          <>
            {!isDashboard && (
              <Link href="/dashboard" className={styles.link}>Dashboard</Link>
            )}
            <div className={styles.userMenu}>
              <button className={styles.avatar} onClick={() => setMenuOpen(!menuOpen)}>
                {session.user?.name?.[0]?.toUpperCase() || '?'}
              </button>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <div className={styles.dropdownName}>{session.user?.name}</div>
                    <div className={styles.dropdownEmail}>{session.user?.email}</div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link href="/profil" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    👤 Mon profil
                  </Link>
                  <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    ⚡ Dashboard
                  </Link>
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                  >
                    → Déconnexion
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {!isDashboard && (
              <Link href="#pricing" className={styles.link}>Tarifs</Link>
            )}
            <Link href="/login" className={styles.link}>Connexion</Link>
            <Link href="/login" className={styles.btn}>
              Essayer gratuitement →
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
