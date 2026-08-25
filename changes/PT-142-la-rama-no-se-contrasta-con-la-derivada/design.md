# Diseño — `PT-142`   `PHASE 4`

## `checkNombreDeRama()`

| Situación | Fuera de `G4` | En `G4` |
|:---|:---|:---|
| La rama no coincide con lo derivado | aviso, **con el nombre esperado** | **error** |
| La allocation no declara `type` | aviso: no hay nombre que contrastar (`RULE-06`) | aviso |
| Anterior a la `13.1.0` | no se juzga | no se juzga |
| Coincide | `✓` | `✓` |

**El mensaje enseña el nombre derivado**, no sólo que está mal: decir «mal» sin decir «así» obliga
a ir a buscarlo.

## La contradicción, resuelta y en qué dirección

`LEXICON` §4.1 (`LEX-R27`) manda sobre `FDGE-R19` (`LEX-R21`). Se escribe en la regla:

> **un lote no tiene nombre de rama derivable**, y su trabajo viaja en la rama de una de sus
> tareas, declarado en `SESSION_LOG.md`

No se toca `LEX-R27`. La regla que cede es la que contradecía al léxico.

## Por qué el arreglo es la rama **siguiente**

`FDGE-R19` ya declara que una rama creada se termina como empezó — renombrarla rompe su pull
request. La comprobación **nombra** lo desviado y no pide arreglarlo en marcha.
