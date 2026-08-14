# PT-043 — Migración guiada

> Tarea de la implementación abierta `EP-011` (`FDGE-R51`).

```yaml
---
id: PT-043
type: FEATURE
epic: EP-011
track: STANDARD
status: DRAFT
created: 2026-08-14
structural: no
suite_version: 7.5.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «migrar un legado como está me parece hasta preocupante»

Conducir las siete decisiones de migrar un legado, no enumerarlas.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Las decisiones humanas de la migración se **conducen** una por una | ejecución |
| AC-02 | Cada una dice qué decide, por qué no puede decidirla la máquina y qué pasa después | selftest |
| AC-03 | El modo restringido se explica al entrar en él, no se descubre | selftest |
| AC-04 | Migrar sin resolverlas sigue siendo imposible: no se relaja `SUITE-R17` | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: se detalla en `PHASE 1` de esta tarea. El lote está firmado; el alcance
> concreto se cierra al abrirla, no antes — inventarlo ahora sería el mismo defecto que
> `EP-010` corrigió: escribir sin la lista.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras cuatro tareas de `EP-011`
- OUT: publicar. Decisión humana: «antes de publicar, debemos solventar todo»

## 5. Firma

```
Firmado por lote: EP-011
```
