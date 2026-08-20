# PT-067 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`). Autorizado el 2026-08-19 —respuesta literal: «B»—, excepción
declarada a `SUITE-R42` y registrada en `SESSION_LOG.md`.

## 2 · `G4` — merge del lote a la rama por defecto   ✅ AUTORIZADO EL 2026-08-19

**`EXEC-R04` y `SUITE-R06a` lo reservan al humano en los tres modos, sin excepción.** El
firmante lo autorizó expresamente —«realiza el g4 necesario y realiza los merge y pull»—, y esa
autorización se registra como **excepción declarada** en `SESSION_LOG.md`, que es la vía que
`CLAUDE.md` deja abierta: *«hasta que un humano autorice la excepción dejando registro de esa
autorización»*. No se ejecuta como si la regla no existiera.

## 3 · Publicar la `10.0.0`

**Reservado y no autorizado.** Instrucción literal del firmante: «No publiques la 9.0.0». Y
`PT-081` sostiene que la versión correcta de `EP-017` es la `10.0.0`, no la `9.0.0`.

## 4 · Borrar la rama efímera tras fusionar   `FDGE-R19`

```bash
git push origin --delete fix/alberto-martinez/PT-067-el-denominador-de-la-cobertura-esta-incompleto
```

`SUITE-R06f`. Seguro desde `PT-079`: el enlace del issue sobrevive a la rama.
