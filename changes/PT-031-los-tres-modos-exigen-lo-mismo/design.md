# PT-031 — Diseño   `PHASE 4` · `FDGE-R21`

`EXEC-R08` en `EXECUTION-MODES.md` — su documento propietario; `verify-suite` rechaza definir
una regla `EXEC-*` en `RULES.md` con severidad, y tiene razón (`LEX-R22`).

En `verify-suite.mjs`:

```js
const RE_ARTEFACTO = /\b[a-z0-9-]+\.(?:md|json|mjs|sh)\b/i;
const RE_REGLA     = /\b(?:SUITE|FDGE|INTAKE|LEX|FND|QA|PTSA|EXEC)-R\d+\b/;
// por cada celda de la matriz, salvo la etiqueta de fila
```

| Encuentra | Significa |
|:---|:---|
| un artefacto | ese modo pide o exime algo distinto |
| una regla | ese modo trata una regla distinto |
| `G4` sin `humano` en las tres | `EXEC-R04` roto |

La etiqueta de fila se excluye: ahí sí se nombra la compuerta.
