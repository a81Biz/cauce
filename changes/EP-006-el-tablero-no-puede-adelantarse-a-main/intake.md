# EP-006 — El tablero no puede adelantarse a `main`

```yaml
---
id: EP-006
type: EP
status: IN_PROGRESS
created: 2026-08-13
suite_version: 7.0.0
phase: 1
---
```

## 1. Qué pasó   `[HUMANO]`

> «el merge falló, es necesario agregar algo que revise ésos errores»

Nueve divergencias `SUITE-R35` en la CI de `main`, todas de la misma forma:

```
✗ EP-004 está vivo (DONE) y su issue #17 no está abierto.
✗ PT-011 está vivo (DONE) y su issue #18 no está abierto.
   … siete más
```

## 2. Por qué   `[AGENTE]`

Cerré los issues desde `trabajo` **antes de que `INTEGRATED` llegara a `main`**. La CI de `main`
lee el `REGISTRY.json` de `main`, que decía `DONE` —vivo— con el issue ya cerrado.

Y no es un despiste puntual: **con ese orden, la CI de `main` fallaría después de cada merge.**
El apunte `DONE → INTEGRATED` se escribe en `trabajo` *después* de mergear, así que solo llega a
`main` en el merge siguiente. `main` queda permanentemente un ciclo por detrás de su tablero.

## 3. Objetivo común del lote   `INTAKE-R09`

Que el estado del tablero no pueda adelantarse al de la rama de la que se deriva.

## 4. Criterio de éxito del lote   `INTAKE-R09`

`tracker cerrar` se niega a cerrar un issue cuyo estado terminal no está todavía en la rama por
defecto, y lo dice con el comando que lo arregla. La CI de `main` queda verde después de un
merge sin intervención manual.

## 5. Análisis de solapamiento   `INTAKE-R09`

Las dos tocan `tracker.mjs` y salen del mismo síntoma —la CI de `main` en rojo tras el merge—
pero **son defectos distintos y no se solapan**:

- `PT-024`: el tablero se adelantaba al **contenido** de la rama por defecto (issues cerrados
  antes de tiempo). Se arregla en `cerrar`.
- `PT-026`: el espejo se comprueba **en el sitio equivocado**. El registro que asigna vive en la
  rama de trabajo; el de `main` es una foto del momento del merge, y compararla contra un
  tablero que sigue avanzando diverge siempre, por construcción.

`PT-024` primero: arreglar dónde se comprueba sin arreglar qué se cierra dejaría el cierre
prematuro sin guarda y solo escondería su efecto.

## 6. Tareas del lote   `FDGE-R51`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-024` | BUG | S1 | `cerrar` no se adelanta a la rama por defecto |
| `PT-026` | BUG | S1 | El espejo se comprueba donde el registro **asigna**, no en la foto |
| `PT-028` | BUG | S1 | Un cierre pendiente no es un huérfano: `SUITE-R46` y `SUITE-R35` chocaban |

## 7. Cómo termina

> Termina cuando: cerrar un issue exige que el estado terminal ya esté en la rama por defecto, y
> el orden correcto está escrito donde se lee antes de mergear.

## 8. Qué NO entra

- OUT: relajar `SUITE-R35` para que tolere la ventana. Cegar al detector es peor que el defecto
- OUT: automatizar el merge o el push a `main` (`SUITE-R06a`)

## 9. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «es necesario agregar algo que revise ésos errores», 2026-08-13)
Fecha: 2026-08-13
Severidad declarada: S1. Rompe la integración de forma reproducible en cada merge.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | HECHO |
| Número de versión | HECHO — 7.1.0 |
| Regenerar `CORE.md` | HECHO |
| El choque entre `SUITE-R35` y `SUITE-R46` que apareció al ejecutar el orden nuevo | `PT-028` |
| Buscar más reglas que se hagan imposibles entre sí | `PT-029` |
| Comprobar que la CI de `main` queda verde tras el merge | `PT-027` |

> El merge y la publicación no son filas de esta sección: son el cierre mismo (`G4`). Y lo que
> se verifica **después** del cierre tampoco lo es: no se puede declarar resuelto antes de que
> ocurra. Eso es trabajo aplazado y se **asigna** (`SUITE-R44`) — por eso la comprobación de la
> CI es `PT-027` con su issue abierto, y no una fila que bloquearía la compuerta con la
> compuerta. Es el tercer punto muerto de esta familia en dos días; queda escrito en la regla.
