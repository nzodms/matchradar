import type { Category } from "@/shared/stats";

/**
 * Cosmetic rules — curated, conservative, grouped by stat category.
 *
 * Safety model:
 *  - Only well-known ad/consent/popup vendor markers — never generic layout
 *    classes used by real content.
 *  - The sweeper never touches anything matching PROTECTED_SELECTORS
 *    (header/nav/main/form/cart/checkout/login/search).
 *  - The overlay heuristic only fires on fixed, near-full-viewport, very
 *    high z-index layers whose text matches consent/newsletter wording.
 */

export interface CosmeticGroup {
  category: Category;
  selectors: string[];
}

/* ───────────────── Ads (containers, slots, sticky/anchored) ───────────────── */
const ADS: string[] = [
  "ins.adsbygoogle",
  ".adsbygoogle",
  "[id^='google_ads_iframe']",
  "[id^='div-gpt-ad']",
  "[id^='gpt-']",
  "[data-google-query-id]",
  "[data-ad-client]",
  "[data-ad-slot]",
  "[id^='taboola-']",
  ".trc_related_container",
  ".OUTBRAIN",
  "[data-widget-id^='outbrain']",
  ".ob-widget",
  "[class*='sponsored-content']",
  "[class*='SponsoredContent']",
  "[data-testid='ad-banner']",
  "[data-testid*='AdSlot']",
  "[aria-label='advertisement' i]",
  "[aria-label='publicité' i]",
  "[id^='ad-slot']",
  "[id^='adunit']",
  "[id^='ad_'][id$='_container']",
  "[class^='ad-'][class$='-container']",
  ".ad-slot--rendered",
  ".advert",
  ".advertisement",
  ".ad-wrapper",
  ".ad-container",
  ".dfp-ad",
  ".gpt-ad",
  ".banner-ad",
  ".display-ad",
  "iframe[src*='doubleclick.net']",
  "iframe[src*='googlesyndication']",
  "iframe[src*='amazon-adsystem']",
  "iframe[src*='adnxs.com']",
  "iframe[src*='criteo']",
  "amp-ad",
  "amp-embed",
  // sticky / anchored
  ".adhesion-unit",
  "[class*='sticky-ad']",
  "[id*='sticky-ad']",
  ".ad-sticky",
  "#fixedban",
  ".anchor-ad",
  "[class*='AnchorAd']",
  "[id*='anchorAd']",
  "[class*='floating-ad']",
];

/* ───────────────── Cookie banners / CMPs ───────────────── */
const COOKIES: string[] = [
  "#onetrust-consent-sdk",
  "#onetrust-banner-sdk",
  ".onetrust-pc-dark-filter",
  "#CybotCookiebotDialog",
  "#CybotCookiebotDialogBodyUnderlay",
  ".qc-cmp2-container",
  "#qc-cmp2-container",
  ".qc-cmp-cleanslate",
  "#didomi-host",
  ".didomi-popup-backdrop",
  ".didomi-consent-popup",
  ".fc-consent-root",
  ".fc-dialog-overlay",
  "#sp_message_container_1",
  "[id^='sp_message_container']",
  ".message-container.sp_choice_type_11",
  ".cc-window.cc-banner",
  "#cookie-law-info-bar",
  "#cookiebanner",
  "#cookie-banner",
  ".cookie-consent-banner",
  ".cookie-notice",
  "#cookieConsent",
  "#cookie-notice",
  "#usercentrics-root",
  "#uc-banner",
  ".osano-cm-window",
  "#axeptio_overlay",
  "#axeptio_main_button",
  ".truste_box_overlay",
  ".truste_overlay",
  ".cmplz-cookiebanner",
  "#tarteaucitronRoot",
  "#tarteaucitronAlertBig",
  ".cookiebar",
  "[class*='cookie-consent']",
  "[id*='gdpr-banner']",
  "[aria-label*='cookie' i][role='dialog']",
];

/* ───────────────── Newsletter / subscription popups ───────────────── */
const POPUPS: string[] = [
  ".needsclick.kl-private-reset-css-Xuajs1[role='dialog']",
  "[id^='om-'][class*='Campaign']",
  ".om-holder",
  ".sumome-popup-overlay",
  ".sumo-popup-overlay",
  "#PopupSignupForm_0",
  ".mailmunch-forms-modal",
  ".mc-modal",
  "#mc_embed_signup_modal",
  ".privy-popup-container",
  ".privy-modal",
  ".poptin-popup",
  ".sleeknote-overlay",
  ".sgpb-popup-overlay",
  ".popmake-overlay",
  ".pum-overlay",
  ".wisepops-popup",
  ".getsitecontrol-widget",
  "[class*='newsletter-modal']",
  "[class*='NewsletterModal']",
  "[class*='subscribe-modal']",
  "[id*='newsletter-popup']",
  "[class*='signup-overlay']",
  "[class*='email-capture']",
  ".modal-newsletter",
];

