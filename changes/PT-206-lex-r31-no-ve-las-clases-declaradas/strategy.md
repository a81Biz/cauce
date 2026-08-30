# `PT-206` · `strategy.md`

## La decisión

**La clase se lee hasta el identificador, y lo que venga detrás es descripción.**

```js
const RE_CLASE_EVENTO = /^Clase de evento:[^\S\r\n]*(CE-\d{3})\b/im;
export function claseDeEvento(texto) { … }
```

Anclar a fin de línea confundía **«declarada»** con **«declarada de una forma concreta»** — y la
forma concreta era la **minoritaria**. Lo que la regla quiere saber es **si hay clase**, no cómo se
escribió.

`[^\S\r\n]` es espacio horizontal: espacio o tabulador, **nunca** el salto. Con `\s` se tragaría la
línea siguiente, que es el mismo cuidado que `PT-198` tuvo con `campoDeIntake`.

## Dónde vive, y por qué ahí

**`patrones.mjs`, con su contrato.** Es el módulo declarado de los patrones críticos y
`verify-patrones` los comprueba — un patrón crítico en el consumidor no lo vigila nadie, que es la
razón por la que `PT-198` encontró siete copias.

## Lo que NO se hace, y es la decisión más importante

**No se unifica con `eventos.mjs`.** Miden **cosas distintas**: `eventos` deduce la clase de lo que
la entrada **cuenta**; `LEX-R31` comprueba que la entrada la **declare**. Fundirlas sería inventar
un `SUITE-R38` que no existe — y lo escribí como si existiera **antes de comprobarlo**, así que se
declara.

## `AC-02` gobierna la forma

Un regex que **acepte cualquier cosa** cumple `AC-01` y **apaga la regla**. Por eso sus dos casos
no son opcionales: una entrada **sin** clase devuelve `null`, y la etiqueta **sin identificador**
tampoco cuenta. Sin ellos, «arreglar» `LEX-R31` sería quitarla.

## `AC-04`: se cuenta la familia, no se fija

Once expresiones anclan un campo a fin de línea; **cinco** exigen un valor concreto y ahí el riesgo
es real. **La cifra se declara** en la evidencia y en `HISTORY` — fijarla en un caso sería fijar
**el número de lo correcto** (`HANDOFF -18`) y además caducaría (`CE-010`).

Lo que **sí** se fija es un **cero**: que la expresión vieja ya no se **usa**, sólo queda citada en
el comentario que la documenta.

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** que `LEX-R31` vea las que se declaran, en un solo sitio con contrato, y la cifra de la
familia.

**Fuera, y consta:** las cinco expresiones en riesgo **no se arreglan** —ninguna ha fallado
todavía—; `LEX-R31` sigue avisando; no se retrofecha nada; y no se unifica con `eventos.mjs`.
