# PT-013 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`SUITE-R44`: lo que un lote aplaza se **asigna**, no se narra. `DEFERRED` deja de ser un estado
declarado y muerto: **exento** de las exigencias de un PT en curso, **vivo** para el espejo.

```
selftest   266 → 275 casos
audit      93/170 reglas con verificador que una compuerta ejecuta
```

## Y lo primero que hizo fue encontrar tres aplazados míos

```
PT-002  «escribir verificadores para las 63 reglas HARD sin ninguno»  → PT-015 · #22
PT-004  «hacer phase obligatoria» y «añadirla a TAREA.md»             → PT-016 · #23
PT-012  «derivar la lista de qué llega nuevo en migrate»              → PT-017 · #24
```

Los tres estaban escritos en un `out-of-scope.md` y ninguno era algo que una compuerta tocara.
Ahora son tres issues abiertos en el tablero.

## Lo que un revisor debería atacar

**1 · Citar cualquier identificador satisface la comprobación.** `PT-012` citaba `PT-013` en su
fila —«es lo que `PT-013` vuelve comprobable»— y **pasaba**, aunque `PT-013` no fuera a hacer
ese trabajo. Lo corregí a `PT-017`, pero la comprobación no puede saber si el PT citado cubre
de verdad lo aplazado. **Es el agujero real de esta regla** y no tiene arreglo mecánico:
comprueba que haya dónde volver, no que ese sitio sirva.

**2 · La heurística de «apunta a trabajo futuro» es una lista de palabras.** Se me escapó
«posteriores» —plural— en la primera versión, y una fila aplazada quedó sin ver hasta que
comparé a mano. Está declarada en la regla y en el código, que es lo mejor que puedo hacer,
pero cualquier redacción que no use esas palabras se escapa.

**3 · `DEFERRED` es exento y vivo a la vez.** Es deliberado y está explicado en los dos sitios,
pero es un estado con dos signos opuestos según quién lo mire, y eso siempre se puede leer mal.

**4 · Un `DEFERRED` podría usarse para esconder trabajo.** No: su issue queda **abierto**.
Aplazar algo lo pone en el tablero, no lo saca.

## Lo que NO he verificado

Que la regla impida de verdad perder algo **en la próxima sesión**. Eso solo lo dirá el tiempo,
y es honesto decir que lo único demostrado hoy es que encuentra lo que ya se había perdido.

SELF_REVIEW_COMPLETE
