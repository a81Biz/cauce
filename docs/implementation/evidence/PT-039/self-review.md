# PT-039 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`SUITE-R52`. El núcleo abre preguntando **qué es** un mensaje, antes incluso de consultar el
tablero — porque consultar el tablero ya es tratarlo como trabajo.

```
selftest   382 → 391 casos
```

## Lo que hace que esto pueda funcionar

**No se pide acertar.** Se pide no decidir en silencio. Una línea al principio, corregible. El
coste de equivocarme pasa de ser un lote inventado o un trabajo perdido a ser **una frase**.

Es el mismo principio que `SUITE-R27` aplica a las firmas: lo mecanizable no es la sinceridad,
es que la afirmación sea **contrastable**.

Y el criterio no es nuevo: `FDGE-R53` lleva desde siempre exigiendo condición de terminado a todo
intake. La distinción estaba a medio usar, no faltaba.

## El defecto que apareció al usarlo, y por qué importa

Ejecuté `tracker siguiente EP-011` —lo primero que `SUITE-R49` obliga y que **no había hecho ni
una vez en toda la sesión**— y falló: `ROOT` excluía `PT-\d+` y no `EP-\d+`, así que el
identificador del lote se tomaba como ruta.

No es una anécdota. `PT-030` añadió esa forma y no tocó el filtro; yo escribí las dos cosas. **El
defecto llevaba días ahí y apareció en el primer intento de usar la herramienta para trabajar en
vez de para demostrar que funcionaba.**

## Lo que un revisor debería atacar

**1 · La distinción sigue siendo un juicio mío.** Una petición mal declarada como conversación
pierde trabajo igual que antes; lo único que cambia es que ahora se ve. Un revisor podría exigir
algo más fuerte, y tendría razón en que esto es lo mínimo, no lo suficiente.

**2 · «Condición de terminado» es más fácil de reconocer en un intake escrito que en un mensaje
hablado.** «Arregla esto» no la lleva explícita y es claramente una petición. La regla dice que
se pueda **escribir**, no que venga escrita — y eso deja margen.

**3 · Puse la sección antes de `SUITE-R49` y eso es una afirmación sobre prioridades.** Si alguien
sostiene que consultar el tablero debe ir siempre primero, el orden es discutible. Mi argumento
es que preguntar «qué sigue» ante una conversación ya es tratarla como trabajo.

## Lo que NO he verificado

Si esto cambia mi comportamiento. Cuarta vez que lo escribo en cuatro tareas, y sigue sin
poderse verificar desde dentro.

SELF_REVIEW_COMPLETE
