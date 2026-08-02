# CMS Core

Sdílená core vrstva multi-tenant frameworku. Toto repo je **template** — nové
klienty vytváříš přes GitHub "Use this template", ne forkem.

## Core vs. client vrstva

Sync mechanismus (Fáze 4, `repo-file-sync-action`) bude z tohoto repa
propagovat do všech `client-*` repozitářů **výhradně**:

```
.eleventy.js
src/_includes/**
src/assets/css/base.css
src/assets/js/**
.github/workflows/deploy.yml
package.json
```

Nikdy se nepropaguje (client-owned, sync na tyto cesty nesmí sáhnout):

```
src/_data/site.json
src/content/**
src/assets/css/theme.css   (klient si tu může přepsat proměnné z base.css)
```

`src/_data/site.json` v tomto core repu je jen vývojový placeholder, aby šlo
repo samostatně buildit a testovat layouty — v client repu ho nahrazuje
skutečná konfigurace daného klienta editovaná přes Decap CMS.

## Content model

Definice polí (Pages, Products, Site settings) žije jako zdroj pravdy v
`decap-cms/config.yml.template`. admin-hub (Fáze 2–3) z něj generuje konkrétní
`config.yml` per klient (dosadí `repo` a `base_url`) — tenhle soubor se
necommituje do client repa, servíruje ho hub dynamicky podle přihlášeného
klienta.

**Zpětná kompatibilita:** všechna pole v šablonách (`seo.njk`, `footer.njk`,
`page.njk`, `product.njk`) používají Nunjucks `default` filter. Když někdy
přidáme do content modelu nové pole, starší klienti bez migrace nespadnou —
jen se jim nezobrazí dokud pole v Decapu nevyplní.

## Vývoj

```bash
npm install
npm run serve   # dev server s livereload
npm run build    # produkční build do _site/
```

## Co chybí (další fáze)

- Fáze 2: `admin-hub` — OAuth proxy, `clients-registry.json`, branded login
- Fáze 3: dynamické generování `config.yml` per klient v admin-hub
- Fáze 4: `repo-file-sync-action` workflow + `sync.yml` s přesným seznamem cest výše
- Fáze 5: `theme.css` mechanismus pro per-klient restylování
- Fáze 6: Formspree, sitemap, DNS/CNAME dokumentace
