# Fuera de alcance — `PT-127`

> `SUITE-R44` · La **última columna** es el destino, y es vocabulario cerrado: `—` si no aplaza
> nada, o la cita de quien lo sostiene. Sin eso, aplazar es narrar.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Impedir el commit con un hook local | Un hook se desactiva con una bandera y no viaja en el paquete: sería una compuerta que cualquiera abre (`EXEC-R03`) | — |
| Reescribir la historia para corregir los 34 commits ya escritos | `SUITE-R06f`: reescribir historia no se automatiza, y aquí **tampoco se propone** — la historia se declara, no se maquilla | — |
| Juzgar los commits anteriores a la fila de `RIGE_DESDE` | `SUITE-R09`: una regla nueva no juzga trabajo anterior | — |
| Que el hallazgo **falle** en vez de avisar | Está mapeado en `AVISA_AHORA_FALLA_EN` a `G4`: el aviso ya tiene fecha de caducidad mecánica, y adelantarla dejaría el lote en curso sin salida | — |
| Reconstruir si un identificador estaba vivo **en aquel commit** | Exigiría leer el `REGISTRY.json` de cada commit: arqueología, no verificación. El caso lo cazan `FDGE-R52` y `SUITE-R08` por otra vía | — |
| Que `FORZADO` observe intención y no co-ocurrencia | Necesita un campo estructurado en el ledger, que es lo que construye la clasificación de eventos | `PT-125` |
| Decidir si un commit **de lote** debe poder citar el `EP` | Es una pregunta sobre la **regla**, no sobre el detector. El detector la hace visible; resolverla es otra tarea | `PT-130` |
| Que la ventana deje de ser de 60 commits | Hoy cubre de sobra el lote vivo. Ampliarla sin `RIGE_DESDE` por commit sería retrofechar | — |

---

## El hallazgo que esta tarea **produce** y no resuelve

La primera medición del detector dice algo que nadie había medido: **15 commits de `EP-020` y 18
de `EP-019` citan el lote**, y para `EP-020` **no hay excepción declarada**.

Buena parte de ellos son trabajo **de lote** —abrir la implementación, publicar las paradas,
cerrar— que **no tiene un `PT` al que pertenecer**. O `FDGE-R19` admite el identificador del lote
para ese trabajo, o el trabajo de lote necesita su propia allocation. Las dos salidas son
razonables y **ninguna es cosa de esta tarea**: aquí se construyó el detector, y el detector
acaba de hacer visible una pregunta sobre la regla.

Va a `PT-130`, que es la tarea del lote cuyo alcance es todo el texto normativo.
