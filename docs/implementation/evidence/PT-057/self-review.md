# PT-057 — Autorrevisión   `PHASE 6`

## Lo entregado

```
tracker coste [tipo] [complejidad]    lo que suele costar un tipo de tarea
costeDe(cerradas, {...})              pura · referencia | null con motivo
resumen(xs)                           mediana, min, max, n · nunca media
duenoDe(asunto)                       el primer PT del ASUNTO, y solo del asunto
MINIMO_REFERENCIA = 5                 exportado, porque es un JUICIO
LEXICON §6.5b                         el vocabulario · sin regla nueva
casos                                 663 → 706
```

## La trampa que casi me como

Lo primero que parece razonable es buscar los commits de una tarea con `--grep PT-NNN`. Da esto:

```
BUG/STANDARD            14 tareas · mediana commits 5 · archivos 66 · lineas 2708
BUG/TRIVIAL              7 tareas · mediana commits 5 · archivos 65 · lineas 2708
```

**Idénticos hasta la línea.** No es coincidencia: **61 de 162 commits nombran más de un `PT`** y
uno nombra **diez**, porque el cuerpo cita las tareas anteriores —`CORRIGE PT-052`, «el mismo
defecto que `PT-023` encontró»— y eso es **lo correcto** en una bitácora append-only. La señal
obvia atribuía a una tarea el trabajo de otras.

Si la hubiera aceptado, la herramienta habría dicho que un `TRIVIAL` cuesta lo mismo que un
`STANDARD`, **con toda la autoridad de un número derivado del historial real**. La atribución es
el **asunto**, y solo el asunto.

## El resultado que no esperaba

La señal con **mejor cobertura es la peor predictora**. `changes/PT-NNN/` existe para 52 de 53
tareas cerradas —casi perfecta— y mide esto:

```
BUG/STANDARD 9 · CHORE/STANDARD 10 · FEATURE/STANDARD 9 · BUG/TRIVIAL 9 · BUG/SIMPLE 9
```

Nueve o diez **siempre**, porque es exactamente lo que el marco exige en `PHASE 4`. Está
**saturada por construcción**: cuenta cumplimiento del procedimiento, no esfuerzo. Habría sido la
elección natural por parecer la más limpia.

## Dos defectos que encontraron las herramientas del marco, no yo

**`audit` vio cuatro bytes de control `0x1F` crudos en el código.** Escribí el separador como una
secuencia de escape unicode y al editar se convirtió en el byte literal. **Funcionaba** —por eso mis pruebas
pasaban— y era invisible al leer. Es exactamente el hueco que esa comprobación existe para
detectar, y me pilló a mí.

**El arnés corría `coste` con el fixture como raíz**, así que leía el registro de mentira con
cuatro tareas: los casos sobre las cifras reales **no comprobaban nada**. Verde por vacío, el
defecto de `PT-023`, otra vez.

## Y dos patrones que ya van por la cuarta y la sexta vez

**La detección de `ROOT` se tragó otro argumento.** `coste CHORE STANDARD` buscaba el registro
dentro de `./CHORE`. Van cuatro en dos lotes —`-q`, `--solo`, `--a` y ahora las etiquetas—, así
que se arregla por **forma** (`ES_ETIQUETA`) y no con un caso más.

**Una aserción casaba con el texto de al lado.** El caso que comprueba que *no* se da mediana con
una sola tarea buscaba la palabra «mediana», que aparece en la frase que lo explica: «una mediana
de una tarea no es una mediana». Sexta vez. Ahora busca la **forma** de una medida.

## Lo que la tarea se hizo a sí misma

**Dos cifras inventadas, en dos fases distintas.** En `PHASE 3` escribí rangos «73 – 9012» que no
había medido; en `PHASE 4`, que el `CHORE/SIMPLE` era `PT-035` cuando es `PT-027`. Las dos las
cacé midiendo antes de commitear — pero **las dos las escribí**, con los datos delante y en la
tarea cuyo `AC-04` dice literalmente que ninguna cifra puede salir de la memoria del agente.

No es una anécdota: si eso pasa dos veces en dos fases, la herramienta no es un lujo.

## Lo que no queda comprobado

Que la referencia **sirva para decidir** — eso es `PT-059`. Que **cinco** sea el umbral correcto:
no hay dato, está declarado como juicio. Que la cifra describa el **presente**: `BUG/TRIVIAL` sale
más caro porque sus tareas son anteriores a `FDGE-R19`, y la salida dice de cuántas sale, no de
cuándo.

Y una cuarta que solo se ve mirando lo que se excluye: **las 8 cerradas sin commit propio no son
una muestra neutral**. Son las más antiguas, las anteriores a la convención de mensajes.
Excluirlas inclina la referencia hacia lo reciente, y eso no está medido — solo declarado.
