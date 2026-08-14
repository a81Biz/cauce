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

Una sola tarea. No hay solapamiento.

## 6. Tareas del lote   `FDGE-R51`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-024` | BUG | S1 | `cerrar` no se adelanta a la rama por defecto |

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
| Entrada de `CHANGELOG.md` | pendiente |
| Número de versión | pendiente |
| Regenerar `CORE.md` | pendiente |

> El merge y la publicación no son filas de esta sección: son el cierre mismo (`G4`).
