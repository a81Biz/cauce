# Descubrimiento — `PT-138`   `PHASE 2`

## Qué exige `SUITE-R44` hoy, literalmente

Que la columna «Dónde va» sea vocabulario cerrado, que la cita sea recíproca, y que el destino
sea «una `allocation` en estado `DEFERRED` cuyo campo `origin` mencione el PT del que sale».

**Y nada más.** No hay condición de reentrada, ni fecha, ni dueño. La regla cierra la puerta por
la que se pierde el trabajo **al aplazarlo**, y deja abierta la de perderlo **después**.

## Ningún comando escribe `DEFERRED`

Medido sobre `tracker.mjs`: las únicas apariciones del literal son la lista de estados (`93`), el
filtro de `integrar` (`4121`) y el comando `retomar` que acaba de escribir `PT-137`. **Ninguna lo
asigna.** Los dos aplazados que existen se escribieron a mano.

`PT-134` tiene `origin` porque `SUITE-R44` lo exige; `PT-025` también, pero es **anterior** a la
regla y su texto no dice qué haría falta para retomarlo.

## El agujero, con nombre

Es `CE-006` —el acto fuera del comando— en su forma completa: **ninguna de las dos puertas de
`DEFERRED` tenía comando**. `PT-137` construyó la de vuelta. Ésta construye la de ida, y le pone
lo que debió pedir siempre.

## Qué NO se midió

- **Cuántos aplazados hay en proyectos instalados.** No hay acceso.
- **Si alguien ha revisado alguna vez un aplazado.** No hay registro de revisiones: es
  precisamente lo que falta.
