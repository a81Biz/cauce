# `PT-124` — Autorrevisión   `PHASE 6`

## El hallazgo: no era una lista desactualizada, era **una lista de otra cosa**

`CHANGE` y `TAREA` **no existen en ningún otro sitio del código**. Son nombres de **plantilla de
intake**:

```
BUG · INVESTIGATION   ->  templates/BUG-REPORT.md
FEATURE               ->  templates/FEATURE-REQUEST.md
REFACTOR · CHORE      ->  templates/CHANGE-REQUEST.md
una tarea de un lote  ->  templates/TAREA.md
```

Alguien derivó la lista de las **cuatro plantillas** y la etiquetó como los **cinco tipos**. Por
eso se solapaba en `BUG` y `FEATURE` —donde plantilla y tipo se llaman igual— y **fallaba justo en
los tres donde no**: `REFACTOR` y `CHORE` comparten plantilla, e `INVESTIGATION` comparte la de
`BUG`.

Y el mensaje de error lo atribuía a `LEXICON`, que nunca declaró eso.

## Lo que cierra la clase no es mover la constante

`AC-07`. Mover la lista a `patrones.mjs` la deja siendo **una copia, sólo que una**. `PT-080`
midió lo que pasa después: tres copias de una regla, las tres divergiendo, y ninguna
comparándose. **Lo que cierra es que `verify-suite` la compare con `LEXICON` §8.1 y falle.**

Probado en las dos direcciones: con la lista vieja falla y **dice qué diverge**; restaurada, verde.

## El caso que escribí mal, y lo que enseña

Escribí la inversa como *«¿está el texto en el fuente de `verify-suite`?»*. **Eso no comprueba
nada** — y la lección está escrita en el propio `selftest.sh`, treinta líneas más arriba:

> *«Se rompe un patrón EN EL FIXTURE para que el fallo ocurra de verdad, no se busca el ID en el
> fuente: un ID en un texto que nunca se imprime no cita nada.»*

**Es el proxy en lugar del hecho, cometido dentro del caso que prueba una comprobación contra
proxies.** No lo cacé leyendo: lo cazó `patlib` reventando, y el arnés dijo *«la herramienta
reventó: no verifica nada»*, que es para lo que `revento()` existe.

Reescrito: se rompe la constante **en el fixture** y se comprueba que `verify-suite` lo caza.

## Lo que **no** se hizo, y se dice

- **`AC-06` queda sin hacer**: `asignar` sigue sin escribir `suite_version`. Se declaró en `O-9`
  del intake del lote. Meterlo aquí mezclaría dos defectos en un arreglo — esta tarea es sobre el
  **vocabulario**.
- **No se renombran los 32 `CHORE`/`INVESTIGATION` ya escritos.** Eran los correctos.
- **No se toca `LEXICON`.** Ya declaraba los cinco. El defecto era la copia.
- **No se toca el vocabulario de casos `QA`** (`verify-qa.mjs:175`). Es otro conjunto, bien
  separado.

## Lo que arrastró al cerrarse

```
PT-125  type: INVESTIGATION  ->  DISCOVERY.md        ✓ FDGE-R31
PT-126  type: CHORE          ->  REFACTOR_SCOPE.md   ✓ FDGE-R31
```

Eran los **dos únicos errores** del árbol tras firmar el lote, y se cerraron **sin tocarlos**.
