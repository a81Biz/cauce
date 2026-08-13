# PT-022 — Diseño   `PHASE 4` · `FDGE-R21`

## `SUITE-R45` — el lote declara su cierre

Sección `## Cierre del lote` en el intake del `EP`, con una fila por cosa que se resuelve al
cerrar. En `G4` cada fila declara `HECHO` o el identificador al que se movió.

```
sin sección          → fuera de G4 avisa · en G4 bloquea
sección vacía        → igual: «no queda nada» es una afirmación, no un hueco
fila sin resolver    → igual
todas resueltas      → pasa
```

`enG4` es `gate === 'G4' || alloc.status === 'DONE'`: un lote en `DONE` ya está esperando la
compuerta, así que se le exige como si estuviera en ella.

## Dos decisiones que no son obvias

**Un lote `CLOSED` queda exento.** Ya pasó su `G4` con las reglas de su momento; exigirle una
sección que no existía entonces es reescribir historia — y este marco lo prohíbe en todas partes
menos, hasta aquí, en sí mismo. `EP-001`, `EP-002` y `EP-003` no se tocan.

**El merge y la publicación no son filas.** No son trabajo que el lote absorba al cerrar: son el
cierre mismo. Listarlos convierte la compuerta en su propio bloqueo — lo comprobé escribiéndolo
y viendo a `EP-004` bloquearse contra sí mismo. Está dicho en la regla para que no se repita.

## La otra mitad: citar el lote deja de ser gratis

`SUITE-R44` se engancha a `SUITE-R45`: citar el propio lote vale **si el lote declara su
cierre**. Antes, apuntar al lote no obligaba a nada — por eso la misma obligación acabó escrita
en dos `out-of-scope` y ausente en tres. Ahora apuntar al lote cuesta escribirlo **en** el lote,
una sola vez, donde no se puede omitir en tres de cinco sitios porque solo hay uno.

## Lo que esto NO hace, y va en la regla

**No comprueba que un `out-of-scope` esté completo.** Lo que no está escrito no es detectable
sin conocer el alcance real de la tarea — que es justo lo que ese documento sirve para declarar.
Forzarlo produciría filas copiadas para pasar: ruido con aspecto de rigor.

Lo que cambia no es que se detecte la omisión: es que **omitir deje de perder nada**, porque la
obligación ya no vive en la fila que se omitió.
