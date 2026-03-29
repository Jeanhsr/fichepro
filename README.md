# FichePro 🚀

Générateur de fiches produit IA pour e-commerçants français.

## Stack
- **Next.js 14** (frontend + API routes)
- **TypeScript**
- **Anthropic Claude** (IA)
- **Vercel** (déploiement)

## Installation locale

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier d'environnement
cp .env.example .env.local

# 3. Ajouter ta clé API dans .env.local
ANTHROPIC_API_KEY=sk-ant-api03-TA_CLE_ICI

# 4. Lancer en développement
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

## Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter la variable d'environnement sur Vercel
vercel env add ANTHROPIC_API_KEY
```

## Structure du projet

```
fichepro/
├── pages/
│   ├── index.tsx          ← Landing page
│   ├── dashboard.tsx      ← App principale
│   └── api/
│       └── generate.ts    ← Backend (clé API cachée ici)
├── components/
│   └── Navbar.tsx
└── styles/
    ├── globals.css
    ├── Home.module.css
    └── Dashboard.module.css
```

## Comment ça marche

1. Le client remplit le formulaire sur `/dashboard`
2. Le frontend envoie les données à `/api/generate` (ton backend)
3. Le backend utilise la clé API (invisible pour le client) pour appeler Claude
4. Claude génère la fiche → retournée au client

**La clé API n'est JAMAIS exposée au client.** ✅
