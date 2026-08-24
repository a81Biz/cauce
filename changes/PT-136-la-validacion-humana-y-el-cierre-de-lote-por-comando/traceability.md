# Trazabilidad — `PT-136`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Existe un comando que lleva un `BUG` de `VALIDATION_PENDING` a `DONE`, registrando quién y cuándo | `TS-01` `TS-02` | `selftest.sh:validar lleva un BUG de VALIDATION_PENDING a DONE` · `…y deja quien y cuando en el registro` | `salidas/casos-136.txt` |
| AC-02 | **No decide**: rechaza lo que no sea un `BUG` en `VALIDATION_PENDING`, y contrasta el firmante | `TS-03` `TS-04` `TS-05` `TS-06` | `selftest.sh:un no-BUG no pasa por esta validacion` · `…ni un BUG que ya esta en DONE` · `un firmante que no esta en la lista falla` | `salidas/casos-136.txt` |
| AC-03 | La fecha se puede **decir** | `TS-07` | `selftest.sh:la fecha de la validacion se puede DECIR` | `salidas/casos-136.txt` |
| AC-04 | `integrar` cierra también un lote: `READY` → `CLOSED`, y sólo si ninguna tarea sigue viva | `TS-08` `TS-10` | `selftest.sh:un lote con tareas vivas NO se cierra` · `…y con todas terminales, READY -> CLOSED` | `salidas/casos-136.txt` · `salidas/integrar-rechaza.txt` |
| AC-05 | La condición se **deriva** de las tareas, no se pregunta ni se supone | `TS-08` `TS-09` | `selftest.sh:…y las nombra, no solo las cuenta` | `salidas/integrar-rechaza.txt` |

**Cinco criterios, cinco con `TS`, cinco con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-05` tiene evidencia de campo, no sólo de fixture

`salidas/integrar-rechaza.txt` es el rechazo **real** sobre `EP-020`: nombra las 22 tareas que
seguían en `DONE`. No es un caso montado — es el comando corrigiéndome mientras cerraba el lote.

## Lo que esta trazabilidad **no** establece

- **Que el comando valide.** La decisión es humana y sigue siéndolo: esto la **escribe**. `SUITE-R27`
  dice qué prueba una firma y qué no.
- **Que las tres validaciones históricas queden regularizadas.** No se tocan (`SUITE-R09`); están
  declaradas en el ledger.
- **Que las 21 allocations sin `suite_version` se rellenen.** No se rellenan: sería inventar bajo
  qué versión nació cada una.
