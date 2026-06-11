/**
 * Cosmetic rules — curated, conservative selectors.
 *
 * Safety rules applied here:
 *  - Only target well-known ad/consent/popup vendor markers, never generic
 *    layout classes (no ".sidebar", ".banner" alone, etc.).
 *  - HIDE_SELECTORS are hidden via injected CSS (cheap, reversible).
 *  - REMOVE_SELECTORS are physically removed by the sweeper (iframes/scripts
 *    whose mere presence costs CPU).
 *  - The overlay heuristic only fires on fixed full-viewport layers whose text
 *    matches consent/newsletter wording, and never on PROTECTED_SELECTORS.
 */

/** Elements hidden on every site in Clean mode. */
export const HIDE_SELECTORS: string[] = [
  // Generic ad containers & vendor markers
  "ins.adsbygoogle",
  ".adsbygoogle",
  "[id^='google_ads_iframe']",
  "[id^='div-gpt-ad']",
  "[data-google-query-id]",
  "[id^='taboola-']",
  ".trc_related_container",
  ".OUTBRAIN",
  "[data-widget-id^='outbrain']",
  ".ob-widget",
  "[class*='sponsored-content']",
  "[data-testid='ad-banner']",
  "[aria-label='advertisement' i]",
  "[id^='ad-slot']",
  "[id^='adunit']",
  ".ad-slot--rendered",
  "iframe[src*='doubleclick.net']",
  "iframe[src*='googlesyndication']",
  "iframe[src*='amazon-adsystem']",
  "amp-ad",
  "amp-embed",
  // Cookie banners / CMPs
  "#onetrust-consent-sdk",
  "#onetrust-banner-sdk",
  "#CybotCookiebotDialog",
  "#CybotCookiebotDialogBodyUnderlay",
  ".qc-cmp2-container",
  "#qc-cmp2-container",
  "#didomi-host",
  ".didomi-popup-backdrop",
  ".fc-consent-root",
  "#sp_message_container_1",
  "[id^='sp_message_container']",
  ".cc-window.cc-banner",
  "#cookie-law-info-bar",
  "#cookiebanner",
  "#cookie-banner",
  ".cookie-consent-banner",
  "#usercentrics-root",
  ".osano-cm-window",
  "#axeptio_overlay",
  ".truste_box_overlay",
  ".truste_overlay",
  // Newsletter / subscription popups (vendor-scoped)
  ".needsclick.kl-private-reset-css-Xuajs1[role='dialog']",
  "[id^='om-'][class*='Campaign']",
  ".sumome-popup-overlay",
  "#PopupSignupForm_0",
  ".mailmunch-forms-modal",
  ".privy-popup-container",
  // Push-notification prompts (vendor-scoped)
  "#onesignal-slidedown-container",
  "#onesignal-popover-container",
  ".pushengage-popup",
  ".izooto-optin",
  // Sticky / anchored ads
  ".adhesion-unit",
  "[class*='sticky-ad']",
  "[id*='sticky-ad']",
  ".ad-sticky",
  "#fixedban",
];

/** Elements physically removed (cost CPU/network even when hidden). */
export const REMOVE_SELECTORS: string[] = [
  "iframe[src*='doubleclick.net']",
  "iframe[src*='googlesyndication']",
  "iframe[id^='google_ads_iframe']",
  "iframe[src*='adnxs.com']",
  "iframe[src*='criteo.com']",
];

/** Focus mode: common distraction surfaces (feeds, shorts shelves, prompts). */
export const FOCUS_SELECTORS: string[] = [
  // Social feeds
  "[data-testid='primaryColumn'] [aria-label*='Timeline' i]",
  "div[role='feed']",
  "[data-pagelet='FeedUnit']",
  ".scaffold-finite-scroll__content > div > .feed-shared-update-v2",
  "shreddit-feed",
  // Short-video shelves on compatible sites
  "ytd-rich-shelf-renderer[is-shorts]",
  "ytd-reel-shelf-renderer",
  "[data-e2e='recommend-list-item-container']",
  // Engagement bait
  "[aria-label*='notification' i][role='dialog']",
  ".artdeco-toasts_toasts",
];

/** Video Clean mode: ad surfaces of compatible video players. */
export const VIDEO_SELECTORS: string[] = [
  ".video-ads",
  ".ytp-ad-module",
  ".ytp-ad-overlay-container",
  ".ytp-ad-player-overlay",
  "[class*='videoAdUi']",
  "[class*='preroll-overlay']",
  ".ima-ad-container",
  "[id^='google_ima']",
  ".jw-ad",
  ".vjs-ad-overlay",
  ".fp-ad",
];

/** Never hide/remove anything matching these (page-critical surfaces). */
export const PROTECTED_SELECTORS: string[] = [
  "header",
  "nav",
  "main",
  "form",
  "[role='main']",
  "[role='navigation']",
  "[type='password']",
  "[class*='cart' i]",
  "[id*='cart' i]",
  "[class*='checkout' i]",
  "[id*='checkout' i]",
  "[class*='login' i]",
  "[id*='login' i]",
  "[class*='search' i]",
];

/** Overlay heuristic keywords (consent / newsletter / paywall-nag wording). */
export const OVERLAY_KEYWORDS: RegExp =
  /cookie|consent|rgpd|gdpr|newsletter|subscribe|abonnez|inscrivez|notification|adblock/i;

export function buildHideCss(selectors: string[]): string {
  if (selectors.length === 0) return "";
  // display:none beats most inline styles; !important wins specificity wars.
  return `${selectors.join(",\n")} { display: none !important; visibility: hidden !important; }`;
}
