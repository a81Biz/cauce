# Strategy — `PT-099`

## 1. Objetivo

Que la transición que `LEXICON` declara «siempre» la aplique **el comando**, y que saltarla se
reporte.

## 2. Solución

### `S-1` · `estadoDeFase` extiende lo que `L-1` creó `AC-01` `AC-02`

`PT-098` introdujo `estadoTerminalDe`. **No se añade un segundo sitio que escriba `status`** —eso
sería la avería de `SUITE-R38` cometida una tarea después de arreglarla—: se extiende.

```
al entrar en la fase de VALIDACION  y  type === 'BUG'   ->  VALIDATION_PENDING
al llegar a la ULTIMA fase                              ->  lo que L-1 decidio
en cualquier otro caso                                  ->  no se toca
```

La fase de validación **no se inventa**: `PHASES · PHASE 7` la sitúa —*«BUG → `VALIDATION_PENDING`
y PARA»*— y `FASES` ya la nombra en el propio `tracker`.

### `S-2` · `avanzar` **para** ahí para un `BUG` `AC-02`

`FDGE-R26`: *«transita a `VALIDATION_PENDING` y ahí **se detiene**. Solo un humano lo lleva a
`DONE`»*. El comando lo dice en su salida, con la forma que `FDGE-R26` exige para la firma.

**No se niega a avanzar de fase** —eso rompería el flujo— : escribe el estado y **avisa de que el
siguiente paso es humano**. La diferencia importa: la fase avanza, el estado se detiene.

### `S-3` · `verify-fdge` reporta el `BUG` que no pasó `AC-03`

```
BUG en fase >= validacion y su status nunca fue VALIDATION_PENDING ni DONE  ->  ERROR
```

**Y con `RIGE_DESDE`** (`AC-04`): los 51 `BUG` existentes nunca pasaron por ahí, y juzgarlos hacia
atrás los pondría a los 51 en rojo sin salida. Es literalmente lo que `PT-095` corrigió para
`EXEC-R04a` y lo que `L-5` va a generalizar.

### `S-4` · El caso negativo `AC-05`

Un `FEATURE`, `REFACTOR`, `CHORE` o `INVESTIGATION` **no** se detiene. Sin ese caso, «detenerse
siempre» pasaría `AC-02` y bloquearía todo el marco.

## 3. Alternativas evaluadas

### `A-1` · Aplicar la escalera **completa** — rechazada, y declarada

`avanzar` tampoco escribe `IN_PROGRESS` ni `IN_REVIEW`: la escalera entera está sin aplicar.
Arreglarla completa es más de lo que esta tarea declara y toca el estado de **todas** las tareas,
no sólo los `BUG`.

Se declara al `## Cierre del lote`. Lo que esta tarea sí cierra es la transición que `LEXICON`
marca **«siempre»** y que `FDGE-R26` hace `HARD`.

### `A-2` · Que `avanzar` se niegue a pasar de la fase de validación — rechazada

Rompería el flujo: la fase avanza porque el trabajo avanza; lo que se detiene es el **estado**.
Confundirlos es lo que hizo `A-1` de `PT-098`.

### `A-3` · Comprobarlo sólo en `--gate G3` — rechazada

Sería coherente con dónde vive la compuerta, y repite el defecto de `INC-010`: *«cada compuerta es
una revisión sorpresa»*. `--all` tiene que verlo.

## 4. Riesgos

```
RIE-1  51 BUG existentes sin el dato. Sin RIGE_DESDE saldrian los 51 en rojo. La fila se
       declara EN ESTA TAREA, no despues

RIE-2  «avanzar» hace CINCO actos atomicos. El cambio va DENTRO del calculo del estado,
       antes de escribir nada

RIE-3  la fase de validacion se identifica por su NOMBRE en FASES. Si alguien la renombra,
       la transicion se apaga en silencio — el riesgo de PT-096 con su marcador. Se cubre
       con un caso que ata las dos cosas
```

## 5. Criterios de éxito

```
AC-01  al entrar en la fase de validacion, un BUG queda en VALIDATION_PENDING
AC-02  y el comando DICE que el siguiente paso es humano
AC-03  verify-fdge reporta el BUG que llego mas alla sin pasar por ahi
AC-04  con RIGE_DESDE: los 51 existentes no se juzgan hacia atras
AC-05  un FEATURE/CHORE no se detiene — caso negativo
AC-06  la bateria falla sin el arreglo
```

## 6. Autorrevisión

- **¿Contradice el intake?** No.
- **¿Inventa vocabulario?** No: `VALIDATION_PENDING` está en `LEXICON` §5.1 y la fase la sitúa
  `PHASES · PHASE 7`.
- **¿Añade un segundo sitio que escriba `status`?** No — extiende el que `L-1` creó. Era el riesgo
  más real de esta tarea.
