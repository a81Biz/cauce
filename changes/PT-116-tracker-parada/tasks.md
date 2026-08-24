# `PT-116` — Tareas atómicas   `PHASE 4`

| # | Qué | Archivos | Verifica |
|:--|:---|:---|:---|
| `PT-116.1` | Las dos listas cerradas en `patrones.mjs` | `tools/patrones.mjs` | casos |
| `PT-116.2` | `cuerpoDeParada`, pura, junto a `mensajeDeCierre` | `tools/tracker.mjs` | casos |
| `PT-116.3` | La acción `parada`, con sus seis negativas y el destino reusado | `tools/tracker.mjs` | negativas |
| `PT-116.4` | **La regla de FORMA** para la detección de `ROOT` | `tools/tracker.mjs` | casos |
| `PT-116.5` | Los casos, y reescribir el que assertaba sobre el fuente | `tools/selftest.sh` | `npm run selftest` |

`PT-116.4` **no estaba en la propuesta**: salió al probar el comando, y es la octava instancia de
su clase.
