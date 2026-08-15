# PT-012 — Migrar desde 4.12

> Tarea de la implementación abierta `EP-004` (`FDGE-R51`).

```yaml
---
id: PT-012
type: BUG
epic: EP-004
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 6.0.1
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «arreglar cauce […] hasta que no esté al 100»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `migrate` enumera lo que un 4.x necesita para llegar a 6.x | El bloque `ESTADO` de `HANDOFF.md` (`SUITE-R33`) entre las acciones pendientes |
| AC-02 | Dice qué herramientas y documentos llegan nuevos | Los enumera, no los cuenta |
| AC-03 | Menciona la plataforma como decisión opcional | `tracker.plataforma`, y qué reglas se activan si se declara |
| AC-04 | Menciona `SECRETOS-EXCEPCIONES.md` | Existe desde 5.2.2 y ningún tramo lo nombra |
| AC-05 | Lo que exige criterio humano no se inventa | Sigue saliendo como acción pendiente (`SUITE-R19`) |
| AC-06 | Un proyecto ya en 6.x no ve el tramo | Caso de `selftest.sh` |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `migrate` sobre un proyecto en 4.12 enumera las cuatro acciones que hoy solo
> viven en prosa dentro del `CHANGELOG` de la 5.0.0.

## 4. Qué NO entra   `[AGENTE]`

- OUT: ejecutar la migración del proyecto legado
- OUT: automatizar lo que exige criterio humano (`SUITE-R19`)
- OUT: el tramo desde 3.x, que ya existe

## 5. Firma

```
Firmado por lote: EP-004
```

---

## Evidencia de que el defecto existe

`migrate.mjs` tiene bloques para `3.x → 4.x`, `< 4.1.0` y `< 4.2.0`. **Nada más.** Su informe
íntegro sobre el proyecto legado, medido el 2026-08-13:

```
SE HARÍA AUTOMÁTICAMENTE    · REGISTRY.suite_version: 4.12.0 → 6.0.1
REQUIERE UNA PERSONA        ! actualizar suite_version en el CLAUDE.md
```

La guía de migración de la 5.0.0 lista cuatro pasos —el bloque `ESTADO`, escribirlo al cerrar
cada fase, la plataforma opcional, el espejo— y **están en prosa dentro del CHANGELOG**. Quien
migre tiene que leerlos y acordarse. La herramienta que existe para eso no los ejecuta ni los
enumera.
