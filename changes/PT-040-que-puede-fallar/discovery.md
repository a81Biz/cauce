# PT-040 — Descubrimiento   `PHASE 2` · `FDGE-R42`

La tabla del manual estaba escrita DE MEMORIA. Cada `fail()` y cada `warn()` del código lleva su regla: la lista es **derivable** (`RULE-01`). Una escrita a mano se queda corta en cuanto alguien añade una comprobación — y ya se había quedado.

## La fuente que ya existe

```
grep -oE "(fail|warn)\('[A-Z]+-R[0-9]+'" tools/*.mjs   →  90 reglas distintas
```

Noventa reglas emiten fallos con su nombre y **ninguna es consultable**. El dato estaba en el
código; lo que faltaba era preguntárselo.
