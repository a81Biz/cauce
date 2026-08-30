# `PT-187` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La divergencia entre las cuatro fuentes se **enumera**, con dirección | TS-01 · TS-05 | selftest §EP-026 | evidence/PT-187/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Sin acceso a npm, **se dice** — no se da por cuadrado | TS-02 · TS-03 | selftest §EP-026 | evidence/PT-187/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Una diferencia legítima —tag sin publicar— **no** bloquea | TS-04 | selftest §EP-026 | evidence/PT-187/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-02` lleva dos escenarios porque el fallo va en dos direcciones

`TS-02` fija que sin red **se dice**. `TS-03` fija que **aun así se dice lo que sí se puede** —
sin él, una herramienta que se apague entera cumple `AC-02` y apaga lo que no dependía de la red.
`SUITE-R22` declara soportado el proyecto sin ella.

## Las cifras del intake estaban mal, y se corrigen en `discovery.md`

| El intake decía | Medido |
|:---|:---|
| tres tags sin publicar | **siete** |
| tres publicadas sin `CHANGELOG` | **ninguna** |
| *(no lo veía)* | **28 de 47** entradas del `CHANGELOG` sin tag |

Venían del `HANDOFF` de una medición anterior: `CE-010`, la cifra transcrita que caduca. Por eso
`TS-05` fija que se **deriven**.
