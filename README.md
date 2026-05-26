# Aurora Finance

Aurora Finance ist ein moderner persoenlicher Ausgaben-Tracker mit React, Vite, TailwindCSS, Framer Motion und Recharts. Das Projekt enthaelt weiterhin eine Electron-Huelle fuer Desktop, ist aber jetzt auch sauber als oeffentliche Web-App auf Vercel deploybar.

## Features

- Dashboard mit Guthaben, Einnahmen, Ausgaben, Sparquote und Budgetstatus
- Transaktionen mit Suche, Kategorie-, Datum-, Typ- und Betragsfilter
- Floating Modal zum Hinzufuegen neuer Einnahmen und Ausgaben
- Analytics mit Trend-, Balken- und Donut-Charts
- Monatsbudgets und Kategorie-Budgets mit Warnstatus
- Kategorieverwaltung, Settings, Privacy Mode und CSV-Export
- Lokale Speicherung im Browser/App-Speicher
- Tastenkombinationen fuer Command Center, neue Transaktion und Export

## Tech Stack

- React 19
- Vite
- TypeScript
- TailwindCSS
- Framer Motion
- Recharts
- Electron fuer die optionale Desktop-Version
- Vercel fuer das oeffentliche Web-Deployment

## Lokale Entwicklung

```bash
npm install
npm run dev:web
```

Die Web-App laeuft danach lokal auf `http://127.0.0.1:5173`.

## Desktop-Entwicklung

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build:web
npm run preview
```

Der produktionsfertige Web-Build wird in `dist/` erzeugt.

## Vercel-Konfiguration

Die Datei `vercel.json` setzt:

- Framework: Vite
- Install Command: `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci`
- Build Command: `npm run build:web`
- Output Directory: `dist`
- SPA-Rewrite: alle Routen laden `index.html`
- Security- und Cache-Header fuer Production

## Supabase Authentication

Die App nutzt Supabase Authentication fuer Registrierung, Login, Session-Restore und Logout. Die Finanzdaten werden pro Supabase-User-ID getrennt im lokalen Browser-Speicher abgelegt, damit Nutzer nur ihren eigenen Workspace sehen.

### Supabase-Projekt anlegen

1. Oeffne `https://supabase.com/dashboard`.
2. Erstelle ein neues Projekt.
3. Gehe zu `Project Settings` und dann `API`.
4. Kopiere:
   - Project URL
   - anon/public key oder publishable key
5. Gehe zu `Authentication` und dann `Providers`.
6. Stelle sicher, dass `Email` aktiviert ist.
7. Optional: Deaktiviere fuer schnelles Testen die E-Mail-Bestaetigung oder konfiguriere Redirect URLs.

### Lokale ENV-Datei

Erstelle lokal eine Datei `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

Diese Datei wird nicht committed. Als Vorlage gibt es `.env.example`.

### Vercel Environment Variables

In Vercel unter `Project` -> `Settings` -> `Environment Variables` eintragen:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Beide Variablen fuer `Production`, `Preview` und `Development` setzen, wenn alle Deployments funktionieren sollen.

## Deployment mit GitHub und Vercel

### 1. Repository lokal vorbereiten

```bash
git init
git add .
git commit -m "Initial Aurora Finance app"
git branch -M main
```

### 2. GitHub Repository erstellen

1. Oeffne GitHub.
2. Erstelle ein neues Repository, zum Beispiel `aurora-finance`.
3. Lege keine README, kein `.gitignore` und keine Lizenz auf GitHub an, weil diese Dateien lokal schon vorhanden sind.

### 3. Projekt zu GitHub pushen

Ersetze `USER` und `REPO` durch deinen GitHub-Namen und Repository-Namen:

```bash
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

### 4. Mit Vercel verbinden

1. Oeffne `https://vercel.com/dashboard`.
2. Klicke auf `Add New` und dann `Project`.
3. Waehle dein GitHub Repository aus.
4. Vercel erkennt Vite automatisch. Falls du die Werte manuell pruefen willst:
   - Framework Preset: `Vite`
   - Build Command: `npm run build:web`
   - Output Directory: `dist`
   - Install Command: `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci`
5. Trage unter `Environment Variables` die Supabase-Werte ein.
6. Klicke auf `Deploy`.

Nach dem ersten Deploy erhaeltst du eine oeffentliche URL nach dem Muster:

```text
https://dein-projekt.vercel.app
```

### 5. Eigene Domain verbinden

1. Oeffne dein Projekt in Vercel.
2. Gehe zu `Settings` und dann `Domains`.
3. Fuege deine Domain hinzu, zum Beispiel `finance.example.com` oder `example.com`.
4. Folge den DNS-Anweisungen von Vercel:
   - Subdomain: meistens ein `CNAME` auf Vercel
   - Apex/root domain: meistens ein `A` Record nach Vercel
5. Warte, bis Vercel die Domain als validiert markiert.

Sobald die Domain validiert ist, zeigt sie automatisch auf dein letztes Production Deployment.

### 6. Zukuenftige Updates deployen

Arbeite lokal weiter und pushe danach auf `main`:

```bash
git add .
git commit -m "Update finance tracker"
git push
```

Vercel baut und veroeffentlicht danach automatisch eine neue Production-Version.

## Preview Deployments

Der einfachste Workflow fuer Aenderungen:

```bash
git checkout -b feature/neue-funktion
git add .
git commit -m "Add new feature"
git push -u origin feature/neue-funktion
```

Oeffne auf GitHub einen Pull Request. Vercel erstellt automatisch eine Preview-URL fuer diesen Branch. Nach dem Merge in `main` wird Production aktualisiert.

## Nuetzliche Commands

```bash
npm run typecheck
npm run build:web
npm run preview
```

Optional mit Vercel CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```
