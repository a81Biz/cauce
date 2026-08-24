# `PT-136` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza**.

---

## Ningún documento normativo cambia su obligación

`FDGE-R26` ya dice que un `BUG` se detiene en `VALIDATION_PENDING` y que sólo un humano lo lleva a
`DONE`. `LEX-R08` ya fija la transición. `SUITE-R45` ya dice cuándo cierra un lote. `PHASE 9` ya
describe el orden.

**Todo estaba escrito. Lo que no existía era algo que lo ejecutara** — y por eso las tres únicas
validaciones anteriores se escribieron a mano.

Es `P-003` de la Declaración de Valor, no `P-001`.

## Lo que sí cambia, y no es normativo

| Dónde | Qué |
|:---|:---|
| `tools/tracker.mjs` | `validar` — la validación humana de un `BUG`, registrada y contrastable |
| `tools/tracker.mjs` | `integrar` acepta un lote: `READY` → `CLOSED` si ninguna tarea sigue viva |
| `tools/tracker.mjs` | los dos en `SIN_PLATAFORMA` |

## Autoridad

`FDGE-R26` · la validación de un `BUG` es humana.
`LEX-R08` · la transición va de `VALIDATION_PENDING` a `DONE`.
`SUITE-R27` · la firma se contrasta contra la lista.
`SUITE-R45` · un lote declara qué se hace al cerrarlo.
