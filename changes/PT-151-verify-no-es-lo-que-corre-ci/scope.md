# `PT-151` · `scope.md` — `PHASE 2-R`

## Lo medido

| Paso | `verify` | CI |
|:---|:---:|:---:|
| `verify:patrones` · `verify:suite` · `core:check` · `audit` · `selftest` · `espejo` | ✓ | ✓ |
| **`verify-fdge --all`** | **no** | sí |
| **`revisar-secretos`** | sin `--historial` | **con** |
| **`matriz:check`** | **sí** | **no** |

**Tres divergencias, y la tercera en sentido contrario.**

## Qué se toca

| Archivo | Qué cambia |
|:---|:---|
| `package.json` | `verify:fdge` nuevo · `verify:secretos` gana `--historial` · la cadena de `verify` |
| `verificacion.yml` · `publicar.yml` | invocan `npm run <script>`, no la herramienta |
| `verificacion.yml` | gana `matriz:check`, que corría sólo en local |
| `patrones.mjs` | `pasosDeCI()` · `pasosDeVerify()` |
| `verify-fdge.mjs` | `checkVerifyEsCI()`, en los **dos** sentidos |
| `RULES.md` | `SUITE-R62` |
| `PHASES.md` · `FDGE-Prompts.md` | la citan |
| `CLAUDE.md` | deja de prometer lo que no cumplía |

## Qué NO se toca

**Qué comprueba CI.** Se iguala lo local a lo remoto, no al revés — salvo `matriz:check`, que
**faltaba** en CI y su rojo no lo veía nadie en el PR.

**Partir la batería en perfiles rápidos.** Es razonable y es otra tarea; `PT-169` ya abarató
`--solo`, que es la mitad del problema.
