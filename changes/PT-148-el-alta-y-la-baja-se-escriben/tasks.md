# PT-148 · `tasks.md` — `PHASE 4` Proposal

## Archivos

```
docs/methodology/LEXICON.md
docs/methodology/RULES.md
docs/methodology/CASOS-DE-USO.md
docs/methodology/CORE.md · CORE-PTSA.md    (generados)
docs/methodology/tools/verify-suite.mjs    el barrido
docs/methodology/tools/selftest.sh
```

## `PT-148.1` — el barrido, en rojo

| | |
|:---|:---|
| **Objetivo** | Que meter un literal de componente en una herramienta **falle** (`FDGE-R17`) |
| **Validación** | El caso en rojo antes de que exista el barrido |
| **Cubre** | `AC-04`, `RC-04` |

Va primero: es lo que permite que la regla nazca `CHECK` y no `HARD`.

## `PT-148.2` — el barrido

| | |
|:---|:---|
| **Validación** | Verde sobre el árbol real · rojo con un literal metido a propósito · **no caza comentarios ni rutas** |
| **Archivos** | `tools/verify-suite.mjs` |
| **Cubre** | `AC-04` |

**El tercer criterio es el que decide si sirve.** Un barrido que caza los comentarios de este
mismo lote se desactivaría en la primera corrida.

## `PT-148.3` — el vocabulario en `LEXICON`

| | |
|:---|:---|
| **Objetivo** | Los ocho campos de `COMPONENTES`, los cuatro de `FAMILIAS`, y la distinción componente/familia |
| **Validación** | `verify-suite` sin vocabulario derogado ni nombres duplicados |
| **Cubre** | `AC-01` |

## `PT-148.4` — la regla en `RULES.md`

| | |
|:---|:---|
| **Validación** | `regla.mjs <ID>` la resuelve · `verify-suite` no la ve duplicada · nace **`CHECK`** porque `PT-148.2` existe |
| **Cubre** | `AC-02` |

## `PT-148.5` — las dos filas del catálogo

| | |
|:---|:---|
| **Objetivo** | `E5` alta y `E6` baja, **citando** la regla por ID, sin enunciarla |
| **Validación** | formato del catálogo · `verify-suite` sin obligaciones fuera de `RULES` |
| **Cubre** | `AC-03` |

## `PT-148.6` — `CORE` regenerado

| | |
|:---|:---|
| **Validación** | `build-core --check` en verde · el `diff` **se lee**, no se supone |
| **Cubre** | `AC-05`, `RC-01` |
