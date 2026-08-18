# PT-051 — Diseño   `PHASE 4`

## El cambio, en una función

```js
// tools/regla.mjs:66-80   lo que hay
for (const m of String(texto).matchAll(RE)) {
  const [, tipo, id] = m;
  …
  e.herramientas.add(archivo);        // ← el m.index se descarta aqui
}
```

Se conserva la emisión completa, y lo que ya se publicaba se **deriva** de ella:

```js
e.emisiones.push({ archivo, linea: lineaDe(texto, m.index), tipo });
// y al devolver:
herramientas: [...new Set(e.emisiones.map((x) => x.archivo))].sort()
bloquea:      e.emisiones.some((x) => x.tipo === 'fail')
avisa:        e.emisiones.some((x) => x.tipo === 'warn')
```

**La forma pública no cambia.** `regla --fallos` y `regla <ID>` siguen leyendo lo mismo, y por eso
el único caso existente que toca esta función sigue en verde.

## `lineaDe`, y la única forma correcta de escribirla

```js
const lineaDe = (texto, indice) => texto.slice(0, indice).split(RE_LINEA).length;
```

**`indice` es `m.index`, no `texto.indexOf(m[0])`.** Con dos emisiones idénticas —el caso real:
`fail('SUITE-R35', …)` dos veces en `verify-fdge.mjs`— `indexOf` devolvería **la misma línea para
las dos**, y esa línea sería plausible. `PT-043` documentó exactamente ese defecto en la lectura
de las entradas `CORRIGE`.

Se cuenta con `RE_LINEA` de `patrones.mjs`, que ya existe y contempla `\r\n`: contar con `\n` a
secas daría la línea correcta igualmente, pero habría **dos** formas de partir líneas en el
repositorio, y eso es lo que `SUITE-R38` prohíbe.

## La salida

```
$ regla SUITE-R35 --donde
  SUITE-R35   tracker.mjs:NNN         fail
  SUITE-R35   verify-fdge.mjs:NNN     fail
  SUITE-R35   verify-fdge.mjs:NNN     warn
```

Ordenada por archivo y línea, con el **tipo** al lado: `fail` y `warn` son cosas distintas —una
bloquea y la otra no— y una regla que se emite de las dos formas lo hace en sitios distintos por
razones distintas.

Y sin verificador:

```
$ regla SUITE-R22 --donde
  SUITE-R22   ningún verificador la emite con su nombre.
              62 reglas están así (TD-08): es deuda MEDIDA, no un fallo de esta consulta.
```

La cifra **se cita**, no se recalcula: `audit` es quien la mide, y tener dos sitios que la
calculen es el defecto que este marco persigue.

## Lo que este diseño **no** hace

No cambia `regla <ID>` sin la bandera. No toca `audit`. No abre un editor. Y no intenta
**adivinar** qué comprueba una regla que no se emite con su nombre: si no hay `fail('ID')`, no hay
línea, y decirlo es la respuesta.
