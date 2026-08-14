# PT-035 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Toda tarea con epic es sub-issue de su lote | E1 | ejecucion real: 24 tareas anidadas bajo siete lotes | salidas/arbol-real.txt | - | VERIFICADO |
| AC-02 | Se calcula lo que falta sin repetir | E2 E3 | selftest.sh - «y no repite el que ya esta» - «nombra hijo y padre» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Si la plataforma no sabe, no se afirma | E4 E5 | selftest.sh - «sin saber, no se afirma que falte» - «una tarea sin lote no se anida» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Se aplica a la historia ya cerrada | E1 | ejecucion real: EP-001 a EP-008, incluidos los CLOSED | salidas/arbol-real.txt | - | VERIFICADO |
| AC-05 | La jerarquia sigue saliendo del registro | E6 E7 | selftest.sh - «SUITE-R51 existe en RULES» - «y llega al nucleo» | salidas/selftest.txt | - | VERIFICADO |
