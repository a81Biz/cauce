# PT-089 — Tareas   `PHASE 4`

| # | Qué | Archivo |
|---:|:---|:---|
| 1 | `divergenciaTerminal` — error si el registro es terminal y el YAML no | `docs/methodology/tools/verify-fdge.mjs` |
| 2 | `avanzar` marca terminal en **las dos** fuentes, dentro del acto atómico | `docs/methodology/tools/tracker.mjs` |
| 3 | Sincronizar las **seis** divergencias vivas | `changes/PT-0NN-*/intake.md` |
| 4 | 9 casos, sección propia | `docs/methodology/tools/selftest.sh` |

## Orden, y por qué

```
1  la comprobacion PRIMERO: sin ella, sincronizar las seis no deja rastro de que existieran
3  las seis, con la comprobacion ya en rojo — asi se ve pasar de rojo a verde
2  avanzar, que cierra donde NACIAN
4  los casos
```

**`3` va antes que `2` a propósito.** Sincronizar sin haber visto la comprobación en rojo sería
arreglar sin prueba de que había algo roto — y `FDGE-R17` pide exactamente lo contrario.

## Lo que este orden dejó ver

`AC-03` del intake pedía que `avanzar` escribiera las dos fuentes. **Ya lo hacía para `phase`.**
Sólo al mirar dónde nacían las seis apareció que `status` no entraba en el acto — y que quien lo
marcaba a mano era yo, en este mismo lote.
