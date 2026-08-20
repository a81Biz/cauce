# PT-086 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Una sección inactiva se salta **entera** | E1 | `build_fixture` y `reg_set` no corren | `salidas/parcial.txt` | VERIFICADO |
| AC-02 | El mapa sección → herramienta se **deriva** | E2 | `seccionesDelArnes` lee el propio archivo | `salidas/parcial.txt` | VERIFICADO |
| AC-03 | Una sección sin herramienta corre **siempre** | E3 | 10 de 37 | `salidas/parcial.txt` | VERIFICADO |
| AC-04 | La salida dice `PARCIAL` y enumera lo que saltó | E4 | el bloque final | `salidas/parcial.txt` | VERIFICADO |
| AC-05 | Sellar exige la **completa** | E5 | `SUITE-R57`, escrita en `PT-085` | `salidas/parcial.txt` | VERIFICADO |
| AC-06 | Acota de verdad | E6 | medido en los dos extremos | `salidas/parcial.txt` | VERIFICADO |

## `AC-06`, medido y no estimado

```
plan-layout.mjs cambiado   134 de 1118 casos ·  106 s
patrones.mjs cambiado      669 de 1118 casos ·  405 s
corrida completa          1118 de 1118      · ~600 s
```

**Que `patrones` acote poco es la respuesta correcta**, no una limitación: lo importan ocho
herramientas. Una selección que dijera «pocas secciones» ahí sería el falso verde más caro que
este arnés podría producir.

## `AC-05` se escribió **antes** que esta tarea

`PT-085` puso en `SUITE-R57` que sellar exige la batería completa **antes** de que existieran las
corridas parciales. Al revés habría una ventana con corridas parciales y sin un sello que
reclamara la completa — exactamente la fábrica de falsos verdes que este lote persigue.

## La guarda que no disparaba

`${SEC_ACTIVA:-1}` sustituye también cuando la variable está **vacía**, así que la guarda no
disparaba nunca: **822 casos corrían igual** con una sola herramienta cambiada. Sintácticamente
correcta, semánticamente inerte — el mismo patrón que `PT-067` encontró en `audit` y `PT-066` en
`regla`. Lo dijo medir, no leer.
