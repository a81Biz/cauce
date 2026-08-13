# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

## Implementación abierta

`EP-003` · **El issue se lee sin salir de GitHub** · `IN_PROGRESS` ·
issue [#13](https://github.com/a81Biz/cauce/issues/13) · `G1` PASS

## PTs vivos

| Orden | PT | Tipo | Sev | Estado | Fase | Issue |
|:--|:---|:---|:---|:---|:---|:---|
| 1 | PT-009 | BUG | S2 | READY | PHASE 1 | [#14](https://github.com/a81Biz/cauce/issues/14) |
| 2 | PT-010 | BUG | S2 | READY | PHASE 1 | [#15](https://github.com/a81Biz/cauce/issues/15) |

`G3` de las dos es **humana**: son `BUG` y `SUITE-R06b` no lo automatiza ningún modo.

## Solapamiento y orden   `FDGE-R40` · `EXEC-R08`

```
PT-009 ↔ PT-010   tracker.mjs · selftest.sh   → SERIALIZADOS
Orden:  1. PT-009   2. PT-010
```

`PT-009` primero: pone la compuerta en verde y es de una línea. Dejar el rojo mientras se
trabaja en lo otro obliga a leer cada verificación preguntándose si el error es el viejo o
uno nuevo.

## Lotes anteriores

`EP-001` y `EP-002`, ambos `CLOSED`, integrados en `main` con el PR
[#7](https://github.com/a81Biz/cauce/pull/7). La `6.0.0` está **sin publicar**.
