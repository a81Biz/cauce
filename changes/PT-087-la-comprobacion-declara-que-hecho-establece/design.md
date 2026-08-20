# PT-087 — Diseño   `PHASE 4`

## Las piezas

```
patrones.mjs        SUJETOS                        registro: establece / noEstablece
                    sujetosIncompletos()           una celda vacia no pasa
                    limitesQueNoLleganAlMensaje()  la mitad que hace trabajo
                    reglasNuevasFueraDeLaGuia()    la QUINTA instancia

verify-suite.mjs    dos fail + un warn con la COBERTURA declarada

tracker.mjs         sellar paso 1: la guia ENUMERA, no solo existe
                    sellar y verify-fdge: el tag MAS ALTO, no «el anterior»  (OCTAVA)

selftest.sh         revento() mira la TRAZA, no la palabra                   (SEPTIMA)
                    14 casos
```

---

## Por qué el registro y no un campo por emisión

**313 emisiones, 105 reglas que emiten.** Exigirlo a todas de golpe nace con cientos de fallos, y
una comprobación que nace roja se apaga — `PT-023` lo midió en el 75 % de falsos positivos.

Adopción declarada, exactamente como `EXIGIBLE_DESDE` y `RIGE_DESDE`. Y la cobertura **se publica**:

```
SUITE-R38  3 de 107 reglas que emiten declaran su sujeto.
```

Sin esa línea, un «sin errores de coherencia» diría que el marco está cubierto cuando cubre el 3 %.
Es lo que `SUITE-R11` y `PTSA-R21` prohíben para cualquier score, aplicado a éste.

---

## `null` no es una celda vacía

```js
'SUITE-R01': { establece: '…se instancia en cuatro reglas', noEstablece: null },
```

`undefined` —el campo ausente— **cae**. `null` **pasa**, y declara: *no hay límite que expresar*.
Es el caso de una regla que no se verifica en absoluto, y por tanto no tiene mensaje donde poner
nada.

Es la distinción de `PT-058` —`null` no es cero— aplicada a una declaración en vez de a una cifra:
«no se midió» y «se midió y salió cero» no son el mismo hecho.

---

## La mitad que hace trabajo: el límite en el mensaje

`limitesQueNoLleganAlMensaje` busca la frase de `noEstablece` en el **texto de las herramientas**.

**Por qué esto y no un comentario:** en las siete instancias, cuando el límite estaba escrito
vivía en un comentario del código fuente. `PT-088` lo puso en el mensaje **a mano**, y sus dos
casos lo asertaban **a mano**. Esto lo hace obligatorio.

Un límite en un comentario protege a quien ya está leyendo el código — o sea, a quien no lo
necesita.

---

## La séptima: `revento()`

```sh
# antes
grep -qE 'SyntaxError|ReferenceError|TypeError|RangeError|node:internal|at file:///'
# ahora
grep -qE '^[[:space:]]+at .*:[0-9]+:[0-9]+'
```

Seis de los siete patrones eran **nombres de clases de error**: aparecen en cualquier texto que
hable de errores, y por eso un comentario de `PT-088` puso trece casos en rojo.

El séptimo, `at file:///`, era el único que miraba el hecho. Medido:

```
$ node -e "undefinedFn()"
ReferenceError: undefinedFn is not defined
    at [eval]:1:1                                  <- la forma, y no lleva «file://»
```

`at file:///` habría **fallado con este reviente**. La forma general —`at` indentado con
`:línea:columna`— lo caza y no acusa a nadie que sólo hable de errores. **Más cobertura y menos
falsos positivos a la vez**, que es lo que suele indicar que se pasó de un proxy al hecho.

---

## La octava, y apareció sellando de verdad

```js
// antes
.find((t) => t !== `v${VERSION_DEL_PROYECTO}`)      // «el tag ANTERIOR»
// ahora
.filter(Boolean)[0]                                  // el tag MAS ALTO
```

**Se escribió cuando la versión en curso todavía no estaba etiquetada**, y en ese mundo saltarse
su propio tag era inofensivo. En cuanto se creó `v10.0.0`, las 21 tareas de `EP-017` —que están
**dentro** de él— aparecieron como deuda sin sellar: **21 contra un umbral de 3**, bloqueando `G2`
justo después de haber sellado.

Es la misma forma que las otras siete: «el tag anterior» era un **proxy** de «lo ya sellado», y
funcionaba sólo mientras la versión en curso no estuviera sellada — el caso que nadie había
ejercitado porque nunca se había llegado a sellar.

**Sólo aparece ejecutando.** Ninguna lectura del código lo habría dado.
