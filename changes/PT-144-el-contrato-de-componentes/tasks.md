# PT-144 · `tasks.md` — `PHASE 4` Proposal

> Una subtarea, un objetivo único, su validación y sus archivos.
> **El campo `Archivos` es lo que hace computable el solapamiento del lote** (`FDGE-R40`).

## Archivos que toca esta tarea, en total

```
docs/methodology/tools/patrones.mjs          <- SOLAPA con PT-150 (serializados, EP-022 §6)
docs/methodology/tools/verify-patrones.mjs
```

Ningún otro. Las cuatro herramientas del lote son `PT-145`, `PT-146` y `PT-147`.

---

## `PT-144.1` — los tests de contrato, en rojo

| | |
|:---|:---|
| **Objetivo** | Que exista una comprobación que **falle** hoy, antes de que exista lo comprobado (`FDGE-R17`) |
| **Input** | `design.md` §6 · el precedente de `selloDe` en `verify-patrones.mjs:60-68` |
| **Output** | Aserciones nuevas en `verify-patrones.mjs`, **en rojo** |
| **Validación** | `node docs/methodology/tools/verify-patrones.mjs` sale **1** y nombra `SUITE-R38` |
| **Archivos** | `tools/verify-patrones.mjs` |
| **Cubre** | `RC-04`, `AC-03` |
| **Estado** | `PENDIENTE` |

Va primera. Un contrato escrito antes que su comprobación se escribe para pasar la comprobación
que venga después, y eso no es una red: es un espejo.

## `PT-144.2` — `FAMILIAS`, con su documento propietario

| | |
|:---|:---|
| **Objetivo** | Las diez familias de reglas, con `prefijo`, `documento` y `orden` |
| **Input** | `RULES.md` §«Dónde vive cada familia de reglas» · `build-core.mjs:171` y `:183` |
| **Output** | `export const FAMILIAS` en `patrones.mjs`, con comentario de contrato |
| **Validación** | `verify-patrones` pasa de rojo a verde en las aserciones de familia · `familiasEnProsa()` devuelve **exactamente** las 7 de `:171` · `ordenDePrefijos()` **exactamente** las 10 de `:183`, en ese orden |
| **Archivos** | `tools/patrones.mjs` |
| **Cubre** | `AC-01`, `AC-02` (parcial), `RC-03` (parcial) |
| **Estado** | `PENDIENTE` |

Va antes que `COMPONENTES` porque es la mitad **medible sin ambigüedad**: sus dos proyecciones
tienen que reproducir dos literales que ya existen, carácter a carácter.

## `PT-144.3` — `COMPONENTES`, con los ocho campos

| | |
|:---|:---|
| **Objetivo** | Los seis componentes, con `sigla` separada de `nombre` y `fases` capaz de decir `SIN_EVALUAR` |
| **Input** | `LEXICON` §3 (fases) · §7 (triggers) · `LEX-R03` (FQAGE/QA) · `FIDE-R01` (opcional) · `SUITE-R25` (overlay de PTSA) · los catorce sitios |
| **Output** | `export const COMPONENTES` + las proyecciones de `design.md` §2 |
| **Validación** | `opcionales()` devuelve `Set(['FIDE'])` · `siglaDe('Foundation') === 'FND'` · `fasesDe('FPGE')` es `SIN_EVALUAR`, **no** un rango · `fasesDe('FIDE')` es `[1,5]` |
| **Archivos** | `tools/patrones.mjs` |
| **Cubre** | `AC-01`, `AC-02`, `AC-05`, `RC-03` |
| **Estado** | `PENDIENTE` |

## `PT-144.4` — la comparación campo a campo contra los catorce sitios

| | |
|:---|:---|
| **Objetivo** | Demostrar que el contrato **no diverge** del literal que va a sustituir |
| **Input** | los catorce sitios enumerados en `EP-022` §1 |
| **Output** | La comparación ejecutada, con su salida capturada como evidencia |
| **Validación** | **cero** discrepancias. Una sola discrepancia detiene la tarea: significaría que `PT-145`..`PT-147` serían cambios de comportamiento disfrazados de refactor |
| **Archivos** | ninguno — es una comprobación, no un cambio |
| **Cubre** | `AC-02`, `RC-03` |
| **Estado** | `PENDIENTE` |

## `PT-144.5` — la prueba del no-cambio

| | |
|:---|:---|
| **Objetivo** | Que ninguna herramienta haya cambiado de comportamiento |
| **Input** | la línea base: `npm run verify` `EXIT=0`, `selftest: OK · 1695 casos` |
| **Output** | La misma salida, y `build-core --check` en verde |
| **Validación** | `npm run verify` da `EXIT=0` con el **mismo** recuento de casos · `CORE.md` y `CORE-PTSA.md` sin diferencia |
| **Archivos** | ninguno |
| **Cubre** | `AC-04`, `RC-01`, `RC-02` |
| **Estado** | `PENDIENTE` |

> **El exit code se lee del comando, no de una tubería.** Está en el `no hacer` del `HANDOFF`
> desde hoy: `npm run verify | grep …` devuelve el código del `grep`, y por poco se canta un
> verde falso sobre nueve divergencias reales.
