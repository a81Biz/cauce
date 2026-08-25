# PT-145 · `spec-changes.md`

```
PRD / TRD / API / esquema / eventos    sin cambios
Contratos                              patrones.mjs gana cuatro funciones de patron
EXECUTION-MODES.md                     NO SE TOCA — si :708 destapa una cita, se DECLARA
```

## Comportamiento observable

Siete de los ocho sitios: **ninguno**. Es la barra de `AC-04`.

El octavo, `:708`, **sí**, y a propósito:

```
una celda de la matriz de compuertas que cite FPGE-Rnn o FIDE-Rnn
   HOY   pasa en verde
   TRAS  falla citando EXEC-R08
```

**Puede poner en rojo el árbol real** si esa cita existe hoy. Sería un hallazgo del lote, no un
fallo de la tarea: se declara y, si merece trabajo, entra como tarea propia.

## Efecto en la versión

`MINOR` por la restricción aditiva de `EP-022` §3. `:708` endurece una comprobación existente —no
cambia lo exigido, lo hace visible— así que no rompe compatibilidad: **un proyecto cuya matriz
citara una regla `FPGE` ya estaba incumpliendo `EXEC-R08`; lo que cambia es que ahora se entera.**
