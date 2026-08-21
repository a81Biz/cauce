# PT-088 — Contexto   `FDGE-R08`

## De dónde sale esta tarea

De `H-002` de [`PTSA-2026-08-20`](../../PTSA/Findings/H-002.md), la primera auditoría del marco
sobre sí mismo. **No de una intuición**: de consultar una a una las reglas que sostienen la
Declaración de Valor firmada y encontrar que cuatro no las emite nadie.

## Estado del grafo   `FDGE-R43`

`FRESH` — regenerado el 2026-08-20 sobre `bin, docs/methodology/tools`, 692 nodos y 1 041 aristas.

**Y no es un detalle de trámite aquí.** El grafo obsoleto contestaba que `patrones.mjs` tiene 2
importadores cuando tiene **8**, y esta tarea toca `patrones.mjs`. Consultado con el grafo al día:

```
audit · build-core · migrate · tracker · verify-fdge · verify-patrones · verify-suite · version
```

Ocho herramientas dependen de lo que aquí se añade. Por eso las dos funciones nuevas son **puras**
—entran y salen valores, no leen el disco— y por eso `verify-patrones` las cubre con su contrato.

## Lo que ya existía y no se rehace

| | Dónde | Por qué se reutiliza |
|:---|:---|:---|
| `RIGE_DESDE` | `patrones.mjs` | `PT-081` lo dejó puesto; sin él `EXEC-R04` nace con 17 fallos |
| `firmantesDeclarados()` | `verify-fdge.mjs:384` | `SUITE-R27` ya resuelve quién puede firmar |
| `NO-VERIFICABLES.md` | `docs/implementation/` | `PT-078` lo montó con cinco reglas y su firma |
| `clasificarReglas` | `patrones.mjs` | reparte las 224 en tres casillas exhaustivas |

**Nada de esto se reescribe.** La tarea añade dos funciones y una fila; el resto es enchufar.

## Limitación declarada del contexto

**El auditor que encontró `H-002` es el mismo agente que escribe esta tarea.** Toda afirmación de
`PHASE 2` tiene evidencia ejecutada —`regla.mjs`, `audit`, `git diff`, la prueba inversa en rama
temporal— pero *qué otras reglas del dominio no se miraron* no es contrastable desde dentro.

Se dice porque `PTSA-R14` lo exige y porque es el mismo límite que `RESUMEN.md` declara sobre la
auditoría entera.