/* ───────────────── Annoyances (push prompts, app banners, paywall nags) ───────────────── */
const ANNOYANCES: string[] = [
  "#onesignal-slidedown-container",
  "#onesignal-popover-container",
  ".onesignal-bell-container",
  ".pushengage-popup",
  ".izooto-optin",
  ".webpushr-pc",
  "[class*='push-notification-prompt']",
  "[class*='notification-prompt']",
  ".smartbanner",
  ".smartbanner-show",
  "[class*='app-install-banner']",
  "[class*='AppBanner']",
  "[class*='back-to-top-ad']",
  ".interstitial-ad",
  "[class*='paywall-nag']",
  "[class*='adblock-detect']",
  "[id*='adblock-detect']",
  "[class*='cmp-paywall']",
];

/* ───────────────── Focus mode: feeds, shorts shelves, engagement bait ───────────────── */
const FOCUS: string[] = [
  "[data-testid='primaryColumn'] [aria-label*='Timeline' i]",
  "div[role='feed']",
  "[data-pagelet='FeedUnit']",
  ".scaffold-finite-scroll__content > div > .feed-shared-update-v2",
  "shreddit-feed",
  "ytd-rich-shelf-renderer[is-shorts]",
  "ytd-reel-shelf-renderer",
  "ytd-rich-section-renderer",
  "[data-e2e='recommend-list-item-container']",
  "[aria-label*='notification' i][role='dialog']",
  ".artdeco-toasts_toasts",
  "[class*='suggested-for-you']",
  "[class*='trending-sidebar']",
  "[class*='related-articles']",
  "[class*='recommended-feed']",
];

/* ───────────────── Video Clean: ad surfaces of compatible players ───────────────── */
const VIDEO: string[] = [
  ".video-ads",
  ".ytp-ad-module",
  ".ytp-ad-overlay-container",
  ".ytp-ad-overlay-slot",
  ".ytp-ad-player-overlay",
  ".ytp-ad-player-overlay-layout",
  ".ytp-ad-image-overlay",
  "[class*='videoAdUi']",
  "[class*='preroll-overlay']",
  ".ima-ad-container",
  "[id^='google_ima']",
  ".jw-ad",
  ".jwplayer .jw-flag-ads",
  ".vjs-ad-overlay",
  ".vjs-ad-playing .vjs-control-bar",
  ".fp-ad",
  ".plyr__ads",
];

/** Base groups applied in every mode (Clean). */
export const BASE_GROUPS: CosmeticGroup[] = [
  { category: "ads", selectors: ADS },
  { category: "cookies", selectors: COOKIES },
  { category: "popups", selectors: POPUPS },
  { category: "annoyances", selectors: ANNOYANCES },
];

export const FOCUS_GROUP: CosmeticGroup = { category: "focus", selectors: FOCUS };
export const VIDEO_GROUP: CosmeticGroup = { category: "video", selectors: VIDEO };

/** Ad iframes/scripts physically removed (cost CPU/network even when hidden). */
export const REMOVE_SELECTORS: string[] = [
  "iframe[src*='doubleclick.net']",
  "iframe[src*='googlesyndication']",
  "iframe[id^='google_ads_iframe']",
  "iframe[src*='adnxs.com']",
  "iframe[src*='criteo.com']",
  "iframe[src*='amazon-adsystem']",
  "iframe[src*='adsafeprotected']",
];

/** Never hide/remove anything matching these (page-critical surfaces). */
export const PROTECTED_SELECTORS: string[] = [
  "header",
  "nav",
  "main",
  "form",
  "[role='main']",
  "[role='navigation']",
  "[role='search']",
  "[type='password']",
  "[class*='cart' i]",
  "[id*='cart' i]",
  "[class*='basket' i]",
  "[class*='checkout' i]",
  "[id*='checkout' i]",
  "[class*='login' i]",
  "[id*='login' i]",
  "[class*='signin' i]",
  "[class*='search' i]",
  "[id*='search' i]",
  "[class*='player' i]:not([class*='ad'])",
];

/** Overlay heuristic keywords (consent / newsletter / paywall-nag wording). */
export const OVERLAY_KEYWORDS: RegExp =
  /cookie|consent|rgpd|gdpr|newsletter|subscribe|abonnez|inscrivez|s'inscrire|notification|adblock|bloqueur|sign up|get \d+% off|promo/i;

export function buildHideCss(selectors: string[]): string {
  if (selectors.length === 0) return "";
  return `${selectors.join(",\n")} { display: none !important; visibility: hidden !important; }`;
}
