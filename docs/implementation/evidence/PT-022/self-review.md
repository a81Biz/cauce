# PT-022 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`SUITE-R45`: un lote declara en su intake qué se hace al cerrarlo, y `G4` comprueba que cada
fila esté resuelta. Y `SUITE-R44` se le engancha: citar el propio lote vale **si el lote declara
ese cierre**.

```
selftest    291 → 299 casos
```

## El criterio que NO se cumplió

`AC-03` pedía que omitir la fila «dejara de ser gratis». **No se logró, y no se puede.** Lo que
no está escrito no es detectable sin conocer el alcance real de la tarea, que es exactamente lo
que el `out-of-scope` sirve para declarar. Cualquier intento —exigir que todas las tareas de un
lote escriban lo mismo, compararlas entre sí— produciría filas copiadas para pasar: ruido con
aspecto de rigor, que es peor que la omisión porque parece cobertura.

Queda en el manifiesto como `verified: false` y en la trazabilidad como `PARCIAL`. Ponerlo en
verde porque «el espíritu se cumple» sería la clase de falso verde que este lote existe para
eliminar.

Lo que sí se logró es lo que había detrás del criterio: **omitir la fila deja de perder algo**,
porque la obligación ya no vive ahí. Vive en el lote, donde solo hay un sitio y no se puede
olvidar en tres de cinco.

## Dos veces me bloqueé contra mi propia regla

**Escribí «merge y publicación» como fila de cierre de `EP-004`** y el lote se bloqueó contra sí
mismo: el merge no es algo que el lote resuelva al cerrar, **es** cerrar. Misma familia que el
punto muerto de `PT-021`, veinticuatro horas después. Está dicho en la regla ahora.

**Y exigí la sección a `EP-001`, `EP-002` y `EP-003`**, ya cerrados. Es reescribir historia con
una regla que no existía cuando pasaron su compuerta — algo que este marco prohíbe en todas
partes menos, hasta ese momento, en sí mismo. `CLOSED` queda exento.

Ninguna de las dos la vi leyendo. Las vi ejecutando.

## Y un defecto de método, no de código

Tres casos salieron en rojo porque `checkCierreDeLote()` **no se ejecutaba**: el `continue` de
`INTAKE-R09` cortaba antes cuando el intake estaba incompleto. Escribí la llamada al final de la
función porque «ahí es donde termina la comprobación del lote», sin mirar los `continue` de
arriba. Si los tres casos hubieran sido menos exigentes, la comprobación estaría hoy en el
repositorio sin ejecutarse nunca — que es el mismo defecto que `PT-014` encontró en
`sincronizarCuerpos()`, en el mismo archivo, con dos días de diferencia.

Un `\n` se me volvió a degradar a salto de línea real dentro de un heredoc y rompió el parser.
Ese al menos falla ruidosamente.

## Lo que un revisor debería atacar

**1 · `RE_RESUELTA` acepta cualquier `PT-NNN` o `EP-NNN` en la celda de estado.** No comprueba
que ese identificador exista ni que recoja la fila. Es más débil que la reciprocidad que
`PT-018` exigió a los `DEFERRED`, y lo es a propósito: la fila de cierre puede moverse a un lote
futuro que aún no existe. Un revisor podría decir con razón que ahí falta una vuelta.

**2 · `enG4` incluye `status === 'DONE'`.** Un lote en `DONE` se trata como si ya estuviera en la
compuerta. Es lo que hace que `EP-004` se compruebe sin pasar `--gate G4`, y también significa
que un lote marcado `DONE` por error empieza a bloquear antes de tiempo.

**3 · La sección se busca por título literal.** `## Cierre del lote`, insensible a mayúsculas.
Un lote que la titule distinto no la tiene, aunque la haya escrito.

## Lo que NO he verificado

Si `PT-018` declaró más cambios de especificación que no hizo. Apareció en `PT-021`, no se ha
mirado, y está en el cierre de `EP-005`.

SELF_REVIEW_COMPLETE
