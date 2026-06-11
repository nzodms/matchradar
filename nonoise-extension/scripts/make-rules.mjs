/**
 * Generates rules/*.json (declarativeNetRequest static rulesets) from curated
 * domain lists. Run `node scripts/make-rules.mjs` after editing a list — the
 * generated JSON is committed so the extension builds without this step.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "rules");
mkdirSync(out, { recursive: true });

/** Sub-resource types blocked for ad/tracker domains (never main_frame). */
const SUB = ["script", "image", "xmlhttprequest", "sub_frame", "ping", "media", "websocket", "other"];

// ───────────────────────── Ad networks & exchanges ─────────────────────────
const ADS = [
  "doubleclick.net", "googlesyndication.com", "googleadservices.com", "adservice.google.com",
  "adnxs.com", "adsrvr.org", "criteo.com", "criteo.net", "taboola.com", "outbrain.com",
  "pubmatic.com", "rubiconproject.com", "magnite.com", "openx.net", "casalemedia.com",
  "smartadserver.com", "adform.net", "yieldmo.com", "sharethrough.com", "amazon-adsystem.com",
  "media.net", "adsafeprotected.com", "moatads.com", "teads.tv", "33across.com",
  "lijit.com", "sovrn.com", "gumgum.com", "triplelift.com", "bidswitch.net",
  "mgid.com", "revcontent.com", "zemanta.com", "undertone.com", "adroll.com",
  "perfectaudience.com", "quantcast.com", "spotxchange.com", "yieldlab.net",
  "improvedigital.com", "smaato.net", "inmobi.com", "applovin.com", "unityads.unity3d.com",
  "popads.net", "propellerads.com", "exoclick.com", "juicyads.com", "adcash.com",
  // exchanges, SSPs & networks
  "contextweb.com", "districtm.io", "indexww.com", "advertising.com", "adtechus.com",
  "rfihub.com", "simpli.fi", "stackadapt.com", "nativo.com", "powerlinks.com",
  "adingo.jp", "adhigh.net", "adkernel.com", "admixer.net", "adtelligent.com",
  "loopme.com", "pubnative.net", "smartyads.com", "vidoomy.com", "richaudience.com",
  "onetag.com", "rtbhouse.com", "yieldmo.com", "districtm.net", "media6degrees.com",
  "servedbyadbutler.com", "adzerk.net", "kevel.co", "adblade.com", "adsterra.com",
  "hilltopads.net", "clickadu.com", "trafficstars.com", "mediavine.com", "adthrive.com",
  "ezoic.net", "ezoic.com", "playwire.com", "freestar.com", "monetag.com",
];

// ───────────────────────── Trackers & analytics ─────────────────────────
const TRACKERS = [
  "google-analytics.com", "googletagmanager.com", "scorecardresearch.com", "quantserve.com",
  "chartbeat.com", "hotjar.com", "fullstory.com", "mouseflow.com", "clarity.ms",
  "mixpanel.com", "segment.io", "segment.com", "amplitude.com", "branch.io",
  "appsflyer.com", "adjust.com", "kochava.com", "bluekai.com", "krxd.net",
  "demdex.net", "everesttech.net", "agkn.com", "rlcdn.com", "tapad.com",
  "mathtag.com", "bidr.io", "crwdcntrl.net", "exelator.com", "narrative.io",
  "permutive.com", "parsely.com", "newrelic.com", "bat.bing.com", "mc.yandex.ru",
  "matomo.cloud", "plausible.io", "luckyorange.com", "crazyegg.com", "inspectlet.com",
  // product / marketing analytics & data brokers
  "heap.io", "heapanalytics.com", "pendo.io", "logrocket.com", "logrocket.io",
  "statcounter.com", "woopra.com", "kissmetrics.io", "customer.io", "june.so",
  "posthog.com", "i.posthog.com", "rudderstack.com", "rudderlabs.com", "snowplowanalytics.com",
  "tealiumiq.com", "ensighten.com", "signal.co", "marketo.com", "marketo.net",
  "pardot.com", "omtrdc.net", "2o7.net", "adobedtm.com", "optimizely.com",
  "visualwebsiteoptimizer.com", "dynamicyield.com", "monetate.net", "cdn.heapanalytics.com",
  "track.hubspot.com", "forms.hubspot.com", "cdn.mxpnl.com", "api.mixpanel.com",
  "cdn.segment.com", "api.segment.io", "sb.scorecardresearch.com", "smetrics.com",
  "yieldify.com", "cxense.com", "lytics.io", "sailthru.com", "bronto.com",
];

