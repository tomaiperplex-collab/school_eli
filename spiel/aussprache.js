// spiel/aussprache.js — Echte Aussprache-Analyse: Mikrofon-Aufnahme im Browser
// (MediaRecorder, funktioniert in jedem Browser mit Mikrofon-Zugriff), Umwandlung
// in 16-kHz-WAV und Bewertung durch ein Audio-fähiges Modell (Google Gemini).
// Claude kann kein Audio hören; deshalb ist das ein separater Dienst mit eigenem Key.

const GEMINI_STANDARD_MODEL = "gemini-2.5-flash";

const Aufnahme = {
  stream: null, rec: null, chunks: [], timer: null, fertig: null,

  aktiv() { return !!this.rec && this.rec.state === "recording"; },

  async start(maxMs = 10000) {
    if (!navigator.mediaDevices || !window.MediaRecorder) throw Object.assign(new Error("kein MediaRecorder"), { name: "NotSupportedError" });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find((m) => MediaRecorder.isTypeSupported(m));
    this.rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    this.rec.ondataavailable = (e) => { if (e.data.size) this.chunks.push(e.data); };
    this.fertig = new Promise((resolve) => {
      this.rec.onstop = () => {
        clearTimeout(this.timer);
        this.stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(this.chunks, { type: this.rec.mimeType }));
      };
    });
    this.rec.start();
    this.timer = setTimeout(() => this.stop(), maxMs);
  },

  stop() {
    if (this.rec && this.rec.state !== "inactive") this.rec.stop();
    return this.fertig;
  },
};

// Aufnahme (webm/mp4) -> 16-kHz-Mono-WAV als base64 (Gemini versteht WAV sicher).
async function blobZuWavBase64(blob) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const roh = await ctx.decodeAudioData(await blob.arrayBuffer());
  ctx.close();
  const ziel = 16000;
  const offline = new OfflineAudioContext(1, Math.max(1, Math.ceil(roh.duration * ziel)), ziel);
  const quelle = offline.createBufferSource();
  quelle.buffer = roh;
  quelle.connect(offline.destination);
  quelle.start();
  const daten = (await offline.startRendering()).getChannelData(0);

  const wav = new DataView(new ArrayBuffer(44 + daten.length * 2));
  const schreibe = (o, t) => { for (let i = 0; i < t.length; i++) wav.setUint8(o + i, t.charCodeAt(i)); };
  schreibe(0, "RIFF"); wav.setUint32(4, 36 + daten.length * 2, true); schreibe(8, "WAVE"); schreibe(12, "fmt ");
  wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true);
  wav.setUint32(24, ziel, true); wav.setUint32(28, ziel * 2, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true);
  schreibe(36, "data"); wav.setUint32(40, daten.length * 2, true);
  for (let i = 0; i < daten.length; i++) wav.setInt16(44 + i * 2, Math.max(-1, Math.min(1, daten[i])) * 0x7fff, true);

  const bytes = new Uint8Array(wav.buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return { base64: btoa(bin), sekunden: roh.duration };
}

function ausspracheAnfrage(ziel) {
  return `Du bist eine freundliche Französisch-Lehrerin für ein Schweizer Kind (5./6. Klasse, Anfänger, Muttersprache Deutsch, Lehrmittel «Ça roule 6, Unité 1»).
Das Kind spielt «Le jeu des détectives» und stellt einem Zeugen eine Frage auf Französisch, z. B. «Est-ce qu'il porte des lunettes ?», «Est-ce qu'elle a les yeux marron ?», «Est-ce que c'est un homme ?».
${ziel ? `Der Satz, den das Kind sagen wollte (Vorlage): «${ziel}»` : "Eine Vorlage gibt es nicht; schliesse aus dem Gehörten auf den gemeinten Satz."}
Höre dir die Aufnahme genau an und beurteile die tatsächlich gesprochene AUSSPRACHE (nicht die Schreibweise): Nasale (on, an, in), «u» vs. «ou», französisches «r», «eu», stumme Endkonsonanten, Verbindungen (Liaison, «qu'il»), Betonung auf der letzten Silbe, «h» stumm, «ch» wie «sch».
Sei fair und ermutigend, wie für ein Kind. Lobe zuerst, was gut war.
Antworte AUSSCHLIESSLICH mit einem JSON-Objekt:
{"verstaendlich": true/false (false bei Stille, Rauschen oder wenn kein Französisch/keine Sprache zu hören ist),
 "transkription": "was du tatsächlich gehört hast, möglichst lautgetreu",
 "gemeint": "der Satz, den das Kind vermutlich sagen wollte, korrekt geschrieben",
 "note": Zahl 1-5 (5 = sehr gut verständlich und korrekt gesprochen),
 "lob": "ein kurzer Satz auf Deutsch, was gut war",
 "tipps": ["maximal 3 konkrete Tipps auf Deutsch zu den echten Fehlern, mit einem Vergleichswort oder Beispiel"],
 "verbessert": "der Satz richtig geschrieben"}`;
}

async function pruefeAussprache(base64Wav, ziel, key, model) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model || GEMINI_STANDARD_MODEL)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: ausspracheAnfrage(ziel) }, { inline_data: { mime_type: "audio/wav", data: base64Wav } }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });
  if (!r.ok) {
    let detail = "";
    try { detail = (await r.json()).error?.message || ""; } catch (e) { /* kein JSON */ }
    throw new Error(`HTTP ${r.status}${detail ? ": " + detail : ""}`);
  }
  const data = await r.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
}

// Nur Key-Test (ohne Audio)
async function testeGeminiKey(key, model) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model || GEMINI_STANDARD_MODEL)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Antworte nur mit: ok" }] }] }),
  });
  if (!r.ok) {
    let detail = "";
    try { detail = (await r.json()).error?.message || ""; } catch (e) { /* kein JSON */ }
    throw new Error(`HTTP ${r.status}${detail ? ": " + detail : ""}`);
  }
}
