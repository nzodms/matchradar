# 📡 MatchRadar

**104 matchs. On te dit lesquels regarder.**
_Le radar des événements sportifs à ne pas rater._

MatchRadar est une web app **mobile-first, dark, premium** qui aide à savoir quels
matchs/événements sportifs regarder aujourd'hui, demain et cette semaine — via un
**score de hype**, des **recommandations personnalisées**, un **brief quotidien
partageable** et l'**export calendrier**.

> ⚠️ Ce n'est **pas** une app de paris. Aucune cote, aucune mise, aucun bonus.
> On s'inspire de l'énergie sportive (cartes, badges, live, densité) pour un outil
> 100 % légal et grand public.

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

| Route          | Rôle                                                                 |
| -------------- | ------------------------------------------------------------------- |
| `/`            | **Radar du jour** — hero, match du jour, programme, tabs            |
| `/match/[id]`  | **Détail match** — hype, enjeux, scénario, joueurs, brief, calendrier|
| `/brief`       | **Brief du jour** — carte partageable + message WhatsApp prêt        |
| `/calendar`    | **Calendrier perso** — formulaire → recommandations → export        |
| `/favorites`   | **Équipes favorites** — recherche, favoris, matchs des équipes       |
| `/events`      | **Prochainement** — roadmap des futurs radars                        |
| `/landing`     | **Landing marketing** — page de pub immersive                        |

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

## 🏗️ Architecture & branchement API

Tout est **mocké proprement** dans `data/` et structuré pour brancher une API plus tard
sans toucher l'UI :

```
data/        events.ts · matches.ts · teams.ts        ← données mockées (à remplacer par l'API)
lib/         hype · badges · datetime · whatsapp · calendar · selectors
components/   ~25 composants réutilisables (MatchCard, HypeScore, DailyBriefCard…)
types/       contrat de données unique (Match, Team, SportEvent, DailyBrief…)
app/         pages (App Router)
```

Points d'extension prévus :

- **Calendrier sportif** → remplacer `data/matches.ts` (les `selectors` restent identiques)
- **Scores live** → champs `status`, `liveMinute`, `homeScore/awayScore` déjà là
- **Diffuseurs TV** → champ `broadcasters`
- **Fuseaux horaires** → `lib/datetime.ts` (offsets simplifiés → à passer sur une lib tz/IANA)
- **Notifications / Auth / Paiement** → CTAs déjà présents (front-only), à câbler

## 🎨 Design system

- Dark profond (noir bleuté / vert terrain), accents néon (vert, rouge, jaune, bleu).
- Glassmorphism, bordures lumineuses, glows par palier de score.
- Fond **radar animé** (sweep + blips + grille), 100 % CSS (GPU-friendly).
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
