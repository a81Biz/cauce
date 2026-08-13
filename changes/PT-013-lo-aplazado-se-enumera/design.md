# PT-013 — Diseño   `PHASE 4`

## `DEFERRED`, en dos sitios y con signos opuestos

```js
// verify-fdge · descubrimiento de PTs
const terminal = new Set(['CLOSED', 'REJECTED', 'REVERTED', 'DEFERRED']);

// tracker · VIVOS
'VALIDATION_PENDING', 'DONE', 'DEFERRED'
```

No es contradictorio: para la **verificación** un aplazado no es trabajo en curso —no tiene
intake— y para el **espejo** sigue pendiente, así que su issue permanece abierto. Es la misma
distinción que ya se hizo con `DONE`.

## `SUITE-R44`, y qué cuenta como «apunta a trabajo futuro»

Una fila de `out-of-scope.md` cuya columna de destino **cita un identificador** o **nombra un
trabajo futuro** sin citarlo. La primera está bien; la segunda es la que se persigue.

```
| … | … | `PT-015` |            ✓ tiene dónde volver
| … | … | Decisión posterior |  ✗ apunta a trabajo futuro y no cita a nadie
| … | … | — |                   ✓ no aplaza: declara lo que no entra
```

Se reconoce por una lista corta de expresiones —«posterior», «siguiente», «más adelante»,
«otra implementación»— y **se declara en la regla**, porque una heurística escondida es peor
que una explícita.

## Dónde bloquea

```
verify-fdge PT-NNN      → warn   ·  aplazar durante el trabajo es legítimo
verify-fdge --gate G4   → fail   ·  es donde el lote se cierra, y donde EP-001 lo perdió
```

## Resolución de `G2`   `FDGE-R13`

```
Veredicto:    APROBADA · 2026-08-13 · Alberto Martínez · escrita por el agente POR DELEGACIÓN
Cubre SUITE-R06e para: verify-fdge.mjs · tracker.mjs · RULES.md · CORE.md · selftest.sh
NO cubre: G4 ni la publicación.
```
