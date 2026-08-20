# PT-069 — Descubrimiento   `PHASE 2`

## Cuatro instrucciones que no se podían cumplir a la vez

| Dónde | Qué exige |
|:---|:---|
| `PHASE 8` | regenerar los índices |
| `SUITE-R35` | que espejen el registro |
| `verify-fdge` | lo comprueba (`FDGE-R31`) |
| `HANDOFF` `no hacer` | **prohíbe editarlos a mano** |

Y **ninguna herramienta los generaba.** Regenerar sin generador sólo se puede hacer a mano, que
es lo que la cuarta prohíbe.

## Lo que produjo, medido

```
antes                despues (derivado)
DISCOVERY        33            43
ENRICHMENT        4            15
REFACTOR_SCOPE   52            28
total            89            86
```

**89 filas para 86 tareas.** Y no eran duplicados: eran **27 tareas mal archivadas** — 16 bugs y
11 features viviendo en el índice de refactors. El reparto lo dice `LEX-R12` y nadie lo aplicaba
porque nadie lo derivaba.

Comprobado que **ninguna se perdió**: los 28 IDs que salieron de `REFACTOR_SCOPE` están todos en
el registro, y los 86 `PT` aparecen en alguno de los tres. **Cero fuera.**

## El daño que ya había causado

El `HANDOFF` lo tiene escrito: *«`REFACTOR_SCOPE` acabó con catorce filas pegadas en una línea por
editarlo a mano, y `BACKLOG` llevó ocho lotes declarando un estado de tres versiones atrás»*.

Y en esta misma épica volvió a pasar: **`PT-078` faltaba de `DISCOVERY.md`** y nada lo detectó.
Lo añadí a mano — que es exactamente lo prohibido — porque no había otra forma.

## Conclusión

Un artefacto **derivado** sin generador no es derivado: es un artefacto a mano con una etiqueta
que dice lo contrario. Y esa etiqueta es peor que no tenerla, porque hace confiar en él.

Es la misma forma que `PT-054` con la proyección: diseñada, escrita, documentada — y nunca
ejecutada, porque ninguna herramienta la disparaba.
