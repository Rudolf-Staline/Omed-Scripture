# Content governance

How biblical and editorial content enters Omed Scripture. The guiding rule is
caution: **if a license is not clear, verified and documented, the content is
not integrated.**

## Central rule
No Bible text, commentary, devotional, cross-reference database, or third-party
content may be added unless its license is **clear, verified, and documented**
(provenance + license + URL). When in doubt, do not integrate.

## Adding a Bible translation
1. Confirm the license allows redistribution (public domain, or an explicit
   grant you can cite). Record it in `docs/BIBLE_RIGHTS_AND_LICENSES.md`.
2. Add catalog metadata (`public/bibles/catalog.json`) honestly:
   `availability` (`static` / `partial-static` / `api-only` / `external-only`),
   `offlineSupported`, `publicDomain` (false/absent if uncertain), `license`,
   `licenseUrl`, `completeness`.
3. Generate packs/index via the import pipeline; run `npm run bible:validate`.
4. A static translation **must** have a documented license status, or it stays
   `api-only` / `external-only`.

## Adding editorial content (cross-references, study prompts, notes)
- Must be **original** (written for Omed Scripture) or under a documented,
  compatible license.
- Cross-references and study prompts reference **passages only** — never embed
  Bible text or copied commentary.
- Study prompts stay short, open-ended, non-doctrinaire; nothing is inserted into
  a user's work automatically.

## Adding reading plans
- Reference passages with day titles; no copied Bible text or long commentary.
- Keep ids unique, `readings.length === durationDays`, days `1..N`, valid book
  ids (enforced by `readingPlans.test.ts` and `contentIntegrity.test.ts`).
- A plan with no real readings stays `status: 'planned'` (not startable).

## Provenance & citation
Every textual source needs documented provenance. Public-domain claims must be
verifiable. Never assert a license you have not checked.

## What is allowed / forbidden
**Allowed:** public-domain Bible texts (e.g. LSG 1910) with provenance; original
editorial helpers; passage references; API-only translations clearly marked.
**Forbidden:** copyrighted Bible text without license; copied commentaries or
devotionals; third-party cross-reference databases; inventing a license; marking
uncertain content as `publicDomain`.

## What to do if a license is uncertain
- Do **not** integrate the text.
- Mark the translation `api-only` or `external-only`.
- Document the uncertainty in the licenses doc.
- Request human validation before any publication.

## Validation before merge (checklist)
- [ ] `npm run bible:validate` passes (catalog, indexes, book files).
- [ ] `npm test` passes (`contentIntegrity.test.ts`, plan/cross-ref/prompt tests).
- [ ] New translation metadata is honest (availability/offline/completeness).
- [ ] Licenses/provenance recorded in `docs/BIBLE_RIGHTS_AND_LICENSES.md`.
- [ ] No copyrighted text or third-party database added.
- [ ] No bundled large Bible JSON in `src/` (packs live in `public/`).
