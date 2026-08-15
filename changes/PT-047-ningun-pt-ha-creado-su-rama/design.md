# PT-047 — Diseño   `PHASE 4`

## La topología, confirmada por el firmante

> «sí, es correcto» — 2026-08-14

```
main                   la linea principal. Lo publicado y publicable
 ^
 |  G4 · HUMANA · una por LOTE · sin cambios
 |
trabajo                donde se integra el trabajo del lote
 ^
 |  PR de la tarea · revision · NO es G4
 |
<type>/PT-NNN-slug     efimera. Nace de «trabajo» en PHASE 5, se borra al mergear
```

`G4` **no se multiplica**: sigue siendo el merge a la línea principal, uno por lote
(`FDGE-R33`, `EXEC-R03`).

## `SUITE-R42` deja de ser ambigua

Hoy dice *«`G4` se resuelve sobre un pull request abierto para la rama»*. Con dos niveles de
merge, «la rama» tiene dos lecturas. Pasa a decir **para la rama por defecto** — que es lo que
`verify-fdge` ya comprueba cuando corre desde `trabajo`, así que el código no cambia: cambia el
texto que lo describía mal.

## El campo, y por qué en el registro

```json
{ "id": "PT-047", "branch": "fix/PT-047-ningun-pt-ha-creado-su-rama", ... }
```

`HISTORY.log` ya declara `Rama:` y **nadie lo comprueba** — es uno de los ocho campos sin
verificación. Pero `HISTORY` se escribe en `PHASE 8` y la rama se crea en `PHASE 5`: comprobarlo
ahí llega tres fases tarde. El registro es donde `PT-044` puso la fuente de verdad del estado, y
la rama **es estado**.

## La comprobación

```js
// Un PT VIVO en PHASE 5 o posterior tiene rama. Lo ya terminado no se retrofecha:
// mismo criterio con el que PT-044 acoto FDGE-R52, y por la misma razon.
if (fase >= 5 && !YA_TERMINADO.has(alloc?.status) && !alloc?.branch) {
  const m = `${pt}: esta en PHASE ${fase} y no declara rama. PHASE 5 crea ...`;
  gate === 'G4' ? fail('FDGE-R19', m) : warn('FDGE-R19', m);
}
```

Aviso durante el trabajo, error en `G4` — el patrón que `PT-044` dejó establecido.

## Lo que este diseño **no** hace

No crea la rama por nadie, no toca quién resuelve `G4` ni cuántas veces, y no reescribe la
historia de los 46 PT integrados. Hace que **no declararla se vea**.
