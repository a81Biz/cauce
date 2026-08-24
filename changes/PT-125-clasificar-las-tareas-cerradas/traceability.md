# Trazabilidad — `PT-125`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `EVENTOS.jsonl` existe, es append-only, y lleva un registro por evento con tarea, fecha, clase, CITA TEXTUAL y naturaleza | `TS-01` `TS-02` | `selftest.sh:un registro lleva clase, cita y naturaleza` · `…y la cita es LITERAL, no parafraseada` | `salidas/casos-125.txt` · `salidas/eventos.txt` |
| AC-02 | Toda clasificación va marcada `DECLARADO`: la clase es un juicio, no una derivación | `TS-03` `TS-04` `TS-05` `TS-06` `TS-07` | `selftest.sh:toda clasificacion va DECLARADO` · `…y ninguna se presenta como MEDIDO` · `una MENCION no se cuenta como instancia` | `salidas/casos-125.txt` |
| AC-03 | Las entradas de `HISTORY.log` más `INCIDENTS.log` quedan recorridas, y las que no encajan se declaran en vez de forzarse | `TS-08` `TS-09` `TS-10` `TS-15` `TS-16` | `selftest.sh:una entrada sin clase queda RECORRIDA igual` · `…y afirmar recurrencia sin nombrar la forma es OTRO estado` · `sin ledger legible NO escribe un archivo vacio` | `salidas/eventos.txt` · `salidas/distribucion.txt` |
| AC-04 | Ninguna tarea cerrada se rejuzga ni se reabre | `TS-14` | `selftest.sh:clasificar no toca HISTORY.log` | `salidas/casos-125.txt` |

**Cuatro criterios, cuatro con `TS`, cuatro con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-01` dice «131 entradas» y son **163**

El intake se escribió el 2026-08-22. El ledger creció con `EP-020`: hoy `HISTORY.log` tiene **162**
encabezados y `INCIDENTS.log` **uno**. Siete de esos 162 son entradas `## G4 — …`, registros de
compuerta y no de tarea, y cuentan igual: son entradas del ledger.

La cifra del criterio es la del día en que se escribió; la del trabajo, la del día en que se hace.
Se declara la diferencia en vez de arrastrar la vieja.

## `AC-03` y el límite de acceso, sin cambios

Cinco `INC` de `EP-019` viven en el `INCIDENTS.log` de otro proyecto que **no está en esta
máquina**. Se declaran ausentes. El `INCIDENTS.log` local tiene una entrada y está recorrida.

## Lo que esta trazabilidad **no** establece

- **Que las 56 instancias sean todas las que hay.** Son las que el ledger **nombra**. Cuarenta
  entradas más afirman recurrencia sin decir de qué, y quedan declaradas con su cita: son un hueco
  medido, no una ausencia.
- **Que el recuento sea de ocurrencias.** Es de **entradas que nombran la clase**. `EP-020` §2.1
  contó ocurrencias —27 roturas de escapado frente a 6 entradas aquí—. Los dos son correctos y
  sumarlos sería falso; la diferencia va escrita en la cabecera del propio archivo.
- **Que la separación `INSTANCIA`/`MENCION` sea incontestable.** Es un juicio, va `DECLARADO`, y
  las catorce decisiones están escritas con su motivo **precisamente** para que se puedan
  contradecir.
