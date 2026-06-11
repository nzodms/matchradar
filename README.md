# 📡 MatchRadar

**Tu ouvres MatchRadar, tu sais quoi regarder ce soir.**
_Tous les jours : les matchs à ne pas rater, horaires, chaînes, enjeux, hype et brief WhatsApp._

MatchRadar est une web app **mobile-first, dark, premium** qui aide à savoir quels
matchs/événements sportifs regarder aujourd'hui, demain et cette semaine — via un
**score de hype**, une couche **Market Pulse** (cotes indicatives), des
**recommandations personnalisées**, un **brief quotidien partageable** et l'**export
calendrier**.

> ⚠️ Ce n'est **pas** une app de paris. Les cotes affichées sont un **signal sportif
> informatif** ("le marché voit quoi ?"), jamais une incitation. Pas de bouton
> « parier », pas de mise, pas de bonus, pas de lien bookmaker. Outil 100 % légal,
> grand public, qui dit juste **quels matchs regarder**.
>
> _Cotes indicatives, susceptibles d'évoluer. Jeu d'argent réservé aux 18+. Jouer
> comporte des risques. MatchRadar ne fournit pas de conseil de pari._

Le lancement se fait sur la **Coupe du Monde**, avec une roadmap déjà prête :
Wimbledon, Tour de France, F1, UFC, NBA, Ligue des Champions, Roland-Garros, CAN,
Euro, Super Bowl, JO.

---

## 🧱 Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design system custom, tokens en CSS variables)
- **Framer Motion** (animations, micro-interactions, count-up)
- **lucide-react** (icônes)

Zéro asset binaire : les drapeaux sont des emojis (nets sur mobile, bundle léger).

## 🚀 Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run start    # serveur de prod
npm run lint     # eslint
npm run typecheck
```

## 🗺️ Pages

| Route          | Rôle                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| `/`            | **Radar du jour** — hero "Ce soir tu regardes quoi ?", ticker live, affiche chaude, Hot Board, Market Pulse, filtres |
| `/match/[id]`  | **Détail match** — hype, heat meter, Market Pulse complet, scénario, storylines, joueurs, brief |
| `/brief`       | **Brief du jour** — carte partageable + versions courte / complète / drôle    |
| `/calendar`    | **Construis ton radar** — formulaire + inclusions → recommandations → export   |
| `/favorites`   | **Équipes favorites** — niveau d'alerte par équipe, prochain match, Market Pulse |
| `/events`      | **Prochainement** — roadmap, Wimbledon en avant, vote du prochain radar        |
| `/landing`     | **Landing marketing** — page de pub immersive                                  |

Navigation : **bottom nav** fixe mobile (blur) — Radar · Brief · Calendrier ·
Favoris · Prochainement.

## 🧠 Le moteur de hype

Le score de hype (0–100) est calculé dans [`lib/hype.ts`] à partir de 6 facteurs :

```
hype = teamPopularity + stakes + rivalry + starPower + accessibility + storyFactor
```

(blend pondéré, chaque facteur sur 100). Les paliers :

| Score   | Verdict               |
| ------- | --------------------- |
| 90–100  | Immanquable           |
| 80–89   | Gros match            |
| 60–79   | Bon match à suivre    |
| 40–59   | Sympa si tu es dispo  |
| 0–39    | Pour les vrais fans   |

Le détail des facteurs est affiché en barres animées sur la page match.

## 📊 Market Pulse (cotes indicatives) — V2

Couche de lecture du marché, présentée comme un **signal sportif**, jamais comme une
incitation. Logique dans [`lib/market.ts`].

- **Cotes 1-N-2** dé-viggées → favori + probabilités (`marketFavorite`, `impliedProbabilities`)
- **Équilibre** du match 0–100 (`marketBalance`) → bloc « match serré »
- **Signal** par match : `affiche-brulante`, `favori-clair`, `match-serre`,
  `outsider-dangereux`, `piege-possible`, `ouverture-chaude`
- **Heat level** (`chill` → `insane`) + jauge 5 segments (`MatchHeatMeter`)
- **Verdicts d'audience** : casual / hardcore / groupe WhatsApp
- **Hot Board** arcade (`getTodayHotBoard`) : le plus chaud, le plus serré, le favori
  en danger, le match du groupe…
- **Filtres** home : Immanquables · Live · Market Pulse · Serrés · Outsiders ·
  Favori en danger · Pour WhatsApp (`applyHomeFilter`)

Le **`ResponsibleGamingNote`** est affiché partout où des cotes apparaissent (page
match, blocs Market Pulse) et **aucun lien bookmaker** n'est présent en V1/V2.

### Brancher une vraie API de cotes plus tard

`data/matches.ts` exporte `ODDS_META` (`sourceType`, `oddsProvider`, `providerCountry`,
`isLegalProvider`, `affiliateUrl`). En V1/V2 : `sourceType: "mock"`, `affiliateUrl: null`
(jamais affiché). Remplacer les `odds` mockées par l'API suffit — l'UI ne change pas.

## ✏️ Modifier les matchs / les cotes

Tout est dans **`data/matches.ts`** (un objet `Match` par affiche). Pour changer un
match : éditer `hypeScore`, `odds`, `marketSignal`, `marketCopy`, `heatLevel`,
`storylines`, `watchVerdictShort/Long`, etc. `dayOffset` (0 = aujourd'hui) garde la
démo « evergreen ». Les équipes sont dans `data/teams.ts`, les événements à venir dans
`data/events.ts`.

## 🔌 Fondation données réelles (`lib/data-sources/`)

L'app tourne en **mock** par défaut et bascule provider par provider dès qu'une
clé est présente — sans toucher à l'UI :

| Variable d'env          | Provider                          | Sans clé |
| ----------------------- | --------------------------------- | -------- |
| `SPORTS_API_KEY`        | calendrier + scores live          | mock     |
| `BROADCASTERS_API_KEY`  | droits TV/streaming (optionnel)   | mock     |
| `ODDS_API_KEY`          | cotes indicatives (optionnel)     | mock     |

```
lib/data-sources/
  config.ts               ← lecture des clés, sourceFor(), isFullMock()
  fixturesProvider.ts     ← calendrier des matchs (getFixtures)
  liveScoreProvider.ts    ← statuts live + applyLiveStatuses()
  broadcastersProvider.ts ← chaînes + broadcasterLabel() (règle "à confirmer")
  oddsProvider.ts         ← cotes 1N2 indicatives
  normalizeMatch.ts       ← normalisation payload API → Match interne
  status.ts               ← getProviderStatus()
