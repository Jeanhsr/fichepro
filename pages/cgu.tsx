import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Legal.module.css'

export default function CGU() {
  return (
    <>
      <Head><title>Conditions Générales d'Utilisation — FichePro</title></Head>
      <div className={styles.page}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>Fiche<span>Pro</span></Link>

          <h1 className={styles.title}>Conditions Générales d'Utilisation</h1>
          <p className={styles.updated}>Dernière mise à jour : mars 2026</p>

          <div className={styles.content}>

            <section className={styles.section}>
              <h2>1. Présentation du service</h2>
              <p>FichePro est un service en ligne permettant aux e-commerçants de générer automatiquement des fiches produit optimisées pour le référencement naturel (SEO) grâce à l'intelligence artificielle. Le service est édité et exploité par FichePro, accessible à l'adresse fichepro.fr.</p>
            </section>

            <section className={styles.section}>
              <h2>2. Acceptation des CGU</h2>
              <p>L'utilisation du service FichePro implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser le service.</p>
            </section>

            <section className={styles.section}>
              <h2>3. Accès au service</h2>
              <p>Le service est accessible après création d'un compte utilisateur. L'inscription est gratuite et donne accès à 5 fiches produit offertes. Au-delà, un abonnement payant est nécessaire.</p>
              <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toute activité effectuée depuis votre compte.</p>
            </section>

            <section className={styles.section}>
              <h2>4. Utilisation du service</h2>
              <p>Vous vous engagez à utiliser FichePro uniquement à des fins légales et conformes aux présentes CGU. Il est notamment interdit de :</p>
              <ul>
                <li>Générer du contenu illégal, trompeur ou frauduleux</li>
                <li>Tenter de contourner les limitations du service</li>
                <li>Revendre ou redistribuer l'accès au service sans autorisation</li>
                <li>Utiliser le service pour des activités portant atteinte aux droits de tiers</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>5. Propriété intellectuelle</h2>
              <p>Les fiches produit générées par FichePro vous appartiennent entièrement. Vous êtes libre de les utiliser, modifier et publier sur vos boutiques en ligne sans restriction.</p>
              <p>La plateforme FichePro, son design et ses fonctionnalités restent la propriété exclusive de FichePro.</p>
            </section>

            <section className={styles.section}>
              <h2>6. Abonnements et paiements</h2>
              <p>Les abonnements sont souscrits pour une durée mensuelle, renouvelables tacitement. Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel, avec prise d'effet à la fin de la période en cours.</p>
              <p>Conformément à la législation européenne, vous disposez d'un droit de rétractation de 14 jours à compter de la souscription.</p>
            </section>

            <section className={styles.section}>
              <h2>7. Limitation de responsabilité</h2>
              <p>FichePro met tout en œuvre pour fournir un service de qualité, mais ne peut garantir l'exactitude, l'exhaustivité ou la pertinence de chaque fiche générée. Vous êtes responsable de la vérification et de la validation du contenu avant publication.</p>
              <p>FichePro ne peut être tenu responsable des pertes de revenus ou préjudices commerciaux résultant de l'utilisation du service.</p>
            </section>

            <section className={styles.section}>
              <h2>8. Modification des CGU</h2>
              <p>FichePro se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email de tout changement significatif. La poursuite de l'utilisation du service vaut acceptation des nouvelles conditions.</p>
            </section>

            <section className={styles.section}>
              <h2>9. Droit applicable</h2>
              <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris.</p>
            </section>

            <section className={styles.section}>
              <h2>10. Contact</h2>
              <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : <a href="mailto:contact@fichepro.fr">contact@fichepro.fr</a></p>
            </section>

          </div>

          <div className={styles.footer}>
            <Link href="/">← Retour à l'accueil</Link>
            <Link href="/confidentialite">Politique de confidentialité →</Link>
          </div>
        </div>
      </div>
    </>
  )
}
