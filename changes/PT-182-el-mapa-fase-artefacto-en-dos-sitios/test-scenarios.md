# `PT-182` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | el mapa | `ARTEFACTO_DE_FASE[1]` | `intake.md` |
| TS-02 | `PHASE 6` | `faltaDeFase(6, …)` | pide `manifest.json` y `self-review.md` |
| TS-03 | fase completa | todo presente | no falta nada |
| TS-04 | fase sin artefacto | `faltaDeFase(2, …)` | `null` — no se sabe, no se inventa |
| TS-05 | `avanzar` sin traceability | `PHASE 4` → `5` | **se niega**, y dice qué falta |
| TS-06 | y cita su origen | el mensaje | nombra `PT-182` |
| TS-07 | fase sin artefacto | `PHASE 2` → `3` | **no** bloquea |

**Dónde viven**: selftest §EP-024 · 7 casos.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
