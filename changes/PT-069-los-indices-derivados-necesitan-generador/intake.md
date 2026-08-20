# PT-069 — Los índices derivados necesitan generador

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-069
type: FEATURE
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 10.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que `BACKLOG.md`, `DISCOVERY.md`, `ENRICHMENT.md` y `REFACTOR_SCOPE.md` se puedan regenerar. `PHASE 8` ordena regenerarlos, `SUITE-R35` exige que espejen el registro, `verify-fdge` lo comprueba y el `no hacer` prohíbe editarlos a mano — y ninguna herramienta los genera. Las tres instrucciones no se pueden cumplir a la vez.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Existe una acción que los deriva y los escribe | `tracker indices --aplicar` los reescribe desde `REGISTRY.json` y `changes/` |
| AC-02 | Sin `--aplicar` no escribe nada | igual que `espejo` frente a `abrir --aplicar`: ver primero, escribir después |
| AC-03 | Lo derivado hace desaparecer las divergencias de `SUITE-R35` | tras ejecutarlo, `verify-fdge --all` no reporta ninguna línea de índice divergente |
| AC-04 | La prosa que no se deriva no se pierde | las notas explicativas de `BACKLOG.md` sobreviven a una regeneración, o se declara explícitamente que no las hay |
| AC-05 | El estado de lote abierto sale del registro | `BACKLOG.md` deja de declarar `EP-015` abierta y `EP-016` `DEFERRED` cuando el registro dice las dos `CLOSED` |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `tracker indices --aplicar` deja los cuatro índices espejando el registro, y `verify-fdge --all` no reporta ninguna divergencia de `SUITE-R35` en ellos.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Regenerar `HANDOFF.md`: su prosa —decisiones y «no hacer»— es lo único del estado que NO se deriva.
- OUT: Regenerar `HISTORY.log` ni `INCIDENTS.log`: son append-only (`SUITE-R09`).
- OUT: Cambiar el formato de los índices: se deriva **el que hay**.

## 5. Firma

```
Firmado por lote: EP-017
```
