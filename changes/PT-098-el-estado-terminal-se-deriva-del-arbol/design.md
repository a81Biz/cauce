# Design — `PT-098`

## D-1 · `integradoEnPrincipal(a)` devuelve **tres** valores, no dos

```
true    su changes/<ID>-<slug>/ esta en la rama por defecto
false   esta en la de integracion pero NO en la principal
null    no esta en ninguna, o no se puede preguntar  ->  SIN EVALUAR
```

**El `null` no es cortesía.** `RULE-06`: no saber no es permiso, **pero tampoco es una
acusación**. Un clon superficial, un `origin` ausente o una rama sin traer no dicen nada del
estado — y `PT-056` ya pagó dos veces por comprobaciones que se ponían en rojo en CI por el
entorno, no por el hecho.

Con dos valores, el `false` tendría que cubrir «no está» y «no lo sé», y la segunda es la que
produce rojos que nadie puede arreglar.

## D-2 · `avanzar` escribe **lo cierto**, no se niega

```js
// antes
if (terminal) a.status = 'INTEGRATED';
// despues
if (terminal) a.status = integradoEnPrincipal(a) === true ? 'INTEGRATED' : 'DONE';
```

**Negarse era mi primer diseño y rompía `SUITE-R46`**, que exige apuntar el estado terminal
**antes** del merge. La salida no es una excepción: es que `LEXICON` §5.1 ya distingue `DONE`
—«terminado, esperando `G4`»— de `INTEGRATED` —«mergeado a la línea principal»—, y `FDGE-R34`
confirma que **`G4` exige `DONE`**.

Así que el comando llevaba escribiendo el estado que no toca. Escribir `DONE` **sirve mejor** a
`SUITE-R46` que lo que había.

**Y lo dice en su salida.** Un cambio silencioso de estado es exactamente lo que causó el problema:
*«nadie tuvo que decidirlo»*.

**`null` escribe `DONE`.** No se afirma `INTEGRATED` sobre lo que no se pudo comprobar — y `DONE`
no es una acusación: es el estado correcto de algo terminado que aún no consta integrado.

## D-3 · `verify-fdge` distingue los tres casos

```
INTEGRATED y false   ->  ERROR    el registro afirma un merge que el arbol no tiene
INTEGRATED y null    ->  AVISO    SIN EVALUAR, y se dice por que
INTEGRATED y true    ->  silencio
```

**El aviso no es ruido**: es la única forma de que un clon donde no se puede comprobar no aparezca
ni en verde ni en rojo, sino como lo que es.

## D-4 · Dónde vive la función

En `tracker.mjs`, junto a `refDurableDe`, y **exportada**. La consume `avanzar` y la consumirá
`verify-fdge` por inyección —el patrón de `refExiste` en `compararEspejo`— para que siga siendo
probable sin git.

**No se duplica el `git cat-file`.** `refDurableDe` ya lo tiene, y una segunda copia sería lo que
`PT-096` acaba de quitar de en medio.

## D-5 · Qué NO se cambia

- **La exención de lo terminal en las seis comprobaciones.** Existe para no exigir bitácora
  retroactiva a lo integrado antes de la `5.1.0`. Quitarla pondría en rojo todo repositorio con
  historia. **Falla el dato, no la exención.**
- **`LEXICON` §5.1.** Ya define bien los dos estados. El problema era que el comando no los
  distinguía.
- **Los 91 `INTEGRATED` actuales.** Medido: los 91 tienen su directorio en `main`. El arreglo no
  abre deuda, y eso se comprobó **antes** de diseñarlo.

## D-6 · Lo que se declara y no se arregla

`--gate G4` caza este caso —dice «`G4` exige `DONE`»— y `--all` no. `INC-010` de la calculadora lo
llama *«cada compuerta es una revisión sorpresa»*.

**No entra aquí**: cambiar qué ejerce `--all` afecta a todas las compuertas, no sólo a ésta, y
merece su propia medición. Va al `## Cierre del lote` de `EP-019`.
