# PT-056 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Cambio |
|:---|:---|
| `LEXICON.md` · `LEX-R26` | **Ampliada**: el `sha` no solo tiene que ser alcanzable — el árbol tiene que **corresponder**. Sustituye la frase que dejaba la correspondencia fuera |
| `LEXICON.md` §6.2 | **`STATE_MISMATCH` nuevo**: nombre canónico de la condición que la comprobación reporta. **No** es un `status` del registro |
| `CORE.md` | Regenerado — se compila desde `LEXICON.md` |

**Ninguna regla nueva.** `LEX-R26` es la regla del contrato del checkpoint, y «el checkpoint dice
la verdad sobre el árbol» es parte de ese contrato: dos reglas para lo mismo serían dos sitios
donde divergir (`SUITE-R38`).

**No rompe compatibilidad.** Añade una exigencia sobre un artefacto que **ningún proyecto
instalado tiene todavía** —`INSTALL.md` declara que `CHECKPOINT.json` no se siembra— así que nadie
puede quedar en rojo por esto. El lote seguirá siendo `MINOR` salvo que otra tarea diga lo
contrario.

> La frase que se sustituye la escribió `PT-052` a propósito: *«Que el árbol corresponda a ese
> `sha` es otra comprobación y no está aquí»*. Dejar dicho lo que falta es lo que permite que la
> tarea siguiente lo encuentre sin buscarlo.
