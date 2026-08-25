# Descubrimiento — `PT-137`   `PHASE 2`

## Dónde está el defecto, con archivo y línea

**Las únicas cuatro asignaciones de estado del tracker:**

| Línea | Qué escribe | Quién |
|:---|:---|:---|
| `tracker.mjs:3279` | `DONE` | `avanzar`, al cerrar la última fase |
| `tracker.mjs:3285` | `VALIDATION_PENDING` | `avanzar`, para un `BUG` (`FDGE-R26`) |
| `tracker.mjs:4165` | el destino que se le pase | `integrar` |
| `tracker.mjs:4214` | `READY` | `firmar`, al resolver `G1` |
| `tracker.mjs:4284` | `DONE` | `validar`, para un `BUG` validado |

**Ninguna escribe ni retira `DEFERRED`.** Se escribe una sola vez, a mano, cuando una tarea
aplaza a otra.

## El lazo, y por qué no se abre por ninguno de los dos lados

`integrar` es el único que acepta un destino arbitrario. Pero exige el intake:

```
tracker.mjs:4145    const antes = readFileSync(intake, 'utf8');
tracker.mjs:4148    if (!m) fail('FDGE-R23', `${id}: su intake no declara «status:»...`)
```

Y antes de eso, `tracker.mjs:4119` filtra explícitamente:

```
&& x?.status !== 'DEFERRED'
```

Del otro lado, `SUITE-R44` declara que un aplazado **no tiene intake** y queda **exento** de las
exigencias de artefactos. Las dos afirmaciones son correctas por separado. Juntas dejan
`DEFERRED` sin puerta.

## Lo que además falta, y lo hace peor

`avanzar` protege lo terminal a propósito (`tracker.mjs:3261`):

```
// NO se toca un estado que ya sea terminal: una tarea puede acabar REJECTED o DEFERRED
```

Ese comentario es correcto para `REJECTED` —una tarea rechazada no vuelve— pero mete a
`DEFERRED` en el mismo saco, y aplazar **no** es rechazar. `LEXICON` §5.1 los lista juntos como
terminales sin distinguir el que puede volver del que no.

## Los dos casos vivos, medidos

```
PT-134  #255   DEFERRED   2026-08-23   origin: «Aplazado por PT-113…»
PT-025  #35    DEFERRED   mucho antes  sin origin que lo explique
```

`PT-025` no declara siquiera de qué tarea salió: `SUITE-R44` sólo exige `origin` a los aplazados
que citan un destino, y éste es anterior a la regla.

## Qué NO se midió

- **Si otros proyectos instalados tienen aplazados atrapados.** No hay acceso a ellos.
- **Cuántas veces se ha escrito `DEFERRED` a mano.** `HISTORY.log` no registra escrituras de
  registro, sólo transiciones de fase.
