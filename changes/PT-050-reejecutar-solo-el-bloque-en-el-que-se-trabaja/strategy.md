# PT-050 — Estrategia   `PHASE 3`

## Objetivo

Que iterar sobre un bloque de casos no obligue a ejecutar los 536 — y que el subconjunto **no
pueda confundirse con la batería**.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Partir `selftest.sh` en un archivo por sección | Es el refactor que haría posible el otro 45 %, y `selftest.sh` lo tocan **cinco** de las seis tareas del lote. Convertiría cada tarea posterior en un conflicto |
| Convertir las 19 secciones en funciones y saltarlas | Lo mismo, más pequeño y aún demasiado: reescribe la estructura de 2 400 líneas dentro de una tarea `S3` |
| `--desde N --hasta N` por número de caso | Los números cambian cada vez que alguien añade un caso. Sería un hecho copiado (`RULE-01`) que envejece solo |
| Una variable de entorno `MTH_SOLO` | No deja rastro en la línea que se lee. Quien vea «12 casos» en una evidencia no sabrá que fue un subconjunto |
| **`--solo <patrón>` filtrando en `chk`/`chkno`** | Son las **dos únicas puertas** por las que pasa cualquier caso: cubre los 453 sin tocar ninguno |

## Solución

```
bash tools/selftest.sh --solo "compuerta"      ejecuta los casos cuyo NOMBRE casa
```

**Tres invariantes, y las tres tienen caso:**

```
1  la salida dice CUANTOS DE CUANTOS. Un subconjunto que parece la bateria es peor
   que no tener subconjunto — es PT-002 con otro nombre
2  un patron que no casa NADA es ROJO, no un verde por vacio. Lo aprendio PT-023
   ejecutandolo: el silencio parece exito
3  --solo NO cambia lo que un caso comprueba. Filtra cuales corren, no como
```

`--solo` se combina con `-q`: son ortogonales, uno elige **cuáles** y el otro **cuánto se
imprime**.

## Lo que esta tarea NO puede dar, y se dice antes de hacerla

**El techo del ahorro es el 55 %, no el 95 %.** Medido: 205 s → ~95 s. Los 92 s restantes son las
**181 reconstrucciones del fixture**, que se siguen ejecutando porque no están agrupadas en
unidades que se puedan saltar.

Mi propio balance de `EP-013` estimó «≈99 %» para esta tarea. **La medida lo desmiente**, y lo
correcto es escribirlo aquí y no en la nota de cierre.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| La batería sin `--solo` | Sin la bandera, el filtro no se evalúa. Caso propio: los 536 siguen corriendo |
| El recuento | Con `--solo`, aparece un segundo número: el universo. `AC-02` |
| `-q` de `PT-049` | Ortogonales. Caso propio con las dos banderas a la vez |
| El posicional `[dir-temporal]` | `--solo` toma **un valor**, así que el parseo consume dos posiciones. Es la trampa que `PT-049` ya encontró en su forma simple |
| `revento()` | No se toca: un caso filtrado no se ejecuta, así que no puede reventar |

## Criterios de éxito, derivados de los AC

- `AC-01` → `--solo <patrón>` ejecuta solo los que casan
- `AC-02` → dice cuántos de cuántos
- `AC-03` → un patrón sin coincidencias **falla**
- `AC-04` → el fixture se construye igual: comprueba **menos casos**, no menos por caso

## Autorrevisión

**El riesgo de esta tarea es venderla por lo que no da.** «Iterar sin pagar la batería» suena a
segundos y son 95. La medida está en el `discovery`, la cifra honesta está aquí, y `AC-02` la deja
a la vista **en cada ejecución** en vez de en un documento que nadie relee.

El segundo riesgo es el refactor: partir el archivo daría el 45 % restante y rompería las cuatro
tareas que vienen detrás. No se hace, y se dice por qué.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.
