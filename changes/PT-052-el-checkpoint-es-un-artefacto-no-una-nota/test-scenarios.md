# PT-052 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `tracker checkpoint PT-NNN` sobre una tarea viva | escribe el archivo con sus campos |
| E2 | AC-01 | …y declara el **SHA** del código | presente y con forma de commit |
| E3 | AC-01 | …y la **siguiente acción**, derivada | la misma que `tracker siguiente` |
| E4 | AC-02 | Escribirlo dos veces, con tareas distintas | **uno solo**, el segundo sustituye al primero |
| E5 | AC-03 | Un PT que no está en el registro | **falla**; no inventa los campos |
| E6 | AC-03 | El código no lee nada del agente | ningún campo sin fuente |
| E7 | AC-04 | Un `sha` que no existe en el repositorio | `verify-fdge` **bloquea** |
| E8 | AC-04 | Un `sha` real | pasa |
| E9 | AC-05 | `CHECKPOINT.json` está en `LEXICON.md` | aparece con sus campos |
| E10 | AC-05 | `verify-suite` sobre la metodología | sin errores de coherencia |

`E4` es el que fija la decisión de diseño: el estado en curso es **uno**. Si escribir sobre otra
tarea dejara dos archivos, N−1 estarían mintiendo desde el momento en que se escriben.

`E7` es el que separa un checkpoint de una afirmación: un SHA con forma correcta que no existe es
lo que hace peligroso un dato estructurado — **el que no existe se nota; el que miente, no**.

## Lo que ningún caso puede comprobar

**Que el árbol corresponda al SHA declarado.** Se comprueba que el commit **exista**, no que el
directorio de trabajo sea el suyo. Eso es `STATE_MISMATCH` y es de `EP-015`: prometerlo aquí haría
que el lote siguiente heredara una casilla marcada en vez de un punto de partida.

Y **que los campos sean los que hacen falta para retomar**. Se comprueba que cada uno se derive de
una fuente; que el conjunto baste para reanudar una tarea sin releer nada solo lo dirá `EP-015`
intentándolo. Es un juicio, y se declara antes de que parezca una verificación.
