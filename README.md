# Se til Notodden

Frontend-only prototype for å utforske lokale jobbmuligheter, bedrifter og livet i Notodden. Alle stillinger, arrangementer, profiler, matcher og meldinger er fiktive og håndteres lokalt i nettleseren.

## Kom i gang

```sh
npm install
npm run dev
```

Produksjonsbygg:

```sh
npm run build
npm run preview
```

Prosjektet bruker React, TypeScript, Vite, Tailwind CSS, React Router, Lucide og Framer Motion. Det er ingen backend, innlogging eller eksterne integrasjoner. Bilder og skrifttyper lastes fra Unsplash og Google Fonts.

## Publisering

Prosjektet kan importeres som en Vite-app i Vercel. `vercel.json` sender app-ruter tilbake til `index.html`, slik at direkte lenker fungerer. En QR-kode kan peke til den publiserte nettadressen; ingen adresse eller QR-kode er laget i denne prototypen.
