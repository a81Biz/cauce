# PT-024 — Fuera de alcance   `PHASE 4`

| Fuera | Por qué | Dónde va |
|:---|:---|:---|
| Relajar `SUITE-R35` para tolerar la ventana | Cegar al detector es peor que el defecto | — |
| Quitar el espejo de la CI de `main` | Apaga la compuerta donde más importa | — |
| Automatizar el merge o el push a la principal | `SUITE-R06a`, sin excepción mecánica | — |
| Cambiar cuándo una allocation pasa a `INTEGRATED` | Lo que fallaba era el orden del cierre, no la definición del estado | — |
| Comprobar el orden también en Azure | El adaptador existe pero no hay proyecto que lo use; escribirlo a ciegas sería código sin ejecución | `PT-025` |
