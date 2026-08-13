# PT-018 — Trazabilidad   `PHASE 4` · `FDGE-R24`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | RE_APLAZA no existe en el codigo | E2 E3 | grep RE_APLAZA tools/ sin resultados | salidas/verify-fdge-all.txt | - | VERIFICADO |
| AC-02 | Una fila en prosa falla | E2 | selftest.sh - «SUITE-R44 ya no adivina sobre prosa» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Prosa sin palabra reconocible tambien falla | E3 | selftest.sh - «otra prosa cualquiera, tambien» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Citar el propio lote abierto falla | E5 | selftest.sh - «el propio lote abierto no vale» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | Un DEFERRED que reconoce su origen vale | E8 | selftest.sh - «si reconoce su origen, pasa» | salidas/selftest.txt | - | VERIFICADO |
| AC-06 | Citar a cualquiera sin reciprocidad falla | E7 | selftest.sh - «citar a cualquiera ya no basta» - «si no reconoce su origen, falla» | salidas/selftest.txt | - | VERIFICADO |
| AC-07 | El repositorio entero cumple la gramatica | E1 E4 E6 E9 | verify-fdge --all - avisos SUITE-R44: 0 - ejecucion real PT-019/#26 y PT-020/#27 | salidas/verify-fdge-all.txt salidas/espejo.txt | - | VERIFICADO |

## Lo que apareció al aplicarla

La gramática encontró dos filas más que aplazaban trabajo sin asignarlo, y ninguna la habría
visto la versión anterior:

```
PT-004  «ampliar el grafo a tools/»                 → PT-020 · #27
        migrar el proyecto legado — sin fila propia  → PT-019 · #26
```

`PT-019` es **el trabajo con el que se abrió esta sesión** y no estaba asignado en ninguna
parte. Que aparezca al aplicar la regla es la prueba de la tarea.

## Corrección respecto al intake

El intake decía «un caso nuevo en `selftest`». Son **seis**, y uno viejo de `PT-013` se
sustituye: afirmaba que citar cualquier allocation basta, que es justo lo que este PT deroga.
Un aserto que exige el comportamiento viejo lo perpetúa.
