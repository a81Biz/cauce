# PT-059 — Descubrimiento   `PHASE 2`

> Medido contra este repositorio el 2026-08-18.

## 1. El «presupuesto disponible» no existe como cifra

La formulación natural de la compuerta es:

```
disponible = total − gastado
```

**`total` es el contexto del modelo, y el marco no puede medirlo.** Es la decisión 4 del firmante,
y `PT-058` ya obliga a declararlo como `SIN EVALUAR`. Ejecutado:

```js
restar(cifra(null, SIN_EVALUAR), cifra(14319, MEDIDO))
  →  { valor: null, naturaleza: 'SIN EVALUAR' }
```

**El presupuesto disponible es `SIN EVALUAR` siempre, por construcción.** No es un caso de borde:
es el caso permanente.

Eso cambia por completo lo que esta compuerta puede ser. Una que compare el coste con el
disponible **nunca tendría con qué comparar**, y `AC-05` —que ante la falta de datos no apruebe—
dejaría el marco bloqueado para todo, siempre. Una compuerta que bloquea siempre se desactiva a la
semana, que es el mismo argumento que `PT-056` midió con las discrepancias.

## 2. Lo que sí se puede medir

| Señal | Naturaleza | De dónde |
|:---|:---|:---|
| Lo **gastado** en la sesión | `MEDIDO` | commits del día: 37 commits, 145 archivos, 14 319 líneas |
| El coste **típico** de la tarea que viene | `ESTIMADO` | `tracker coste` (`PT-057`) |
| …si su grupo tiene menos de 5 casos | `SIN EVALUAR` | `costeDe` devuelve `null` con motivo |
| El **mayor trabajo ya completado** en una sesión | `MEDIDO` | el historial, por día |
| El **total** disponible | `SIN EVALUAR` | nada lo registra, y nada puede |

## 3. Sesiones reales de este repositorio

Aproximando una sesión por día de commits —lo único observable— el historial completo:

```
2026-08-12    21 commits ·   91 archivos ·  29 286 lineas
2026-08-13    64 commits ·  410 archivos ·  25 232 lineas
2026-08-18    37 commits ·  145 archivos ·  14 319 lineas
2026-08-14    23 commits ·  279 archivos ·   9 802 lineas
2026-08-17     8 commits ·   70 archivos ·   7 441 lineas
2026-08-15    11 commits ·  106 archivos ·   6 812 lineas
```

Seis sesiones. La mayor hizo **29 286 líneas**; la menor, 6 812. Un factor de **cuatro**.

## 4. La pregunta que sí se puede responder

No «¿cabe en el presupuesto?» —eso exige un total que no existe— sino:

> **¿Ha demostrado esta sesión que puede con algo de este tamaño?**

Esa sí es observable y no requiere inventar nada:

- Si el coste típico de lo que viene es **menor o igual** que lo mayor que esta sesión ya ha
  completado, hay **evidencia** de que cabe. No certeza: evidencia.
- Si es mucho mayor que cualquier cosa que la sesión haya hecho, **no hay evidencia**, y eso no es
  lo mismo que saber que no cabe.
- Si la sesión **acaba de empezar** y no ha completado nada, no hay con qué comparar:
  `SIN EVALUAR`, y no aprueba por omisión.

La compuerta deja de fingir que mide capacidad y pasa a medir **precedente**, que es lo que el
repositorio realmente tiene.

## 5. `AC-06` es derivable, y ese es el hallazgo

«Un lote entero en `UNSAFE` para siempre se declara, no se repite en bucle.»

Con el historial se puede distinguir **no cabe ahora** de **no cabría nunca**: si el coste típico
de una tarea supera **la mayor sesión jamás registrada** (29 286 líneas), no es que esta sesión
vaya justa — es que **ninguna sesión de este repositorio ha hecho nunca tanto**. Repetir
`BLOCKED_BY_CONTEXT` ahí sería un bucle infinito garantizado.

Hoy **ninguna** referencia de coste se acerca: la mayor es `CHORE/STANDARD` con 1 974 líneas de
mediana, un 7 % de la mayor sesión. La comprobación existirá sin dispararse — y eso está bien: es
una salvaguarda, no una funcionalidad.

## 6. `BLOCKED_BY_CONTEXT` frente a los estados que ya hay

`LEXICON` §4 declara los estados de tarea. `BLOCKED` ya existe. Los dos se parecen y **no son lo
mismo**:

| | Qué significa | Quién lo desbloquea |
|:---|:---|:---|
| `BLOCKED` | Falta algo **externo**: una decisión, un acceso, otra tarea | Alguien hace algo |
| `BLOCKED_BY_CONTEXT` | La tarea está lista; **el momento** no | Empezar otra sesión |

`BLOCKED_BY_CONTEXT` **no es terminal** (`AC-04`) y **no es un fallo**: la tarea no está fallando,
no debe ejecutarse todavía. Meterlo dentro de `BLOCKED` perdería exactamente eso, y lo que se
pierde es la diferencia entre «hay un problema» y «no es el momento».

## 7. Lo que esto obliga

1. La compuerta compara con **el precedente de la sesión**, no con un total inexistente.
2. `SIN EVALUAR` en cualquier entrada ⇒ **no aprueba**, pero tampoco declara `UNSAFE`: la
   respuesta honesta es `MARGINAL` con el motivo, que es «no se sabe» sin bloquear el trabajo.
3. `UNSAFE` se reserva para cuando **sí** hay evidencia en contra.
4. La distinción **nunca cabría** se deriva del historial completo, no de un contador de reintentos.
