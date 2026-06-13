# Bible rights and licenses

Omed Scripture must treat Bible text as licensed content, not as filler data.

## Static translations included
Static packs live under `public/bibles/` and are indexed by `public/bibles/catalog.json`. Each pack should have a clear source, language, scope and license/public-domain status before being distributed.

## API-only translations
Some translations may be available only through external APIs or user-provided sources. Do not cache or redistribute API-only text unless the provider license permits it.

## Rule for protected translations
Do not add copyrighted or protected Bible translations to the repository without written permission or a license that explicitly allows redistribution in this form.

## Adding a translation legally
1. Identify source, copyright holder and license.
2. Confirm redistribution, offline caching and search indexing are allowed.
3. Document attribution and limits in this file and/or `docs/BIBLE_DATA.md`.
4. Add only the permitted scope.
5. Run `npm run bible:build` and QA Reader/Search/offline behavior.

## Partial packs
If a pack is partial, the UI and documentation should describe that limitation honestly so testers do not assume full Bible coverage.

## Original editorial content (cross-references & study prompts)
`src/data/crossReferences.ts` and `src/data/studyPrompts.ts` are **original**
content written for Omed Scripture. They contain **no Bible text and no
third-party material**:
- Cross-references list only passage coordinates (book / chapter / verse) linked
  by an obvious theme. No external cross-reference database is copied.
- Study prompts are short, open-ended questions (Observation / Interpretation /
  Application / Prayer). No commentary or devotional is copied; nothing is forced
  into the user's notes.

These structures are ready to receive additional, **licensed and documented**
data later, following `docs/CONTENT_GOVERNANCE.md`.
