# Fuera de alcance — `PT-125`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Producir `MATRIZ.md` | Aquí sólo se clasifica; derivar la matriz es otra tarea con su propio generador y su propia comprobación de frescura | `PT-119` |
| Clasificar lo que ocurra a partir de ahora | Cada entrada nueva declara su clase; el aviso lo pone `verify-fdge` | `PT-126` |
| Reescribir o corregir entradas de `HISTORY.log` | `SUITE-R09`: append-only. `EVENTOS.jsonl` **lee** el ledger, no lo toca | — |
| Rejuzgar o reabrir una tarea cerrada | `SUITE-R36`: lo cerrado es evidencia, no estado | — |
| Clasificar las **40** que afirman recurrencia sin nombrar la forma | Exigiría reinterpretarlas, y eso inventaría la recurrencia que la matriz va a contar (`RULE-06`). Quedan declaradas con su cita | `PT-119` las verá como hueco medido |
| Los cinco `INC` de `EP-019` | Viven en el `INCIDENTS.log` de otro proyecto que no está en esta máquina. Se declaran ausentes, no se inventan | — |
| Reconciliar el denominador con `EP-020` §2.1 | §2.1 contó **ocurrencias**, aquí se cuentan **entradas que nombran la clase**. Los dos son correctos; la diferencia se declara en la cabecera del archivo para que nadie los sume | `PT-119` |
| Ampliar la lista de clases | Es cerrada por versión (`LEX-R32`) y ampliarla es modificar `docs/methodology/` (`SUITE-R06e`) | — |

---

## Lo que esta tarea **produce** y no resuelve

**Las diecisiete clases tienen instancia**, así que ninguna de las que `PT-118` declaró era
inventada. Y dos cifras que nadie había medido:

- `CE-001` —el proxy en lugar del hecho— llega a **instancia doce** por declaración propia.
- `CE-004` —probar donde trabajo, no donde se decide— llega a **nueve**, y el trabajo de este
  mismo lote la llevó a **diez**.

Ninguna de las dos tiene hoy una regla con verificador. Convertir eso en trabajo es `PT-126`.
