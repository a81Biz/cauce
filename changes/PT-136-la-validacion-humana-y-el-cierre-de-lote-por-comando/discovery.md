# Descubrimiento — `PT-136`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · Dos actos sin comando, medidos al cerrar

**`BUG` → `DONE`.** `FDGE-R26` dice que un `BUG` «transita a `VALIDATION_PENDING` y ahí **se
detiene**: sólo un humano lo lleva a `DONE`». **No dice cómo se escribe eso.** Y el comentario del
propio `tracker.mjs` ya lo tenía medido:

> *«51 `BUG` en este registro y **CERO** han pasado por ahí. Los tres en `DONE` son `PT-096`,
> `PT-097` y `PT-098` —las tareas de este mismo lote— y los tres se escribieron **A MANO**,
> declarando la excepción cada vez, porque el comando no lo hacía.»*

**Lote → `CLOSED`.** Lo mismo, y sin nadie que lo hubiera medido.

## 2 · Y lo cometí al cerrar

Escribí el estado de `EP-020` con un `node -e`:

```
EP-020: CLOSED {"G1":{...},"G4":{...}}
```

**`CE-006` dentro del cierre del lote que existe para impedir `CE-006`.** Se deshizo y se rehizo
con el comando: corregir a mano lo que un comando debe escribir habría sido la instancia
siguiente.

## 3 · El orden que nadie había escrito en ningún sitio ejecutable

Al ejecutar `integrar EP-020` el comando lo rechazó:

```
✗ SUITE-R45  EP-020 tiene 22 tarea(s) que no estan terminales: PT-113 (DONE) · …
```

**Y tenía razón.** `DONE` no es terminal —espera `G4`— así que el orden real es:

```
merge  →  cada PT: DONE → INTEGRATED  →  el lote: READY → CLOSED
```

`PHASE 9` lo describe en prosa desde siempre. Lo que no existía era algo que lo **impidiera** al
revés, y por eso yo lo intenté al revés.

---

## Conclusión

**`tracker validar`** registra la validación humana de un `BUG`: contrasta el firmante
(`SUITE-R27`), rechaza lo que no sea un `BUG` en `VALIDATION_PENDING`, acepta la fecha real, y **no
escribe ninguna si una falla** — cinco validaciones a medias serían peores que ninguna.

**`tracker integrar`** cierra también un lote, y **sólo** si ninguna tarea sigue viva. La condición
se **deriva** de las tareas.

**Lo que sigue siendo humano es la decisión.** El comando la escribe; no la toma.
