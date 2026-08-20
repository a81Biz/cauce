# PT-084 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`). Desde `PT-082` el merge no depende de que yo mire `gh pr checks`:
`trabajo` está protegida y GitHub lo rechaza en rojo.

## 2 · `G4` del lote   AUTORIZADA, y va con el cierre de `EP-017`

Autorización registrada como **excepción declarada** a `EXEC-R04` y `SUITE-R06a` en
`SESSION_LOG.md`. Es del **lote**, no de la tarea (`EXEC-R03`).

## 3 · Sellar la `10.0.0`   ocho pasos, los dos últimos tuyos

```bash
node docs/methodology/tools/tracker.mjs sellar
```

Los pasos **7** —PR a la rama por defecto— y **8** —`git tag -a v10.0.0`— son humanos
(`SUITE-R06a`). Y el 8 va **después** del 7: un tag antes del merge apunta a un árbol sin lo que
la versión trae.

## 4 · Publicar   **NO AUTORIZADO**

Sigue vigente «No publiques la 9.0.0» — que ahora es la `10.0.0`.
