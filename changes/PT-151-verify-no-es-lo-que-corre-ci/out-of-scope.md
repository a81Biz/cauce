# `PT-151` · `out-of-scope.md` — `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Que el paso **haga** lo mismo en los dos sitios | Se comparan nombres de script; comparar comandos exigiría entender banderas | — |
| Partir la batería en perfiles rápidos | Razonable y es otra tarea. `PT-169` abarató `--solo`, que es la mitad del problema | — |
| Cambiar **qué** comprueba CI | Se iguala lo local a lo remoto, salvo `matriz:check`, que faltaba en CI | — |
| Que CI corra `npm run verify` como paso único | Perdería los nombres de paso —lo que hace legible un fallo en el PR— y el `env` por paso | — |
