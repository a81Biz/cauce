# PT-087 — Autorrevisión   `PHASE 6`

## Ocho instancias, y tres aparecieron dentro de este lote

`H-003` documentaba cinco. Al terminar hay **ocho**, y las tres últimas no salieron de leer el
código: salieron de **ejecutar el marco**.

| | Comprobación | Sujeto | Observable | Dónde apareció |
|---:|:---|:---|:---|:---|
| 6 | `SUITE-R27` | la firma es de la lista | una **frase** en todo el archivo | escribiendo el intake de `PT-093` |
| 7 | `revento()` | la herramienta **reventó** | una **palabra** en toda la salida | la batería, contra el trabajo de `PT-088` |
| 8 | `sellar` · deuda | lo **ya sellado** | el **tag anterior** | ejecutando `sellar` tras crear `v10.0.0` |

**La octava es la más instructiva.** «El tag anterior» funcionaba perfectamente mientras la
versión en curso no estuviera etiquetada — y **nunca lo había estado**, porque hasta hoy nadie
había llegado a sellar de verdad. En cuanto se creó `v10.0.0`, las 21 tareas de `EP-017` —que
están **dentro** de él— aparecieron como deuda: **21 contra un umbral de 3**, bloqueando `G2`
justo después de sellar.

Ninguna lectura del código lo habría dado. Sólo aparece ejecutando.

---

## Lo que este PT **no** hace, y se estrechó en `PHASE 3` y no callando

El intake prometía que *«el sujeto declarado y lo que la comprobación lee se contrastan
mecánicamente»*. **No es mecanizable**: exigiría entender el código.

Entregar una comprobación de **presencia** llamándola contraste habría sido la novena instancia,
escrita por la tarea que cierra el patrón. Así que `AC-03` se reescribió a lo que sí se entrega:
**que el límite llegue al mensaje que el usuario lee**.

Y esa mitad sí hace trabajo. En las ocho instancias, cuando el límite estaba escrito vivía en un
**comentario del código fuente** — donde sólo lo ve quien ya está leyendo el código, es decir
quien no lo necesita.

---

## `revento()`: más cobertura y menos falsos positivos a la vez

```
antes   'SyntaxError|ReferenceError|TypeError|RangeError|node:internal|at file:///'
ahora   '^[[:space:]]+at .*:[0-9]+:[0-9]+'
```

Seis de los siete patrones eran **nombres de clases de error**: aparecen en cualquier texto que
hable de errores, y por eso un comentario de `PT-088` puso trece casos en rojo.

Y el séptimo tampoco servía. Medido:

```
$ node -e "undefinedFn()"
    at [eval]:1:1              <- «at file:///» habria FALLADO con este reviente
```

Pasar del proxy al hecho **subió la cobertura y bajó los falsos positivos al mismo tiempo**. Suele
ser la señal de que el cambio era ése y no un ajuste de umbral.

---

## Tres defectos míos, y los tres del mismo linaje

**`file://` con ruta relativa.** Diez casos reventaron porque `import('file://docs/…')` exige ruta
absoluta y en Windows la del arnés no lo es. El arnés sólo dice «la herramienta reventó» — y esa
frase, otra vez, es el observable barato de «algo falló, mira tú dónde».

**`[]` como patrón de `grep`.** Cuatro casos no casaban su propia salida: los corchetes son una
clase de caracteres. La salida era exactamente `[]` y la aserción no podía verla. Ahora el
ayudante dice `VACIO`, que además se lee.

**Escapes en un `RegExp` dentro de un heredoc**, por décima vez en este proyecto. Se resolvió
como siempre: quitando la necesidad —`new RegExp('…')` con cadenas— en vez de escapando mejor.

---

## La cobertura se publica, y es del 3 %

```
SUITE-R38  3 de 107 reglas que emiten declaran su sujeto.
```

**Sin esa línea, «sin errores de coherencia» diría que el marco está cubierto cuando cubre el 3 %.**
Es lo que `SUITE-R11` y `PTSA-R21` prohíben para cualquier score, aplicado a éste — y es la razón
de que el aviso exista aunque no falle nada.

Adopción declarada, como `RIGE_DESDE`: 313 emisiones y 105 reglas que emiten. Exigirlo a todas de
golpe nace con cientos de fallos, y una comprobación que nace roja se apaga.

---

## Lo que no se verifica, y está declarado

**Que el sujeto declarado sea cierto.** Un autor puede escribir «establece que el grafo describe el
código» sobre una función que mira `mtime`, y el mecanismo lo aceptará.

Lo que sí impide es lo que pasó ocho veces: que **nadie se hubiera hecho la pregunta**, y que el
hueco entre sujeto y observable no existiera por escrito donde el usuario lo ve.

`AC-01`..`AC-08`, los ocho.
