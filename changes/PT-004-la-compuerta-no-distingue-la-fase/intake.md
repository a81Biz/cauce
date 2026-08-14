# PT-004 — La compuerta no distingue la fase

> Tarea dentro de la implementación abierta `EP-001` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-004
type: BUG
epic: EP-001
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 5.2.3
---
```

## 1. Qué se quiere   `[HUMANO]`

> «el bloqueo entra como cuarta tarea»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un PT en `PHASE 1` no falla por no tener artefactos de fases posteriores | Caso de `selftest.sh`: fixture con intake firmado y sin `traceability.md`, en fase 1 → verificador en verde |
| AC-02 | Una INVESTIGATION en `PHASE 1` no falla por no tener `discovery.md`, que es de `PHASE 2` | Caso de `selftest.sh` equivalente para `FDGE-R42` |
| AC-03 | La ausencia del artefacto **sí** sigue fallando cuando el PT declara haber alcanzado la fase que lo produce | Caso inverso: fixture en fase 4 sin `traceability.md` → falla |
| AC-04 | La fase de un PT es legible sin adivinarla | Determinar de dónde sale: `phase:` en el YAML del intake, campo en `REGISTRY.allocations`, o ambos con precedencia declarada |
| AC-05 | Un PT que no declara fase no se vuelve invisible para el verificador | Sin fase declarada, el comportamiento es explícito y está escrito — no un hueco silencioso |
| AC-06 | CI puede estar en verde con trabajo abierto en curso | `verify-fdge --all` sobre este repositorio, con `EP-001` abierto y sus PTs antes de `PHASE 4`, sale con 0 errores |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `verify-fdge --all` sale con 0 errores sobre este repositorio con `EP-001`
> abierto y sus tareas antes de `PHASE 4`, y falla si un PT declara `PHASE 4` sin
> `traceability.md`.

## 4. Qué NO entra   `[AGENTE]`

- OUT: relajar `FDGE-R15` o `FDGE-R42`. Los artefactos siguen siendo obligatorios; lo que se corrige es **cuándo** se exigen
- OUT: quitar `verify-fdge --all` de CI. La compuerta se arregla, no se apaga
- OUT: inventar los artefactos que faltan para poner el verificador en verde
- OUT: el resto de comprobaciones que ya distinguen fase correctamente (`FDGE-R23`, `FDGE-R29`, `FDGE-R52`)

## 5. Firma

```
Firmado por lote: EP-001
```

---

## Evidencia de que el defecto existe

Encontrado **ejecutando** el marco, no leyéndolo. Tras cerrar `PHASE 1` de los tres primeros
PTs, el 2026-08-13:

```
✗ FDGE-R15   PT-001: falta changes/PT-001-el-espejo-en-las-compuertas/traceability.md
✗ FDGE-R15   PT-002: falta changes/PT-002-cobertura-por-regla/traceability.md
✗ FDGE-R42   PT-003: falta changes/PT-003-el-contrato-de-la-plataforma/discovery.md
```

`traceability.md` es artefacto de `PHASE 4` y `discovery.md` de `PHASE 2` (`CORE.md`
§Procedimiento por fase). Los tres PTs estaban en `PHASE 1`.

El código **sabe** distinguir fases para las columnas de la matriz — `verify-fdge.mjs:818`
«AC y TS se exigen desde PHASE 4», `:820` «Test y Evidencia solo desde PHASE 6» — pero exige
la **existencia** del archivo sin mirar la fase. La intención está escrita en los comentarios
y no llega a la condición.

**Consecuencia medida:** `.github/workflows/verificacion.yml` ejecuta `verify-fdge --all`. Desde
el momento en que se abre un PT correctamente, el job queda en rojo hasta `PHASE 4`. Un
repositorio no puede tener trabajo en curso y CI en verde a la vez. Una compuerta que se pone
roja sobre comportamiento correcto enseña a saltársela — el mismo razonamiento que motivó
`SECRETOS-EXCEPCIONES.md` en 5.2.2.

## Por qué va el primero del lote

Mientras esté sin arreglar, las otras tres tareas se ejecutan con la compuerta en rojo por un
motivo ajeno a ellas, y ninguna puede demostrar que la dejó verde.

---

## Revisiones

> Append-only (`SUITE-R09`). El intake se firmó por lote el 2026-08-13; lo que cambia después
> se añade aquí y no se edita arriba.

### Revisión 1 — 2026-08-13 · reformulación de `AC-06`

**Qué cambia.** `AC-06` decía «CI puede estar en verde con trabajo abierto en curso», medido
como `verify-fdge --all` con 0 errores. Pasa a medirse como **0 errores atribuibles a la
exigencia de artefactos por fase**.

**Motivo.** Al escribir `PHASE 3` se determinó que quedará un error ajeno a este PT:
`FDGE-R52` busca `bitacora.md` e ignora la plataforma declarada, cuando `CORE.md` manda
escribir el reanclaje en el issue si la hay. Corregirlo aquí violaría el scope lock
(`FDGE-R20`): pertenece a `PT-001`, donde ya está recogido como `AC-07`.

**Consecuencia.** La verificación de que CI puede estar entero en verde con trabajo abierto se
traslada al cierre de `PT-001`. Se escribe aquí para que la discusión ocurra ahora y no en
`G3`, que es para lo que existe este campo.

**Registrado por:** el agente, en `PHASE 3`. No altera lo firmado: acota cómo se mide un
criterio, no qué se quiere.
