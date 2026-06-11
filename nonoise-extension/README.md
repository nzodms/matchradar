# NoNoise

**NoNoise nettoie le web : pubs, trackers, popups, cookie banners, overlays, sticky ads et distractions.**
Extension navigateur Manifest V3, **local-first** : pas de compte, pas de cloud, pas de collecte. V1 fonctionnelle, pas une démo.

Compatible : **Chrome · Brave · Edge · Opera** (tout Chromium ≥ 121).

---

## Installation (build local)

```bash
cd nonoise-extension
npm install
npm run build        # → dist/
```

Puis dans le navigateur :

1. Ouvre `chrome://extensions` (Brave : `brave://extensions`, Edge : `edge://extensions`, Opera : `opera://extensions`).
2. Active **Developer mode** (en haut à droite).
3. Clique **Load unpacked** et sélectionne le dossier **`dist/`**.
4. Épingle NoNoise dans la barre d'outils.

## Comment tester

- **Blocage réseau** : ouvre un site de presse chargé en pubs (20minutes, forbes.com, cnn.com…). Le badge de l'icône affiche le nombre de requêtes bloquées sur l'onglet ; la popup cumule pubs/trackers.
- **Nettoyage visuel** : les cookie banners (OneTrust, Didomi, Cookiebot, Quantcast…), popups newsletter et sticky ads disparaissent. Le compteur « éléments nettoyés » s'incrémente.
- **Pause par site** : popup → « Mettre en pause sur ce domaine » → recharge la page : tout réapparaît (le réseau est exempté via une règle `allowAllRequests`). « Réactiver » pour revenir.
- **Modes** : *Clean* (essentiel) · *Focus* (Clean + feeds/prompts/distractions) · *Video Clean* (Clean + ruleset vidéo + cosmétique des lecteurs compatibles).
- **Règle scam (démo non destructive)** : visite `https://scam-demo.nonoise.invalid` → navigation bloquée par le ruleset `scams` (domaine volontairement factice).
- **Options** : whitelist/blacklist, sélecteurs CSS personnalisés (un par ligne, masqués partout), export/import JSON, reset stats.

## Voir les règles actives / debugger

- Règles : `chrome://extensions` → NoNoise → **Service worker** (console du SW) puis
  `chrome.declarativeNetRequest.getEnabledRulesets(console.log)`.
- Comptage exact des requêtes bloquées : l'événement `onRuleMatchedDebug` **ne fonctionne que pour les extensions unpacked** — c'est le cas ici, donc les stats réseau sont exactes en dev.
- Content script : DevTools de la page → Console → les éléments masqués portent les sélecteurs de `src/content/cosmetic-rules.ts`.
- Stats brutes : console du SW → `chrome.storage.local.get(console.log)`.

## Modifier les rulesets

Les listes vivent dans `scripts/make-rules.mjs` (domaines par catégorie). Après édition :

```bash
node scripts/make-rules.mjs   # régénère rules/*.json (ids uniques garantis)
npm run build
```

Recharger l'extension (`chrome://extensions` → ↻). Les JSON générés sont commités : on peut aussi les éditer à la main en gardant `id` uniques par fichier.

## Architecture

```
manifest.json                 MV3 : 5 rulesets DNR, SW, content script, popup, options
src/background/service-worker.ts  sync rulesets/mode, whitelist (allowAllRequests),
                                  comptage (debug exact + fallback échantillonné), badge
src/content/cleaner.ts        injection CSS à document_start, sweep DOM, overlays, scroll-unlock
src/content/cosmetic-rules.ts sélecteurs prudents (vendors connus + garde-fous PROTECTED)
src/content/observer.ts       MutationObserver débouncé (≥400 ms)
src/shared/                   storage (settings), stats, modes, domains
src/popup, src/options        React + CSS premium clair
rules/*.json                  rulesets DNR statiques générés
```

Build : 3 passes Vite (UI multi-page / SW en IIFE / content en IIFE — un content script ne peut pas être un module ES) + copie des statiques.

## Limites connues (honnêtes)

- **Stats réseau en build packé** : sans `onRuleMatchedDebug` (réservé aux unpacked), le fallback échantillonne `getMatchedRules()` toutes les 5 min (quota Chrome) → sous-comptage des rafales. Les éléments nettoyés restent exacts.
- **DNR statique ≠ EasyList complet** : ~135 règles curées (réseaux majeurs). Pas de listes communautaires auto-mises à jour en V1 (les listes dynamiques MV3 sont la piste V2).
- **Cosmétique conservatrice** : on préfère rater un popup exotique que casser un checkout. Les garde-fous (`PROTECTED_SELECTORS`) bloquent toute suppression près de header/nav/form/panier/login.
- **Video Clean** : bloque les régies vidéo génériques (IMA SDK, FreeWheel, SpotX…) et masque les surfaces pub des lecteurs compatibles. Certains lecteurs attendent la réponse de leur régie : un spinner peut apparaître quelques secondes. Certains flux insèrent la pub côté serveur (SSAI) — indétectable par blocage réseau.
- **Anti-adblock** : aucune contre-mesure en V1 ; certains sites détectent le blocage et l'affichent.
- **Frames imbriquées** : le nettoyage cosmétique tourne dans la frame principale uniquement (`all_frames: false`) ; le blocage réseau couvre, lui, toutes les frames.
- **« Temps gagné »** : estimation assumée (1,2 s/pub, 0,1 s/tracker, 0,4 s/élément), pas une mesure.

## Roadmap V2 (non codée volontairement)

1. **Listes dynamiques** : conversion EasyList/EasyPrivacy → règles DNR dynamiques avec mise à jour périodique et diff (limite 30k règles dynamiques).
2. **Cosmétique par site** : base de sélecteurs spécifiques par domaine + éditeur visuel « cliquer pour masquer ».
3. **Sync optionnelle chiffrée** des réglages (compte facultatif) — le blocage reste 100 % local.
4. **SaaS** : dashboard web (stats agrégées locales exportées volontairement), licences équipe, listes premium maintenues, support Firefox (MV3 WebExtensions).
5. **Anti-adblock countermeasures** ciblées + mode « rapport de casse » en un clic.
6. Publication Chrome Web Store / Edge Add-ons (le fallback de comptage packé existe déjà).
