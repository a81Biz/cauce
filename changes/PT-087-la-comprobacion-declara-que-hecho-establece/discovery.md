# PT-087 — Descubrimiento   `PHASE 2`

## Las siete instancias, y qué tienen en común

| | Comprobación | Sujeto — el hecho que pretende establecer | Observable — lo que de verdad lee |
|:---|:---|:---|:---|
| 1 | `SUITE-R34` | el estado retomable **dice la verdad** | la **fecha** del archivo |
| 2 | `FDGE-R43` | el grafo **describe el código** | si se **movieron** archivos |
| 3 | `audit` | la regla **tiene verificador** | su ID **aparece** en algún tool |
| 4 | `regla` | qué **dice** una regla | la **primera línea** que cita su ID |
| 5 | `sellar` paso 1 | la guía **enumera** las reglas nuevas | que la entrada **exista** |
| 6 | `SUITE-R27` | la **firma** es de alguien de la lista | una **frase** en cualquier parte del archivo |
| 7 | `revento()` | la herramienta **reventó** | una **palabra** en cualquier parte de la salida |

**La forma es idéntica en las siete**, y se ve al ponerlas en columnas: el observable es siempre
más barato que el sujeto, y **en ninguna estaba escrito el hueco entre los dos**.

## La superficie, medida

```
$ grep -ohE "\b(fail|warn|ok)\(\s*'[A-Z]+-R[0-9]+[a-z]?'" tools/*.mjs | wc -l
313 emisiones
$ … | grep -oE "'[A-Z]+-R[0-9]+'" | sort -u | wc -l
105 reglas distintas
```

**Imponer un sujeto declarado a 313 emisiones de golpe no es viable**, y hacerlo sería el error de
`EXEC-R04` en `PT-088`: una comprobación que nace con cien fallos se apaga.

## Lo que sí es mecánicamente comprobable, y lo que no

| | ¿Mecánico? |
|:---|:---|
| Que una comprobación **declare** su sujeto y su límite | **Sí** · presencia de dos campos no vacíos |
| Que el límite declarado **llegue al usuario** | **Sí** · su frase tiene que aparecer en el texto que la herramienta emite |
| Que el sujeto **corresponda** al observable | **No.** Exigiría entender qué hace la función |

**El segundo es el hallazgo de este descubrimiento.** En las siete instancias, cuando el límite
estaba escrito lo estaba **en un comentario del código fuente**, que el usuario no ve. `PT-088` lo
puso en el mensaje a mano, y sus dos casos lo asertan a mano.

Un límite que vive sólo en un comentario **no protege a nadie**: protege al que ya leyó el código.

## La séptima tiene arreglo directo, y lo tiene hoy

```sh
revento() { printf '%s' "$1" | grep -qE 'SyntaxError|ReferenceError|TypeError|RangeError|node:internal|at file:///'; }
```

Seis de los siete patrones son **nombres de clases de error**: aparecen en cualquier texto que
hable de errores. El séptimo, `at file:///`, es **la forma de una traza de pila** — y ése sí es el
hecho.

Medido: un reviente real de node imprime la clase **y** la traza. Un archivo que *menciona* la
clase no imprime traza. **Quedarse con la traza distingue el hecho del proxy sin perder cobertura.**

## Lo que este descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| Alcance | «un campo junto a la emisión» | **Un registro con adopción declarada**, como `RIGE_DESDE`. 313 emisiones no se migran de golpe |
| `AC-03` | «contrastar sujeto y observable» | **No es mecanizable.** Lo que sí: que el límite **llegue al mensaje** |
| `AC-05` | «las cinco instancias expresadas» | Son **siete**, y la séptima se arregla en esta tarea |

**`AC-03` se estrecha, y hay que decirlo.** La versión del intake prometía contrastar el sujeto con
lo que la función lee, y eso exige entender el código. Prometerlo y entregar una comprobación de
presencia sería **la octava instancia**, escrita por la tarea que cierra el patrón.
