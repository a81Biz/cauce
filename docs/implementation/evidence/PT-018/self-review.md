# PT-018 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

La columna «Dónde va» de un `out-of-scope.md` deja de admitir prosa. Dos formas y ninguna más:
`—`, o la cita de un identificador **que reconozca el origen**. `RE_APLAZA` —la lista de
palabras que tenía que adivinar si una frase significaba «aplazado»— ya no existe.

```
selftest   275 → 281 casos
avisos SUITE-R44 en el repositorio   0
```

## Por qué no se mejoró el detector

Era la opción obvia y es la equivocada. Ampliar la lista es perseguir el idioma: cada sinónimo
que se añade deja fuera al siguiente, y el que falta no se ve hasta que algo ya se perdió —que
es literalmente lo que me pasó con «posteriores» en plural en `PT-013`. Un sistema que depende
de acertar el vocabulario del redactor no cuadra nada; solo mueve el fallo a otro sitio.

## Lo primero que hizo fue encontrar dos aplazados míos más

```
PT-004  «ampliar el grafo a tools/»                  → PT-020 · #27
        migrar el proyecto legado, sin fila propia    → PT-019 · #26
```

`PT-019` es **el trabajo con el que se abrió esta sesión**. Llevaba veinte tareas sin estar
asignado en ninguna parte, y no lo vio la regla anterior. Ahora es un issue abierto.

## Defecto propio, y es EL defecto que este marco documenta

Escribiendo `RE_CITA_ID` mi `\b` se degradó al byte de control `0x08`. El regex compilaba sin
error y no casaba nada: la comprobación estaba **apagada** y en verde. Es exactamente el
escape que `SUITE-R38` recoge ocho veces. Lo encontré con `cat -A`, no leyendo el archivo —
leerlo no sirve, porque en pantalla `0x08` no se ve. Dos bytes sustituidos.

Que me ocurriera escribiendo la tarea que existe para que no se me escape nada dice algo
incómodo y verdadero: la regla no me hace infalible, hace que el fallo tenga dónde aparecer.

## Lo que un revisor debería atacar

**1 · La reciprocidad prueba reconocimiento, no cobertura.** Que `PT-019` declare venir de
`PT-012` no prueba que vaya a hacer ese trabajo. Está declarado en el diseño y en el
`out-of-scope`, y es lo que una persona lee en `G3`. No tiene arreglo mecánico y no se finge
que lo tenga.

**2 · «Hermano del mismo epic» vale en cualquier estado.** Es deliberado —el lote responde de
sus propias filas— pero significa que dentro de un lote la cita es más barata que fuera. Si un
lote cierra sin hacer lo que una fila suya prometió, esto no lo caza. Lo caza el cierre del
lote, que es otra compuerta.

**3 · Rompe compatibilidad y eso es el objetivo.** Todo `out-of-scope.md` con prosa en esa
columna pasa a fallar. Va en el `CHANGELOG` del lote con su migración; sin esa entrada, este
cambio llega a los proyectos instalados como una sorpresa en rojo.

**4 · Sustituí un caso de `PT-013` en vez de arreglarlo.** «si cita una allocation, no se ve»
afirmaba justo lo que este PT deroga. Dejarlo verde habría exigido conservar el agujero. Queda
escrito en el propio `selftest.sh` por qué se cambió, para que no parezca un aserto relajado
para pasar.

## Lo que NO he verificado

Que la gramática cubra redacciones que aún no he visto. Lo demostrado hoy es que **no depende
de la redacción**: no hay nada que interpretar, así que no hay frase que se escape. Es una
propiedad más fuerte que la anterior, pero se prueba por construcción, no por casos.

SELF_REVIEW_COMPLETE
