# Estrategia — `PT-143`   `PHASE 3`

## El camino elegido

Excluir los **valores de bandera** usando `CON_VALOR`, que ya existe, y contrastar el resultado
contra los prefijos que `LEXICON` declara.

## Los caminos descartados, con su por qué

**1 · Exigir el prefijo siempre.** Descartado: rompería toda invocación existente y el defecto por
omisión —`PT`— es el correcto en la inmensa mayoría de los casos.

**2 · Excluir sólo `--tipo`.** Descartado: sería perseguir el síntoma. Cualquier bandera futura
con valor en mayúsculas volvería a colarse, y `CON_VALOR` ya sabe cuáles son.

**3 · Un analizador de argumentos general para el tracker.** Descartado: es un cambio estructural
encima de una batería de 1600 casos. Aquí se arregla **la lectura del prefijo** y lo demás se
declara.

**4 · Aceptar prefijos nuevos silenciosamente.** Descartado: crear un espacio de nombres que
ningún contador reconoce es peor que fallar.

## Cómo se verifica

Cinco casos sobre fixture: sin prefijo con `--tipo BUG`, que el identificador no lleve el tipo, un
prefijo declarado, uno inventado, y que el error **enumere** los válidos.
