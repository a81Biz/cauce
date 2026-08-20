# PT-071 — Descubrimiento   `PHASE 2`

## Medido, derivando los comandos de cada workflow

```
verificacion.yml   8 comprobaciones
publicar.yml       5

faltaban en publicar:
  npm run verify:patrones
  node docs/methodology/tools/tracker.mjs espejo
  node docs/methodology/tools/verify-fdge.mjs --all
```

## Por qué la tercera es la que importa

`FDGE-R34` dice que **`verify-fdge` sin errores es precondición de `G4`**. Y publicar ocurre
**después** de `G4`: llegar a `publicar.yml` sin haberlo corrido es publicar sin la comprobación
que autorizó el merge que trajo el código.

Las otras dos no son menores. `verify:patrones` comprueba que los patrones críticos cumplen su
contrato — el módulo del que dependen ocho herramientas. Y el espejo (`SUITE-R35`) detecta que lo
publicado no coincida con lo que el tablero dice que existe.

## Conclusión

**El verde que autoriza una publicación no era el mismo que verifica el repositorio.** Es la
misma familia que `PT-067` —medir sobre un universo incompleto— aplicada a las compuertas: cinco
de ocho es una comprobación parcial, y una comprobación parcial que parece completa es
exactamente lo que este lote lleva veinte tareas persiguiendo.

Y el precedente ya estaba escrito en el propio `publicar.yml`: `FND-R29` —el escáner de secretos—
**faltaba** y lo encontró Foundation como divergencia `D9`. La misma forma, otra comprobación.
