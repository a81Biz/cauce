# PT-089 — Fuera de alcance   `SUITE-R44`

| Qué queda fuera | Por qué | Destino |
|:---|:---|:---|
| Las **22** divergencias de `phase` en tareas terminales | Un `phase` viejo en algo terminal **no apaga nada**: las comprobaciones de fase ya no aplican. Convertirlas en error nace con 22 fallos sobre trabajo cerrado | `—` |
| Las **7** divergencias de `estado` en los índices | `DISCOVERY`/`ENRICHMENT`/`REFACTOR_SCOPE` se **derivan** del registro: `tracker indices --aplicar` las resuelve, y editarlas a mano está en el `no hacer` | `—` |
| Decidir **cuál fuente manda** | `PT-004` ya lo decidió: manda el YAML, es lo que el PT dice de sí mismo. El arreglo es sincronizar, no elegir | `—` |
| Eliminar el YAML del intake | Es lo que hace legible un PT sin abrir `REGISTRY.json` | `—` |
| Que `avanzar` decida cómo termina una tarea | `FDGE-R53` dice que lo declara la tarea. Sólo se rellena lo que **nadie ha declarado**: una `DEFERRED` sigue `DEFERRED` | `—` |
| Los otros **41** avisos de `verify-fdge --all` | `FDGE-R19` son ramas anteriores al formato con usuario y el propio mensaje dice que siguen valiendo; `SUITE-R44` y `SUITE-R43` son otra cosa | `—` |

## `AC-06` del intake se cumple, con otra cifra

Decía «bajar de 65 avisos». Hoy son **24** —el recuento cambió al abrir el lote— y al resolver las
seis quedan **18**, ninguno de la clase que apaga comprobaciones.

La cifra del intake era de otro momento del árbol. Se dice en vez de reescribirla como si hubiera
acertado.
