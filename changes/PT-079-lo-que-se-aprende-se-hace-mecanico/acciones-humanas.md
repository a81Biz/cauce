# PT-079 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`). Autorizado el 2026-08-19 —respuesta literal: «B»—, excepción
declarada a `SUITE-R42` y registrada en `SESSION_LOG.md`.

## 2 · Publicar la proyección   `SUITE-R56` · ✅ AUTORIZADO AL AGENTE

```bash
node docs/methodology/tools/tracker.mjs proyectar --publicar
```

**Escribe en `cauce/alberto-martinez`, no en la rama por defecto**, así que no cae bajo
`SUITE-R06a`. Es la rama que el firmante acordó para que esta documentación no se pierda:
existe desde `PT-054`, y hasta esta tarea **nunca se había ejecutado** — porque ninguna regla
la exigía, ninguna fase la abría y el manual no la nombraba. Ahora `PHASE 9` la cita y el
verificador la echa en falta.

## 3 · `G4` — merge del lote a la rama por defecto

**Humano en los tres modos, sin excepción** (`EXEC-R04`, `SUITE-R06a`). Es del **lote**
(`EXEC-R03`), no de la tarea. Se describirá cuando `EP-017` cierre.

## 4 · Publicar la `9.0.0`

**Reservado y no autorizado.** Instrucción literal del firmante: «No publiques la 9.0.0».
Posterior al cierre del lote.

## 5 · Borrar la rama efímera tras fusionar   `FDGE-R19`

```bash
git push origin --delete fix/alberto-martinez/PT-079-lo-que-se-aprende-se-hace-mecanico
```

Borrar ramas remotas no se automatiza (`SUITE-R06f`). **Y ahora es seguro hacerlo**: es
precisamente esta tarea la que hace que el enlace del issue sobreviva a la rama que lo produjo.
Antes de `PT-079`, ejecutar esta línea rompía el enlace — así murieron 14 de 16.
