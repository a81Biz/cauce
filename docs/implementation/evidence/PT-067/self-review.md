# PT-067 — Autorrevisión   `PHASE 6`

## Lo que cambia, en una línea

```
ANTES    114 / 183   ( 62 % )        un denominador que ignoraba dos de los tres documentos
DESPUES  108 / 223   ( 48 % )        el universo entero, y sólo verificadores de verdad
```

**La cobertura no bajó: bajó la mentira sobre la cobertura.** Nadie escribió menos verificadores.

## Los dos defectos, medidos

`audit` derivaba las reglas con un regex propio que sólo leía filas de `RULES.md` — 183 de 223.
Fuera quedaban las 26 `LEX-*` y las 14 `EXEC-*`, entre ellas **`EXEC-R04`** (merge humano en los
tres modos) y **`EXEC-R07`** (describir el comando en vez de ejecutarlo): dos de las obligaciones
más citadas del marco, invisibles para la métrica que dice cuánto se comprueba.

Y `t.includes(id)` daba por verificada cualquier regla cuyo ID apareciera en un **comentario**:
24 así. Entre ellas **`FDGE-R17`**, que `PT-079` acababa de declarar *no comprobable* en `TD-16`.
Publicar como verificada una regla que sabemos que no lo está es la peor forma del error: no
falla, **miente con formato de respuesta correcta**. Es lo mismo que `PT-066` encontró en
`regla.mjs`, en la herramienta de al lado.

## Por qué la derivación vive en `patrones.mjs`

Porque ya había dos. `PT-066` arregló la de `regla.mjs` y ésta se quedó como estaba — el mismo
patrón, el mismo día, en el mismo directorio. Añadir aquí un tercer regex habría garantizado la
próxima divergencia (`SUITE-R38`). Las dos formas son las que `PT-066` estableció, no unas nuevas.

**`regla.mjs` no migra en esta tarea, y consta**: funciona y está verificado. Cambiar dos
herramientas a la vez es cómo se pierde cuál rompió qué.

## Una decisión que parece pequeña

`reglasDelMarco` **no filtra por prefijo**: acepta cualquier `XXX-Rnn` en prosa, no sólo `LEX-` y
`EXEC-`. Por eso aparecen `FDGE-R22`, `R40` y `R41` — las tres definidas dos veces, que ahora son
`PT-080`. Filtrar por prefijo las habría ocultado, y esconder un defecto para que salga un número
redondo es exactamente lo contrario de esta tarea.

Gana `RULES.md` ante un ID duplicado. No lo arregla: lo hace determinista mientras `PT-080` cierra.

## Mis errores, con la salida delante

**Tres aserciones que no casaban con lo real.** Dos exigían la lista vacía con `^$` — y una salida
vacía **no tiene líneas**, así que `grep` no casa y el caso falla acusando al código. Se
serializan con `JSON.stringify` y se exige `[]`: un valor observable en vez de una ausencia. La
tercera anclaba en `$` un número que va **en medio** de la línea. Me costó una corrida entera.

**Y un `chkno` contra la salida cuando debía ir contra la fuente.** «El desglose no lleva cifras a
mano» comprobado sobre la salida habría fallado siempre: la salida dice `+40` cuando la medida da
40. Es `RULE-01` aplicada al caso mismo — y lo dijo escribirlo mal primero.

Sexto caso de esta familia en el lote. Es justo lo que `PT-079` dejó enumerado con `lint_aserciones`.

## Lo que NO se verifica, y está declarado

Que una cita dentro de una condición **que puede fallar** se distinga de una que no. Eso es
análisis estático de verdad, y `SUITE-R26` dice que esta métrica aspira, no exige: una medida
honesta y simple vale más que una sofisticada que nadie audita.

`AC-01`..`AC-05`, los cinco. `selftest` 1042 → **1058**, cero fallos.
