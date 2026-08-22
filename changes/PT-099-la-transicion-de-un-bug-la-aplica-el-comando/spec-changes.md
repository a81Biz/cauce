# Spec changes — `PT-099`

## Ninguna regla nueva

`LEX-R08` y `FDGE-R26` ya existen y ya dicen lo que hace falta. Lo que faltaba era **quien las
aplicara** y **quien las comprobara**.

## `RIGE_DESDE` — sí, y es lo importante

La comprobación de `AC-03` es **nueva** aunque la regla no lo sea, y juzgaría 51 `BUG` que nunca
pasaron por `VALIDATION_PENDING` porque nadie los llevó. Sin la fila, los 51 saldrían en rojo **sin
salida**: un estado por el que no se pasó no se puede retrofechar.

Es exactamente `EXEC-R04a` en `PT-095`, y la razón de que `L-5` exista.

## Contratos internos

```
tracker.mjs   + export function estadoDeFase(a, destino, ctx) -> string | null
```

Extiende `estadoTerminalDe` (`PT-098`) en vez de añadir un segundo escritor de `status`.
`null` = «no se toca».
