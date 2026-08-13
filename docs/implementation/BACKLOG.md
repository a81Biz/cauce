# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

## Implementación abierta

`EP-001` · **El marco se hace cumplir a sí mismo** · estado `DRAFT` — no pasa a
`IN_PROGRESS` hasta que `G1` resuelva PASS.

## PTs vivos

| PT | Tipo | Sev | Estado | Fase | Implementación |
|:---|:---|:---|:---|:---|:---|
| PT-001 | BUG | *pendiente* | DRAFT | PHASE 1 · G1 | EP-001 |
| PT-002 | BUG | *pendiente* | DRAFT | PHASE 1 · G1 | EP-001 |
| PT-003 | INVESTIGATION | *pendiente* | DRAFT | PHASE 1 · G1 | EP-001 |

La severidad la declara el humano (`INTAKE-R04`) y es uno de los dos campos que bloquean
`G1`. El otro es la firma única (`INTAKE-R06`).

## Solapamiento y orden de ejecución   `FDGE-R40` · `EXEC-R08`

```
Pares que comparten archivos:
  PT-001 ↔ PT-002   docs/methodology/tools/selftest.sh   → SERIALIZADOS
  PT-003            no toca ningún archivo               → sin solapamiento

Orden:  1. PT-001   2. PT-002   3. PT-003
Motivo: solapamiento en selftest.sh entre 1 y 2; PT-003 al final por dependencia técnica
        — decide sobre el contrato que PT-001 vuelve exigible.
```

Ejecución **secuencial**. El lote entero se detiene ante el primer `BLOCKED` o el primer
fallo de compuerta no resuelto (`FDGE-R41`).
