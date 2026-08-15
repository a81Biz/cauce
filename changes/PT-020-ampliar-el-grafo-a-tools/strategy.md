# PT-020 — Estrategia   `PHASE 3`

## Objetivo

Que `REGISTRY.graph` describa el código propio de este marco, que son `bin/` **y**
`docs/methodology/tools/`.

## Qué se espera del grafo, declarado antes de generarlo

`PHASE 2` dejó la pregunta: 16 herramientas casi autónomas pueden describir bien y decir poco.
Lo que se espera es **concreto y comprobable**:

```
1 · que patrones.mjs aparezca como lo que es: el nodo del que cuelgan las demas.
    SUITE-R38 dice que un patron critico vive en un solo sitio, y el grafo tiene
    que poder ENSENARLO en vez de que haya que creerlo.
2 · que verify-fdge se vea como el mayor, para que «esto es un cambio MAJOR»
    deje de ser una intuicion.
3 · que una herramienta que nadie importa se vea aislada — que es como se detecta
    la que sobra.
```

Si el grafo generado no responde a las tres, **se dice** en el `self-review` en vez de darlo por
bueno: la casilla marcada es peor que el hueco declarado.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Dejar `scope: bin` | Es lo que hay, y hace que `FDGE-R43` pueda dar verde sobre lo que no miró |
| Ampliar a la raíz | `FND-R28` lo prohíbe: fuera dependencias, compilación, fixtures. Y `changes/` son 48 directorios de markdown |
| Incluir `selftest.sh` | El grafo es de dependencias entre módulos; un shell script no las declara |
| **`bin/` + `docs/methodology/tools/*.mjs`** | Es el código propio, y es lo que el `CLAUDE.md` ya declaraba |

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `FDGE-R43` con el grafo nuevo | Se ejecuta `verify-fdge --all`: sigue `STALE` por `PT-034` hasta que `pt_at_generation` se actualice |
| `REGISTRY.graph.pt_at_generation` | Se pone al PT actual: si no, nace `STALE` el mismo día |
| El grafo viejo | Se sobrescribe. Es regenerable y su frescura vive en el registro (`SUITE-R37`) |
| `graphify-out/` no se versiona | `SUITE-R37` lo dice: es regenerable. No entra en el commit |

## Criterios de éxito

- `AC-01` → `scope` incluye `docs/methodology/tools/`
- `AC-02` → el grafo contiene las herramientas
- `AC-03` → `FDGE-R43` deja de poder dar por bueno lo que no describe
- `AC-04` → el alcance excluye dependencias, fixtures y mocks

## Autorrevisión

**El riesgo real de esta tarea es marcar la casilla.** Regenerar es un comando; que el grafo
sirva es otra cosa. Por eso las tres expectativas de arriba están escritas **antes** de generarlo
—para poder contrastarlas— y no después, cuando ya se sabe qué salió.
