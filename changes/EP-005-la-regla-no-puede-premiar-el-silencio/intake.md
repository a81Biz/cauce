# EP-005 — La regla no puede premiar el silencio

```yaml
---
id: EP-005
type: EP
status: DRAFT
created: 2026-08-13
suite_version: 7.0.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «¿por qué habrían 3 de 5 tareas limpias?? deben ser las 5 ¿qué pasa?»

`G4` de `EP-004` quedó bloqueada en dos tareas y no en las otras tres. La diferencia **no era
corrección**: las tres que pasan omiten una fila que las dos bloqueadas escriben.

## 2. Qué falla   `[AGENTE]`

La entrada de `CHANGELOG.md` y el número de versión están fuera del alcance de **las cinco**
tareas por igual — es cierre de lote, no de tarea. `PT-014` y `PT-018` lo declararon;
`PT-011`, `PT-012` y `PT-013` no. Las que lo declararon son las más completas y son las que la
compuerta castiga.

**Defecto 1 — el punto muerto.** `SUITE-R44` acepta la cita al propio lote solo si está
`CLOSED`. Un lote llega a `CLOSED` **después** del merge, y el merge **es** `G4`. El patrón
legítimo «esto se hace al cerrar el lote» no puede satisfacerla nunca.

**Defecto 2 — la regla premia el silencio.** `checkAplazado()` recorre las filas que existen.
Una fila que falta no produce aviso: el `out-of-scope` más pobre es el que mejor pasa. Es lo
contrario de aquello para lo que `SUITE-R44` se escribió — «es imposible que se te pasen u
olviden cosas».

El segundo es el grave, y es de `S1`: convierte la compuerta en un incentivo a documentar menos.

## 3. Objetivo común del lote   `INTAKE-R09`

Que `SUITE-R44` deje de tener un incentivo invertido. Las dos tareas atacan la misma pieza
—`checkAplazado()`— desde sus dos extremos: qué acepta cuando la fila está escrita, y qué hace
cuando no lo está.

## 4. Criterio de éxito del lote   `INTAKE-R09`

`EP-004` pasa `G4` con sus **cinco** tareas, y omitir una fila de cierre de lote deja de ser
más barato que escribirla. Si solo se cumple lo primero, el lote ha desbloqueado un merge y no
ha arreglado nada.

## 5. Análisis de solapamiento   `INTAKE-R09`

Las dos tocan `checkAplazado()` en `verify-fdge.mjs` y las dos añaden casos a `selftest.sh`.
**No se solapan en el código**: `PT-021` cambia una condición de aceptación —qué estado del
propio lote vale— y `PT-022` añade una comprobación que hoy no existe —qué pasa con lo que no
está escrito—.

Orden obligado: `PT-021` primero. Mientras el punto muerto siga ahí, no se puede medir si
`PT-022` mejora algo, porque toda fila que cite al lote falla por la otra razón.

## 6. Tareas del lote   `FDGE-R51`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-021` | BUG | S1 | El punto muerto: citar el propio lote en su cierre |
| `PT-022` | BUG | S1 | La fila que falta no se ve |

## 7. Cómo termina

> Termina cuando: `EP-004` puede pasar `G4` con sus cinco tareas, y cuando omitir una fila de
> cierre de lote deja de ser la forma barata de pasar la compuerta.

## 8. Qué NO entra

- OUT: relajar `SUITE-R44` para desbloquear el merge. El punto muerto se corrige; la exigencia no se baja
- OUT: obligar a que todo `out-of-scope` sea idéntico dentro de un lote

## 9. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «Vamos por A», 2026-08-13)
Fecha: 2026-08-13
Severidad declarada: S1 en las dos tareas. La compuerta premia documentar menos, y eso
corrompe el incentivo que el marco entero existe para crear.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` de `7.0.0` ampliada con `SUITE-R45` | pendiente |
| Regenerar `CORE.md` | pendiente |
| Escribir la sección de cierre en los lotes vivos | pendiente |
| Auditar si `PT-018` declaró más cambios de especificación que no hizo | pendiente |

> El merge y la publicación **no** son filas de esta sección: no son trabajo que el lote
> absorba al cerrar, son el cierre mismo (`G4`, humano — `EXEC-R04`, `SUITE-R06a`). Listarlos
> aquí sería un checklist que se pide completarse a sí mismo, y bloquearía la compuerta con la
> compuerta.
