# PT-011 — Diseño   `PHASE 4`

```js
const enFilas = txt.split(/\r?\n/)                       // RULE-03
  .filter((l) => /^\s*\|/.test(l))                       // solo filas de tabla
  .flatMap((l) => [...l.matchAll(/\bPT-\d+\b/g)].map((m) => m[0]));
const pts = enFilas.length ? enFilas : [...txt.matchAll(/PT-\d+/g)].map((m) => m[0]);
```

Cuatro líneas. Vienen del commit `760f790` del proyecto legado, con su comentario, porque el
razonamiento de por qué el respaldo existe se pierde si solo se copia el código.

## Y el `CHANGELOG` se corrige

La entrada de la 4.13.0 afirma esta corrección como traída. Se le añade una nota que dice
**dónde estaba realmente** y en qué versión llegó. No se reescribe la entrada —`SUITE-R09`,
append-only— pero tampoco se deja una afirmación falsa cerrando la pregunta.

## Resolución de `G2`   `FDGE-R13`

```
Veredicto:    APROBADA · 2026-08-13 · Alberto Martínez · escrita por el agente POR DELEGACIÓN
Cubre SUITE-R06e para: verify-fdge.mjs · selftest.sh · CHANGELOG.md
NO cubre: G4 ni la publicación.
```
