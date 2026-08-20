# PT-081 — Propuesta   `PHASE 4` · `G2`

## 1 · `RIGE_DESDE`, la hermana de `EXIGIBLE_DESDE`

En `patrones.mjs`, junto a la tabla que ya decide **qué compuerta** exige cada artefacto. Ésta
decide **desde qué versión** rige cada regla.

```js
export const RIGE_DESDE = {
  'FDGE-R52': [5, 0, 0],    // reanclaje por fase · CHANGELOG 5.0.0
  'FDGE-R53': [5, 1, 0],    // la tarea declara cómo termina · CHANGELOG 5.1.0
  'FDGE-R54': [10, 0, 0],   // la viabilidad consta antes de G2 · nace con EP-017
  'SUITE-R56': [10, 0, 0],  // el rastro sobrevive a la rama · nace con EP-017
};

export const rigeDesde = (id, suiteDelPT) => { … };
```

**Sin fila, rige siempre.** El defecto de partida era eximir de más —una regla que no se aplica a
nadie no protege— y una regla sin versión declarada es casi siempre una que existió desde el
principio. El caso contrario lo caza `AC-08`.

Y `verify-fdge` deja de tener una constante propia: las tres comprobaciones preguntan
`rige('FDGE-R52')`, `rige('FDGE-R53')`, `rige('FDGE-R54')`.

## 2 · `AC-08` · lo que impide la cuarta

```js
export function reglasNuevasSinVersion(reglas, idsAntes) { … }
```

**«Nueva» es *no existía en la versión anterior*, no «no aparece en el `CHANGELOG`».** Probé el
segundo criterio y devolvió **69**: casi todas son reglas fundacionales anteriores al propio
`CHANGELOG`. Una lista con 69 falsos positivos es una lista que nadie mira.

Y los dos lados se derivan **con la misma función y sobre los tres documentos**. Mi primera
versión leía sólo `RULES.md` de antes contra los tres de ahora, y las 26 `LEX-*` y las 14 `EXEC-*`
salían como nuevas todas. Comparar mitades distintas del mismo universo produce exactamente el
ruido que el detector existe para evitar.

Medido contra `origin/main`:

```
universo antes   221
universo ahora   223
nuevas           SUITE-R56  FDGE-R54
nuevas sin fila  []
```

Sin poder leer la versión anterior devuelve **`null`**, distinguible de la lista vacía (`RULE-06`).

## 3 · La `10.0.0`

| | |
|:---|:---|
| La entrada `9.0.0` | **no se toca.** Es el registro fechado de `EP-016` |
| La entrada `10.0.0` | nueva, con `EP-017` y las dos reglas que faltaban |
| La guía de migración | `9.0.0 → 10.0.0`, enumerando **lo que rompe** |
| `version.mjs` | alinea los 21 documentos y `package.json` |

**`MAJOR` porque rompe.** `FDGE-R54` y `SUITE-R56` son `HARD` con verificadores que fallan.
`CLAUDE.md` regla 6 no deja alternativa.

## 4 · Escenarios

| # | Escenario | Espera |
|:---|:---|:---|
| E1 | `rigeDesde('FDGE-R54', '8.2.0')` | `false` |
| E2 | `rigeDesde('FDGE-R54', '10.0.0')` | `true` |
| E3 | La versión exacta cuenta: `FDGE-R53` sobre `5.1.0` | `true` |
| E4 | Un parche antes: `FDGE-R53` sobre `5.0.9` | `false` |
| E5 | Una regla sin fila | rige siempre |
| E6 | La **misma** tarea con `8.2.0` y sin `viabilidad` | `FDGE-R54` **no** aparece |
| E7 | La **misma** tarea con `10.0.0` y sin `viabilidad` | `FDGE-R54` **sí** aparece |
| E8 | Una regla nueva sin fila | se señala |
| E9 | Una que ya existía, o una nueva con fila | no se señala |
| E10 | Sin la versión anterior | `null`, no lista vacía |
| E11 | `version.mjs` sobre los 21 documentos | todos en `10.0.0`, sin desalineados |
| E12 | La entrada `10.0.0` | nombra `FDGE-R54` y `SUITE-R56` con qué hacer en cada una |
| E13 | `git diff v9.0.0 -- CHANGELOG.md` | **cero** líneas eliminadas |

`E6` y `E7` son el par que importa: **la misma tarea, el mismo verificador, dos versiones**.
Por separado cada uno pasaría con un `rigeDesde` que devolviera siempre lo mismo.

## 5 · Lo que esta tarea NO puede resolver, y consta

**Que una guía de migración siga siendo verdad.** Comprobar mecánicamente que una prosa describe
correctamente un conjunto de cambios no sé hacerlo. Lo que `AC-08` consigue es que **redactarla
sea enumerar en vez de recordar**. Se declara la diferencia en `TD` en vez de fingir que es lo mismo.

## 6 · `G2`

```
Firmado por lote: EP-017 · delegada · 2026-08-20 · Alberto Martínez
Viabilidad (FDGE-R54): SAFE · registrada en REGISTRY.allocations[].viabilidad
```
