# PT-003 — El contrato de la plataforma: implementarlo o recortarlo

> Tarea dentro de la implementación abierta `EP-001` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-003
type: INVESTIGATION
epic: EP-001
track: STANDARD
status: CLOSED
created: 2026-08-13
structural: no
suite_version: 5.2.3
---
```

## 1. Qué se quiere   `[HUMANO]`

> «desde ahí se desprenda el seguimiento para no perder lo que se está haciendo»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Está determinado qué aporta el milestone que el issue no da ya | `discovery.md` §Conclusión, con la evidencia que lo sustenta |
| AC-02 | Está determinado si el enlace `G4` ↔ pull request se puede comprobar mecánicamente sin que el agente cree el PR | `SUITE-R06a` prohíbe automatizar el merge; queda por determinar si crear el PR cae dentro o fuera de esa prohibición |
| AC-03 | La decisión está escrita como una de dos: implementar los dos mapeos que faltan, o recortar el contrato a lo que el adaptador hace | Una de las dos, con motivo, en `discovery.md` |
| AC-04 | La tarea de seguimiento queda propuesta con su tipo | `FDGE-R42`: una investigación cierra con el PT que la sucede, o con la declaración de que no hace falta |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `discovery.md` tiene su sección `## Conclusión` con la decisión tomada
> entre implementar y recortar, y el PT de seguimiento propuesto o descartado por escrito.

## 4. Qué NO entra   `[AGENTE]`

- OUT: escribir código. Una investigación no produce código (`FDGE-R10`)
- OUT: automatizar el merge o su aprobación. `G4` es humana en los tres modos (`EXEC-R04`)
- OUT: el adaptador de Azure DevOps
- OUT: sustituir el repositorio por la plataforma como fuente de lo decidido (`SUITE-R35`: la plataforma espeja, no es fuente)

## 5. Firma

```
Firmado por lote: EP-001
```

---

## Por qué es INVESTIGATION y no FEATURE

Porque la decisión no está tomada y el agente no la toma. `FDGE-R09` manda reclasificar a
`INVESTIGATION` cuando el camino no está determinado; escribir el código de los milestones
antes de decidir si los queremos sería diseñar la respuesta a una pregunta que nadie ha
contestado.

## Evidencia de que el hueco existe

Medido el 2026-08-13:

```
CORE.md §La plataforma de trabajo   declara tres mapeos:
    implementación abierta → milestone
    tarea                  → issue
    compuerta G4           → pull request

tracker.mjs (205 líneas)   → 0 coincidencias de «milestone»
                           → 0 coincidencias de «pull»
```

El adaptador implementa uno de los tres. Un marco que declara una capacidad que no tiene es
el mismo defecto que persigue en los demás.
