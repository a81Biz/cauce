# `PT-160` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un `AC` del intake que **falta** en la matriz **bloquea** | TS-01 · TS-02 | `selftest` ×2 · fixture | `evidence/PT-160/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | Un `AC` de la matriz que el intake no declara **avisa** | TS-03 | `selftest` · fixture | `evidence/PT-160/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | Con las dos listas iguales **no dice nada** | TS-04 | `chkno` | `evidence/PT-160/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-04 | Lo integrado antes **no se juzga** | TS-04 | `RIGE_DESDE 13.2.0` · `verify-fdge --all` | `evidence/PT-160/salidas/verify-fdge.out` | n/a | `CUMPLIDO` |

**Primera corrida, sin frontera:**

```
6 bloqueantes  el intake declara un AC y la matriz NO lo recoge
13 avisos      la matriz recoge un AC que el intake no declara
```

`PT-077` declara `AC-06` —*«ninguna otra acción que escriba se salta la guarda»*— y su matriz **no
lo recoge**. Un criterio que nadie comprobó, en verde durante cincuenta tareas.

**`AC-04` es lo que hace que la regla sea aplicable.** Los seis son trabajo **ya integrado**:
juzgarlo hacia atrás es `CE-014`, y aquí el rojo **no tendría salida** —esas matrices ya se
cerraron, y añadirles una fila hoy sería inventar una comprobación que nunca ocurrió—.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `FDGE-R15` sigue rigiendo **desde siempre** | la frontera es de `FDGE-R15a` | `CUMPLIDO` |
| RC-02 | Las dos direcciones no cuestan lo mismo: falta bloquea, sobra avisa | TS-01 · TS-03 | `CUMPLIDO` |
| RC-03 | `verify-fdge --all` sin rojos nuevos sobre lo integrado | `EXIT` sin `FDGE-R15a` | `CUMPLIDO` |

**`RC-01` es la decisión de diseño.** Emitir `FDGE-R15` habría metido la frontera a **toda** la
regla, que rige desde siempre. `FDGE-R15a` es **la parte que hasta hoy nadie comprobaba**, con su
propia versión de entrada.

Es la misma decisión que `PT-151` tomó con `SUITE-R01`/`SUITE-R62`: **una comprobación nueva no
puede cambiar el alcance de una regla vieja** — ni ampliándolo ni eximiéndolo.

## Lo que NO establece   `SUITE-R26`

Que los `AC` **digan** lo mismo. Compara **identificadores**, no enunciados: un `AC-03` reescrito
en la matriz con otro texto pasa, y eso lo ve quien lee.
