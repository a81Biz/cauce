# PT-054 — Autorrevisión   `PHASE 6`

## Lo entregado

```
tracker proyectar [--publicar]     escribe cauce/<usuario> SIN tocar el arbol
avanzar                            la llama, la ULTIMA de sus siete actos
casos                              603 → 618
```

## Lo que hace posible el diseño

```
hash-object -w  ->  mktree  ->  commit-tree  ->  update-ref
```

**Ninguno toca el directorio de trabajo.** Comprobado ejecutando: antes y después de proyectar,
la rama y los archivos son los mismos. Las alternativas —`worktree`, `checkout`— tocan el
directorio donde se está trabajando, y la peor deja al usuario **en otra rama** si falla a mitad.

## La proyección enseñó algo a la primera

```
| PT-049 | CHORE | DONE | 9 | chore/PT-049-... | — |
| PT-054 | CHORE | IN_PROGRESS | 6 | chore/PT-054-... | e3501e6 |
```

Las ramas de `PT-049`..`PT-053` **se borraron al fusionar**, así que su SHA sale `—`. **No hereda
uno prestado**: `AC-04` y `RULE-06` funcionando sin que nadie lo forzara. Un SHA de otra rama
habría sido plausible y falso, que es la peor combinación.

## Corregí mi propia estrategia al implementarla

En `PHASE 3` escribí: *«va dentro del respaldo de `avanzar`: si la proyección falla, la transición
entera se revierte»*.

**Es imposible.** La nota ya se publicó y un comentario no se despublica. Revertir los archivos
dejaría **una nota sobre una transición que el registro niega** — exactamente el registro falso que
todo ese orden existe para impedir.

Lo correcto es lo contrario: la proyección es **lo más recuperable de todo** —enteramente derivada,
se rehace con un comando— así que va **la última** y su fallo **no revierte nada**. La transición
ya ocurrió y está registrada; la proyección es una vista.

**Lo razoné mal y lo dijo implementarlo.** Está corregido en el código, con el porqué escrito
donde se toma la decisión.

## `avanzar` acabó con siete actos, no cinco

```
1 registro   2 YAML   3 checkpoint   4 sello del HANDOFF
5 espejo     6 nota   7 proyeccion
```

Y **los dos que se descubrieron los dijo ejecutar, no leer**: el espejo lo dijo `npm run verify`,
el sello lo dijo la CI. El diseño de `PT-053` listaba cinco.

Eso es, en sí, la medida de por qué el comando hacía falta: **si un humano tenía que acordarse de
siete actos, se olvidaba de dos incluso cuando su única tarea era enumerarlos.**

## La marca, y por qué no es un adorno

Una rama derivada en la que alguien escribe **deja de serlo**, y `cauce/alberto` con un commit
humano se ve **exactamente igual** que sin él. La marca `cauce:proyeccion` es lo único que los
distingue, y un commit sin ella se **reporta** — no se borra: decidir qué hacer con el trabajo de
alguien es humano (`SUITE-R06`).

Es el mismo mecanismo que `SUITE-R43` usa con las notas del agente, y tiene el mismo límite: es
**falsificable**, como una firma. Por eso se declara en vez de presumirse.

## Publicar es una decisión, no un efecto colateral

`--publicar` no va en `avanzar`. Empujar en cada transición daría la visibilidad **sin ningún acto
manual** —que es lo que este lote persigue— pero convertiría un acto de **publicación** en un
efecto colateral.

**La frontera que se respeta: el lote quita los actos de registrar, no los de publicar.** Lo asumo
a sabiendas y está en el `out-of-scope` con su porqué.

## Lo que no resuelve

**La convivencia de dos personas.** Aquí el usuario es uno, el de `git config`. Que dos
proyecciones no se pisen es `EP-016`, y esta tarea le deja el **mecanismo hecho** para que solo
tenga que añadir la identidad.

Y **que alguien mire la proyección**. Se comprueba que exista, que agregue y que diga la verdad;
que sirva para lo que se pidió solo lo dirá usarla.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