// Path-based tracker scripts (urlFilter on path, any domain).
const TRACKER_PATHS = [
  "/fbevents.js", "/gtag/js?", "/analytics.js^", "/piwik.js^", "/matomo.js^",
];

// ───────────────────────── Annoyances (push, popup vendors) ─────────────────────────
const ANNOYANCES = [
  "onesignal.com", "pushengage.com", "izooto.com", "subscribers.com", "pushcrew.com",
  "webpushr.com", "pushwoosh.com", "privy.com", "justuno.com", "optinmonster.com",
  "sumo.com", "mailmunch.co", "sleeknote.com", "getsitecontrol.com", "wisepops.com",
  "poptin.com", "hellobar.com", "intercomcdn.com",
  // more push/popup/chat-nag vendors
  "vwo.com", "sleeknotecustomerscripts.com", "getbeamer.com", "beamer.io",
  "useinsider.com", "insitez.com", "cdn.optinmonster.com", "app.getsitecontrol.com",
  "cdn.privy.com", "widget.privy.com", "popupsmart.com", "convertflow.com",
  "smartsupp.com", "tawk.to", "tidio.co",
  "livechatinc.com", "purechat.com", "crisp.chat", "drift.com", "driftt.com",
  "wisepops.net", "klaviyo.com", "static.klaviyo.com", "cdn.tinypass.com", "tinypass.com",
];

// ───────────────────────── Scams (demo + known malvertising) ─────────────────────────
// Demo domains are intentionally fake (.invalid TLD) so the blocking behaviour
// can be tested non-destructively; the rest are known malvertising redirectors.
const SCAM_MAIN = [
  "scam-demo.nonoise.invalid", "phishing-demo.nonoise.invalid",
];
const SCAM_SUB = [
  "ad-maven.com", "adskeeper.com", "mobtrks.com", "trafficjunky.net",
  "pushame.com", "pushnest.com", "loadercdn.com", "deloplen.com",
];

// ───────────────────────── Video ad serving (Video Clean mode only) ─────────────────────────
const VIDEO = [
  "imasdk.googleapis.com", "innovid.com", "springserve.com", "stickyadstv.com",
  "fwmrm.net", "tremorhub.com", "spotx.tv", "eyeota.net", "videohub.tv",
  "adsparc.net", "aniview.com", "connatix.com", "ex.co", "primis.tech",
];

let nextId;
const domainBlock = (domain, resourceTypes = SUB) => ({
  id: nextId++,
  priority: 1,
  action: { type: "block" },
  condition: { urlFilter: `||${domain}^`, resourceTypes },
});
const pathBlock = (path) => ({
  id: nextId++,
  priority: 1,
  action: { type: "block" },
  condition: { urlFilter: path, resourceTypes: ["script", "xmlhttprequest", "ping"] },
});

function write(name, rules) {
  writeFileSync(resolve(out, `${name}.json`), JSON.stringify(rules, null, 2) + "\n");
  console.log(`rules/${name}.json — ${rules.length} rules`);
}

nextId = 1;
write("ads", ADS.map((d) => domainBlock(d)));

nextId = 1;
write("trackers", [...TRACKERS.map((d) => domainBlock(d)), ...TRACKER_PATHS.map(pathBlock)]);

nextId = 1;
write("annoyances", ANNOYANCES.map((d) => domainBlock(d)));

nextId = 1;
write("scams", [
  ...SCAM_MAIN.map((d) => domainBlock(d, ["main_frame", ...SUB])),
  ...SCAM_SUB.map((d) => domainBlock(d)),
]);

nextId = 1;
write("video", VIDEO.map((d) => domainBlock(d)));
