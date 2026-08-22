# Autorrevisión — `PT-109`

## Lo que establecí

Que ningún aviso puede volverse rojo en una compuerta sin haberlo dicho, y que una mención de un
identificador no cuenta como su declaración.

## Lo que NO establecí

- **Que `INC-003`, `INC-005` e `INC-014` estén resueltos.** No lo están. Sus descripciones no
  están en esta máquina.
- **Que no haya más reglas que cambien de severidad.** Se midieron cuatro con un `grep`.

## `L-7` pedía cinco y se cierran dos

Y eso es una decisión, no un recorte por cansancio: arreglar «algo parecido» a un defecto que no
puedo leer sería **inventar el defecto y su arreglo a la vez** — exactamente lo que este lote
persigue.

Del `INC-003` sí se sabe lo que el lote dice: «se registró el 2026-08-20, se escribió *reportado a
cauce* y nadie abrió el `PT`». Es un defecto de **procedimiento**, y se cierra abriéndolo — que es
lo que este lote entero hace.

## Lo que salió mal

**Mis primeros casos corrían sobre el repositorio real** y sobre una tarea concreta. Fallaron sin
que el código estuviera mal —la batería trabaja desde un proyecto de mentira— y, aunque hubieran
pasado, **habrían caducado** en cuanto esa tarea dejara de tener el aviso.

## Lo que se repite

**`INC-015` es literalmente el defecto de `PT-100`, en el mismo archivo.** Aquel arregló el
vocabulario de los tipos de caso `QA`; este, el reconocimiento de un candidato. Los dos confundían
**nombrar** con **declarar**.
