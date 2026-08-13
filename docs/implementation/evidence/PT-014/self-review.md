# PT-014 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Una función pura de una línea, `ordenDeApertura()`, y una palabra en el bucle de `abrir()`. Las
tareas se crean antes que su lote, así que cuando se compone el cuerpo del lote sus tareas ya
tienen número.

```
selftest   281 → 287 casos
llamadas nuevas a la plataforma   0
```

## Lo que encontré y no esperaba

`sincronizarCuerpos()` **ya arreglaba esto** y no se alcanzaba: solo corre en la rama de
`abrir()` en la que no hay nada que abrir. Al leer el código el caso parece cubierto, y por eso
el defecto sobrevivió a `PT-010`, que es quien escribió esa función.

Es peor que no tener el arreglo: un arreglo inalcanzable se lee como protección.

## Lo que un revisor debería atacar

**1 · El orden basta hoy porque la dependencia va en un sentido.** El cuerpo de un `PT` cita a
su lote por identificador, no por número. Si alguien añade el número, hay ciclo y ningún orden
sirve. Está escrito en el comentario de la función; es lo único que puedo hacer, porque no hay
forma mecánica de impedir que se añada.

**2 · No probé abriendo un lote real contra GitHub.** No hay ninguno que abrir, e inventar uno
para probar dejaría basura en el tablero. Verifiqué las dos piezas que componen el resultado —el
orden y el cuerpo— y lo digo en la trazabilidad en vez de dejar que `AC-01` parezca comprobado
de punta a punta.

**3 · La estabilidad de `sort` es una garantía del lenguaje, no mía.** ES2019. Si alguien
portara esto a un runtime anterior, dos tareas podrían salir permutadas. No rompe nada —el
cuerpo seguiría completo— pero el orden dejaría de ser el que el humano lee.

## Lo que NO he verificado

Que un lote con muchas tareas no tope con límites de la plataforma. No cambia con este PT: se
crean los mismos issues, en otro orden.

SELF_REVIEW_COMPLETE
