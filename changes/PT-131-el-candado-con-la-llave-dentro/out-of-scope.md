# Fuera de alcance — `PT-131`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Que el estado terminal llegue a la rama por defecto ANTES del tag | Es la causa de fondo: sin esa demora el defecto no se manifiesta. `PT-131` hace que deje de **bloquear**, no que deje de **ocurrir** | PT-121 |
| Meter `DONE` en `ESTADOS_TERMINALES` | `SUITE-R08` lo declara fuera a propósito y la constante la comparten tres reglas. Tocarla apaga seis comprobaciones | — |
| Bajar o quitar `umbral_sellado` | Apagar la compuerta en vez de arreglar su medida. Con umbral 20 el mismo defecto vuelve al lote 21 | — |
| Retag de `v12.0.0` | Reescritura de historia (`SUITE-R06f`), y el tarball de npm apunta a `5b184af` | — |
| Que `sellar` compruebe el resto de su lista | Esta tarea toca **una** de sus comprobaciones. Las otras cuatro siguen igual | — |
