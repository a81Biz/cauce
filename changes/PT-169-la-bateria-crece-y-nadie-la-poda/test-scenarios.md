# `PT-169` · `test-scenarios.md` — `PHASE 4`

| TS | Qué prueba | Cómo puede fallar | Mecanismo |
|:---|:---|:---|:---|
| `TS-01` | Un fixture cuya mutación **no cambia nada** se caza | se quita `muta` de `rot144` | `chk` · `FIXTURE_HUECO` |
| `TS-02` | …y dice **qué archivo** quedó intacto | el mensaje deja de nombrarlo | `chk` · `patrones.mjs` |
| `TS-03` | Una mutación **real** no se marca como hueca | `muta` empieza a fallar siempre | `chkno` |
| `TS-04` | `--solo` con un patrón real sigue casando su caso | la selección de secciones se equivoca | medido: `1 de 1749`, en verde |
| `TS-05` | `--solo` acota de verdad | vuelve a correr el arnés entero | medido: **252 s → 47 s** |
| `TS-06` | `audit` publica la adopción con **denominador** | se convierte en porcentaje | `3 de 61` |
| `TS-07` | `SUITE-R61` la emite un verificador **que viaja** | vuelve a comprobarla sólo el arnés | `regla.mjs SUITE-R61` |

## `TS-03` es el freno, y sin él `TS-01` no vale

Un `muta` que **fallara siempre** pasaría `TS-01` y `TS-02` y sería **peor que el defecto**: todos
los casos que mutan algo se volverían rojos y alguien quitaría el mecanismo entero. Es la misma
trampa que `PT-096` documentó con su `TS-04` y `PT-095` con su inversa en cero.

## `TS-04` es el que casi se pierde

La primera medición de `--solo` fue con `PT-098` como patrón, y dio **cero casos**. Parecía una
regresión y **no lo era**: el patrón casa **nombres de caso**, y los nombres de ese bloque no
contienen «PT-098» — daba cero **antes también**. Sin comprobar con un nombre de caso **real** se
habría dado por rota una selección que funciona, o por buena una que no.

## Lo que estos casos NO establecen

- Que la adopción de `muta` **avance**. `TS-06` publica la cifra; que suba es decisión de quien
  escriba el próximo fixture, y `SUITE-R61` lo obliga a mirarla, no a moverla.
- Que la cuenta por patrón que un lote publique sea **completa**. No es mecanizable
  (`SUITE-R26`): la regla impide el silencio, no el error de quien cuenta.
- Que la batería completa sea más rápida. **No lo es**, y se dice: lo que se abarató es iterar.
