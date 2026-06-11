import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { baseDomain } from "@/shared/domains";
import { MODES, type Mode } from "@/shared/modes";
import { resetStats } from "@/shared/stats";
import {
  exportSettings,
  getSettings,
  importSettings,
  onSettingsChanged,
  setSettings,
  type Settings,
} from "@/shared/storage";
import "./options.css";

function normalizeDomain(input: string): string | null {
  const raw = input.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!raw || !raw.includes(".")) return null;
  return baseDomain(raw);
}

function DomainList({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onAdd: (d: string) => void;
  onRemove: (d: string) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const add = () => {
    const d = normalizeDomain(value);
    if (d) {
      onAdd(d);
      setValue("");
    }
  };
  return (
    <>
      <div className="list">
        {items.length === 0 && <div className="empty">Aucun domaine.</div>}
        {items.map((d) => (
          <div key={d} className="list-item">
            <code>{d}</code>
            <button type="button" className="icon-btn" aria-label={`Retirer ${d}`} onClick={() => onRemove(d)}>
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="add">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" onClick={add}>
          Ajouter
        </button>
      </div>
    </>
  );
}

function App() {
  const [settings, setLocal] = useState<Settings | null>(null);
  const [selectorsDraft, setSelectorsDraft] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void getSettings().then((s) => {
      setLocal(s);
      setSelectorsDraft(s.customSelectors.join("\n"));
    });
    onSettingsChanged(setLocal);
  }, []);

  if (!settings) return <div className="page">…</div>;

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(null), 2500);
  };

  const saveSelectors = () => {
    const customSelectors = selectorsDraft
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length < 300);
    void setSettings({ customSelectors }).then(() => flash("Sélecteurs enregistrés."));
  };

  const doExport = async () => {
    const json = await exportSettings();
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "nonoise-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file: File) => {
    try {
      const s = await importSettings(await file.text());
      setSelectorsDraft(s.customSelectors.join("\n"));
      flash("Réglages importés.");
    } catch {
      flash("Fichier invalide.");
    }
  };

  return (
    <div className="page">
      <div className="head">
        <span className="mark" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="4.6" width="10" height="1.8" rx="0.9" fill="#8a93a3" />
            <rect x="4.5" y="7.1" width="7" height="1.8" rx="0.9" fill="#8a93a3" />
            <rect x="3.8" y="9.6" width="8.4" height="1.8" rx="0.9" fill="#8a93a3" />
            <path d="M3.5 12.5 L12.5 3.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <h1>NoNoise — Options</h1>
          <div className="version">Version {chrome.runtime.getManifest().version} · données 100 % locales</div>
        </div>
      </div>

      <div className="card row">
        <div>
          <h2>Protection globale</h2>
          <div className="hint" style={{ marginBottom: 0 }}>
            Coupe tout NoNoise (réseau + nettoyage visuel) sur tous les sites.
          </div>
        </div>
        <button
          type="button"
          className="switch"
          data-on={settings.enabled}
          aria-label="Protection globale"
          onClick={() => void setSettings({ enabled: !settings.enabled })}
        />
      </div>

      <div className="card">
        <h2>Mode par défaut</h2>
        <p className="hint">Appliqué partout. Modifiable à tout moment depuis la popup.</p>
        <div className="segment">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button key={m} type="button" data-active={settings.mode === m} onClick={() => void setSettings({ mode: m })}>
              {MODES[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Sites en pause (whitelist)</h2>
        <p className="hint">NoNoise ne touche à rien sur ces domaines.</p>
        <DomainList
          items={settings.whitelist}
          placeholder="exemple.com"
          onAdd={(d) => void setSettings({ whitelist: [...new Set([...settings.whitelist, d])] })}
          onRemove={(d) => void setSettings({ whitelist: settings.whitelist.filter((x) => x !== d) })}
        />
      </div>

      <div className="card">
        <h2>Nettoyage renforcé (blacklist)</h2>
        <p className="hint">Ces domaines reçoivent toujours le nettoyage Focus, quel que soit le mode.</p>
        <DomainList
          items={settings.blacklist}
          placeholder="exemple.com"
          onAdd={(d) => void setSettings({ blacklist: [...new Set([...settings.blacklist, d])] })}
          onRemove={(d) => void setSettings({ blacklist: settings.blacklist.filter((x) => x !== d) })}
        />
      </div>

      <div className="card">
        <h2>Règles personnalisées</h2>
        <p className="hint">Un sélecteur CSS par ligne — chaque élément correspondant sera masqué sur tous les sites.</p>
        <textarea
          value={selectorsDraft}
          onChange={(e) => setSelectorsDraft(e.target.value)}
          placeholder={".bandeau-promo\n#popup-parrainage"}
          spellCheck={false}
        />
        <div className="actions" style={{ marginTop: 10 }}>
          <button type="button" className="btn" onClick={saveSelectors}>
            Enregistrer les sélecteurs
          </button>
          {note && <span className="ok-note" style={{ alignSelf: "center" }}>{note}</span>}
        </div>
      </div>

      <div className="card">
        <h2>Données</h2>
        <p className="hint">Tout est stocké localement dans ton navigateur. Rien ne quitte la machine.</p>
        <div className="actions">
          <button type="button" className="btn ghost" onClick={() => void doExport()}>
            Exporter les réglages (JSON)
          </button>
          <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
            Importer des réglages
          </button>
          <button
            type="button"
            className="btn danger"
            onClick={() => void resetStats().then(() => flash("Statistiques remises à zéro."))}
          >
            Réinitialiser les stats
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
