# `PT-167` · `strategy.md` — `PHASE 3`

## Se descartaron dos criterios antes de dar con el bueno, y las cifras lo dicen

| Criterio | Falsos positivos |
|:---|---:|
| Comparar con la **explicación** del hueco —el tercer argumento de `gap()`— | **30** |
| Comparar con el **esqueleto** del identificador | **9** |
| El **identificador instanciado** con los valores que `COMPONENTES` declara | **0** |

«PHASE» aparece en media metodología; **`FIDE PHASE` no aparece en ningún documento**. Sólo lo
emite `audit`, y sólo cuando algo falta. Ése es el discriminador.

Un barrido con 30 —o con 9— falsos positivos **se desactiva en la primera corrida**, y un
verificador desactivado es peor que ninguno (`SUITE-R60`). La diferencia entre los tres criterios
no es de estilo: es la que decide si el barrido sobrevive a su segunda semana.

## Sale como candidato, no como fallo

Un caso que prueba que **una regla puede fallar** asierta exactamente lo mismo que un caso
invertido, y es lo **contrario** de un defecto: `PT-149` tiene tres, y son lo que impide que su
corrección fuera un apagado disfrazado.

La diferencia es de **intención**, y la intención no está en el texto (`SUITE-R26`). Por eso el
barrido publica una lista para mirar, y por eso hay tres casos que fijan que **no** los mate.

## Por qué los cuatro conocidos entran como fixture

`PT-156` ya los reescribió, así que hoy el árbol da **cero**. Un barrido que no caza nada y no
puede demostrar que cazaría **es indistinguible de uno roto** — es la misma trampa que `PT-095`
documentó con su inversa en cero. Los cuatro se reintroducen como cadenas de prueba.
