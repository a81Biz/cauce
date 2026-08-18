# PT-059 — Autorrevisión   `PHASE 6`

## Lo entregado

```
tracker viabilidad PT-NNN          ¿se puede empezar esto AHORA?
viabilidadDe(...)                  pura · SAFE | MARGINAL | UNSAFE, con motivo
SAFE · MARGINAL · UNSAFE · HOLGURA
BLOCKED_BY_CONTEXT                 estado de tarea · VIVO, no terminal
LEXICON §4 y §6.5d                 el vocabulario · sin regla nueva
casos                              738 → 784
```

## El descubrimiento que invalidó el enunciado

La compuerta se pedía así: *«nunca comenzar una unidad de trabajo que probablemente no pueda
completarse dentro del presupuesto disponible»*. `PHASE 2` midió que **ese presupuesto no existe**:

```js
restar(cifra(null, SIN_EVALUAR), cifra(14319, MEDIDO))
  →  { valor: null, naturaleza: 'SIN EVALUAR' }
```

`total` es el contexto del modelo y el marco no puede medirlo. Así que el disponible es
`SIN EVALUAR` **siempre**, y una compuerta que compare contra él nunca tendría con qué comparar.

**La pregunta se cambió por una que sí se puede responder:** *¿ha completado ya esta sesión algo
del tamaño de lo que viene?* Eso mide **precedente**, no capacidad, y el precedente sí está en el
repositorio — seis sesiones, de 6 812 a 29 286 líneas.

## La decisión difícil, y por qué no es la prudente

Con una cifra `SIN EVALUAR`, ¿qué devuelve la compuerta?

- `SAFE` sería **aprobar por omisión**: verde justo cuando menos se sabe.
- `UNSAFE` suena prudente y es **peor**: como el disponible es `SIN EVALUAR` siempre, bloquearía
  **todo trabajo para siempre**. Una compuerta que bloquea siempre se apaga a la semana — y
  entonces no protege el día que tiene razón.

`MARGINAL`: **no apruebo, y no invento un motivo para prohibir.** `UNSAFE` queda reservado a
evidencia **en contra**, que no es lo mismo que ausencia de evidencia a favor.

Es la misma frontera que las tres tareas anteriores del lote: no confundir «no sé» con «no».

## El caso que ningún otro cubre

De los cuatro que caen en la inversa, uno vigila algo que no es contenido sino **orden**:

```
«y se decide ANTES que el SIN EVALUAR»   →  false
```

`AC-06` —«nunca cabría»— se comprueba **primero**. Si se moviera detrás del `SIN EVALUAR`, una
tarea que no cabe en ninguna sesión saldría `MARGINAL` por faltar el precedente, y el bucle
infinito que `AC-06` existe para impedir volvería **sin que ningún otro caso se enterara**.

El segundo que importa: `«coste SIN EVALUAR ⇒ MARGINAL»` salió `SAFE`. Como el disponible es
`SIN EVALUAR` siempre, esa sería la respuesta **normal** de la compuerta: aprobaría todo
pareciendo que ha evaluado algo.

## Sobre el repositorio real

```
PT-059 · CHORE/STANDARD
  coste tipico    1982 (ESTIMADO)   de 15 cerradas
  mayor hecho     2703 (MEDIDO)     en esta sesion
  techo historico 29286 (MEDIDO)
  veredicto       SAFE
```

Las tres cifras llegan con su naturaleza pegada, que es exactamente lo que `PT-058` dejó para esto.

## Lo que no queda comprobado

**Que el veredicto acierte.** La señal es ruidosa por construcción: la sesión mayor hizo cuatro
veces más que la menor.

**Que `HOLGURA = 1.5` sea el número.** Es un juicio declarado.

**Que `AC-06` se dispare alguna vez.** Hoy la mayor referencia es el 7 % del techo. La salvaguarda
existe sin activarse — probada, no observada.

**Que alguien obedezca un `UNSAFE`.** Nada impide seguir. Lo que queda es que el motivo esté
escrito **antes** de empezar, no después de quedarse a medias.

**Y una que es un límite del método, no del código:** «un día» es una mala aproximación a «una
sesión». Dos sesiones el mismo día cuentan como una; una que cruza la medianoche, como dos. Es lo
único observable desde git, y el precedente hereda ese error. Nada en el repositorio registra
cuándo empieza y acaba una sesión — que es, precisamente, lo que `PT-060` va a tener que resolver.
