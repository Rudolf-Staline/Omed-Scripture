# BaseKit (vendorisé)

Ce dossier contient une copie **vendorisée** de la bibliothèque UI générique
[BaseKit](https://github.com/Rudolf-Staline/Base) consommée par Omed Scripture.

- Source : `Rudolf-Staline/Base`
- Commit d'origine : voir [`SOURCE_COMMIT.txt`](./SOURCE_COMMIT.txt)
- Paquets inclus : `@basekit/tokens`, `@basekit/core`, `@basekit/ui`, `@basekit/api`

## Pourquoi vendoriser ?

BaseKit n'est pas publié sur npm. Plutôt que d'utiliser un submodule git (fragile
sur Vercel et en CI éphémère) ou de basculer Omed sur un workspace pnpm, on copie
ici **la source et le `dist` pré-compilé** de chaque paquet. Omed reste sur npm,
les scripts existants ne changent pas, et le déploiement Vercel fonctionne sans
étape de build supplémentaire pour BaseKit.

La résolution `@basekit/*` se fait via des alias :

- `vite.config.ts` → `resolve.alias` (dev / build / tests)
- `tsconfig.app.json` → `compilerOptions.paths` (type-check, vers les `.d.ts`)

`skipLibCheck` garde les internes de BaseKit hors du type-check de l'application.

## Ne pas modifier

Cette copie est consommée telle quelle. **Ne modifiez pas** la logique interne de
BaseKit ici : Omed consomme BaseKit, il ne le transforme pas. Toute évolution doit
être faite en amont dans le repo `Base`, puis re-synchronisée (voir ci-dessous).

## Re-synchroniser depuis le repo Base

```bash
# 1. Cloner et construire BaseKit
git clone https://github.com/Rudolf-Staline/Base.git /tmp/base
cd /tmp/base && pnpm install
pnpm -r --filter "@basekit/tokens" --filter "@basekit/core" \
        --filter "@basekit/ui" --filter "@basekit/api" run build

# 2. Recopier src + dist de chaque paquet dans vendor/basekit/packages/<pkg>/
#    (tokens, core, ui, api), puis mettre à jour SOURCE_COMMIT.txt.
```

Le `dist` est volontairement versionné (l'ignore global `dist` du `.gitignore` est
limité à la racine du projet via `/dist`).
