# `PT-206` · self-review

## Lo que se sostiene

- **`AC` verificados: 4, ninguno huérfano.** Siete casos sobre cuatro escenarios.
- **Medido antes y después, sobre el árbol real:**

```
entradas que DECLARAN una clase :  76
que LEX-R31 veia ANTES          :  22
que ve AHORA                    :  76
avisos falsos sobre el arbol    :   0
```

**Tres de cada cuatro entradas que cumplían la regla salían como incumpliéndola.**

- **Es el defecto de `PT-198` en otra herramienta**: un regex anclado a fin de línea que rompe ante
  contenido legítimo detrás, y un mensaje que afirma «no lo declara» cuando sí.

## Una afirmación mía que era falsa, corregida **antes** de construir sobre ella

En la parada escribí: *«`eventos.mjs` sí las cuenta, así que el mismo hecho se lee de dos formas y
una se equivoca — `SUITE-R38`»*. **Lo comprobé y es falso.**

```js
'CE-005': ['verde por vac[ií]o', 'verde por no haber mirado', 'falso verde', …]   // eventos.mjs:45
```

`eventos.mjs` **no lee la línea `Clase de evento:`**: clasifica por **frases del cuerpo**. Son dos
hechos distintos — uno **deduce** la clase de lo que la entrada cuenta, el otro comprueba que la
**declare**. **No hay `SUITE-R38` aquí**, y decir que lo había habría llevado a «unificar» dos
cosas que miden cosas distintas, **que es peor que el defecto**.

La parada queda corregida en su propio texto, con la corrección visible.

## `AC-02` es el que impide arreglarlo en la dirección peligrosa

Un regex que **acepte cualquier cosa** cumple `AC-01` y **apaga la regla**. Sin sus dos casos
—«sin clase declarada devuelve null» y «ni con la etiqueta y sin identificador»— «arreglar»
`LEX-R31` sería quitarla.

## `AC-04` cuenta la familia, y no la fija

`PT-198` midió **un archivo** y su `discovery` declaró *«ningún otro `.mjs` los tiene»* — cierto
para `status`/`phase`/`type`/`epic`, **falso para la familia entera**. Aquí se mide el directorio:

```
once expresiones de tools/ anclan un campo a fin de linea
de ellas CINCO exigen un valor concreto, que es donde el riesgo es real:
  Estructural · certificacion · confidence · health · health_unstable
```

**La cifra se declara aquí y en `HISTORY`, no se fija en un caso**: fijar el número de lo correcto
es lo que `HANDOFF -18` prohíbe, y además caducaría (`CE-010`). Lo que sí se fija es un **cero**:
que la expresión vieja ya **no se usa**, sólo queda citada en el comentario que la documenta.

## Un tercer error mío, y es el más fino de la sesión

La condición era `if (clase === undefined)`. Correcta con el `campo()` original, que devuelve
`undefined` cuando no casa. **`claseDeEvento` devuelve `null`** —el valor que dice «no hay», no «no
se preguntó»— y con la comparación **estricta** el aviso se volvió **verde**:

```
✓ LEX-R31  PT-129: declara «Clase de evento: null».
```

**`PT-129` no declara clase, y salía diciendo que sí.** Un cambio de **tipo** que convierte una
comprobación en su contrario, dentro de la tarea que arregla una comprobación que no veía.

**Lo destapó la corrida completa**, no la acotada: los dos casos que lo cazan están en otra sección
(`PT-126`, `EP-024`) y la sección de `EP-026` no los lleva. Es la lección de `PT-192`, otra vez —
y ésta es la razón por la que la corrida completa por tarea no se negocia.

## Dos errores míos, los dos de herramienta

1. **`grep -c` devuelve el número, no el texto.** El caso comparaba `CLASE_DE_EVENTO` contra `1`.
2. **`bc` no existe en este entorno**, y mi primer caso de familia dependía de él. Se sustituyó por
   el cero que sí se puede fijar.

## Lo que NO se hace, y consta   `SUITE-R26`

- **`LEX-R31` sigue avisando, no bloqueando**: no todo trabajo repite un tropiezo, y eso no cambia.
- **No se retrofecha ninguna entrada** anterior a la regla (`SUITE-R09`, `CE-014`).
- **No se reescriben las 76 cabeceras**: el defecto era del regex, no de las entradas.
- **No se unifica con `eventos.mjs`**, por lo de arriba.
- **Las cinco expresiones en riesgo NO se arreglan aquí.** Se cuentan y se nombran: arreglarlas es
  otro trabajo y ninguna ha fallado todavía. Declararlo es lo que impide que la cifra se pierda.

## Sin bloqueadores
