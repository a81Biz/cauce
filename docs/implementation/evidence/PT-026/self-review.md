# PT-026 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`tracker espejo` bloquea en la rama de trabajo y en los pull requests, e **informa sin bloquear**
en la rama por defecto. `SUITE-R47`.

```
selftest    307 → 315 casos
cobertura   96/173 reglas
```

## Lo que aprendí arreglando `PT-024`

`PT-024` arregló el cierre prematuro y la CI de `main` **volvió a fallar**, con otro mensaje. Eso
fue el dato: no era un descuido con una ventana de tiempo, era estructural. `main` tiene el
registro del **momento del merge**; el tablero refleja el trabajo, que sigue. Cualquier cosa que
el tablero publique desde la rama de trabajo hace fallar a `main`, y publicar es lo que el
tablero existe para hacer.

Si no hubiera vuelto a mirar después de `PT-024`, habría entregado una corrección que trata un
síntoma y deja la causa. Dar por buena la primera explicación que encaja es lo que hizo falta
para llegar aquí, y no lo hice yo: lo forzó que el usuario mirase la CI dos veces.

## Por qué informar y no callar

Las divergencias se enumeran igual, marcadas `INFORMATIVO`, y el mensaje dice dónde sí se decide.
Un paso que desaparece se lee como «no hay nada que mirar»; uno que informa deja el dato a la
vista sin convertirlo en un rojo que nadie puede arreglar desde ahí.

Y la **comparación no cambia con la rama**: `compararEspejo()` sigue siendo la misma función
pura. Un detector que cambiara de criterio según dónde corre serían dos detectores divergiendo,
que es `SUITE-R38` exactamente.

## Lo que un revisor debería atacar

**1 · Esto reduce lo que `main` bloquea, y eso siempre merece sospecha.** El argumento es que
esa comprobación ahí no puede pasar nunca, no que estorbe. Si alguien demuestra un estado en el
que `main` y el tablero deberían coincidir, la regla está mal y yo he apagado una compuerta.

**2 · `esRamaPorDefecto()` compara nombres de rama.** En CI, `rev-parse --abbrev-ref HEAD` puede
devolver `HEAD` con checkout desprendido — y entonces bloquea, que es el lado seguro, pero
significa que en algunas configuraciones de CI la rama principal seguiría en rojo permanente.
**No lo he probado en el runner**; lo sabré con el próximo merge.

**3 · `AC-05` está `PENDIENTE`, no verde.** Que la CI de `main` quede verde tras el merge es lo
único que prueba la tarea, y solo se comprueba mergeando. Ponerlo en verde antes sería el falso
verde que este marco existe para cazar.

## Lo que NO he verificado

Nada más de lo dicho: el comportamiento real en el runner de GitHub. Es lo que decidirá si esta
tarea sirvió o si hace falta una tercera.

SELF_REVIEW_COMPLETE
