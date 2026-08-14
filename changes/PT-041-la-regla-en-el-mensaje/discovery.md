# PT-041 — Descubrimiento   `PHASE 2` · `FDGE-R42`

Un mensaje de fallo dice `✗ SUITE-R44` y ahí se acaba. El manual proponía **deducir** la regla de diez principios: eso no escala a 179 reglas y es una excusa, no una solución.

## La fuente que ya existe

```
grep -oE "(fail|warn)\('[A-Z]+-R[0-9]+'" tools/*.mjs   →  90 reglas distintas
```

Noventa reglas emiten fallos con su nombre y **ninguna es consultable**. El dato estaba en el
código; lo que faltaba era preguntárselo.
