# Autorrevisión — `PT-139`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`checkAplazados()`: la compuerta que faltaba. `PT-137` hizo la puerta de vuelta, `PT-138` escribió
cuándo cruzarla, y **sin esto los dos eran documentación** — un campo que nadie mira es un campo
que se rellena mal.

## Lo que dice, y por qué cada parte

| El mensaje incluye | Porque |
|:---|:---|
| **Cuántos días** lleva vencido | «Vencido» sin la cifra no distingue dos días de dos años |
| **De quién** es | Un aviso sin destinatario no es una decisión pendiente de nadie |
| **Qué comando** lo arregla | Un aviso que obliga a ir a buscar el comando es un aviso que se ignora |

## No decide nada, y lo dice

El mensaje del caducado enumera los tres caminos —retomar, mover la fecha, cerrar— y declara
explícitamente que **la compuerta obliga a mirar y no decide por nadie**. Cerrar automáticamente
un aplazado sería `SUITE-R06` roto por comodidad.

## Los dos límites, cada uno con su clase

**`CE-014` · no juzga hacia atrás.** `PT-025` está aplazado desde mucho antes de que existiera
`tracker aplazar`: no pudo declarar lo que nadie le pedía. `RIGE_DESDE` lo exime **y lo dice** —
ponerle el bloque es una decisión de su dueño, no una deuda.

**`CE-010` · la fecha de hoy se deriva.** Del último commit, y del reloj del sistema cuando no hay
git — la misma lección que `PT-138` aprendió dentro de `aplazar`. Y el fixture usa `2099` para que
el caso **no caduque solo**.

## El defecto que apareció, y no está en el código nuevo

**Seis casos antiguos afirmaban sobre el ID de la regla, no sobre el hallazgo.** `chkno … "SUITE-R44"`
significaba «que esta regla no diga nada», y `PT-139` le añadió una cláusula: la regla empezó a
hablar en corridas donde antes callaba, y seis casos que miden **otra cosa** se pusieron rojos.

**No es que el código esté mal: es que el patrón era demasiado grueso.** Afirmar sobre un ID de
regla acopla el caso a **todo** lo que esa regla pueda decir en el futuro. Se afinaron al hallazgo
concreto —`no declaran su destino`— que es lo que cada uno mide de verdad.

Un séptimo, `un DEFERRED no exige artefactos`, casaba el identificador a secas y mi línea de
exentos lo **nombra** justamente para decir que **no** es deuda. Afinado a `PT-020:`, que es la
forma en que `verify-fdge` le exige algo a un PT. **Mencionar no es exigir.**

## Lo que esta tarea NO establece

- **Que el umbral deba ser «vencido» y no un margen de gracia.** Sería un juicio sin datos.
- **Que alguien vaya a mirar el aviso.** La compuerta obliga en `G4`; fuera de ella, avisa.
- **Que `PT-025` deba tener bloque.** Está exento y se dice.

## Estado

| | |
|:---|:---|
| Escenarios | 11 de 11 |
| Negativo | `TS-06` — sin él, una comprobación que marcase todo también pasaría |
| Orphan Criterion | ninguno |
