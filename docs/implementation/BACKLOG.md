# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

## Implementación abierta

`EP-002` · **GitHub responde qué va cuándo, sin abrir el repositorio** · `IN_PROGRESS` ·
issue [#9](https://github.com/a81Biz/cauce/issues/9) · `G1` PASS

## PTs vivos

| Orden | PT | Tipo | Sev | Estado | Fase | Issue |
|:--|:---|:---|:---|:---|:---|:---|
| 1 | PT-006 | CHORE | S3 | READY | PHASE 1 | [#10](https://github.com/a81Biz/cauce/issues/10) |
| 2 | PT-007 | FEATURE | S3 | READY | PHASE 1 | [#11](https://github.com/a81Biz/cauce/issues/11) |
| 3 | PT-008 | FEATURE | S2 | READY | PHASE 1 | [#12](https://github.com/a81Biz/cauce/issues/12) |

## Solapamiento y orden   `FDGE-R40` · `EXEC-R08`

```
PT-006 ↔ PT-007   tracker.mjs · selftest.sh                 → SERIALIZADOS
PT-006 ↔ PT-008   verify-fdge.mjs · RULES.md · selftest.sh  → SERIALIZADOS
PT-007 ↔ PT-008   tracker.mjs · selftest.sh                 → SERIALIZADOS

Orden:  1. PT-006   2. PT-007   3. PT-008
```

Los tres tocan `tracker.mjs` o `verify-fdge.mjs`, así que van en serie. Dentro de la serie el
orden es por dependencia: `PT-006` deja el contrato dicho donde manda y es lo que los otros dos
espejan; `PT-008` va al final porque necesita que el issue ya lleve estado.

## Lote anterior

`EP-001` · `DONE` · issue [#2](https://github.com/a81Biz/cauce/issues/2) — esperando `G4` en el
PR [#7](https://github.com/a81Biz/cauce/pull/7). Sus cinco tareas cerradas; pasan a
`INTEGRATED` tras el merge (`FDGE-R35`).
