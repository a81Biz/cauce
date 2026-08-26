# `PT-149` · `design.md` — `PHASE 4`

## 1. El colador de `CORE.md`

```js
const completa = (bloque, comps, linea) => {
  const faltan = comps.filter((c) => !bloque.includes(c.marca));
  return faltan.length ? bloque + '\n' + faltan.map(linea).join('\n') : bloque;
};
```

Tres líneas, y resuelven la mitad del criterio de éxito del lote. Se aplica a los **dos** bloques
que dependen de qué componentes hay:

| Bloque | Marca de presencia | Línea derivada |
|:---|:---|:---|
| Fases | la sigla al principio de línea | `ZT    1-3  — declarado en el contrato; su recorrido, en LEXICON §3` |
| Triggers | su primer trigger | `[START ZETA]` |

**Al aplicarlo apareció algo que nadie buscaba: `FIDE` no estaba en el mapa de fases**, teniendo
`fases: [1, 5]` declaradas desde `PT-144`. Cinco componentes tecleados de seis, y el ausente no
daba error.

## 2. La corrección asimétrica de `verify-patrones`

```js
const LOS_SEIS = ['FDGE', 'FQAGE', 'PTSA', 'Foundation', 'FPGE', 'FIDE'];
const perdidos = LOS_SEIS.filter((x) => !nombres.includes(x));
if (perdidos.length) { … }
```

**Crecer sí, encoger no.** La lista sigue escrita —`SUITE-R60` excluye expresamente a
`verify-patrones` de su barrido, porque es la **prueba** del contrato— pero ya no como techo.

Igual para `opcionales()`: se exige que **contenga** `FIDE`, que es el hecho que
`verify-suite.mjs:425` y `comparar-marco.mjs:39` escribían cada una por su cuenta con dos nombres
distintos (`FIDE-R01`), no que sea el único.

## 3. Los nueve casos

```
1  el alta toca UN solo archivo               diff -rq base alta  →  1 línea
2  build-core lo cuela en CORE con sus fases  ^ZT
3  …y con su trigger                          [START ZETA]
4  audit lo audita                            Zeta 1-3
5  …contando, no de pasada                    (7 de 7)
6  verify-patrones admite el séptimo          Todos los patrones cumplen
7  verify-suite recoge el prefijo nuevo       ZTA ∈ prefijos()
8  perder uno de los seis SIGUE siendo rojo   «el contrato no puede perder ninguno»
9  la baja deja el árbol byte a byte          diff -rq base alta  →  0 líneas
```

**El 8 es el que impide que esto sea una desactivación disfrazada**, y el 9 es el que convierte
la prueba en prueba: «restable» sin él significaría sólo que el componente deja de funcionar, no
que se pueda quitar.

**El 4 y el 5 no asertan sobre `<comp> PHASE <n>`**, aunque sería lo natural: esas líneas sólo se
emiten como hueco, y `audit` las da por cubiertas si el número aparece en cualquier sitio
(`PT-168`). Se aserta sobre la anchura, que sí deriva de `COMPONENTES`.

## 4. El fixture

`Zeta` · sigla `ZT` · prefijo `ZTA` — **los tres distintos entre sí**. Si coincidieran, las
aserciones podrían pasar por parecido en vez de por mecanismo. Es el caso irregular de
`Foundation → FND` que `PT-147` convirtió en campo del contrato.

## 5. Lo que este diseño NO resuelve

- `audit` sigue dando por cubierta una fase que no está → **`PT-168`**
- El paso 2 de `E5` —la tabla de `LEXICON` §3— sigue siendo trabajo humano de redacción. Ninguna
  máquina puede escribirla, y `SUITE-R26` dice que eso se declara en vez de fingirlo.
