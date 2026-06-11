import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { domainFromUrl } from "@/shared/domains";
import { MODES, type Mode } from "@/shared/modes";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  estimatedSecondsSaved,
  formatDuration,
  getStats,
  onStatsChanged,
  type Stats,
} from "@/shared/stats";
import {
  getSettings,
  onSettingsChanged,
  pauseOnDomain,
  resumeOnDomain,
  setSettings,
  type Settings,
} from "@/shared/storage";
import "./popup.css";

function Logo() {
  return (
    <span className="mark" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="4.6" width="10" height="1.8" rx="0.9" fill="#8a93a3" />
        <rect x="4.5" y="7.1" width="7" height="1.8" rx="0.9" fill="#8a93a3" />
        <rect x="3.8" y="9.6" width="8.4" height="1.8" rx="0.9" fill="#8a93a3" />
        <path d="M3.5 12.5 L12.5 3.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function buildReport(args: {
  url: string;
  domain: string | null;
  settings: Settings;
  stats: Stats;
}): string {
  const { url, domain, settings, stats } = args;
  const d = domain ? stats.byDomain[domain] : undefined;
  const paused = domain ? settings.whitelist.includes(domain) : false;
  const lines = [
    "NoNoise — rapport de page",
    `URL          : ${url}`,
    `Domaine      : ${domain ?? "—"}`,
    `Mode actif   : ${MODES[settings.mode].label} (${settings.mode})`,
    `Protection   : ${settings.enabled ? "globale ON" : "globale OFF"} · ${paused ? "EN PAUSE sur ce site" : "active sur ce site"}`,
    `Whitelist    : ${paused ? "oui" : "non"}`,
    `Stats site   : ${d ? `${d.ads} pubs · ${d.trackers} trackers · ${d.cleaned} nettoyés` : "aucune activité"}`,
    `Stats totales: ${stats.adsBlocked} pubs · ${stats.trackersBlocked} trackers · ${stats.elementsCleaned} nettoyés`,
    `Catégories   : ${CATEGORIES.map((c) => `${CATEGORY_LABELS[c]} ${stats.categories[c]}`).join(" · ")}`,
    `Version      : NoNoise v${chrome.runtime.getManifest().version}`,
    `User agent   : ${navigator.userAgent}`,
    `Date         : ${new Date().toISOString()}`,
  ];
  return lines.join("\n");
}

function App() {
  const [settings, setLocal] = useState<Settings | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    void getSettings().then(setLocal);
    void getStats().then(setStats);
    onSettingsChanged(setLocal);
    onStatsChanged(setStats);
    void chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      setUrl(tab?.url ?? "");
      setDomain(domainFromUrl(tab?.url));
    });
  }, []);

  const paused = useMemo(
    () => (settings && domain ? settings.whitelist.includes(domain) : false),
    [settings, domain],
  );
  const protectedHere = Boolean(settings?.enabled && domain && !paused);
  const domainStats = domain && stats ? stats.byDomain[domain] : undefined;

  if (!settings || !stats) return <div className="wrap">…</div>;

  const report = async () => {
    try {
      await navigator.clipboard.writeText(buildReport({ url, domain, settings, stats }));
      setReported(true);
      setTimeout(() => setReported(false), 2000);
    } catch {
      setReported(false);
    }
  };

  return (
    <div className="wrap">
      <div className="header">
        <Logo />
        <div className="header-text">
          <div className="title">NoNoise</div>
          <div className="domain">{domain ?? "Page non nettoyable"}</div>
        </div>
        <button
          type="button"
          className="switch"
          data-on={settings.enabled}
          aria-label="Activer / désactiver NoNoise"
          onClick={() => void setSettings({ enabled: !settings.enabled })}
        />
      </div>

      <div className="card row">
        <div>
          <div className="label">Protection sur ce site</div>
          <div className="sub">
            {domain
              ? protectedHere
                ? `Réseau + nettoyage actifs${domainStats ? ` · ${domainStats.ads + domainStats.trackers + domainStats.cleaned} ici` : ""}`
                : settings.enabled
                  ? "En pause sur ce domaine"
                  : "NoNoise est désactivé"
              : "Onglet système ou page interne"}
          </div>
        </div>
        <span className={`pill ${protectedHere ? "on" : "off"}`}>
          <span className="dot" />
          {protectedHere ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{stats.adsBlocked.toLocaleString("fr-FR")}</b>
          <span>pubs bloquées</span>
        </div>
        <div className="stat">
          <b>{stats.trackersBlocked.toLocaleString("fr-FR")}</b>
          <span>trackers bloqués</span>
        </div>
        <div className="stat">
          <b>{stats.elementsCleaned.toLocaleString("fr-FR")}</b>
          <span>éléments nettoyés</span>
        </div>
        <div className="stat">
          <b>{formatDuration(estimatedSecondsSaved(stats))}</b>
          <span>temps gagné (est.)</span>
        </div>
      </div>

      <button type="button" className="disclosure" onClick={() => setShowBreakdown((v) => !v)}>
        <span>Détail par catégorie</span>
        <span className={`chev ${showBreakdown ? "open" : ""}`}>›</span>
      </button>
      {showBreakdown && (
        <div className="breakdown">
          {CATEGORIES.map((c) => (
            <div key={c} className="bd-item">
              <span>{CATEGORY_LABELS[c]}</span>
              <b>{stats.categories[c].toLocaleString("fr-FR")}</b>
            </div>
          ))}
        </div>
      )}

      <div className="modes">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className="mode"
            data-active={settings.mode === m}
            onClick={() => void setSettings({ mode: m })}
            title={MODES[m].tagline}
          >
            {MODES[m].label}
            <small>{m === "clean" ? "Essentiel" : m === "focus" ? "Sans distraction" : "Lecteurs vidéo"}</small>
          </button>
        ))}
      </div>

      {domain && (
        <button
          type="button"
          className={`btn ${paused ? "good" : "warn"}`}
          onClick={() => void (paused ? resumeOnDomain(domain) : pauseOnDomain(domain))}
        >
          {paused ? `Réactiver sur ${domain}` : `Mettre en pause sur ${domain}`}
        </button>
      )}

      <div className="footer">
        <button type="button" className="link" onClick={() => void chrome.runtime.openOptionsPage()}>
          Options
        </button>
        <button type="button" className="link" onClick={() => void report()} disabled={!domain}>
          {reported ? "Rapport copié ✓" : "Page issue"}
        </button>
      </div>
      <div className="note-row">Local-first · v{chrome.runtime.getManifest().version}</div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
