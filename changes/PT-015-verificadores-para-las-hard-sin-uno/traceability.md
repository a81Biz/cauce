# PT-015 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Esta enumerado cuales de las HARD sin verificador bloquean una compuerta | E6 | selftest.sh - «SUITE-R26 declara que se cubre» | salidas/universo.txt | - | VERIFICADO |
| AC-02 | Cada una de esas emite su ID al fallar | E1 E2 E3 E4 E5 | selftest.sh - «verify-patrones cita SUITE-R38» - «revisar-secretos cita FND-R29» - «tracker cita SUITE-R47 al bloquear» - «un artefacto de PT en ruta global falla» - «sin artefactos globales, silencio» | salidas/selftest.txt · salidas/universo.txt | - | VERIFICADO |
| AC-03 | El alcance reducido esta escrito: que queda fuera y por que | E7 | selftest.sh - «SUITE-R26 declara que se cubre» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | regla --sin-comprobar sigue declarando el resto con su numero | E8 | regla --sin-comprobar (105 -> 101) | salidas/universo.txt | - | VERIFICADO |

## Lo que NO cubre

Cuantas de las 101 restantes son mecanizables. Enumerarlas una a una es trabajo de dias y
prometerlo habria sido justo lo que esta tarea evita. Queda MEDIDO por `regla --sin-comprobar`.

Y FDGE-R39 comprueba doce nombres de archivo: no cubre un artefacto de PT con otro nombre en una
ruta global. Es una lista, y las listas se quedan cortas.
