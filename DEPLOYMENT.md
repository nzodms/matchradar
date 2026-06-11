# Déploiement — structure du repo

Ce repo contient **deux projets indépendants** :

| Dossier              | Quoi                                  | Déploiement                          |
| -------------------- | ------------------------------------- | ------------------------------------ |
| racine (`app/`, …)   | MatchRadar — app Next.js              | **Vercel** (auto-détecté)            |
| `nonoise-extension/` | NoNoise — extension navigateur MV3    | **Local** (Load unpacked) / stores   |

## Pourquoi l'extension ne se déploie PAS sur Vercel

Une extension de navigateur n'est pas un site web. Son livrable (`dist/`,
`manifest.json`, service worker, content scripts) se charge **localement** dans
le navigateur via `chrome://extensions → Load unpacked`, ou se publie sur le
**Chrome Web Store / Edge Add-ons**. Vercel sert des sites et des fonctions
serverless : il n'y a rien à « servir » pour une extension. Pointer un projet
Vercel sur `nonoise-extension/` échoue (pas de framework web, sortie non
servable).

## La cause de l'échec Vercel (corrigée)

Vercel construit la **racine** (Next.js) avec `next build`. Or le type-check de
Next scanne **tout le repo**, donc il compilait aussi `nonoise-extension/src/**`
— qui dépend de `@types/chrome` et d'alias propres à l'extension, absents du
tsconfig racine. Résultat : `next build` échouait à chaque push.

Correctif (sans workaround sale) :

1. `tsconfig.json` racine → `"exclude": ["node_modules", "nonoise-extension"]`
   (Next ne type-check plus l'extension).
2. `.vercelignore` → `nonoise-extension/` est exclu du contexte de build Vercel.

L'extension garde son propre `tsconfig.json` et son propre build, totalement
isolés.

## Réglages Vercel recommandés (dashboard)

- **Root Directory** : `.` (racine du repo) — surtout **pas** `nonoise-extension`.
- **Framework Preset** : Next.js (auto).
- **Build Command** / **Output** : valeurs Next par défaut (ne rien forcer).

## Vérifier en local ce que Vercel fait

```bash
# Ce que Vercel construit (doit être vert) :
npm install
npm run build

# L'extension (indépendante) :
cd nonoise-extension && npm install && npm run build
```
