# PT-066 — Descubrimiento   `PHASE 2-B`

## Causa raíz: una línea, dos fallos

```js
// regla.mjs:55 — dentro de definicionDe()
if (linea.includes(`\`${id}\``) && /HARD|SOFT/.test(linea)) {
  return { documento: f, texto: linea };
}
```

**Fallo 1 · el filtro de severidad omite `CHECK`.** `RULES.md` usa tres severidades:

```
148 HARD · 20 CHECK · 13 SOFT
```

Las 20 `CHECK` no pasan el filtro. Entre ellas `FDGE-R34`, que `CLAUDE.md` nombra **precondición
de `G4`**, y `SUITE-R13`.

**Fallo 2 · decide por MENCIÓN, no por DEFINICIÓN.** Devuelve la **primera línea** que contiene
el ID y casa `HARD|SOFT` — y una regla se menciona en el cuerpo de otras. Así que:

```
regla.mjs FDGE-R43  ->  devuelve el texto de SUITE-R29
regla.mjs FDGE-R19  ->  devuelve el texto de SUITE-R42
```

**Y las `EXEC-*` no se encuentran nunca.** En `EXECUTION-MODES.md` son prosa —`` `EXEC-R14` ·
**Restricción automática…** ``— sin severidad en la línea, así que el filtro las descarta las 15.

## Medido, no estimado

```
IDs definidos en los tres documentos propietarios : 197
  correctos                                       : 150
  «no existe» siendo FALSO                        :  21   (11 CHECK + 10 EXEC-*)
  devuelven el texto de OTRA regla                :  26
```

**47 de 197 mal.** Y las 26 del segundo grupo son las peores: no fallan, **mienten con formato de
respuesta correcta**, bajo la cabecera «definida en `RULES.md`».

## Lo que el propio archivo ya sabía

Veinte líneas más abajo del defecto, en un comentario de `PT-051`:

> *«Con dos emisiones identicas en el mismo archivo (…) `indexOf` devolveria LA MISMA LINEA para
> las dos, y esa linea seria plausible: quien la abriera veria codigo y creeria que es el que
> busca. **Una linea equivocada y creible es peor que ninguna.**»*

`PT-051` arregló ese patrón en `fallosPosibles`. La misma función `definicionDe`, en el mismo
archivo, lo conserva.

## Y el mensaje de error acusa

Cuando no encuentra, `regla.mjs` imprime:

> *«Si un mensaje la cita, ese mensaje apunta a una regla que no existe — y eso es un defecto, no
> una laguna tuya.»*

Con 21 falsos negativos, eso convierte **citas correctas en acusaciones**. Le pasó a este agente
en `PHASE 0` de esta misma sesión: consultó `EXEC-R14`, `EXEC-R11` y `SUITE-R13`, las tres
existen, y las tres se declararon inexistentes.

## Por qué nada lo detectó

`verify-suite` pasa limpio: comprueba que las reglas **citadas** existan, no que la herramienta
de consulta las **encuentre**. Son dos cosas distintas y sólo una tenía comprobación.
