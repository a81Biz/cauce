# `PT-167` · `test-scenarios.md` — `PHASE 4`

| TS | Qué prueba | Cómo puede fallar | Mecanismo |
|:---|:---|:---|:---|
| `TS-01`..`TS-04` | Caza los **cuatro** invertidos conocidos | el discriminador se afloja o se rompe | `chk` ×4 · `CAZA` |
| `TS-05`..`TS-07` | **No** caza los tres legítimos de `PT-149` | el barrido se amplía y mata lo que protege | `chk` ×3 · `NO_CAZA` |
| `TS-08` | El árbol real no tiene casos invertidos | aparece uno nuevo | `audit` · cuenta `0` |

## `TS-05`..`TS-07` son el freno

Sin ellos, **un barrido que cazara todo pasaría `TS-01`..`TS-04`** y mataría los tres casos de
`PT-149` que prueban que el contrato **no puede encoger** — es decir, mataría exactamente lo que
impide que aquella corrección fuera un apagado.

## `TS-01`..`TS-04` entran como fixture, y no por comodidad

`PT-156` ya reescribió los cuatro, así que el árbol da **cero**. Un barrido que no caza nada **es
indistinguible de uno roto**: es la trampa que `PT-095` documentó con su inversa en cero.

## `TS-08` estuvo mal escrito y salió en rojo a la primera

Esperaba la cadena `SUITE-R61` de la salida de un `grep -c`, que devuelve **un número**. **Nunca
podía pasar** — y eso es lo que un caso mal escrito debe hacer. Es el patrón `hueco` por el otro
lado: no finge probar, es que no puede.

## Lo que estos casos NO establecen

Que no exista un caso invertido con **otra forma**. El barrido conoce lo que `gap()` emite hoy.
