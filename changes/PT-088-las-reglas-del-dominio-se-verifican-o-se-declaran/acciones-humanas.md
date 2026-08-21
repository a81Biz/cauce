# PT-088 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`, `EXEC-R03`). Y desde `PT-082` el merge no depende de que nadie mire
`gh pr checks`: `trabajo` está protegida y GitHub lo rechaza en rojo.

## 2 · La versión de entrada de las dos reglas   **HUMANO**   `SUITE-R19`

`RIGE_DESDE` las ancla en **`[11, 0, 0]`**, y esa cifra es una **apuesta** que hay que confirmar
al cerrar `EP-018`:

```
MAJOR (11.0.0)   si el lote trae verificadores que pueden FALLAR en proyectos que hoy pasan
MINOR (10.1.0)   si solo anade capacidad sin romper
```

**Aquí traen fallos.** `SUITE-R09` y `EXEC-R04` ya eran `HARD`; empezar a comprobarlas pone en
rojo a un destino que reescribió un ledger o mergeó sin constancia. Es el criterio con el que
subió la `10.0.0`.

Si el lote acabara siendo `MINOR`, **hay que corregir el ancla antes de sellar**. `verify-suite`
lo avisa — es como se encontró que `SUITE-R57` no tenía la suya.

## 3 · Las dos comprobaciones están **dormidas** hasta que suba la versión

```
$ node docs/methodology/tools/verify-fdge.mjs PT-088
(sin SUITE-R09 ni EXEC-R04: rigeGlobal es falso con suite_version 10.0.0)
```

**No es un fallo: es la regla no rigiendo hacia atrás.** Se ejercitan en la batería con un fixture
en `11.0.0`, que es para lo que existe el arnés.

Cuando el lote suba la versión, las dos se encienden sobre este repositorio. Medido hoy contra un
fixture en `11.0.0`, las dos pasarían:

```
✓ SUITE-R09   6 ledger(s) sin líneas perdidas desde v9.0.0
✓ EXEC-R04    1 merge(s) a «main» desde v9.0.0, todos con constancia
```

## 4 · La firma de `SUITE-R01` en `NO-VERIFICABLES.md`   **HUMANO**   `SUITE-R26`

Declarar una regla no verificable **es una decisión, no una constatación**, y por eso lleva firma.
La escribió el agente citando el VoBo del firmante, con su constancia en `SESSION_LOG.md`.

Lo que hay que confirmar es concreto: **que `SUITE-R01` no se pueda comprobar desde el
repositorio**, y que sus cuatro instancias —`FDGE-R23`, `FDGE-R24`, `PTSA-R14`, `SUITE-R11`— sí se
comprueben. Si el firmante ve un observable que se me escapó, la fila sale y la deuda vuelve.

## 5 · Cerrar `H-002` en PTSA   **HUMANO**   `PTSA-R44`

El agente lo lleva a `VALIDATION_PENDING` con su evidencia post-corrección observada
(`PTSA-R39`). **Cerrar un `DOMAIN` es de una persona.**

Y hay una razón para no cerrarlo del todo aquí: `H-002` nombra **tres** reglas, y esta tarea
resuelve las tres — pero el hallazgo dice también que *la rúbrica está por debajo de la promesa
del dominio*, y eso no lo cierra escribir dos verificadores.

## 6 · Publicar   **NO AUTORIZADO**

Sigue sin pedirse y sigue sin hacerse.

## 7 · Borrar la rama efímera tras fusionar   `FDGE-R19`

```bash
git push origin --delete fix/alberto-martinez/PT-088-las-reglas-del-dominio-se-verifican-o-se-declaran
```

`SUITE-R06f`. Seguro desde `PT-079`.
