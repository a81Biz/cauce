# PT-062 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `siguienteEnRango` con el rango vacío | el **primero** del rango |
| E2 | AC-01 | …con IDs ya usados dentro | el siguiente al mayor |
| E3 | AC-02 | …ignorando los que están **fuera** del rango | no los cuenta |
| E4 | AC-01 | Sin rango declarado | `null` con motivo |
| E5 | AC-05 | Rango **agotado** | `null` — no invade el siguiente |
| E6 | AC-05 | …y el motivo dice cuántos hay y qué hacer | el texto |
| E7 | AC-04 | `seSolapan` con dos rangos disjuntos | `false` |
| E8 | AC-04 | …con solape parcial | `true` |
| E9 | AC-04 | …con uno dentro de otro | `true` |
| E10 | AC-04 | …tocándose por un extremo | `true` — un número compartido ya es colisión |
| E11 | AC-04 | `solapes` con tres personas y un solape | lo encuentra, con los dos nombres |
| E12 | AC-04 | …y sin solapes, lista vacía | `0` |
| E13 | AC-01 | `tracker asignar PT` con rangos | un ID **del rango** |
| E14 | AC-03 | …y el ID **no** lleva el nombre de nadie | `PT-NNN` |
| E15 | AC-06 | …sin rangos, del contador global | como hoy |
| E16 | AC-02 | `--ver` **no** escribe en el registro | intacto |
| E17 | AC-04 | `verify-fdge` con dos rangos solapados | **falla** |
| E18 | AC-04 | …y con una allocation fuera de todo rango | **falla** |
| E19 | AC-06 | …y sin rangos declarados, **no** comprueba nada | verde |
| E20 | AC-01 | `tracker personas` enseña el rango y el siguiente | las cifras |

**`E10` no es un detalle.** Dos rangos que se tocan por un extremo comparten **un** número, y ese
número es exactamente el que las dos personas van a pedir a la vez. `[1,100]` y `[100,200]` es
`true`.

**`E3` es lo que hace que los rangos funcionen sobre lo que ya existe.** Los 65 `PT` de este
repositorio se asignaron sin rango: si contaran para el rango de otra persona, su primer ID
saltaría a 66 sin motivo.

**`E14` es la decisión 2 del firmante**, comprobada: el identificador **no** se namespacea. Sigue
siendo `PT-NNN` y `LEX-R04` sigue valiendo.

**`E18` cubre lo que la acción no puede impedir**: alguien asigna a mano —como se ha hecho hasta
hoy— y se salta su rango. La acción no lo ve; la verificación sí.

## Lo que ningún caso puede comprobar

**Que dos personas asignen a la vez de verdad.** La colisión está **reproducida** en `PHASE 2` con
dos ramas de git, y los rangos la evitan por construcción — pero eso es un argumento, no una
ejecución con dos personas reales.

**Que nadie asigne a mano.** `verify-fdge` lo detecta después; impedirlo no se puede, porque el
registro es un archivo y editarlo es legítimo.

**Que los rangos elegidos sean los correctos.** Repartir el espacio de identificadores es una
decisión de equipo. La herramienta enseña los datos y no decide.
