# PT-021 — Diseño   `PHASE 4` · `FDGE-R21`

```js
const LOTE_COMPLETO = new Set(['DONE', 'CLOSED']);
...
if (dest.id === yo?.epic && LOTE_COMPLETO.has(dest.status)) continue;
```

Lo que cambia es **cuándo** un lote deja de ser una promesa. No cambia qué se exige.

| Estado del lote citado | Antes | Ahora | Por qué |
|:---|:---|:---|:---|
| `DRAFT` | falla | falla | es una intención |
| `IN_PROGRESS` | falla | falla | es una intención |
| `DONE` | **falla** | pasa | el trabajo está hecho y espera al humano en `G4` |
| `CLOSED` | pasa | pasa | ya pasó por él |

`SUITE-R44` en `RULES.md` se reescribe entera: además de este cambio, seguía describiendo la
lista de palabras que `PT-018` quitó del código.
