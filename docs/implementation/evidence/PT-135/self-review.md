# Autorrevisión — `PT-135`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

Un lint que **deriva** lo que vigila, reconoce las **dos** formas de usar un helper, **ancla** la
posición del comando y **descarta** los heredocs. Más los dos usos anteriores a su definición,
arreglados, y un caso que **puede fallar**.

## Cómo apareció

Corriendo la batería completa de `PT-118`, dos líneas entre 1483 verdes:

```
selftest.sh: line 2402: git_fixture: command not found
selftest.sh: line 2404: con_phase: command not found
```

El caso de `PT-109` que va detrás salía **verde** con su fixture sin `git init` y su allocation
sin `phase: 8`. `CE-005`, **con un lint escrito exactamente para esto**.

## Por qué el lint no podía verlo, y por qué eso importa

Sólo reconocía un helper cuando era el **comando de un caso**. Estos dos se invocan como líneas
de montaje sueltas. **La forma que reconocía y la forma en que fallaban eran distintas**: no se le
escapó, no podía verlo.

Y su lista estaba escrita a mano —nueve nombres— sin ninguno de los dos. Una lista escrita a mano
de lo que hay que vigilar es la copia que diverge **dentro del que vigila**.

## El defecto que aparecí **arreglándolo**, y es el mismo

La primera rutina que movía las definiciones decidía si una era de una línea mirando si la línea
**termina** en `{`. La de `git_fixture` termina en un **comentario**, así que se llevó la cabecera
y **dejó el cuerpo huérfano**. La batería murió **en silencio** —código 0, sin línea de resumen—
en el caso siguiente. Lo delató que el archivo de salida tuviera 1015 líneas y ninguna dijera
`selftest:`.

**Leer el final de la línea en vez del hecho.** Es lo que esta tarea persigue, cometido al
arreglarlo. Corregido: una definición es de una línea sólo si la propia línea **la cierra**.

## Y tres falsos positivos, con la raíz de `PT-130`

Al derivar la lista salieron `M`, `A` y `OTRO`: `A` casaba dentro del **patrón** de un caso
(`"EDITADO A MANO"`), `OTRO` dentro del **nombre** de otro, `M` dentro de un **heredoc**. Leer la
línea entera en vez de la posición del comando es `CE-017`, arreglada horas antes en
`contradiceElRegistro`.

## `AC-05` se ejecutó, no se supuso

El caso de `PT-109` llevaba un lote entero pasando sin su fixture. «Sigue pasando» había que
comprobarlo, y se comprobó en la corrida completa: pasa **con** `git init` y **con** `phase: 8`.

## Una cifra más

`CLAUDE.md` declaraba **16 herramientas** con `eventos.mjs` y `matriz.mjs` ya publicadas. Son
**18**. Lo dijo `FND-R14` en la misma corrida: `CE-010`.

## Lo que esta tarea NO establece

- **Que no queden helpers mal colocados en otros archivos.** La batería es el único con este
  patrón.
- **Que la heurística sea completa.** Reconoce dos formas de invocar un helper; una tercera
  —dentro de una sustitución de comando— no entra.
- **Que `CE-004` esté cerrada.** Le quita **una** instancia y deja el mecanismo que impide la
  siguiente. Sigue siendo la clase más repetida del ledger y sin regla que la reclame.

## Y una autorreferencia más, la tercera de la familia

El caso «el caso del lint ya no casa las dos respuestas» buscaba el patrón viejo en **todo** el
archivo, y lo encontraba en el **comentario** que lo explica. Es lo que le pasó a `lint_helpers`
dos veces y a `PT-051`.

Arreglado mirando la **línea del caso**, no el archivo — el mismo anclaje que `PT-130` acaba de
aplicar. Y de paso salió otro: `chkno?` en `ERE` es `chkn` con una `o` opcional, **no** `chk` con
`no` opcional, así que no casaba nada — y un patrón que no casa nada convierte un `chkno` en un
verde por vacío (`PT-023`).

## Y el error de operación, cuarta vez

Lancé una batería mientras la anterior seguía viva, sobre el mismo archivo de salida. El resultado
decía `OK · 1564 casos` con **1562 verdes y un rojo**: las cifras no cuadraban entre sí, y eso fue
lo que lo delató.

Está escrito en el `HANDOFF` desde `PT-118` y ha vuelto a pasar tres veces. **Escribir la
advertencia no impide nada** — que es, literalmente, la tesis de `EP-020`.

## Estado

| | |
|:---|:---|
| Escenarios | 13 |
| Orphan Criterion | ninguno |
| `verify-fdge` | sin errores |
