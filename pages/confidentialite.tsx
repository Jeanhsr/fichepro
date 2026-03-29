import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Legal.module.css'

export default function Confidentialite() {
  return (
    <>
      <Head><title>Politique de Confidentialité — FichePro</title></Head>
      <div className={styles.page}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>Fiche<span>Pro</span></Link>

          <h1 className={styles.title}>Politique de Confidentialité</h1>
          <p className={styles.updated}>Dernière mise à jour : mars 2026</p>

          <div className={styles.content}>

            <section className={styles.section}>
              <h2>1. Responsable du traitement</h2>
              <p>FichePro est responsable du traitement de vos données personnelles. Contact : <a href="mailto:contact@fichepro.fr">contact@fichepro.fr</a></p>
            </section>

            <section className={styles.section}>
              <h2>2. Données collectées</h2>
              <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
              <ul>
                <li><strong>Données de compte :</strong> prénom, adresse email, mot de passe (chiffré)</li>
                <li><strong>Données d'utilisation :</strong> nombre de fiches générées, date de création du compte</li>
                <li><strong>Données de paiement :</strong> traitées directement par Stripe, nous ne stockons aucune donnée bancaire</li>
                <li><strong>Données de navigation :</strong> adresse IP, navigateur, pages visitées (à des fins d'analyse)</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. Finalités du traitement</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul>
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Fournir le service de génération de fiches produit</li>
                <li>Gérer les abonnements et paiements</li>
                <li>Vous envoyer des communications liées au service (mises à jour, factures)</li>
                <li>Améliorer le service et détecter les abus</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Base légale</h2>
              <p>Le traitement de vos données est fondé sur :</p>
              <ul>
                <li>L'exécution du contrat (fourniture du service)</li>
                <li>Votre consentement (communications marketing)</li>
                <li>Notre intérêt légitime (amélioration du service, sécurité)</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>5. Durée de conservation</h2>
              <p>Vos données sont conservées pendant toute la durée de votre compte, puis supprimées dans un délai de 30 jours après la clôture du compte. Les données de facturation sont conservées 10 ans conformément aux obligations légales.</p>
            </section>

            <section className={styles.section}>
              <h2>6. Partage des données</h2>
              <p>Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec :</p>
              <ul>
                <li><strong>Anthropic</strong> — pour le traitement des requêtes IA (vos descriptions produit)</li>
                <li><strong>Stripe</strong> — pour le traitement des paiements</li>
                <li><strong>Vercel</strong> — hébergement de l'application</li>
              </ul>
              <p>Ces prestataires sont soumis à des obligations strictes de confidentialité.</p>
            </section>

            <section className={styles.section}>
              <h2>7. Vos droits (RGPD)</h2>
              <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
              <ul>
                <li><strong>Droit d'accès</strong> — obtenir une copie de vos données</li>
                <li><strong>Droit de rectification</strong> — corriger vos données</li>
                <li><strong>Droit à l'effacement</strong> — supprimer votre compte et vos données</li>
                <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition</strong> — vous opposer à certains traitements</li>
              </ul>
              <p>Pour exercer ces droits, contactez-nous à <a href="mailto:contact@fichepro.fr">contact@fichepro.fr</a>. Nous répondrons dans un délai de 30 jours.</p>
            </section>

            <section className={styles.section}>
              <h2>8. Cookies</h2>
              <p>FichePro utilise uniquement des cookies techniques nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
            </section>

            <section className={styles.section}>
              <h2>9. Sécurité</h2>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des mots de passe, connexions HTTPS, accès restreints aux données.</p>
            </section>

            <section className={styles.section}>
              <h2>10. Contact & réclamations</h2>
              <p>Pour toute question : <a href="mailto:contact@fichepro.fr">contact@fichepro.fr</a></p>
              <p>Vous pouvez également déposer une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
            </section>

          </div>

          <div className={styles.footer}>
            <Link href="/">← Retour à l'accueil</Link>
            <Link href="/cgu">Conditions Générales d'Utilisation →</Link>
          </div>
        </div>
      </div>
    </>
  )
}
