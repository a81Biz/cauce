# PT-024 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | No cierra si el estado terminal no esta en la rama por defecto | E1 | selftest.sh - «si la principal aun la ve viva, no se cierra» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Si lo cierra cuando ya esta ahi | E4 E5 | selftest.sh - «si la principal ya lo sabe, se cierra» - «lo que la principal no conoce, se cierra» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Sin acceso a la principal lo declara SIN EVALUAR | E6 E7 | selftest.sh - «sin poder leer la principal, no evaluable» - «y en ese caso no se cierra nada» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | El mensaje nombra la causa y el orden correcto | E2 E3 | selftest.sh - «y se nombra cual va adelantada» - «con el estado que la principal declara» | salidas/inversa.txt | - | VERIFICADO |
| AC-05 | El espejo distingue esta causa | E8 | selftest.sh - «el espejo distingue el cierre adelantado» | salidas/selftest.txt | - | VERIFICADO |

## Verificado tambien contra la averia real

El caso que motivo la tarea se reprodujo sobre el repositorio: con `main` en DONE y los issues
cerrados, `tracker espejo` daba nueve divergencias. Restaurado el estado y con la guarda puesta,
`cerrar` se niega mientras la principal siga diciendo DONE. Salida en `salidas/negativa-real.txt`.
