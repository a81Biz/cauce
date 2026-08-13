# PT-022 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Lo que una tarea aplaza a su lote queda recogido POR el lote | E7 E8 | selftest.sh - «citar un lote que no declara cierre falla» - «citarlo cuando si lo declara, vale» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Un lote no cierra dejando sin responder lo que se asigno | E1 E2 E3 | selftest.sh - «un lote sin seccion de cierre no pasa G4» - «y con la seccion vacia, tampoco» - «una fila sin resolver bloquea en G4» | salidas/inversa.txt | - | VERIFICADO |
| AC-03 | Omitir la fila deja de ser gratis | E7 | ver nota | salidas/repositorio.txt | - | PARCIAL |
| AC-04 | No se exige que todas las tareas escriban lo mismo | E4 E6 | selftest.sh - «y con el lote abierto solo avisa» - «a un lote ya cerrado no se le exige» | salidas/selftest.txt | - | VERIFICADO |

## AC-03 se cumple de otra forma, y se dice

El intake pedia que omitir la fila «dejara de ser gratis». **No se logro asi, y no se puede**:
lo que no esta escrito no es detectable sin conocer el alcance real de la tarea, que es lo que
ese documento sirve para declarar. Forzarlo produciria filas copiadas para pasar.

Lo que se hizo es quitarle el precio a la omision: la obligacion ya no vive en la fila, vive en
el lote. Omitirla deja de PERDER algo, que era el objetivo detras del criterio. Queda como
PARCIAL y no como VERIFICADO porque el criterio, tal como se escribio, no se cumple.
