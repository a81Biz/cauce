# `PT-181` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Existe una forma de declarar una expectativa **literal** | TS-01 | selftest §EP-026 · `chkl casa el texto literal` | evidence/PT-181/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Un literal con `.` **no** casa cualquier carácter | TS-02 | selftest §EP-026 · `…y un punto literal NO casa otro caracter` · `…mientras que chk SI lo casa` | evidence/PT-181/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Las expectativas que hoy son regex a propósito **siguen funcionando** | TS-03 · TS-04 | selftest §EP-026 · `chk sigue interpretando la regex` · `la cifra de ambiguas se declara` · y los 1400+ casos de la corrida completa | evidence/PT-181/salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-02` necesita sus DOS mitades

Que `chkl` **no** case es la mitad fácil: lo cumple un `chkl` roto que no case nunca. La otra mitad
—que `chk`, con la **misma** expectativa, **sí** case— es la que prueba que `chkl` hace algo
distinto. Las dos están en la tabla.

## `AC-03` se apoya en la corrida entera

Los 1400+ casos que usan `chk` y siguen en verde son la evidencia de que no se rompió nada. El caso
explícito fija el mecanismo; la corrida fija el alcance.

## Lo declarado sin cubrir

Las **96** expectativas ambiguas no se migran ni se auditan (intake §4, `strategy.md §2`). Y la
cifra es una **heurística**, no una auditoría (`discovery.md §6`).
