# Autorrevisión — `PT-143`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`asignar` deja de adivinar el prefijo del identificador, y lo que `LEXICON` no declara **falla** en
vez de crearse.

## El defecto, medido con `--ver` antes de escribir nada

```
tracker asignar --tipo BUG --severidad S2 --titulo "…"      ->  BUG-001
tracker asignar PT --tipo BUG --severidad S2 --titulo "…"   ->  PT-137
```

El valor de `--tipo` también está en mayúsculas. **`BUG-001` no es un espacio de nombres
declarado**: `LEXICON` §4.3 enumera los contadores y `BUG` no está entre ellos. Un identificador
con un prefijo que ningún contador reconoce es **un identificador que nadie puede volver a
encontrar**.

Lo vio la propia bandera `--ver`, que existe exactamente para eso.

## La información para no cometerlo estaba a diez líneas

`CON_VALOR` es un conjunto que declara **qué banderas llevan valor**. La lectura del prefijo no lo
consultaba: adivinaba qué era un argumento en vez de leer su posición o su bandera.

Es `CE-003` —argumento por detección—, una de las clases **sin regla que la reclame**, con siete
instancias contadas.

## El arreglo no persigue el síntoma

Excluir sólo `--tipo` habría dejado colarse **cualquier bandera futura** con valor en mayúsculas.
Se consulta `CON_VALOR`, que es donde ese hecho ya vive: una lista repetida de banderas a excluir
sería la copia que diverge (`SUITE-R38`).

Es también lo que responde a `AC-04` —«revisar el resto de acciones»— **por la vía de la fuente
única**, y se dice así en lugar de prometer un barrido que no se ha hecho.

## Por qué el defecto por omisión sigue siendo `PT`

Es el correcto en la inmensa mayoría de los casos. Exigir el prefijo siempre rompería toda
invocación existente sin ganar nada.

## Lo que esta tarea NO establece

- **Que ninguna otra acción lea posicionales con el mismo patrón.** Se enumera lo que se ve.
- **Que ningún identificador existente esté mal.** `SUITE-R09` es append-only: esto sólo cambia
  cómo **nace** el siguiente.

## Estado

| | |
|:---|:---|
| Escenarios | 5 de 5 |
| Positivo que valida a los demás | `TS-03` — un prefijo declarado sigue funcionando |
| Orphan Criterion | ninguno |
