# PT-026 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | En la rama por defecto informa y no bloquea | E6 E7 | selftest.sh - «el tracker distingue la rama» - «ante la duda, bloquea» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Fuera de ella sigue bloqueando igual | E1 E2 E3 | selftest.sh - «la divergencia se detecta igual» - «y dice que etiqueta sobra o falta» - «sin divergencia no inventa ninguna» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Cuando informa dice por que y donde si se comprueba | E4 E5 | selftest.sh - «SUITE-R47 existe en RULES» - «llega al nucleo» - «PHASES dice donde bloquea» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | La comprobacion sigue viva en G4 | E8 | verify-fdge --gate G4 sobre las tareas del lote, en la rama de trabajo | salidas/g4.txt | - | VERIFICADO |

## Lo que la compuerta me corrigio

El intake tenia un `AC-05`: «la CI de main queda verde tras el merge». `FDGE-R15` lo rechazo por
no tener escenario ni evidencia, y tiene razon: **no es un criterio de esta tarea**, es
verificacion posterior al merge. No se puede comprobar antes de que ocurra, y dejarlo como AC
obligaba a escribirlo en verde o a bloquear la compuerta para siempre.

Va donde le corresponde: al `## Cierre del lote` de `EP-006` (`SUITE-R45`), que es exactamente
la seccion que existe para lo que se resuelve al cerrar y no en ninguna tarea.
