# PT-033 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`CORE.md` —lo único que el agente carga— **abre** con la consulta al tablero, antes que las
reglas. Y `SUITE-R49` define **qué significa consultado**, que hasta ahora no significaba nada.

```
selftest    340 → 349 casos
cobertura   98/175 reglas
```

## Los tres huecos que estaban abiertos

Sin definir «consultado», tres preguntas se respondían solas y mal:

```
¿vale la consulta de hace tres turnos?   → no: vale para UN turno
¿vale recordar lo que dijo?              → no: la salida ES la respuesta
¿y si no hay plataforma?                 → SIN EVALUAR, declarado
```

Por los tres se colaba exactamente el comportamiento que esto quiere impedir.

## `AC-03` no se logró, y lo digo aquí primero

Pedía que ninguna fase avanzara «sin que la consulta conste». **No hay forma de que conste.** El
agente ejecuta el comando en su proceso y no queda nada escrito. Registrarlo en el repositorio
sería un artefacto que el agente escribe sobre sí mismo — la misma prueba circular que
`SUITE-R27` declara insuficiente para las firmas, y que yo mismo cité contra el merge.

`verified: false` en el manifiesto, `NO VERIFICADO` en la trazabilidad. Es el segundo lote
seguido en que entrego menos de lo pedido; la diferencia es que esta vez el hueco tiene tarea:
`PT-034` lo cierra por otra vía —si el tablero es el **punto de entrada**, no hace falta que la
consulta conste porque no hay entrada sin ella.

## Lo que un revisor debería atacar

**1 · Una convención bien redactada no arregla el problema, lo hace nombrable.** Sigo pudiendo
ignorarla. Lo que cambia es que ahora hay un texto contra el que contrastar y está en el primer
sitio que se lee. Si alguien espera más de esta tarea, esperará mal.

**2 · «Un turno» no está definido mecánicamente.** Un turno es lo que yo entienda por turno. Es
la parte más floja de `SUITE-R49` y no sé cerrarla sin inventar un contador que el agente
también escribiría.

**3 · El caso del orden es el que más vale y el más frágil.** Comprueba que `LO PRIMERO` va
antes que `## Fases` por número de línea. Si alguien reordena `CORE.md` con otra estructura, el
`grep` deja de encontrar la ancla y el caso pasaría por buenas razones equivocadas.

## Lo que NO he verificado

Que esto cambie mi comportamiento. Lo mismo que dije en `PT-030`, y sigue siendo verdad.

SELF_REVIEW_COMPLETE
