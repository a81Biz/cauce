# PT-150 · `design.md` — `PHASE 4` Proposal

## 1. La forma, calcada de `PT-144`

```js
export const SEVERIDADES = ['S1', 'S2', 'S3', 'S4'];   // LEXICON §8.3
export const esSeveridad = (v) => SEVERIDADES.includes(v);
export const RE_SEVERIDAD = ...   // construida, no escrita — SUITE-R59
```

El comentario de contrato **cita** `LEXICON` §8.3 y no lo parsea, por el mismo motivo que en
`PT-144`: un parseo degradado devuelve lista vacía y todo pasa en verde (`RULE-02`).

## 2. El regex se construye, no se escribe

`verify-fdge.mjs:166` tiene hoy `/^\s*severity:\s*(S[1-4])\s*(?:#.*)?$/im`. La clase `[1-4]`
codifica la escala **dentro del patrón**: añadir un nivel obliga a editar un regex, que es donde
`SUITE-R59` avisa de que los escapes se pierden al editar.

Se construye desde `SEVERIDADES` con el normalizador de `patrones.mjs` —`comoLiteral`, `CLASE`—,
**sin una sola barra invertida escrita a mano**. Lo que no se escribe no se pierde.

Y `RULE-02` obliga a que el caso que lo tumbe exista: un `severity: S9` y un `severity:` vacío
tienen que seguir sin casar. El propio comentario de `verify-fdge:165` ya lo declaraba —«sigue
rechazando lo inválido»— y ahora habrá una prueba que lo sostenga.

## 3. El mensaje de error deja de mentir

Hoy:

```
«S4» no es una severidad. LEXICON declara: S0 · S1 · S2 · S3
```

Las dos mitades son falsas. Después, el texto **se deriva de la constante**, así que no puede
divergir del dato: si mañana `LEXICON` gana un nivel y `SEVERIDADES` lo recoge, el mensaje lo
enumera solo.

Es la misma exigencia de `PT-015` —«el fallo cita su regla»— aplicada al **contenido** del
mensaje, no solo a su ID.

## 4. Lo que NO se toca, y por qué importa decirlo

```
INTAKE/templates/CHANGE-REQUEST.md   severity: S4 por defecto   ← CORRECTO. No se toca.
Las cinco allocations historicas     4x S4 y 1x S0, INTEGRATED  ← AC-06. No se tocan.
LEXICON §8.3                          la escala                  ← es la FUENTE. No se toca.
```

La plantilla es la más fácil de «arreglar» mal: cambiarla a `S3` haría pasar el comando y
**acomodaría el documento al defecto**. `S4` es el valor correcto para un `CHANGE-REQUEST` —`LEXICON`
lo define como «deuda sin impacto observable, se agrupa en lotes», que es lo que un `CHORE` de
lote es—. El que está mal es el comando.

## 5. `AC-07` se cumple por la vía del verificador

`strategy.md` §7 lo desarrolla: «ningún camino» no es alcanzable porque `REGISTRY.json` se puede
escribir a mano, y así entraron los cuatro `S4`.

```
por comando      asignar rechaza    ← ya existe, con la lista mal; pasa a estar bien
por verificador  verify-fdge CAZA una severidad fuera de escala en trabajo VIVO   ← NUEVO
a mano           sigue siendo posible, y lo caza el verificador en la corrida siguiente
```

Y **lo terminal no se rejuzga**: `PT-107` (`S0`) y los cuatro `S4` están `INTEGRATED`, así que el
verificador nuevo no los alcanza. Es el mismo criterio de `RIGE_DESDE` y `SUITE-R44`, y sin él
esta tarea pondría en rojo cinco tareas cerradas hace meses.

## 6. Rama propuesta — **no se crea aquí** (`FDGE-R13`)

```
bug/alberto-martinez/PT-150-la-escala-de-severidad-se-declara
```
