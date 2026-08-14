# EP-009 — El tablero refleja la jerarquía real

```yaml
---
id: EP-009
type: EP
status: IN_PROGRESS
created: 2026-08-13
suite_version: 7.3.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Veo que en lugar de crear un sub-issue dependiente del padre creas todos y los enlazas, eso no
> me parece que sea la opción correcta.»

## 2. Por qué tiene razón   `[AGENTE]`

La jerarquía **ya existe en el registro**: cada tarea declara su `epic`. La plataforma la contaba
en **prosa**, enlazándola en el cuerpo del lote. Un enlace es texto:

```
no da progreso · no cierra en cascada · no sale en el árbol del tablero
```

Dos representaciones del mismo hecho —una estructural y otra narrada— es exactamente lo que
`SUITE-R35` existe para impedir, y la estaba causando el propio `tracker`.

## 3. Objetivo común del lote   `INTAKE-R09`

Que la relación lote↔tarea sea la misma en el registro y en la plataforma, y sea **estructura** en
las dos.

## 4. Criterio de éxito del lote   `INTAKE-R09`

Toda tarea con `epic` es sub-issue de su lote en la plataforma, incluida la historia ya cerrada, y
`tracker abrir --aplicar` lo mantiene sin intervención.

## 5. Análisis de solapamiento   `INTAKE-R09`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-035` | BUG | S2 | `tracker` declara sub-issues en vez de enlazar en prosa |

Una sola tarea. No hay solapamiento.

## 6. Qué NO entra

- OUT: quitar la lista de tareas del cuerpo del lote. Sigue siendo útil para leerlo de un vistazo
- OUT: que la plataforma asigne la jerarquía. El registro asigna (`SUITE-R08`)

## 7. Cómo termina

> Termina cuando: el árbol del tablero es el del registro, y mantenerlo no depende de nadie.

## 8. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «yo estaría más cómodo si arreglas lo de github», 2026-08-13)
Fecha: 2026-08-13
Severidad declarada: S2. No pierde trabajo, pero convierte el tablero en algo que hay que leer
en vez de algo que se puede recorrer.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | pendiente |

> El merge y lo posterior no son filas: `SUITE-R45`.
