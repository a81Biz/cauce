# PT-062 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Cada persona tiene un rango reservado | E1-E2 · E4 · E13 · E20 | `selftest.sh`: «rango vacio da el primero» · «…y con usados, el siguiente» · «asignar da un ID» | `salidas/asignar-real.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | El registro sigue asignando: el rango acota | E3 · E16 | `selftest.sh`: «los de FUERA del rango no cuentan» · «--ver no escribe nada» | `salidas/asignar-real.txt` | - | VERIFICADO |
| AC-03 | El identificador no se namespacea | E14 | `selftest.sh`: «…y NO lleva el nombre de nadie» | `salidas/asignar-real.txt` | - | VERIFICADO |
| AC-04 | Dos rangos no se solapan, y solaparlos falla | E7-E12 · E17-E18 | `selftest.sh`: «…y TOCARSE por un extremo tambien» · «solapes encuentra el par» · «verify-fdge detecta rangos solapados» · «…y una allocation fuera de todo rango» | `salidas/inversa.txt` · `salidas/asignar-real.txt` | - | VERIFICADO |
| AC-05 | Agotar un rango se dice; no se invade | E5-E6 | `selftest.sh`: «un rango agotado NO invade» · «…y que ampliarlo es humano» | `salidas/inversa.txt` | - | VERIFICADO |
| AC-06 | Sin rangos, el comportamiento de hoy no cambia | E15 · E19 | `selftest.sh`: «sin rangos, del contador global» · «…y solo si hay rangos declarados» | `salidas/asignar-real.txt` · `salidas/verify-suite.txt` | - | VERIFICADO |

**`AC-04` se verifica con la inversa.** Cambiando `<=` por `<` en `seSolapan`, los rangos `[1,100]`
y `[100,200]` dejan de solaparse — y el número 100 es exactamente el que las dos personas pedirán a
la vez. Tres casos caen solo por eso.

**`AC-06` es lo que hace que esta tarea no rompa a nadie.** Este repositorio **no declara rangos**:
las comprobaciones se probaron declarándolos temporalmente y restaurando el registro después.
