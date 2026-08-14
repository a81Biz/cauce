# PT-024 — No cerrar lo que `main` todavía no sabe

> Tarea de la implementación abierta `EP-006` (`FDGE-R51`).

```yaml
---
id: PT-024
type: BUG
epic: EP-006
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 7.0.0
phase: 1
---
```

## 1. Qué falla   `[AGENTE]`

`tracker cerrar --aplicar` cierra el issue de toda allocation cuyo estado ya no es vivo, mirando
**el registro de la rama en la que corre**. Si esa rama es `trabajo` y `main` todavía dice
`DONE`, el tablero queda por delante de `main` y la CI de `main` marca nueve divergencias.

Con el orden que usé —mergear, luego apuntar `INTEGRATED` en `trabajo`, luego cerrar— el apunte
solo llega a `main` en el merge siguiente. **La CI de `main` fallaría después de cada merge.**

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `cerrar` no cierra un issue cuyo estado terminal no está en la rama por defecto | selftest |
| AC-02 | Sí lo cierra cuando el estado terminal ya está ahí | selftest |
| AC-03 | Sin acceso a la rama por defecto lo declara `SIN EVALUAR`, no lo asume | selftest |
| AC-04 | El mensaje nombra la causa y el orden correcto, no solo el síntoma | selftest |
| AC-05 | `espejo` distingue esta causa de «alguien lo cerró a mano» | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: cerrar un issue exige que su estado terminal ya esté en la rama por defecto, y
> el intento contrario explica qué hacer antes.

## 4. Qué NO entra   `[AGENTE]`

- OUT: relajar `SUITE-R35`. Cegar al detector es peor que el defecto
- OUT: automatizar el merge (`SUITE-R06a`)
- OUT: cambiar cuándo una allocation pasa a `INTEGRATED`

## 5. Firma

```
Firmado por lote: EP-006
```
