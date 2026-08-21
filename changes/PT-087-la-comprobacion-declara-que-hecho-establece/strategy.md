# PT-087 — Estrategia   `PHASE 3`

## La decisión de fondo: qué se puede exigir y qué sería fingir

De las tres cosas que el intake insinuaba, **sólo dos son mecanizables**:

| | Veredicto |
|:---|:---|
| Que una comprobación **declare** su sujeto y su límite | mecanizable · presencia de dos campos |
| Que el límite **llegue al mensaje** que el usuario lee | mecanizable · su frase aparece en la emisión |
| Que el sujeto **corresponda** a lo que la función lee | **no** · exige entender el código |

**El segundo es el que hace trabajo.** En las siete instancias, cuando el límite estaba escrito
vivía en un **comentario del código fuente** — donde sólo lo ve quien ya está leyendo el código, es
decir quien no lo necesita.

## Caminos considerados

| | Por qué se descarta |
|:---|:---|
| Un campo junto a cada una de las **313 emisiones** | Nace con cientos de fallos. Es el error de `EXEC-R04` en `PT-088` multiplicado por cien: una comprobación que nace roja se apaga |
| Un DSL o un sistema de tipos para las comprobaciones | Una capa nueva para un problema que es de **declaración**, no de estructura |
| Inferir el sujeto del **nombre de la función** | Es literalmente el patrón: `checkLedgers` *sugiere* que comprueba ledgers, y sugerir no es establecer |
| Comprobar que el sujeto corresponde al observable | **No mecanizable**, y prometerlo sería la octava instancia |
| **Registro `SUJETOS` con adopción declarada, y el límite obligado en el mensaje** ✅ | Es lo que se adopta |

## Por qué un registro con adopción declarada y no cobertura total

Exactamente el mismo argumento que sostiene `EXIGIBLE_DESDE` y `RIGE_DESDE`: la regla **crece**, y
lo que la hace útil no es cuántas cubre hoy sino que **ninguna pueda quedarse fuera en silencio**.

El registro arranca con las **tres de `PT-088`**, que es lo que `EP-018` §6 declaró: si el
mecanismo no sabe expresar qué mide `SUITE-R09`, está mal, y se sabe antes de tocar 105 reglas.

## La séptima instancia: `revento()`, y se arregla aquí

```sh
revento() { … grep -qE 'SyntaxError|ReferenceError|TypeError|RangeError|node:internal|at file:///'; }
```

Seis de los siete patrones son **nombres de clases de error** — aparecen en cualquier texto que
hable de errores, y por eso un comentario de `PT-088` puso trece casos en rojo.

Medido:

```
$ node -e "undefinedFn()"
ReferenceError: undefinedFn is not defined
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)

$ grep -l "at file:///" docs/methodology/tools/*
docs/methodology/tools/selftest.sh          <- solo su propia definicion
```

**El hecho es la traza de pila**, y su forma es inconfundible: `at` indentado seguido de
`:línea:columna`. Un archivo que *menciona* una clase de error no imprime marcos de pila.

Se conserva `node:internal` porque un reviente dentro de node imprime marcos de esa forma, y se
retiran los cuatro nombres de clase. **No se pierde cobertura**: un reviente real imprime siempre
la traza, y hay un caso que lo demuestra.

## Lo que este PT **no** hace, y por qué decirlo importa

**No comprueba que el sujeto declarado sea cierto.** Un autor puede escribir «establece que el
grafo describe el código» sobre una función que mira `mtime`, y el mecanismo lo aceptará.

Lo que sí impide es lo que ocurrió siete veces: que **nadie se haya hecho la pregunta**, y que el
hueco entre sujeto y observable no exista por escrito en ningún sitio que el usuario vea.

Prometer más sería la octava instancia, escrita por la tarea que cierra el patrón. Y por eso el
`AC-03` del intake **se estrecha aquí**, en `PHASE 3`, y no callando.

## Orden de implementación

```
1. revento()                la septima instancia, y no depende de nada
2. SUJETOS + sujetoDe()     el registro, con las tres de PT-088
3. verify-suite             dos comprobaciones: campos completos, y limite EN EL MENSAJE
4. sellar paso 1            que la guia ENUMERE las reglas nuevas — la quinta instancia
5. los casos
```

**`1` va primero porque es el único que se puede ver fallar sin construir nada**, y porque hasta
que se arregle cualquier comentario que escriba una clase de error vuelve a poner trece casos en
rojo — incluidos los que esta tarea va a escribir.
