# inventory/integrations — sistemas externos

> Foundation `PHASE 5` · 2026-08-13

| Integración | Cómo | Dónde | Qué pasa si falta |
|:---|:---|:---|:---|
| **git** | `execFileSync('git', …)` | `verify-fdge` (frescura del estado, `SUITE-R34`) · `revisar-secretos` (historia) · `plan-layout` (repos anidados, archivos versionados) | Sin repositorio no hay reloj y la frescura **no se exige**: se omite la comprobación, no se inventa |
| **GitHub · issues** | CLI `gh` | `tracker.mjs`, adaptador `github` | Si la plataforma está declarada y `gh` no está autenticado, `tracker` sale con `2` y dice cómo autenticarse |
| **GitHub Actions** | `verificacion.yml` en push, PR y manual · `publicar.yml` solo manual | `.github/workflows/` | La verificación deja de bloquear: el marco podría publicarse sin certificarse |
| **npm (registro)** | `npm publish --provenance --access public` · `npm view` para comprobar que la versión no existe | `publicar.yml` | No se publica |
| **npm (OIDC / Trusted Publisher)** | GitHub se autentica con `id-token: write`; no hay token almacenado | `publicar.yml:26` y `:64-72` | La publicación falla en el paso de `npm publish`. Requiere configuración única en npmjs.com, **fuera de este repositorio** |
| **Azure DevOps** | Contrato declarado, **sin implementar a propósito** | `tracker.mjs`, adaptador `azure` | Lanza con un mensaje que lo explica. Ver `TD-07` |
| **graphify (python)** | `/graphify` produce `graphify-out/graph.json`; la frescura vive en `REGISTRY.graph` | `FDGE-R43` · `FND-R14` | El grafo queda `MISSING` y bloquea `G2` en los PT `MAJOR` |
| **Claude Code** | Es el ejecutor del marco: lee `CORE.md` y conduce las fases. `.claude/settings.json` acota su alcance | Todo el procedimiento | Sin agente, los documentos siguen siendo válidos y los verificadores siguen corriendo; lo que se pierde es quien los ejecuta |

**Ninguna integración es una dependencia de código.** Todas se invocan como procesos externos o
son configuración: `package.json` no declara ni una dependencia (`RULE-04`).
