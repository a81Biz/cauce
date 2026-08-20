# PT-085 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`). Y desde `PT-082` el merge no depende de que yo mire `gh pr checks`:
`trabajo` está protegida y GitHub lo rechaza en rojo.

## 2 · Regenerar el grafo   **HUMANO**   `FDGE-R32`

`FDGE-R43` dice ahora **`SUSPECT · 12 de 16 archivos cambiados`** — antes decía `FRESH`. La
regeneración la dispara una persona:

```
/graphify   con el alcance que declara REGISTRY.graph.scope: bin, docs/methodology/tools
```

Y después, el agente actualiza `REGISTRY.graph` con la fecha y el `pt_at_generation`.

**No bloquea nada hoy** —`SUSPECT` avisa— pero **sellar sí lo exige al día** (`SUITE-R57`), así
que esto hay que hacerlo antes de cerrar la `10.0.0`.

## 3 · Sellar la `10.0.0`   ocho pasos, los dos últimos tuyos

```bash
node docs/methodology/tools/tracker.mjs sellar     # dice cuáles faltan
```

| # | Paso | Quién |
|:---|:---|:---|
| 1 | Entrada en `CHANGELOG` con guía de migración | agente — **hecha** en `PT-081` |
| 2 | `version.mjs --aplicar` | agente — **hecho** |
| 3 | `build-core.mjs` | agente — **hecho** |
| 4 | Batería **completa** | agente |
| 5 | `/graphify` y `REGISTRY.graph` al día | **tú**, ver §2 |
| 6 | `SELLO.md` con los cinco resueltos | agente propone, **tú decides** |
| 7 | PR a la rama por defecto | **tú** — `EXEC-R04` |
| 8 | `git tag -a v10.0.0` | **tú**, y **después** del merge |

**El orden de 7 y 8 no es cosmético.** Un tag creado antes del merge apunta a un árbol que
todavía no tiene lo que la versión trae, y la línea base de `FDGE-R43` y del detector de `AC-08`
quedaría mintiendo. Es el error que `PT-081` cometió eligiendo `origin/main`, en otra forma.

## 4 · El umbral de sellado, si quieres cambiarlo

```json
"tracker": { "umbral_sellado": 3 }
```

En `REGISTRY.json`. `N = 3` por defecto, que es lo que propusiste. Subirlo permite acumular más
deuda antes de que `G2` se bloquee; bajarlo obliga a sellar antes.

## 5 · Publicar   **NO AUTORIZADO**

Sigue vigente «No publiques la 9.0.0» — que ahora es la `10.0.0`.

## 6 · Borrar la rama efímera tras fusionar   `FDGE-R19`

```bash
git push origin --delete fix/alberto-martinez/PT-085-el-sello-de-version
```

`SUITE-R06f`. Seguro desde `PT-079`.
