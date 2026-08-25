# Diseño — `PT-143`   `PHASE 4`

## Cómo se lee el prefijo ahora

```js
const candidato = ARGS.slice(1).find((a, i) => /^[A-Z]+$/.test(a) && !CON_VALOR.has(ARGS[i]));
```

El índice `i` mira **la posición anterior**: si el argumento de delante es una bandera con valor,
esto **es su valor**, no un prefijo. `CON_VALOR` ya lo declara y no hay que repetirlo.

## Y lo que no está declarado **falla**

```
LEXICON §4.3    PT · EP · QA · QR · QD · H · E · P · R · INC
```

Viven **una sola vez**, en `patrones.mjs · PREFIJOS_DE_ID` (`SUITE-R38`). Un prefijo fuera de esa
lista falla en vez de crearse: **un identificador con un prefijo que ningún contador reconoce es
un identificador que nadie puede volver a encontrar**.

## Por qué el defecto por omisión sigue siendo `PT`

Es el correcto en la inmensa mayoría de los casos, y exigirlo siempre rompería toda invocación
existente sin ganar nada.

## Ningún identificador ya asignado cambia

`SUITE-R09` es append-only. Esto sólo cambia **cómo nace** el siguiente.
