# Fuera de alcance — `PT-118`

> `SUITE-R44` · La **última columna** es el destino, y es vocabulario cerrado: `—` si no aplaza
> nada, o la cita de quien lo sostiene.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Clasificar las 131 entradas cerradas | Es otra tarea, y la taxonomía es su precondición | `PT-125` |
| Derivar `MATRIZ.md` de las clases | Necesita las entradas ya clasificadas | `PT-119` |
| Que `sellar` mida la matriz y `FPGE` la lea | Necesita la matriz | `PT-126` |
| Un contador `CE` en `REGISTRY.counters` | Una clase **no es un ítem de trabajo**: meterla en el asignador haría que su número dependiera del orden en que alguien la escribió (`LEX-R31`) | — |
| Cerrar la lista para siempre | Es cerrada **por versión** y ampliable por cambio de metodología (`LEX-R32`, `SUITE-R06e`) | — |
| Anclar el `/H-\d+/` de `tools/verify-ptsa.mjs:203` | Es un riesgo latente **real**, medido y declarado en `LEXICON` §4.4. Arreglarlo es tocar el verificador de otro componente sin allocation que lo cubra — que es lo que `CE-016` nombra. Se abre cuando haya una | `PT-130` |
| Que `git_fixture` y `con_phase` se usen antes de definirse en `selftest.sh` | Lo encontró la corrida completa de esta tarea: dos `command not found` entre 1483 verdes, y el caso que va detrás pasa **sin su montaje**. Es `CE-005`, y arreglarlo es otra tarea con su propia causa: el lint sólo reconoce el helper cuando es el **comando** de un caso | `PT-135` |
| Dar por completa la lista de diecisiete | `PT-125` puede encontrar más, y encontrarlas es la tarea funcionando (`RULE-06`) | `PT-125` |

---

## Lo que esta tarea **produce** y no resuelve

La taxonomía hace contable algo que hasta ahora sólo se podía narrar. Eso significa que a partir
de aquí se puede medir **cuántas clases no tienen dueño** — hoy ocho, según `EP-020` §2.1 — y esa
cifra es una acusación que el marco se hace a sí mismo. Convertirla en trabajo es `PT-119` y
`PT-126`; aquí sólo queda dicho que ahora se puede.
