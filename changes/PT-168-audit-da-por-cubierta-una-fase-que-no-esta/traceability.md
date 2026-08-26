# `PT-168` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una fase se da por cubierta sólo **para el componente que se audita** | TS-01 · TS-02 | `selftest` ×2 · fixture `Zeta` | `evidence/PT-168/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | Un componente cuyas fases **sí** están documentadas sigue en verde | TS-03 · TS-05 | `chkno` · `audit` sobre el árbol real | `evidence/PT-168/salidas/audit.out` | n/a | `CUMPLIDO` |
| AC-03 | La cobertura de clase `fase` se recalcula, y si baja, **baja y se dice** | TS-04 | `audit` · la cifra publicada | `evidence/PT-168/salidas/audit.out` | n/a | `CUMPLIDO` |
| AC-04 | Los huecos que aparezcan se **declaran**; arreglarlos no es de esta tarea | TS-05 | `audit` · cero huecos | `evidence/PT-168/salidas/audit.out` | n/a | `CUMPLIDO` |
| AC-05 | `audit` sigue distinguiendo `SIN EVALUAR` de `cubierto` y de `hueco` | TS-04 | los tres estados en la salida | `evidence/PT-168/salidas/audit.out` | n/a | `CUMPLIDO` |

## `AC-03` cumple con una cifra que **no bajó**, y eso hay que decirlo igual

| | Antes | Ahora |
|:---|---:|---:|
| Cobertura de clase `fase` | **52** | **52** |
| Componente sin fases documentadas | **cubierto** | **HUECO** |

Las 52 son las mismas y **ya no significan lo mismo**: antes salían de que el número apareciera en
el documento, ahora de la **sección del componente**. Los seis reales estaban bien documentados, así
que aciertan igual.

**La cifra publicada era correcta por casualidad.** Lo que cambió no es cuánto se cubre, sino que
la cobertura **pueda fallar** — y `AC-03` obliga a decirlo tanto si baja como si no.

## `AC-04` no tuvo que ejercerse

No aparecieron huecos que declarar: el árbol real sigue en verde. Los **seis** que aparecieron en
la primera versión —`FPGE PHASE 2-7`— **no eran huecos**: eran el lector sin reconocer el formato
compacto de `PHASES.md`.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Los seis componentes reales siguen cubiertos | TS-03 · TS-05 | `CUMPLIDO` |
| RC-02 | La anchura `(N de N)` sigue derivándose de `COMPONENTES` | TS-04 | `CUMPLIDO` |
| RC-03 | El archivo propio del componente no se acota | TS-03 | `CUMPLIDO` |
| RC-04 | `SIN EVALUAR` sigue siendo distinguible de cubierto y de hueco | AC-05 | `CUMPLIDO` |

**`RC-03` nació de un error propio**: acotar el archivo propio produjo **46 huecos falsos** en la
primera corrida — el mismo defecto que se estaba arreglando, con el signo cambiado.

## Lo que esta tarea destapó, y **tiene tarea**

Nada nuevo. Lo que apareció fue **dentro de la propia sección**: `FPGE PHASE 1` pasaba porque su
sección cita *«Entrega a FDGE `PHASE 1` (Intake)»* — la fase de **otro** componente. El defecto
original, en miniatura, y lo cierra el mismo acotado.
