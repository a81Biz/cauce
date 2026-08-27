# `PT-169` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Se mide el tiempo **antes** y **después**, y se publica la cifra | TS-05 | dos corridas cronometradas | `evidence/PT-169/salidas/duracion.out` | n/a | `CUMPLIDO` |
| AC-02 | Un fixture cuya mutación no cambia el archivo se caza | TS-01 · TS-02 · TS-03 | `selftest` ×3 | `evidence/PT-169/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-04 | Los casos retirados se cuentan por patrón y ninguno se borra sin decir por qué | TS-07 | `regla.mjs SUITE-R61` · el bloque `PODA` de `PHASES` | `evidence/PT-169/salidas/regla.out` | n/a | `CUMPLIDO` |
| AC-05 | Existe la regla, con ID, severidad y disparador declarado | TS-07 | `regla.mjs SUITE-R61` | `evidence/PT-169/salidas/regla.out` | n/a | `CUMPLIDO` |
| AC-06 | La regla **puede fallar**: hay un script que la comprueba | TS-01 · TS-06 · TS-07 | `audit.mjs` · `selftest` | `evidence/PT-169/salidas/audit.out` | n/a | `CUMPLIDO` |
| AC-07 | Ningún caso vivo cambia de veredicto por la poda | TS-04 | la batería completa | `evidence/PT-169/salidas/bateria.out` | n/a | `CUMPLIDO` |

## `AC-03` salió del alcance, y `FDGE-R15` fue quien lo obligó

Se escribió primero como `AC` marcado **«no cumplido — declarado»**, creyendo que declarar la
ausencia bastaba. `verify-fdge` lo rechazó como **Orphan Criterion**, y tenía razón: un criterio
sin escenario **es un criterio que nadie comprueba**, y anotarlo como incumplido lo deja igual de
huérfano mientras aparenta rigor.

**O es criterio y tiene prueba, o no es criterio de esta tarea.** Salió a `out-of-scope` con
destino `PT-167`, mediante la Revisión 1 del intake — no borrándolo, que es lo que `SUITE-R09`
impide.

**`AC-04` casi cae en lo mismo.** Estaba escrito como *«cumplido por la regla»* sin `TS`. Lo que de
verdad lo sostiene es que la regla **exista y sea citable** —`regla.mjs SUITE-R61` la resuelve y
`PHASES` la cita en el cierre—, que es `TS-07`.

## `AC-01` cumple con una cifra que no es la que se esperaba

| | |
|:---|:---|
| Batería completa | **1 415 445 ms · 23,6 min** — sin cambio |
| `--solo`, cualquier patrón | **252 373 → 47 466 ms** |

**La corrida completa no se abarató.** Lo que se abarató es **iterar**, que es lo que el firmante
describió: *«tarda veinte minutos en mandar el error de uno solo»*. Decir que la batería «va más
rápida» sería falso.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | El universo de casos no cambia por acotar | `1749 → 1752`, **sólo los tres nuevos** | `CUMPLIDO` |
| RC-02 | `--afectados` sigue funcionando como antes | sus guardas ahora leen `ACOTADO`, que él marca | `CUMPLIDO` |
| RC-03 | `seccionesDelArnes` no cambia para quien ya la usa | el campo nuevo es aditivo | `CUMPLIDO` |
| RC-04 | Ninguna regla existente cambia | `verify-suite` | `CUMPLIDO` |

**`RC-01` es el que hizo revertir un cambio.** Reutilizar el esqueleto bajaba el suelo a 41,6 s y
dejaba el universo en **1730**: diecinueve casos dejaban de ejecutarse. Seis segundos no valen
cambiar lo que la batería mide.

## Lo que esta tarea destapó, y **tiene tarea**

- **`PT-171`** — con las secciones acotadas, órdenes de primer nivel escriben en `stderr` sobre el
  esqueleto. No altera veredictos; es ruido que puede tapar un mensaje real.
