# PT-001 — El espejo entra en las compuertas

> Tarea dentro de la implementación abierta `EP-001` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-001
type: BUG
epic: EP-001
track: STANDARD
status: DRAFT
created: 2026-08-13
structural: no
suite_version: 5.2.3
---
```

## 1. Qué se quiere   `[HUMANO]`

> «no veo que uses github para dar de alta las tareas y desde ahí se desprenda el seguimiento
> para no perder lo que se está haciendo»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una allocation viva sin issue hace fallar la verificación | Caso de `selftest.sh` con un `REGISTRY.json` de fixture con una allocation `DRAFT` sin `issue`: el verificador sale distinto de 0 |
| AC-02 | Un issue abierto que ninguna allocation viva reclama hace fallar la verificación | Caso de `selftest.sh` sobre la dirección inversa del espejo |
| AC-03 | El espejo se ejecuta en CI, no solo a mano | `.github/workflows/verificacion.yml` tiene un paso que lo invoca y el paso puede fallar el job |
| AC-04 | El espejo es precondición de `G4` | `verify-fdge --gate G4` lo enumera entre las precondiciones de `FDGE-R34` y falla si no cuadra |
| AC-05 | La ausencia de credencial de plataforma no produce un rojo permanente | Comportamiento declarado y probado: sin `gh` autenticado el resultado es distinguible de «el espejo no cuadra», y qué se hace con él está escrito |
| AC-06 | Un proyecto sin `tracker.plataforma` declarada no se ve afectado | Caso de `selftest.sh`: `REGISTRY.json` sin la clave `tracker` no falla ninguna compuerta nueva |
| AC-07 | `FDGE-R52` acepta el reanclaje donde `CORE.md` manda escribirlo | Con plataforma declarada, un comentario en el issue satisface la regla; sin plataforma, sigue exigiendo `bitacora.md`. Caso de `selftest.sh` para las dos ramas |
| AC-08 | `tracker` no falla por etiquetas inexistentes | Las etiquetas que usa se crean o se declaran precondición con mensaje accionable (`RULE-07`) |

### AC-07 — por qué se añadió después de firmar

Encontrado el 2026-08-13 ejecutando `PHASE 2` de otra tarea del lote. `CORE.md` §El bloque
ESTADO dice del reanclaje: «**issue si hay plataforma** · `changes/PT-NNN-slug/bitacora.md`
si no». El reanclaje se escribió como comentario del issue, que es lo que manda el
procedimiento, y `verify-fdge` falló igualmente:

```
✗ FDGE-R52   PT-004: está en PHASE 2 y su bitácora tiene 0 nota(s); faltan 1.
```

El verificador solo busca `bitacora.md` y no sabe que hay plataforma. Es la misma causa que
esta tarea ataca —el espejo existe y las compuertas no lo conocen— manifestada en una regla
distinta. Cumplir el procedimiento al pie de la letra deja la compuerta en rojo; ponerla en
verde exige escribir el reanclaje **dos veces**, que es justo lo que `SUITE-R35` prohíbe
(«el issue referencia el intake, no lo copia: dos copias divergen»).

AC-08 recoge la desviación de la apertura: las etiquetas `implementación` y `tarea` no
existían en el repositorio y `gh issue create` falla sin ellas.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `npm run verify` y el job de CI fallan sobre un repositorio con una
> allocation viva sin issue, y pasan cuando el espejo cuadra.

## 4. Qué NO entra   `[AGENTE]`

- OUT: crear milestones o pull requests — el contrato incompleto es materia de `PT-003`
- OUT: cambiar el texto de `SUITE-R35` en `RULES.md`. La regla ya dice lo que tiene que decir; lo que falta es quien la ejecute
- OUT: el adaptador de Azure DevOps, que declara el contrato y no lo implementa a propósito
- OUT: espejar trabajo cerrado (`SUITE-R36`: solo lo vivo)

## 5. Firma

```
Firmado por lote: EP-001
```

---

## Evidencia de que el defecto existe

Medido el 2026-08-13 sobre este repositorio:

```
grep -n "tracker\|SUITE-R35\|issue" docs/methodology/tools/verify-fdge.mjs   → 0 coincidencias
npm run verify   → verify:patrones · verify:suite · core:check · audit · verify:secretos · selftest
.github/workflows/verificacion.yml   → los 7 pasos, ninguno invoca tracker
```

`SUITE-R35` es **HARD**, tiene herramienta (`tools/tracker.mjs`, 205 líneas) y ninguna
compuerta la ejecuta. Una regla que solo se cumple por buena voluntad es una recomendación.
