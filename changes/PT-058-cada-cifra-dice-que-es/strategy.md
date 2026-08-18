# PT-058 — Estrategia   `PHASE 3`

## Lo que se construye

Un **tipo**, no una convención de redacción:

```js
cifra(1974, MEDIDO)        →  { valor: 1974, naturaleza: 'MEDIDO' }
cifra(1974, ESTIMADO)      →  { valor: 1974, naturaleza: 'ESTIMADO' }
cifra(null, SIN_EVALUAR)   →  { valor: null,  naturaleza: 'SIN EVALUAR' }
cifra(1974)                →  lanza: una cifra sin naturaleza no entra
```

Y las operaciones que `PT-059` va a necesitar, con la regla de contagio:

```js
restar(a, b)   MEDIDO   − MEDIDO   = MEDIDO
               MEDIDO   − ESTIMADO = ESTIMADO      la peor gana
               cualquiera con SIN EVALUAR = SIN EVALUAR, y el valor es null
```

## Las cuatro decisiones

### 1. `SIN EVALUAR` lleva `valor: null`, no `0`

Es `AC-03` en su forma más directa. Un `0` sobrevive a cualquier suma y desaparece del resultado;
un `null` no. Y la operación **no revienta**: devuelve `SIN EVALUAR` con `valor: null`, que es la
respuesta correcta —no se sabe— en vez de un error que alguien capturaría con un `?? 0`.

**Es la misma decisión que `PT-056` y `PT-057` ya tomaron dos veces**: `corresponde: null`,
`referencia: null`. No saber tiene su propio valor.

### 2. La naturaleza **contagia hacia la peor**

`MEDIDO < ESTIMADO < SIN EVALUAR`, y el resultado de operar es siempre la peor de las entradas.
Una resta entre un dato medido y una estimación **es** una estimación: presentarla como medida es
exactamente lo que la decisión 4 prohíbe.

El orden es total y está en una constante, no repartido por `if`s.

### 3. Una cifra sin naturaleza **lanza**, no asume

`AC-04` dice que no se asume la más favorable. Podría asumirse la **peor** —`SIN EVALUAR`— y sería
conservador, pero convertiría un olvido del programador en un dato válido que se propaga en
silencio. Lanzar es lo único que lo detiene donde se escribió.

Es la diferencia entre un marco que se defiende de sus datos y uno que se defiende de sí mismo.

### 4. El vocabulario va a `LEXICON`, y se comprueba que **no haya un cuarto**

`AC-02` pide vocabulario cerrado. Se hacen dos cosas:

- Las tres naturalezas entran en `LEXICON` con su contrato — lo que **regulariza los 50 usos de
  `SIN EVALUAR` que ya existen** en trece archivos y que `LEX-R21` lleva ocho lotes prohibiendo
  sin que nadie lo notara.
- `verify-suite` gana una comprobación: si aparece un cuarto valor en el conjunto exportado, falla.
  No se persigue el idioma en prosa —eso es lo que `SUITE-R44` ya decidió no hacer— se comprueba
  **la constante**, que es donde el vocabulario es cerrado de verdad.

## Dónde vive

| Qué | Dónde | Por qué |
|:---|:---|:---|
| `MEDIDO` · `ESTIMADO` · `SIN_EVALUAR` · `NATURALEZAS` | `tools/patrones.mjs` | Es un hecho compartido con contrato — lo mismo que `EXIGIBLE_DESDE` |
| `cifra()` · `naturalezaDe()` · `restar()` · `sumar()` | `tools/patrones.mjs` | Van con el vocabulario que definen |
| El contrato en prosa | `LEXICON.md` §6.5c | `LEX-R21` · antes que el código |
| La comprobación del conjunto cerrado | `tools/verify-suite.mjs` | `AC-02` |

**En `patrones.mjs` y no en `tracker.mjs`** porque `PT-059` lo usará desde `verify-fdge` y
`tracker` a la vez, y `verify-patrones` ya obliga a que cada patrón declare su contrato — que es
justo lo que hace falta aquí.

## Lo que NO se hace

**No se reescriben los 50 usos existentes.** Son mensajes en prosa y funcionan; convertirlos a
`cifra()` es un refactor de trece archivos que no mejora nada hoy y arriesga romper siete
herramientas. Se declara el vocabulario y se usa la estructura **donde hay cifras de presupuesto**,
que es lo que esta tarea gobierna.

**No se añade un cuarto valor** para «medido pero poco fiable». Está en el `out-of-scope` del
intake: una cifra poco fiable **es** una estimación, y eso ya tiene nombre.

**No se decide nada con las cifras.** Eso es `PT-059`.

## El riesgo

Que `cifra()` se convierta en ceremonia: envolver un número para desenvolverlo dos líneas después.
La defensa es que **las operaciones trabajen sobre cifras**, no sobre números — si para sumar hay
que desenvolver, la naturaleza se pierde en la primera suma y todo esto es decorado.

Por eso `restar` y `sumar` entran aquí aunque quien las necesita sea `PT-059`: sin ellas el tipo no
tiene dónde demostrar que sirve, y `AC-03` no sería comprobable.
