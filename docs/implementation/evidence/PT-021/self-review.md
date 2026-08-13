# PT-021 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Una constante y una condición. Citar el propio lote vale cuando su trabajo está **completo** —
`DONE` o `CLOSED`— en vez de solo `CLOSED`.

```
selftest    287 → 291 casos
EP-004      5 de 5 tareas pasan G4
```

## Por qué existía el punto muerto

Lo escribí ayer en `PT-018` con una intención correcta —impedir que una tarea aplace a su propio
lote y el lote cierre sin hacerlo— y elegí para comprobarla el único estado que **no puede
existir todavía** cuando la comprobación corre. `CLOSED` llega después del merge; la
comprobación bloquea el merge.

No lo vio ningún caso porque escribí el caso desde la intención («el propio lote abierto no
vale») y nunca el complementario («y el cerrado, ¿cuándo llega a serlo?»). Un aserto que solo
prueba la mitad prohibitiva de una regla no detecta que la mitad permisiva es inalcanzable.

## El hallazgo que no buscaba

`RULES.md` seguía describiendo `SUITE-R44` con **la lista de palabras que `PT-018` eliminó del
código**. `PT-018` declaró ese cambio en su `spec-changes.md` y no lo hizo.

Es el defecto que la v4 nació para eliminar —la regla escrita y la ejecutada divergiendo— y
sobrevivió un día entero dentro del propio marco. `verify-suite` no lo ve: comprueba que la
regla exista, que tenga ID y severidad y que la citen los documentos operativos. **No comprueba
que diga lo que el código hace**, y eso no es mecanizable en general.

Lo corregí aquí, fuera del alcance mínimo, porque dejar la regla mintiendo un día más es peor.
Queda dicho en el descubrimiento, en `spec-changes` y en la trazabilidad.

## Lo que un revisor debería atacar

**1 · ¿Es `DONE` de verdad «trabajo hecho»?** Un lote en `DONE` puede volver a `IN_PROGRESS` si
`G4` lo rechaza. Si eso pasa, una fila que lo citaba deja de estar cubierta y **la regla no lo
detecta hasta el siguiente `G4`** — que es cuando importa. Acepto el riesgo; lo alternativo es
el punto muerto.

**2 · Sigo sin cubrir lo que no está escrito.** Es `PT-022` y es el defecto grave: tres tareas
de `EP-004` pasaron `G4` **por omitir** la fila que las otras dos escribieron.

**3 · Corregí `RULES.md` fuera del alcance declarado.** Es una desviación real. La alternativa
era una regla que miente; elegí la desviación y la escribí en tres sitios en vez de hacerla
callando.

## Lo que NO he verificado

Que no haya más cambios que `PT-018` declarara y no hiciera. Miré `SUITE-R44` porque bloqueaba;
no audité el resto. Va en el `out-of-scope` citando `PT-022`.

SELF_REVIEW_COMPLETE
