# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

## Implementación abierta

`EP-001` · **El marco se hace cumplir a sí mismo** · `IN_PROGRESS` · issue
[#2](https://github.com/a81Biz/cauce/issues/2)

`G1` resuelta **PASS** el 2026-08-13. Firma única y severidades declaradas por delegación
explícita, con constancia en §4 del intake del lote.

## PTs vivos

| Orden | PT | Tipo | Sev | Estado | Fase | Issue |
|:--|:---|:---|:---|:---|:---|:---|
| 1 | PT-004 | BUG | S2 | READY | PHASE 2 | [#6](https://github.com/a81Biz/cauce/issues/6) |
| 2 | PT-001 | BUG | S2 | READY | PHASE 1 · completa | [#3](https://github.com/a81Biz/cauce/issues/3) |
| 3 | PT-002 | BUG | S3 | READY | PHASE 1 · completa | [#4](https://github.com/a81Biz/cauce/issues/4) |
| 4 | PT-003 | INVESTIGATION | S3 | READY | PHASE 1 · completa | [#5](https://github.com/a81Biz/cauce/issues/5) |

## Solapamiento y orden de ejecución   `FDGE-R40` · `EXEC-R08`

```
Pares que comparten archivos:
  PT-004 ↔ PT-001   verify-fdge.mjs · selftest.sh   → SERIALIZADOS
  PT-004 ↔ PT-002   selftest.sh                     → SERIALIZADOS
  PT-001 ↔ PT-002   selftest.sh                     → SERIALIZADOS
  PT-003            no toca ningún archivo          → sin solapamiento

Orden:  1. PT-004   2. PT-001   3. PT-002   4. PT-003
```

`PT-004` va primero por dependencia de compuerta: mientras `verify-fdge` esté en rojo por
exigir artefactos de fases no alcanzadas, ninguna de las otras tareas puede demostrar que
dejó la compuerta verde.

Ejecución **secuencial**. El lote entero se detiene ante el primer `BLOCKED` o el primer
fallo de compuerta no resuelto (`FDGE-R41`).
