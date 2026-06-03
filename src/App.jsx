import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  bg: "#F7F4F0", surface: "#FDFBF8", ink: "#8c6848",
  muted: "#68749c", accent: "#eb7e13", accentLight: "#FEF3E7",
  border: "#D9CECC", success: "#7a98ad", successLight: "#EAF1F5",
  brown: "#8c6848", white: "#FDFBF8",
};

const SNELRIT = {
  van: "1965RK", vanLabel: "Heemskerk",
  naar: "1703WE", naarLabel: "CTMH Heerhugowaard",
  bestemming: "CTMH Heerhugowaard", opmerking: "Kantoordag",
};

const S = {
  app: { fontFamily: "'DM Mono',monospace", background: C.bg, color: C.ink, height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden", maxWidth: 480, margin: "0 auto" },
  header: { background: C.brown, color: C.white, padding: "14px 18px", borderBottom: `3px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
  h1: { fontFamily: "'Fraunces',serif", fontSize: "1.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 },
  headerSub: { fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4BFA8" },
  tabBar: { display: "flex", background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0 },
  tabBtn: (a) => ({ flex: 1, padding: "11px 4px 9px", fontFamily: "'DM Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.04em", background: "none", border: "none", borderBottom: `3px solid ${a ? C.accent : "transparent"}`, color: a ? C.accent : C.muted, cursor: "pointer" }),
  panel: { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "16px 14px 28px" },
  label: { fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 5 },
  input: { width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.ink, fontFamily: "'DM Mono',monospace", fontSize: "0.9rem", outline: "none", WebkitAppearance: "none", boxSizing: "border-box" },
  textarea: { width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.ink, fontFamily: "'DM Mono',monospace", fontSize: "0.9rem", outline: "none", resize: "none", height: 64, boxSizing: "border-box" },
  formBlock: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 14 },
  formRow: { marginBottom: 13 },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 },
  btnAdd: { width: "100%", padding: 14, background: C.accent, color: "white", border: "none", borderRadius: 10, fontFamily: "'DM Mono',monospace", fontSize: "0.9rem", cursor: "pointer" },
  btnSm: { padding: "9px 14px", background: C.accent, color: "white", border: "none", borderRadius: 8, fontFamily: "'DM Mono',monospace", fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" },
  useHomeBtn: (d) => ({ fontSize: "0.65rem", color: d ? C.muted : C.accent, background: "none", border: "none", cursor: d ? "default" : "pointer", fontFamily: "'DM Mono',monospace", textDecoration: d ? "none" : "underline", textDecorationStyle: "dotted", padding: 0 }),
  kmPreview: { background: C.accentLight, border: `1px solid #F5C98A`, borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", color: C.accent, minHeight: 42, display: "flex", alignItems: "center", gap: 6 },
  kmNum: { fontFamily: "'Fraunces',serif", fontSize: "1.2rem", fontWeight: 600 },
  retourRow: { display: "flex", alignItems: "center", gap: 10, padding: "4px 0" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 },
  statBox: (w) => ({ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px 11px", gridColumn: w ? "span 2" : "span 1" }),
  statLabel: { fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 3 },
  statValue: { fontFamily: "'Fraunces',serif", fontSize: "1.6rem", fontWeight: 600, color: C.accent, lineHeight: 1 },
  statUnit: { fontSize: "0.72rem", color: C.muted, marginLeft: 2 },
  filterRow: { display: "flex", gap: 8, marginBottom: 14 },
  exportRow: { display: "flex", justifyContent: "flex-end", marginBottom: 12 },
  exportBtn: { padding: "9px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", color: C.ink, cursor: "pointer" },
  ritList: { display: "flex", flexDirection: "column", gap: 8 },
  ritCard: (kantoor) => ({ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${kantoor ? C.accent : C.border}`, borderRadius: 10, padding: "12px 14px" }),
  ritDatum: { fontSize: "0.66rem", color: C.muted },
  ritRoute: { fontSize: "0.82rem", fontWeight: 500, marginTop: 2 },
  ritKm: { fontFamily: "'Fraunces',serif", fontSize: "1.3rem", fontWeight: 600, color: C.accent },
  ritKmUnit: { fontSize: "0.68rem", color: C.muted, fontFamily: "'DM Mono',monospace" },
  ritInfo: { fontSize: "0.7rem", color: C.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  badge: (kleur, bg, border) => ({ fontSize: "0.58rem", background: bg, color: kleur, borderRadius: 20, padding: "2px 7px", border: `1px solid ${border}`, textTransform: "uppercase", letterSpacing: "0.06em" }),
  delBtn: { background: "none", border: "none", color: C.border, fontSize: "0.9rem", cursor: "pointer", marginLeft: "auto", padding: "0 2px" },
  emptyState: { textAlign: "center", padding: "48px 20px", color: C.muted },
  homeCard: { background: C.brown, borderRadius: 10, padding: "14px 16px", marginBottom: 18, position: "relative", overflow: "hidden" },
  hcLabel: { fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4BFA8", marginBottom: 4 },
  hcValue: (e) => ({ fontFamily: "'Fraunces',serif", fontSize: e ? "0.9rem" : "1.1rem", fontWeight: 300, color: e ? "#C9B49A" : "white", fontStyle: e ? "italic" : "normal", minHeight: 26 }),
  homeEditRow: { display: "flex", gap: 8, marginTop: 10 },
  homeInput: { flex: 1, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 8, padding: "9px 12px", color: "white", fontFamily: "'DM Mono',monospace", fontSize: "0.9rem", outline: "none" },
  sectionLabel: { fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 8 },
  toast: (show) => ({ position: "fixed", bottom: 24, left: "50%", transform: `translateX(-50%) translateY(${show ? 0 : 80}px)`, background: C.brown, color: "white", padding: "11px 22px", borderRadius: 24, fontSize: "0.82rem", border: `2px solid ${C.accent}`, opacity: show ? 1 : 0, transition: "transform 0.3s ease, opacity 0.3s ease", zIndex: 200, whiteSpace: "nowrap", pointerEvents: "none" }),
  // Autocomplete dropdown
  dropdown: { position: "absolute", left: 0, right: 0, top: "100%", background: "white", border: `1px solid ${C.border}`, borderRadius: "0 0 8px 8px", zIndex: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" },
  dropItem: (hover) => ({ padding: "10px 14px", fontSize: "0.82rem", cursor: "pointer", background: hover ? C.accentLight : "white", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 2 }),
  dropMain: { color: C.ink, fontWeight: 500 },
  dropSub: { color: C.muted, fontSize: "0.68rem" },
};

function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
function cleanPC(pc) { return pc.replace(/\s/g, "").toUpperCase(); }
function validPC(pc) { return /^[0-9]{4}[A-Z]{2}$/.test(cleanPC(pc)); }
function formatPC(pc) { const c = cleanPC(pc); return c.slice(0,4) + " " + c.slice(4); }
function formatDatum(d) { const [y,m,day] = d.split("-"); return `${day}-${m}-${y}`; }
function vandaag() { return new Date().toISOString().split("T")[0]; }
function haversine(a, b) {
  const R=6371, dL=(b.lat-a.lat)*Math.PI/180, dO=(b.lon-a.lon)*Math.PI/180;
  const x=Math.sin(dL/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dO/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

// ── PDOK Geocoding (NL officieel) ──────────────────────────────
let _cache = load("kmCache2", {});

async function pdokGeocode(query) {
  const key = "ll_" + query.replace(/\s/g,"").toUpperCase();
  if (_cache[key]) return _cache[key];
  try {
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(query)}&rows=1&fl=centroide_ll,weergavenaam,postcode,type`;
    const r = await fetch(url);
    const d = await r.json();
    if (!d.response?.docs?.length) return null;
    const doc = d.response.docs[0];
    if (!doc.centroide_ll) return null;
    const [lon, lat] = doc.centroide_ll.replace("POINT(","").replace(")","").split(" ").map(Number);
    if (isNaN(lat) || isNaN(lon)) return null;
    const res = { lat, lon, label: doc.weergavenaam };
    _cache[key] = res; save("kmCache2", _cache);
    return res;
  } catch { return null; }
}

async function pdokSuggest(query) {
  if (!query || query.length < 2) return [];
  try {
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=${encodeURIComponent(query)}&fq=type:(postcode+adres+woonplaats)&rows=6&fl=weergavenaam,postcode,type,centroide_ll`;
    const r = await fetch(url);
    const d = await r.json();
    return (d.response?.docs || []).map(doc => ({
      label: doc.weergavenaam || "",
      postcode: doc.postcode || "",
      type: doc.type || "",
      centroide_ll: doc.centroide_ll || "",
    }));
  } catch { return []; }
}

// ── Adres input met autocomplete ────────────────────────────────
function AdresInput({ value, onChange, onSelect, placeholder, highlighted }) {
  const [suggesties, setSuggesties] = useState([]);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const sugTimer = useRef();
  const wrapRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleChange(v) {
    onChange(v);
    clearTimeout(sugTimer.current);
    if (v.length < 2) { setSuggesties([]); setOpen(false); return; }
    sugTimer.current = setTimeout(async () => {
      const res = await pdokSuggest(v);
      setSuggesties(res);
      setOpen(res.length > 0);
      setHoverIdx(-1);
    }, 300);
  }

  function kiesSuggestie(s) {
    onChange(s.label);
    setOpen(false);
    setSuggesties([]);
    // Cache de coördinaten meteen als ze beschikbaar zijn
    if (s.centroide_ll) {
      try {
        const [lon, lat] = s.centroide_ll.replace("POINT(","").replace(")","").split(" ").map(Number);
        if (!isNaN(lat) && !isNaN(lon)) {
          const key = "ll_" + s.label.replace(/\s/g,"").toUpperCase();
          _cache[key] = { lat, lon, label: s.label };
          save("kmCache2", _cache);
          onSelect && onSelect(s.label, { lat, lon });
        }
      } catch {}
    } else {
      onSelect && onSelect(s.label, null);
    }
  }

  function typeIcon(type) {
    if (type === "postcode") return "📮";
    if (type === "adres") return "🏠";
    if (type === "woonplaats") return "🏙";
    return "📍";
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        style={{ ...S.input, background: highlighted ? C.accentLight : C.bg }}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => suggesties.length > 0 && setOpen(true)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
      {open && suggesties.length > 0 && (
        <div style={S.dropdown}>
          {suggesties.map((s, i) => (
            <div
              key={i}
              style={S.dropItem(i === hoverIdx)}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(-1)}
              onMouseDown={() => kiesSuggestie(s)}
            >
              <span style={S.dropMain}>{typeIcon(s.type)} {s.label}</span>
              {s.postcode && s.type !== "postcode" && (
                <span style={S.dropSub}>{s.postcode}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState(""); const [show, setShow] = useState(false); const t = useRef();
  const toast = useCallback((m) => { setMsg(m); setShow(true); clearTimeout(t.current); t.current = setTimeout(() => setShow(false), 2800); }, []);
  return { msg, show, toast };
}

export default function App() {
  const [tab, setTab] = useState("invoer");
  const [ritten, setRitten] = useState(() => load("ritten", []));
  const [thuis, setThuis] = useState(() => load("thuisPostcode", ""));
  const [tarief, setTarief] = useState(() => load("tarief", 0.23));
  const { msg: toastMsg, show: toastShow, toast } = useToast();

  const [datum, setDatum] = useState(vandaag);
  const [van, setVan] = useState("");
  const [naar, setNaar] = useState("");
  const [bestemming, setBestemming] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [retour, setRetour] = useState(false);
  const [isKantoorrit, setIsKantoorrit] = useState(false);
  const [kmInfo, setKmInfo] = useState(null);
  const [berekendeKm, setBerekendeKm] = useState(0);

  const [thuisInput, setThuisInput] = useState("");
  const [tariefInput, setTariefInput] = useState(() => String(load("tarief", 0.23)).replace(".", ","));
  const [filterText, setFilterText] = useState("");
  const [filterMaand, setFilterMaand] = useState("");

  // Cache coördinaten direct bij selectie uit dropdown
  const coordCache = useRef({});

  const slaRittenOp = (r) => { setRitten(r); save("ritten", r); };

  // ── Afstand berekenen ─────────────────────────────────────
  const retourRef = useRef(retour);
  useEffect(() => { retourRef.current = retour; }, [retour]);

  const berekenTimer = useRef();
  useEffect(() => {
    clearTimeout(berekenTimer.current);
    if (!van.trim() || !naar.trim()) { setKmInfo(null); setBerekendeKm(0); return; }
    if (van.trim() === naar.trim()) { setKmInfo({ zelfde: true }); setBerekendeKm(0); return; }
    setKmInfo({ bezig: true });
    berekenTimer.current = setTimeout(async () => {
      // Gebruik gecachte coördinaten van dropdown-selectie als beschikbaar
      const vanCoord = coordCache.current[van] || await pdokGeocode(van);
      const naarCoord = coordCache.current[naar] || await pdokGeocode(naar);
      if (!vanCoord || !naarCoord) { setKmInfo({ fout: true }); setBerekendeKm(0); return; }
      const enkeling = Math.round(haversine(vanCoord, naarCoord));
      const isRetour = retourRef.current;
      const km = isRetour ? enkeling * 2 : enkeling;
      setKmInfo({ km, enkeling, retour: isRetour });
      setBerekendeKm(km);
    }, 500);
  }, [van, naar, retour]);

  function fmtPC(v) {
    let s = v.replace(/\s/g,"").toUpperCase();
    if (s.length > 4) s = s.slice(0,4)+" "+s.slice(4);
    return s.slice(0,7);
  }

  async function voegToe(override) {
    const d = override || { datum, van, naar, bestemming, opmerking, retour, isKantoorrit };
    if (!d.datum) { toast("Selecteer een datum"); return; }
    if (!d.van?.trim()) { toast("Vul een vertrekadres in"); return; }
    if (!d.naar?.trim()) { toast("Vul een aankomstadres in"); return; }

    const vanCoord = coordCache.current[d.van] || await pdokGeocode(d.van);
    const naarCoord = coordCache.current[d.naar] || await pdokGeocode(d.naar);
    if (!vanCoord || !naarCoord) { toast("Adres niet gevonden — probeer vollediger adres"); return; }

    const enkeling = Math.round(haversine(vanCoord, naarCoord));
    const km = d.retour ? enkeling * 2 : enkeling;

    slaRittenOp([{ id: Date.now(), datum: d.datum, van: d.van, naar: d.naar, bestemming: d.bestemming, opmerking: d.opmerking, retour: d.retour, isKantoorrit: d.isKantoorrit || false, km }, ...ritten]);

    if (!override) {
      setVan(""); setNaar(""); setBestemming(""); setOpmerking("");
      setRetour(false); setIsKantoorrit(false); setVan("");
      setDatum(vandaag()); setKmInfo(null); setBerekendeKm(0);
    }
    toast("Rit toegevoegd ✓");
  }

  function verwijder(id) {
    if (!confirm("Rit verwijderen?")) return;
    slaRittenOp(ritten.filter(r => r.id !== id));
  }

  function saveThuis() {
    const pc = thuisInput.trim();
    if (!pc) { toast("Vul een postcode in"); return; }
    setThuis(pc); save("thuisPostcode", pc); setThuisInput(""); toast("Thuisadres opgeslagen ✓");
  }

  function saveTarief() {
    const v = parseFloat(tariefInput.replace(",","."));
    if (isNaN(v)||v<=0) { toast("Voer een geldig tarief in"); return; }
    setTarief(v); save("tarief", v); toast("Tarief opgeslagen ✓");
  }

  function exportCSV() {
    if (!ritten.length) { toast("Geen ritten om te exporteren"); return; }
    const hdr = ["Datum","Van","Naar","Bestemming","Opmerking","Retour","Kantoorrit","Kilometers"];
    const rows = ritten.map(r => [r.datum,r.van,r.naar,r.bestemming,r.opmerking,r.retour?"Ja":"Nee",r.isKantoorrit?"Ja":"Nee",r.km].map(v=>`"${String(v||"").replace(/"/g,'""')}"`).join(";"));
    const blob = new Blob(["\uFEFF"+[hdr.join(";"),...rows].join("\n")],{type:"text/csv;charset=utf-8;"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`ritten_${vandaag()}.csv`; a.click();
    toast("CSV geëxporteerd ✓");
  }

  const totaalKm = ritten.reduce((s,r)=>s+r.km,0);
  const gefilterd = ritten.filter(r => {
    const t=(r.bestemming+r.opmerking+r.van+r.naar).toLowerCase();
    return t.includes(filterText.toLowerCase()) && (!filterMaand||r.datum.startsWith(filterMaand));
  });

  function KmPreview() {
    if (!kmInfo) return <span style={{color:C.muted,fontSize:"0.78rem"}}>Vul adressen in…</span>;
    if (kmInfo.bezig) return <span style={{color:C.muted,fontSize:"0.78rem"}}>● Berekenen…</span>;
    if (kmInfo.fout) return <span style={{color:"#c0392b",fontSize:"0.8rem"}}>Adres niet herkend — typ vollediger</span>;
    if (kmInfo.zelfde) return <span style={{color:C.muted,fontSize:"0.78rem"}}>Zelfde adres</span>;
    return <>
      <span style={S.kmNum}>{kmInfo.km}</span>
      <span> km</span>
      {kmInfo.retour && <span style={{fontSize:"0.68rem",color:C.success}}>({kmInfo.enkeling} × 2)</span>}
    </>;
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,600&display=swap" rel="stylesheet"/>
      <div style={S.app}>
        <header style={S.header}>
          <div style={S.h1}><span>🚗</span> Rittenregistratie</div>
          <div style={S.headerSub}>{new Date().getFullYear()}</div>
        </header>
        <nav style={S.tabBar}>
          {[["invoer","＋ Nieuwe rit"],["overzicht","📋 Overzicht"],["instellingen","⚙ Instellingen"]].map(([id,label])=>(
            <button key={id} style={S.tabBtn(tab===id)} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </nav>

        {/* ── INVOER ── */}
        {tab==="invoer" && (
          <div style={S.panel}>

            {/* Kantoordag toggle */}
            <div
              onClick={() => {
                const nieuw = !isKantoorrit;
                setIsKantoorrit(nieuw);
                if (nieuw) {
                  setVan(SNELRIT.vanLabel + " " + formatPC(SNELRIT.van));
                  setNaar(SNELRIT.naarLabel + " " + formatPC(SNELRIT.naar));
                  setBestemming(SNELRIT.bestemming);
                  setOpmerking(SNELRIT.opmerking);
                  setRetour(true);
                  // Pre-cache de vaste adressen
                  coordCache.current[SNELRIT.vanLabel+" "+formatPC(SNELRIT.van)] = null;
                  coordCache.current[SNELRIT.naarLabel+" "+formatPC(SNELRIT.naar)] = null;
                } else {
                  setVan(""); setNaar(""); setBestemming(""); setOpmerking(""); setRetour(false);
                }
              }}
              style={{ display:"flex", alignItems:"center", gap:14, background: isKantoorrit ? `linear-gradient(135deg,${C.accent} 0%,#d4700f 100%)` : C.surface, border:`2px solid ${isKantoorrit?C.accent:C.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", marginBottom:14, boxShadow: isKantoorrit?"0 3px 12px rgba(235,126,19,0.3)":"none", transition:"all 0.2s", userSelect:"none" }}
            >
              <div style={{ width:44,height:26,borderRadius:13,flexShrink:0,background:isKantoorrit?"rgba(255,255,255,0.35)":C.border,position:"relative",transition:"background 0.2s" }}>
                <div style={{ position:"absolute",top:3,left:isKantoorrit?21:3,width:20,height:20,borderRadius:"50%",background:isKantoorrit?"white":"#aaa",transition:"left 0.2s,background 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"0.9rem",fontWeight:700,color:isKantoorrit?"white":C.ink}}>🏢 Kantoordag</div>
                <div style={{fontSize:"0.65rem",marginTop:2,color:isKantoorrit?"rgba(255,255,255,0.85)":C.muted}}>
                  {SNELRIT.vanLabel} ({formatPC(SNELRIT.van)}) → {SNELRIT.naarLabel} ({formatPC(SNELRIT.naar)})
                </div>
              </div>
              {isKantoorrit && (
                <div onClick={e=>{e.stopPropagation();setRetour(r=>!r);}} style={{ display:"flex",alignItems:"center",gap:5,background:retour?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:8,padding:"5px 10px",cursor:"pointer",flexShrink:0 }}>
                  <div style={{ width:16,height:16,borderRadius:4,background:retour?"white":"transparent",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    {retour && <span style={{fontSize:"0.65rem",color:C.accent,fontWeight:900,lineHeight:1}}>✓</span>}
                  </div>
                  <span style={{fontSize:"0.7rem",color:"white",fontWeight:600}}>Retour</span>
                </div>
              )}
            </div>

            {/* Formulier */}
            <div style={S.formBlock}>
              <div style={S.formRow}>
                <label style={S.label}>Datum</label>
                <input type="date" style={S.input} value={datum} onChange={e=>setDatum(e.target.value)}/>
              </div>

              <div style={S.formRow}>
                <div style={S.labelRow}>
                  <label style={{...S.label,margin:0}}>Vertrek</label>
                  <button style={S.useHomeBtn(!thuis)} disabled={!thuis} onClick={()=>setVan(thuis)}>← thuis</button>
                </div>
                <AdresInput
                  value={van}
                  onChange={v=>{setVan(v); if(isKantoorrit) setIsKantoorrit(false);}}
                  onSelect={(label,coord)=>{ if(coord) coordCache.current[label]=coord; }}
                  placeholder="Postcode of adres…"
                  highlighted={isKantoorrit}
                />
              </div>

              <div style={S.formRow}>
                <div style={S.labelRow}>
                  <label style={{...S.label,margin:0}}>Aankomst</label>
                  <button style={S.useHomeBtn(!thuis)} disabled={!thuis} onClick={()=>setNaar(thuis)}>← thuis</button>
                </div>
                <AdresInput
                  value={naar}
                  onChange={v=>{setNaar(v); if(isKantoorrit) setIsKantoorrit(false);}}
                  onSelect={(label,coord)=>{ if(coord) coordCache.current[label]=coord; }}
                  placeholder="Postcode of adres…"
                  highlighted={isKantoorrit}
                />
              </div>

              {!isKantoorrit && (
                <div style={S.retourRow}>
                  <input type="checkbox" id="retour" checked={retour} onChange={e=>setRetour(e.target.checked)} style={{width:20,height:20,accentColor:C.accent}}/>
                  <label htmlFor="retour" style={{fontSize:"0.85rem",cursor:"pointer"}}>Retour (heen + terug)</label>
                </div>
              )}

              <div style={{...S.formRow,marginTop:10}}>
                <label style={S.label}>Berekende afstand</label>
                <div style={S.kmPreview}><KmPreview/></div>
              </div>
            </div>

            <div style={S.formBlock}>
              <div style={S.formRow}>
                <label style={S.label}>Bestemming (naam)</label>
                <input style={S.input} type="text" placeholder="Bijv. Klant Rotterdam" value={bestemming} onChange={e=>setBestemming(e.target.value)} autoComplete="off"/>
              </div>
              <div style={{...S.formRow,marginBottom:0}}>
                <label style={S.label}>Doel / opmerking</label>
                <textarea style={S.textarea} placeholder="Bijv. Klantbezoek, vergadering…" value={opmerking} onChange={e=>setOpmerking(e.target.value)}/>
              </div>
            </div>

            <button style={S.btnAdd} onClick={()=>voegToe()}>+ Rit toevoegen</button>
          </div>
        )}

        {/* ── OVERZICHT ── */}
        {tab==="overzicht" && (
          <div style={S.panel}>
            <div style={S.statsGrid}>
              <div style={S.statBox(false)}><div style={S.statLabel}>Totaal km</div><div><span style={S.statValue}>{totaalKm}</span><span style={S.statUnit}>km</span></div></div>
              <div style={S.statBox(false)}><div style={S.statLabel}>Ritten</div><div><span style={S.statValue}>{ritten.length}</span></div></div>
              <div style={S.statBox(true)}><div style={S.statLabel}>Vergoeding (€ {String(tarief).replace(".",",")} / km)</div><div><span style={S.statValue}>€ {(totaalKm*tarief).toFixed(2).replace(".",",")}</span></div></div>
            </div>
            <div style={S.filterRow}>
              <input style={{...S.input,flex:1}} type="text" placeholder="Zoek…" value={filterText} onChange={e=>setFilterText(e.target.value)}/>
              <input style={{...S.input,maxWidth:145,flexShrink:0}} type="month" value={filterMaand} onChange={e=>setFilterMaand(e.target.value)}/>
            </div>
            <div style={S.exportRow}><button style={S.exportBtn} onClick={exportCSV}>↓ Exporteer CSV</button></div>
            {gefilterd.length===0 ? (
              <div style={S.emptyState}><div style={{fontSize:"3rem",marginBottom:10,opacity:0.3}}>🚗</div><p style={{fontSize:"0.82rem",lineHeight:1.6}}>Nog geen ritten.<br/>Voeg toe via "Nieuwe rit".</p></div>
            ) : (
              <div style={S.ritList}>
                {gefilterd.map(r=>(
                  <div key={r.id} style={S.ritCard(r.isKantoorrit)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={S.ritDatum}>{formatDatum(r.datum)}</div>
                        <div style={S.ritRoute}>{r.van} → {r.naar}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span style={S.ritKm}>{r.km}</span><span style={S.ritKmUnit}> km</span>
                      </div>
                    </div>
                    <div style={S.ritInfo}>
                      {r.bestemming && <span>{r.bestemming}</span>}
                      {r.opmerking && <span style={{opacity:.75}}>{r.opmerking}</span>}
                      {r.retour && <span style={S.badge(C.success,C.successLight,"#B5CFDC")}>retour</span>}
                      {r.isKantoorrit && <span style={S.badge(C.accent,C.accentLight,"#F5C98A")}>kantoor</span>}
                      <button style={S.delBtn} onClick={()=>verwijder(r.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INSTELLINGEN ── */}
        {tab==="instellingen" && (
          <div style={S.panel}>
            <div style={S.sectionLabel}>Thuisadres</div>
            <div style={S.homeCard}>
              <div style={{fontSize:"2rem",position:"absolute",right:14,top:10,opacity:0.12,color:"white"}}>⌂</div>
              <div style={S.hcLabel}>Standaard vertrekpunt</div>
              <div style={S.hcValue(!thuis)}>{thuis||"Nog niet ingesteld"}</div>
              <div style={S.homeEditRow}>
                <input style={S.homeInput} placeholder="Postcode of adres" value={thuisInput} onChange={e=>setThuisInput(e.target.value)}/>
                <button style={S.btnSm} onClick={saveThuis}>Opslaan</button>
              </div>
            </div>

            <div style={S.sectionLabel}>Vaste kantoorrit</div>
            <div style={{...S.formBlock,marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"4px 0"}}>
                <span style={{fontSize:"1.6rem"}}>🏢</span>
                <div>
                  <div style={{fontSize:"0.82rem",fontWeight:600,marginBottom:4}}>Kantoordag CTMH</div>
                  <div style={{fontSize:"0.68rem",color:C.muted,lineHeight:1.8}}>
                    <span style={{background:C.accentLight,color:C.accent,borderRadius:4,padding:"1px 6px",marginRight:4}}>{formatPC(SNELRIT.van)}</span>{SNELRIT.vanLabel}<br/>
                    <span style={{background:C.accentLight,color:C.accent,borderRadius:4,padding:"1px 6px",marginRight:4}}>{formatPC(SNELRIT.naar)}</span>{SNELRIT.naarLabel}
                  </div>
                  <div style={{fontSize:"0.65rem",color:C.success,marginTop:4}}>↩ Standaard retour</div>
                </div>
              </div>
            </div>

            <div style={S.sectionLabel}>Vergoeding per km</div>
            <div style={{...S.formBlock,marginBottom:20}}>
              <div style={S.formRow}>
                <label style={S.label}>Tarief (€ per km)</label>
                <input style={S.input} type="text" inputMode="decimal" placeholder="0.23" value={tariefInput} onChange={e=>setTariefInput(e.target.value)}/>
              </div>
              <button style={S.btnAdd} onClick={saveTarief}>Opslaan</button>
            </div>

            <div style={S.sectionLabel}>Gegevens</div>
            <div style={S.formBlock}>
              <p style={{fontSize:"0.78rem",color:C.muted,marginBottom:14,lineHeight:1.6}}>Alle ritten worden lokaal opgeslagen op dit apparaat.</p>
              <button style={{...S.btnAdd,background:"#c0392b"}} onClick={()=>{if(confirm("Weet je zeker dat je ALLE ritten wilt wissen?")){{slaRittenOp([]);toast("Alle ritten gewist");}}}}>🗑 Alle ritten wissen</button>
            </div>
          </div>
        )}

        <div style={S.toast(toastShow)}>{toastMsg}</div>
      </div>
    </>
  );
}