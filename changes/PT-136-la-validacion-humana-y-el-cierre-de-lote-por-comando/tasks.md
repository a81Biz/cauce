# Tareas — `PT-136`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `tracker validar` — la validación humana de un `BUG`, registrada | `tools/tracker.mjs` | ✔ |
| 2 | Todas o ninguna | `tools/tracker.mjs` | ✔ |
| 3 | La fecha se puede **decir** | `tools/tracker.mjs` | ✔ |
| 4 | `integrar` cierra un lote: `READY` → `CLOSED` | `tools/tracker.mjs` | ✔ |
| 5 | …y sólo si ninguna tarea sigue viva, **nombrándolas** | `tools/tracker.mjs` | ✔ |
| 6 | Los dos en `SIN_PLATAFORMA` | `tools/tracker.mjs` | ✔ |
| 7 | Los diez casos | `tools/selftest.sh` | ✔ |

---

## El defecto que cometí construyéndolo, y es el del lote

Escribí el estado de `EP-020` con un `node -e`:

```
EP-020: CLOSED {"G1":{…},"G4":{…}}
```

**`CE-006` dentro del cierre del lote que existe para impedir `CE-006`.** Lo vi al instante, se
deshizo y se rehízo con el comando: corregir a mano lo que un comando debe escribir habría sido la
instancia siguiente, no el arreglo.

## Y el comando me corrigió a mí

`integrar EP-020` rechazó el cierre nombrando las **22** tareas que seguían en `DONE` y no
`INTEGRATED`. Tenía razón: `DONE` espera `G4`, así que el orden es merge → `INTEGRATED` → lote
`CLOSED`. `PHASE 9` lo dice en prosa desde siempre; lo que no existía era algo que lo **impidiera**
al revés — y por eso lo intenté al revés.
