# Diseño — `PT-128`

```
tracker cursor [PT-NNN|EP-NNN]

  ESTAS EN     el nodo y su DATO: tipo, estado, fase
  VIENES DE    el lote que la contiene · la parada que la abrio · o «es raiz»
  PUEDES IR A  un lote -> sus tareas · una tarea -> su fase siguiente, con el comando
  ENUMERADO    con rastro · SIN RASTRO · SIN EVALUAR
```

## El rastro de cada fase

```
PHASE 1   changes/<PT>/intake.md
PHASE 3   changes/<PT>/strategy.md
PHASE 4   changes/<PT>/traceability.md
PHASE 6   evidence/<PT>/manifest.json  +  self-review.md
PHASE 8   la entrada en HISTORY.log
```

Las demás **no producen un artefacto fijo** y salen `SIN EVALUAR`. Marcarlas como hueco sería
inventar un incumplimiento.

## Dos recorridos, una regla

| Nodo | Qué enumera |
|:---|:---|
| tarea | sus fases |
| **lote** | **el subárbol**: cada tarea × cada fase |

El segundo es el que la prueba del intake exigía, y el que la primera versión no hacía.

## Y no escribe

`FDGE-R52` · avanzar es de `avanzar`, con su nota. Hay un caso que compara el registro **antes y
después** de ejecutar el cursor.
