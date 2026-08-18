# PT-057 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El coste se deriva de tareas cerradas | E1-E3 · E15 | `selftest.sh`: «la mediana ignora el caso extremo» · «el rango va con la mediana» · «con cinco tareas SI hay referencia» · «coste da una cifra para un grupo grande» | `salidas/coste-real.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | Se compara con las de su mismo tipo y complejidad | E4-E6 | `selftest.sh`: «filtra por tipo Y complejidad» · «filtra solo por tipo» · «sin filtro, todas» · «la cifra no es la misma para todo grupo» | `salidas/coste-real.txt` | - | VERIFICADO |
| AC-03 | Con pocas tareas lo dice; no extrapola en silencio | E7-E11 · E16 | `selftest.sh`: «con cuatro NO extrapola» · «…y dice cuantas hay y cuantas faltan» · «…y ensena los casos EN CRUDO» · «sin referencia NO devuelve cero» · «un grupo pequeno se declara SIN REFERENCIA» | `salidas/coste-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-04 | Ninguna cifra sale de la memoria ni de una tabla a mano | E12-E14 · E17-E18 | `selftest.sh`: «el dueno es el PT del asunto» · «…el PRIMERO si hay varios» · «MINIMO_REFERENCIA esta exportado» · «coste funciona SIN credencial» | `salidas/coste-real.txt` · `salidas/audit.txt` | - | VERIFICADO |

**`AC-04` es el que más fácil habría sido dar por bueno sin comprobarlo.** El caso «la cifra no es
la misma para todo grupo» existe porque una aserción que solo mira *que sale una cifra* pasa igual
si la cifra está escrita a mano: se comprueba cambiando el filtro y viendo que **cambia**.

**`E19`–`E20` no estaban en `PHASE 4`**: son los dos casos que salieron de defectos encontrados al
ejecutar — que un tipo en mayúsculas no se confunda con el `ROOT`, y que `coste` funcione sin
credencial de tablero, que es lo que CI le enseñó a `PT-056`.
