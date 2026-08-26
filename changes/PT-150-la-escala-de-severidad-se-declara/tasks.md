# PT-150 · `tasks.md` — `PHASE 4` Proposal

## Archivos que toca

```
docs/methodology/tools/patrones.mjs         <- SOLAPA con PT-144 (ya DONE, serializados)
docs/methodology/tools/verify-patrones.mjs
docs/methodology/tools/tracker.mjs
docs/methodology/tools/verify-fdge.mjs
docs/methodology/tools/selftest.sh
```

`INTAKE/templates/` **no** entra: la plantilla es correcta (`design.md` §4).

---

## `PT-150.1` — el test que reproduce, en rojo

| | |
|:---|:---|
| **Objetivo** | Un caso que falle **hoy** y demuestre el defecto, antes de tocarlo (`FDGE-R17`, y para un `BUG` es obligatorio) |
| **Output** | Casos en `selftest.sh`: `asignar --severidad S4` funciona · `S0` se rechaza · el mensaje no atribuye a `LEXICON` lo que no declara · el valor por defecto de `CHANGE-REQUEST.md` es aceptable |
| **Validación** | Los cuatro **en rojo** |
| **Archivos** | `tools/selftest.sh` |
| **Cubre** | `AC-03`, `AC-04`, `AC-05` |

El cuarto caso es el que ata el defecto al paquete: lee el valor por defecto **de la plantilla**,
no un `S4` escrito en el test. Copiarlo compararía lo escrito contra lo escrito.

## `PT-150.2` — `SEVERIDADES` en `patrones.mjs`

| | |
|:---|:---|
| **Objetivo** | La escala, una sola vez, con contrato y aserciones |
| **Output** | `SEVERIDADES`, `esSeveridad()`, `RE_SEVERIDAD` construida (`SUITE-R59`) + su bloque en `verify-patrones` |
| **Validación** | Romper la escala hace fallar `verify-patrones` **por aserción** · `RE_SEVERIDAD` casa `S1..S4` y **no** casa `S0`, `S9` ni vacío |
| **Archivos** | `tools/patrones.mjs` · `tools/verify-patrones.mjs` |
| **Cubre** | `AC-01`, `AC-02` |

## `PT-150.3` — `tracker` consume la escala

| | |
|:---|:---|
| **Objetivo** | Que el literal desaparezca y el mensaje deje de mentir |
| **Validación** | `grep 'S0'` en `tracker.mjs`: cero · los tres primeros casos de `PT-150.1` en verde |
| **Archivos** | `tools/tracker.mjs` |
| **Cubre** | `AC-01`, `AC-03`, `AC-04`, `AC-05` |

## `PT-150.4` — `verify-fdge` deja de escribir la clase `[1-4]`

| | |
|:---|:---|
| **Objetivo** | Que el regex se construya desde la escala, no la codifique |
| **Validación** | `severity: S9` y `severity:` vacío siguen sin casar · las 1703 comprobaciones siguen · un `S0` en trabajo **vivo** se caza |
| **Archivos** | `tools/verify-fdge.mjs` |
| **Cubre** | `AC-01`, `AC-07` |

## `PT-150.5` — lo integrado no se rejuzga

| | |
|:---|:---|
| **Objetivo** | Demostrar que las cinco allocations históricas siguen intactas y **no** salen en rojo |
| **Validación** | `verify-fdge` sin errores sobre `PT-107` y los cuatro `S4` · sus entradas en `REGISTRY.json` sin un solo byte cambiado |
| **Archivos** | ninguno — es una comprobación |
| **Cubre** | `AC-06` |

Es el criterio que más fácil se incumple con buena intención: la tentación al arreglar esto es
«dejar el registro limpio», y esas cinco entradas **son la evidencia de que el defecto existió**.
