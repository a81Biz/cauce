# PT-050 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Saltarse los 181 `build_fixture` de los bloques no seleccionados | — |
| Partir `selftest.sh` o convertir sus 19 secciones en funciones | — |
| Paralelizar la batería | — |
| `--solo` en `verify-fdge` | — |
| La entrada de `CHANGELOG` del lote y el número de versión | EP-014 |

**Las dos primeras filas son la misma cosa y llevan `—` con la medida detrás.** El otro 45 % del
reloj son los fixtures, y saltárselos exige que un bloque sea una unidad que se pueda no ejecutar.
Hoy son sentencias sueltas en un script lineal de 2 400 líneas que **cinco** de las seis tareas de
`EP-014` van a tocar: el refactor convertiría cada tarea posterior en un conflicto.

No se aplaza a nadie porque **no se ha decidido hacerlo**. Lo que hay es una medida, y esa medida
es lo que permitirá decidirlo con datos cuando el lote termine — que es distinto de dejarlo
apuntado hoy como si ya estuviera decidido.

La cuarta lleva `—` por lo mismo que en `PT-049`: `--solo` en `verify-fdge` tendría sentido el día
que su tiempo moleste, y **su tiempo no se ha medido que moleste**. Lo que molesta ahí son las
líneas, y eso lo resolvió `PT-049`.