```

- **`GET /api/health`** → état de chaque provider (mock/api) + dernier sync.
- Chaque match porte une **provenance** (`source`, `lastUpdatedMinAgo`,
  `confidence`, `verified`) affichée en micro-labels de confiance ("Mis à jour
  il y a 4 min · Données calendrier · Horaire vérifié").
- En dev sans clé, un badge discret "Données de démonstration" s'affiche
  (jamais en production).

### Règle diffuseurs (ne jamais inventer une chaîne)

`Broadcaster.verified === false` ⇒ l'UI affiche **"à confirmer"**, partout
(cartes, détail, brief WhatsApp, export calendrier). Seules les entrées
vérifiées (curation manuelle ou API validée) s'affichent comme certaines.
`broadcasterLabel()` est le seul chemin autorisé pour afficher une chaîne.

## 🏗️ Architecture & branchement API

Tout est **mocké proprement** dans `data/` et structuré pour brancher une API plus tard
sans toucher l'UI :

```
data/        events.ts · matches.ts (+ ODDS_META) · teams.ts   ← données mockées (→ API)
lib/         hype · market · badges · datetime · whatsapp · calendar · selectors
components/   ~35 composants réutilisables
types/       contrat de données unique (Match, Odds, MarketSignal, HotBoardEntry…)
app/         pages (App Router)
```

Composants V2 ajoutés : `MarketPulseCard`, `OddsPill`, `OddsStrip`, `MarketSignalBadge`,
`MatchHeatMeter`, `HotMatchHero`, `DailyHotBoard`, `HotMarketSection`, `SportTicker`,
`ResponsibleGamingNote`, et les variantes de carte (`HotMatchCard`, `LiveMatchCard`,
`ChillMatchCard`, `MarketMatchCard`, `BriefMatchCard`).

Points d'extension prévus :

- **Calendrier sportif** → remplacer `data/matches.ts` (les `selectors` restent identiques)
- **Scores live** → champs `status`, `liveMinute`, `homeScore/awayScore` déjà là
- **Diffuseurs TV** → champ `broadcasters`
- **Fuseaux horaires** → `lib/datetime.ts` (offsets simplifiés → à passer sur une lib tz/IANA)
- **Notifications / Auth / Paiement** → CTAs déjà présents (front-only), à câbler

## 🎨 Design system

- Dark profond (noir bleuté / vert terrain), accents néon (vert, rouge, jaune, bleu, violet).
- Glassmorphism + **cartes arcade** (bordures épaisses, sheen, ombres fortes), glows par chaleur.
- Fond **stade vivant** : spotlights colorés animés + grain + grille + radar animé (100 % CSS).
- Énergie « sport TV / Winamax‑like » : badges puissants, ticker live, cotes en gros blocs.
- Tokens dans `app/globals.css` (`:root`) → themables par événement (`themeColor`).

## 🔥 Fonctionnalités virales

- **Copier le brief WhatsApp** (match + brief du jour) avec toast de confirmation.
- **Carte brief partageable** façon story Instagram.
- **Export calendrier** Google / Apple (`.ics` avec rappel 30 min).
- **Favoris** persistés (localStorage), reminder, partage natif.

## 🛣️ Roadmap produit

Gratuit (base) → Premium (alertes avancées, multi-sports, sans pub, export PDF/ICS).
Sponsoring newsletter, affiliation (maillots, TV…). Pas de B2B en V1.

---

_Coupe du Monde maintenant. Wimbledon ensuite. Puis tous les gros événements._
