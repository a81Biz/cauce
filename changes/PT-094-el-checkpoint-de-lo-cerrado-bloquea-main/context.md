# PT-094 — Contexto   `PHASE 2` · `FDGE-R08`

## Qué toca

```
tools/tracker.mjs      estadoDelArbol · avanzar · ramaViva (extraida)
tools/verify-fdge.mjs  checkCheckpoint · el tercer resultado y el limite en el mensaje
tools/patrones.mjs     SUJETOS['LEX-R26']
tools/selftest.sh      8 casos nuevos
```

## Radio de impacto

`estadoDelArbol` la importan **dos** herramientas: `verify-fdge` —donde bloquea `G4`— y el propio
`tracker`, que la usa en `siguiente` para no proponer trabajo sobre un estado que no es de fiar.
Cambiar su contrato cambia las dos, y por eso el cambio devuelve un **tercer** valor en vez de
alterar el significado de los dos que ya había.

`ESTADOS_TERMINALES` la comparten cuatro comprobaciones. Se **hereda**, no se reescribe: una lista
de estados copiada a mano es la enfermedad que la `v4` nació para eliminar, y su comentario ya
advierte que añadir `DONE` apagaría tres comprobaciones a la vez.

## Qué NO establece este contexto

Que sean los únicos consumidores. `graphify` no ha corrido sobre `docs/methodology/tools/`
—`FDGE-R43` sigue `MISSING`— así que el radio se determinó con `grep` sobre cuatro archivos, no
midiendo. Es más débil que un grafo y es lo que hay.
