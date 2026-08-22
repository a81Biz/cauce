# Estrategia — `PT-103`

## La decisión

**A-1 · El comando permite obedecer, y algo avisa cuando no se usó.**

Dos mitades, y ninguna sirve sola:

1. **`asignar` acepta lo que el marco exige.** Mientras el comando no pueda escribir `type`,
   `severity`, `epic` y `phase`, cumplir el marco seguirá exigiendo saltárselo — y eso ninguna
   regla lo arregla.
2. **`SUITE-R58` avisa de la allocation incompleta.** Poder obedecer no es obedecer.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Solo la regla** | prohibir el rodeo sin dar alternativa: la regla se incumpliría el mismo día |
| **Solo el comando** | poder obedecer no es obedecer, y nada lo notaría |
| **Fallar en vez de avisar** | las 41 allocations anteriores se escribieron cuando el comando no permitía otra cosa (`SUITE-R09`) |
| **Prohibir toda escritura manual** | no se puede y no se debe: un arreglo de emergencia a veces la exige |

## Por qué avisa y no falla

`RIGE_DESDE`, como hizo `PT-095`. **Una regla nueva no juzga lo escrito antes.** Las allocations
previas no son incumplimientos: son el rastro de una herramienta que no permitía otra cosa.

## El negativo, que es la mitad del arreglo

`--tipo CHORIZO` **falla**. Un campo que admite cualquier cadena no decide nada — es el mismo
defecto que `PT-100` arregló para los tipos de caso `QA`, un piso más arriba.

## Lo que esta tarea NO cierra

**El problema general que el firmante señala.** `SUITE-R58` mira `asignar`. Que **todo** el
procedimiento sea comprobable —que ninguna fase se pueda saltar sin que algo se ponga rojo— es
más grande, y se declara al cierre del lote en vez de fingir que esta tarea lo resuelve.

## Termina cuando

`asignar` crea una allocation completa, rechaza valores inventados, `verify-fdge` avisa de las
incompletas sin juzgar las antiguas, y la batería falla sin el arreglo.
