# Estrategia — `PT-118`   `PHASE 3`

> `FDGE-R54`: la viabilidad queda registrada antes de proponer. `SAFE`, registrada en
> `REGISTRY.allocations[].viabilidad`.

---

## Dónde vive la lista

| Opción | Por qué NO / SÍ |
|:---|:---|
| En el intake de `EP-020` | Es donde está hoy. Un intake es el registro de **una** admisión, no una autoridad: `PT-125` clasificaría contra un documento que nadie puede citar |
| En `RULES.md` | Una clase **no obliga a nada**. `LEX-R22` es explícito: `RULES.md` enuncia obligaciones. Una taxonomía ahí sería una regla que no manda |
| En un archivo nuevo, `EVENTOS.md` | Un documento normativo más que `CORE.md` tendría que remitir, sin ganar nada: la taxonomía **es** vocabulario |
| **En `LEXICON` §4.4** | **Gana.** `LEX-R21` pone `LEXICON` primero en el orden de autoridad, y §4 ya es el sitio de los identificadores. Una clase de evento es un **nombre**, y los nombres van ahí |

## La decisión que hay que enunciar, no dar por supuesta

`LEX-R04` dice que la asignación de identificadores es **exclusivamente** vía `REGISTRY.json`.
Un `CE-NNN` **no** sale de ahí. Eso deja dos caminos:

1. **Callarlo** y que la tabla contradiga a `LEX-R04` en silencio. Es `CE-008` —un hecho, varios
   nombres— dentro del documento que existe para impedirlo.
2. **Declarar la excepción**, con su motivo. `LEX-R31` lo hace: `counters` cuenta **trabajo**, y
   meter una taxonomía en el asignador haría que el número de una clase dependiera del orden en
   que alguien la escribió.

Gana la segunda. Una excepción declarada es contrastable; una implícita es una divergencia
esperando a ocurrir.

## Y la lista tiene que poder **fallar**

Sin comprobación, `LEX-R31` es una sugerencia: dentro de dos versiones habrá un `CE-018` escrito
de memoria y otro escrito contando filas — la avería que `LEX-R04` impide en los identificadores
de trabajo, repetida en la clase que se acaba de crear para no repetir cosas.

`LEX-R32` **falla**, no avisa. Citar una clase que no existe es afirmar que un tropiezo pertenece
a una familia que nadie declaró, y toda la matriz de `PT-119` se apoya en que la familia exista.

## Cerrada por versión, no para siempre

La lista nace con **diecisiete** —las medidas en `EP-020` §2.1— y **no se promete completa**.
`PT-125` puede encontrar más al recorrer las 131 entradas, y encontrarlas es la tarea funcionando.
Ampliarla es modificar `docs/methodology/`, que no se automatiza (`SUITE-R06e`).

## Al núcleo: derivada, no transcrita

`AC-04` pide que `CORE.md` la lleve. La forma importa: **copiarla al generador** sería la copia
que diverge —`CE-008` y `CE-010`— dentro de la herramienta que existe precisamente para que el
núcleo no sea una copia. Se **deriva** de `LEXICON`, y si la tabla no está el núcleo lo **dice**
(`SIN EVALUAR`) en lugar de salir vacío y hacer creer que no hay clases (`RULE-06`).

## Viabilidad   `FDGE-R54`

| | |
|:---|:---|
| **Datos** | las diecisiete clases ya están medidas y agrupadas en `EP-020` §2.1 |
| **Dependencias** | ninguna nueva. `verify-suite` y `build-core` ya leen `LEXICON` |
| **Riesgo** | colisión de prefijo ⇒ **medida** (§3 de `discovery.md`), no supuesta |
| **Reversible** | sí, mientras nadie cite un `CE` |
| **Veredicto** | **SAFE** — registrado |
