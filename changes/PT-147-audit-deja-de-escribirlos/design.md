# PT-147 · `design.md` — `PHASE 4` Proposal

## 1. Un mapa, no dos

```js
// hoy
const PROMPTS   = { FDGE, Foundation, QA, PTSA, FPGE };          // 5
const esperadas = { FDGE, Foundation, QA, PTSA };                // 4
for (const [comp, nums] of Object.entries(esperadas)) { … }
```

El bucle recorre `esperadas`. **Lo que no esté ahí no aparece** — ni en rojo ni en amarillo.

Después, la fuente es **el contrato**, y las dos proyecciones salen de él:

```js
for (const c of COMPONENTES) {
  const prompt = rd(promptsDe(c.nombre)) ?? '';
  const rango  = fasesDe(c.nombre);
  …
}
```

Recorrer `COMPONENTES` en vez de un mapa a mano es lo que hace **imposible** que un componente se
quede fuera: si está en la suite, está en el bucle.

## 2. `SIN_EVALUAR` se muestra, no se omite

```js
if (rango === SIN_EVALUAR) {
  // FPGE: LEXICON §3 no tiene apartado para el. Se DICE, no se salta.
  // Un componente omitido es indistinguible de uno que pasa; uno declarado
  // SIN_EVALUAR dice exactamente lo que se sabe y lo que no (RULE-06).
}
```

**La diferencia entre «no aparece» y «aparece como no evaluable» es toda la tarea.** Hoy `FPGE` y
`FIDE` no aparecen, y eso es indistinguible de que estuvieran bien.

## 3. El ternario de `:214` desaparece

```js
const sigla = comp === 'Foundation' ? 'FND' : comp;   // hoy
const sigla = siglaDe(c.nombre);                       // despues
```

Es la evidencia más limpia del lote: **no era una lista repetida, era una excepción codificada
como condicional**. `PT-144` la usó como caso de prueba del diseño —si `sigla` no fuera un campo,
este ternario tendría que seguir existiendo en otro sitio— y aquí se cobra.

Y **cubre un caso que el ternario no tenía**: `FQAGE` se llama `QA` en rutas y triggers
(`LEX-R03`). `audit` no lo necesitaba porque usa la sigla como clave, pero al recorrer
`COMPONENTES` la clave pasa a ser el **nombre**, así que `siglaDe()` deja de ser un adorno.

## 4. `RC-04` — la comprobación que impide que el hueco vuelva

Un componente que declare rango en `LEXICON` y al que `audit` no mire **se nombra**. Sin eso,
`FIDE` y `FPGE` entran hoy y el séptimo componente se queda fuera mañana **por el mismo
mecanismo**: alguien añade la entrada a un mapa y olvida el otro.

Con el bucle sobre `COMPONENTES` el hueco es estructuralmente imposible, pero **`RULE-02` pide una
comprobación que pueda fallar**, no una imposibilidad afirmada.

## 5. Rama propuesta — **no se crea aquí** (`FDGE-R13`)

```
refactor/alberto-martinez/PT-147-audit-deja-de-escribirlos
```
