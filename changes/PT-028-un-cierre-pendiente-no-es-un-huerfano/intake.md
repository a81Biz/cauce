# PT-028 — Un cierre pendiente no es un huérfano

> Tarea de la implementación abierta `EP-006` (`FDGE-R51`).

```yaml
---
id: PT-028
type: BUG
epic: EP-006
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.1.0
phase: 10
---
```

## 1. Qué falla   `[AGENTE]`

Ejecutando el orden que `SUITE-R46` acaba de fijar —apuntar el estado terminal, mergear,
cerrar— el espejo denunció nueve issues:

```
✗ El issue #33 está abierto y ninguna allocation viva lo reclama.
  Se está trabajando en algo que el registro no conoce.
```

Y no es cierto: el registro lo conoce perfectamente, lo tiene en `INTEGRATED` y su issue está
abierto **porque la regla anterior obliga a que lo esté** hasta después del merge.

**Dos reglas mías chocando.** `SUITE-R46` obliga a atravesar un estado que `SUITE-R35` marca
como trabajo perdido, así que `G4` no puede pasar bajo el orden que `G4` exige.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un issue reclamado por una allocation terminal se reporta como **cierre pendiente** | selftest |
| AC-02 | Y no bloquea: informar no es castigar | selftest |
| AC-03 | Un issue que **ninguna** allocation reclama sigue siendo huérfano y sigue bloqueando | selftest |
| AC-04 | El mensaje dice qué hacer y cuándo (`SUITE-R46`) | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el orden que `SUITE-R46` obliga a seguir deja de producir un rojo, sin que el
> espejo deje de ver un issue que nadie reclama.

## 4. Qué NO entra   `[AGENTE]`

- OUT: dejar de comprobar los issues huérfanos. Es la dirección que caza trabajo fuera del registro
- OUT: cerrar los issues antes del merge. Es justo lo que `SUITE-R46` prohíbe

## 5. Firma

```
Firmado por lote: EP-006
```
