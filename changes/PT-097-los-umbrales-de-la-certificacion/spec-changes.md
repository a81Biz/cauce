# Spec changes — `PT-097`

## La especificación de `PTSA` **sí** cambia, y es el punto de la tarea

```
§24     «Reglas de transicion»  ->  «Reglas de transicion y clasificacion»
§24.1   NUEVO ENCABEZADO sobre lo que ya habia. PTSA-R38 y PTSA-R39 INTACTOS
§24.2   NUEVA · clasificacion base por Health
§24.3   NUEVA · emision y ausencia de letra
§24.4   NUEVA · topes que rebajan la clasificacion
```

**Ninguna regla existente se modifica.** `PTSA-R38` y `PTSA-R39` conservan su texto y su posición;
sólo ganan un encabezado por encima.

**Ninguna regla nueva se crea.** `§24.2` y `§24.4` **enuncian** lo que `PTSA-R30`, `§13.4`, `§15.6`
y `§26` ya establecen, y cada fila cita su origen. `§24.3` es la única que añade una obligación
—no emitir letra sin datos— y va como aclaración de `PTSA-R08`, no como regla aparte.

> Se consideró crear una regla `PTSA-R80` para `§24.3`. Se descarta: `PTSA-R08` ya dice «emitir una
> clasificación auditable», y una letra sin datos no es auditable. Es el **alcance** de una regla
> existente, no una obligación nueva — y `LEX-R22` prefiere citar a duplicar.

## `RIGE_DESDE` — no aplica, y se dice

`PT-081` estableció que una regla nueva no juzga lo escrito antes. **Aquí no hay regla nueva**, así
que no hay fila que añadir. Lo que hay es una definición que faltaba para una regla que ya regía.

**Y eso tiene una consecuencia que conviene declarar:** la auditoría `PTSA-2026-08-20` se emitió
bajo `PTSA-R08`, que ya existía. Recalcular su letra **no es juzgar hacia atrás** — es aplicar por
primera vez la definición que esa regla siempre exigió.

## Contratos internos

```
verify-ptsa.mjs   + export function letraDeCertificacion(e) -> 'A'|'B'|'C'|'F'|null
```

Pura y exportada, el patrón de `compararEspejo`. Devuelve `null` cuando falta un dato, y el
llamador lo reporta como aviso —no como fallo—: no saber no es no cumplir.

## Documentos generados

```
CORE-PTSA.md   se REGENERA con build-core (SUITE-R16, SUITE-R25). NO se edita a mano.
```

## Compatibilidad con proyectos destino

Un proyecto que actualice recibe:

- **una definición donde antes había una cita rota** — puede emitir la letra sin inventarla;
- **una comprobación nueva en `verify-ptsa`** que puede poner en rojo una auditoría que hoy pasa,
  si su letra publicada no cuadra con sus números.

Ese segundo punto **es intencionado y es el objetivo**: una letra que nadie contrasta no es una
certificación. Se declarará en la guía de migración de la versión que lo lleve, porque un proyecto
destino no tiene por qué deducirlo.

**Y el caso del proyecto legado queda cubierto sin que tenga que hacer nada**: publicó los tres
scores y no emitió letra, que es exactamente lo que `§24.3` autoriza. Su decisión pasa de ser una
desviación tolerada a ser el comportamiento declarado.
