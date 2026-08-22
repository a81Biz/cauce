# Descubrimiento — `PT-103`

## Dónde estaba, con archivo y línea

```
tracker.mjs:2092   asignar()
tracker.mjs:2131   reg.allocations.push({ id, slug, created, status })
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^  cuatro de nueve
```

**Sin `phase`**: `Number(undefined)` es `NaN`, y `avanzar` compara contra la fase actual — la
allocation no se puede mover **nunca**.

**Sin `type`**: las comprobaciones de `BUG` no se activan; la tarea pasa por otro carril.

## Y ya se había topado con esto

`PT-096` fue **la primera allocation creada con `asignar` desde `PT-062`**. Chocó con el `NaN`,
lo resolvió escribiendo el campo a mano con excepción declarada, y **dejó el arreglo declarado
para `L-1`**.

`L-1` se cerró con `PT-098` —el estado terminal— por otra vía. **Este hueco siguió abierto.**

> Un hallazgo declarado para otra tarea puede perderse si esa tarea resuelve algo distinto con
> el mismo nombre.

## Lo que nadie miraba

```
verify-fdge   mira los PRODUCTOS      intake firmado · trazabilidad · HISTORY · indices
verify-suite  mira la COHERENCIA      vocabulario · reglas citadas · enlaces
audit         mira la COBERTURA       que cada regla HARD tenga comprobacion
selftest      mira el COMPORTAMIENTO

nadie         mira el PROCEDIMIENTO
```

Y lo que debería exigirlo **no puede fallar**:

| | |
|:---|:---|
| `CLAUDE.md` | parametriza · `SUITE-R00` dice que no legisla |
| `CORE.md` | se carga · no comprueba |
| `SESSION_LOG` | registra · no impide |
| el agente | lee · puede no leer |

## Una comprobación de la medición

Tras el arreglo, `PT-104` se creó **entera desde el comando**: `id`, `slug`, `created`, `status`,
`phase: 1`, `type`, `severity`, `epic` y `title`. Primera allocation de la sesión que no hizo
falta tocar a mano.

## Lo que este descubrimiento NO establece

- **Que los demás comandos no tengan el mismo hueco.** Se midió `asignar`.
- **Que el procedimiento entero sea comprobable.** No lo es, y `SUITE-R58` no lo hace.
