# `PT-124` — Estrategia   `PHASE 3`

## La decisión

`D-6` deja claro que no hay dos vocabularios compitiendo: hay **uno** —el de `LEXICON` §8.1— y una
lista de **plantillas** que alguien etiquetó como tipos. Así que la pregunta no es cuál gana, sino
**de dónde se deriva**.

```
A  corregir la lista a mano en tracker.mjs
B  DERIVARLA de una constante unica, y que el mensaje cite lo que de verdad declara LEXICON
```

### `A` — corregir la lista

**Descartado.** Deja una **cuarta representación** del mismo hecho escrita a mano, que es
exactamente lo que produjo el defecto. La lista volvería a divergir el día que `LEXICON` cambie —
sólo hace falta tiempo, que es lo que `BACKLOG.md` demuestra dos veces.

### `B` — derivarla — **ELEGIDO**

`TIPOS_DE_ITEM` pasa a `patrones.mjs`, junto a `ESTADOS_TERMINALES` y `RIGE_DESDE`, que es donde
viven las constantes con contrato (`SUITE-R38`). Y **`verify-suite` comprueba que coincida con lo
que `LEXICON` §8.1 declara**: sin eso, la constante única sigue siendo una copia — sólo que una.

**Ésa es la parte que cierra la clase.** Mover la lista sin comprobarla contra `LEXICON` sería
repetir `PT-080`: tres copias de una regla, las tres divergiendo, y ninguna comparándose.

## Los tres movimientos

| # | Qué | Dónde |
|:--|:---|:---|
| `E-1` | `TIPOS_DE_ITEM` vive en `patrones.mjs`, con los cinco de `LEXICON` §8.1 | `tools/patrones.mjs` |
| `E-2` | El mensaje de error **cita** los que declara y deja de atribuir a `LEXICON` lo que no dice | `tools/tracker.mjs` |
| `E-3` | `verify-suite` compara la constante con `LEXICON` §8.1 y **falla** si divergen | `tools/verify-suite.mjs` |

## Y lo que arrastra

`PT-125` y `PT-126` reciben su `type` **con el comando**, no a mano —el registro sólo lo escribe
el comando (`PT-103`, `PT-107`)— y con eso `tracker indices` las coloca y los dos `FDGE-R31` se
cierran solos.

## Lo que NO se hace

- **No se renombran los 32 `CHORE`/`INVESTIGATION` ya escritos.** Son correctos: los correctos
  eran ellos.
- **No se toca `LEXICON`.** Ya declara los cinco. El defecto era la copia.
- **No se toca el vocabulario de casos `QA`** (`verify-qa.mjs:175`). Es otro conjunto y está bien
  separado.
