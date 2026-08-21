# PT-090 — Tareas   `PHASE 4`

| # | Qué | Archivo |
|---:|:---|:---|
| 1 | `derivaDelGrafo` compara **hash**, y cae al `mtime` sólo si no hay | `docs/methodology/tools/patrones.mjs` |
| 2 | `rutaRelativaDelManifiesto` — las rutas absolutas se normalizan | `docs/methodology/tools/patrones.mjs` |
| 3 | La huella se calcula sobre contenido **sin `\r`** | `docs/methodology/tools/verify-fdge.mjs` |
| 4 | `MISSING` dice «no evaluable aquí» y deja de prometer que bloquea | `docs/methodology/tools/verify-fdge.mjs` |
| 5 | La muestra del mensaje va en ruta **relativa** | `docs/methodology/tools/verify-fdge.mjs` |
| 6 | 11 casos, sección propia | `docs/methodology/tools/selftest.sh` |

## `3` no es un detalle de implementación

Sin normalizar el `\r`, un checkout con `CRLF` y otro con `LF` dan **hashes distintos para el
mismo archivo** — y el defecto que se está cerrando es exactamente ése: que el mismo contenido
diera resultados distintos según dónde se mire.

## `5` tampoco

El mensaje decía cuatro veces `C:\DevOps\Desarrollos\cauce\…`. Además de ilegible, **dice dónde
vive el disco de quien generó el grafo** — el mismo material que `H-001` sacó del tarball.
