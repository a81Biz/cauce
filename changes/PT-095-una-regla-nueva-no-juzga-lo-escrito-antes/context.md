# PT-095 — Contexto   `PHASE 2` · `FDGE-R08`

## Qué toca

```
tools/patrones.mjs     anunciaAutorizacion · alcanzadaPor · corregidaDespues · SUJETOS
tools/verify-fdge.mjs  el bloque de constancias: los DOS bucles
tools/selftest.sh      13 casos nuevos
SESSION_LOG.md         una entrada AÑADIDA — no editada
```

## Radio de impacto

`checkG4ConConstancia` tiene **dos** bucles sobre los mismos bloques: uno recoge constancias para
`EXEC-R04`, otro busca malformadas para `EXEC-R04a`. Los dos usaban el mismo regex **escrito dos
veces**, y ahora usan `anunciaAutorizacion` — una sola vez (`SUITE-R38`).

Nada más importa estas funciones: son nuevas.

## Qué NO establece este contexto

Que `EXEC-R04a` no tenga más agujeros. Establece que estos dos —juzgar hacia atrás y leer una
espera como una autorización— quedan cerrados. La regla nació hace un día y ésta es la primera vez
que corre contra un ledger real de doscientas entradas.
