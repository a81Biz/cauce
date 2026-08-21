# PT-095 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es revisión (`FDGE-R19`, `EXEC-R03`).

## 2 · `G4` — merge de `trabajo` a `main`   **NO AUTORIZADO**

**La autorización del firmante fue para `PT-094`.** `PT-095` apareció después, al ver que `main`
seguía rojo, y su `G4` necesita la suya: una autorización cubre lo que se pidió, no lo que se
descubrió luego.

```bash
gh pr create --base main --head trabajo --title "G4 · PT-095 una regla nueva no juzga lo escrito antes"
gh pr merge <n> --merge
```

`EXEC-R04a` · la constancia va en `SESSION_LOG.md` con nombre de firmante y forma fija — **con el
acento**, que es lo que falló hoy.

## 3 · Cerrar el `BUG`   **NO AUTORIZADO**   `SUITE-R06(b)`

```bash
node docs/methodology/tools/tracker.mjs avanzar PT-095 --a 10 --nota "…"
```

## 4 · Publicar   **NO AUTORIZADO**

Elección registrada del firmante, confirmada hoy: *«yo hago la publicación»*.

```bash
gh workflow run publicar.yml --ref main -f confirmacion=PUBLICAR
```

**Va después del paso 2.** `publicar.yml` corre la verificación sobre `main`.
