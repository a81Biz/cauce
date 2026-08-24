# Autorrevisión — `PT-136`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

Los dos actos del cierre que no tenían comando:

- **`tracker validar`** — la validación humana de un `BUG`: `VALIDATION_PENDING` → `DONE`, con
  quién y cuándo, contrastando el firmante y **todas o ninguna**.
- **`tracker integrar` para un lote** — `READY` → `CLOSED`, y sólo si ninguna tarea sigue viva.

## El hueco, y estaba medido desde antes

El comentario del propio `tracker.mjs` ya lo decía: *«51 `BUG` en este registro y **CERO** han
pasado por ahí. Los tres en `DONE` … se escribieron **A MANO**, declarando la excepción cada vez,
porque el comando no lo hacía»*.

`FDGE-R26` decía **qué** hay que hacer y **quién**. No decía **cómo se escribe**, y eso convertía
la única vía en rodear el registro. No es indisciplina: es un hueco de herramienta.

## Y lo cometí al cerrar

Escribí el estado de `EP-020` con un `node -e`. **`CE-006` dentro del cierre del lote que existe
para impedir `CE-006`.** Lo vi al instante, se deshizo y se rehízo con el comando: corregir a mano
lo que un comando debe escribir habría sido la instancia siguiente, no el arreglo.

## Y el comando me corrigió a mí

`integrar EP-020` rechazó el cierre **nombrando** las 23 tareas que seguían en `DONE`. Tenía razón:
`DONE` espera `G4`, así que el orden es **merge → `INTEGRATED` → lote `CLOSED`**.

`PHASE 9` lo describe en prosa desde siempre. Lo que no existía era algo que lo **impidiera** al
revés — y por eso lo intenté al revés. Es la tesis del lote aplicada a mí mismo en su último acto.

**Y nombra en vez de contar**: lo útil no fue el número 23, fue leer `PT-113 (DONE)` y entender por
qué. Un recuento correcto convive con cualquier hueco porque no dice cuál.

## Lo que esta tarea NO establece

- **Que el comando valide.** La decisión es humana y sigue siéndolo. `SUITE-R27` dice qué prueba
  una firma y qué no: la hace **contrastable**, no verificada.
- **Que las tres validaciones históricas queden regularizadas.** No se tocan (`SUITE-R09`).
- **Que las 21 allocations sin `suite_version` se rellenen.** Sería inventar bajo qué versión nació
  cada una: `PT-115` subió el lote a `13.0.0` a mitad.
- **Que un lote no pueda cerrarse mal.** Establece que no puede cerrarse con **trabajo dentro**.

## Estado

| | |
|:---|:---|
| Escenarios | 10 de 10 |
| Orphan Criterion | ninguno |
| `verify-fdge` | sin errores |
| Evidencia de campo | el rechazo real sobre `EP-020`, nombrando 23 tareas |
