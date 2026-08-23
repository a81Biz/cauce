# Autorrevisión — `PT-118`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

La **tercera clase de identificador** del marco. `LEXICON` §4.4 declara `CE-NNN` —clase de
evento—, con las diecisiete clases medidas en `EP-020` §2.1, cada una con su enunciado en una
frase. `LEX-R31` enuncia la excepción a `LEX-R04`; `LEX-R32` hace que citar una clase inexistente
**falle**; `build-core` la lleva al núcleo **derivándola**.

Lo pidió el firmante: *«quiero saber qué ocurrió, qué se mejoró, **qué se repite**»*. Las dos
primeras las contesta `HISTORY.log`. La tercera no se puede contestar mientras el mismo tropiezo
esté escrito con quince redacciones distintas: **nada las junta porque nada las nombra**.

## Las tres decisiones que se enuncian en vez de suponerse

**1 · La excepción a `LEX-R04`.** La regla dice «exclusivamente vía `REGISTRY.json`». Un `CE-NNN`
no sale de ahí. Callarlo habría dejado una contradicción silenciosa —`CE-008`, un hecho con dos
nombres— dentro del documento que existe para impedirla. `LEX-R31` la declara con su motivo:
`counters` cuenta **trabajo**, y meter una taxonomía en el asignador haría que el número de una
clase dependiera del orden en que alguien la escribió.

**2 · `LEX-R32` falla, no avisa.** Sin comprobación, `LEX-R31` es una sugerencia, y en dos
versiones hay un `CE-018` escrito de memoria y otro escrito contando filas — la avería que
`LEX-R04` impide en los identificadores de trabajo, repetida en la clase recién creada para no
repetir cosas.

**3 · Al núcleo, derivada.** Copiar la tabla al generador habría sido la copia que diverge dentro
de la herramienta que existe para que el núcleo **no** sea una copia. Se deriva de `LEXICON`, y
si la tabla no está el núcleo dice `SIN EVALUAR` en vez de salir vacío y hacer creer que no hay
clases (`RULE-06`).

## Los tres defectos que aparecieron construyéndolo

**1 · Una frase que afirmaba más de lo medido.** `LEXICON` decía que las expresiones de una sola
letra iban *«todas ancladas con `^` o `\b`»*. **Es falso**: `tools/verify-ptsa.mjs:203` usa
`/H-\d+/` sin anclar. La frase se escribió antes de terminar de mirar. Lo desmintió construir el
caso que debía respaldarla. Ahora el texto dice lo medido —ninguna herramienta busca un `E-\d+`
suelto— y **declara** el riesgo latente encontrado en vez de callarlo.

**2 · `AC-04` estaba en rojo de verdad.** `grep -c '^CE-0' CORE.md` = **0**. `build-core` compila
reglas: `LEX-R31` y `LEX-R32` llegaban, la tabla no. No se dio por parecido: se midió, salió cero
y se construyó la derivación.

**3 · La prueba inversa daba `REVISAR` en escenarios correctos.** El fixture copiaba la suite
plana; `build-core` no encontraba `docs/methodology/` ni `PTSA/`, se negaba a compilar y `CORE.md`
se quedaba **como estaba**, así que la supresión parecía no tener efecto. **Nada llegó a correr**:
es `CE-005` —verde por no haber mirado— dentro de la prueba que existe para evitarlo. Queda
escrito en el propio script, no sólo aquí.

## Lo que esta tarea NO establece

- **Que las diecisiete sean todas.** No lo son necesariamente. `PT-125` puede encontrar más al
  recorrer las 131 entradas, y encontrarlas es la tarea funcionando.
- **Que ninguna herramienta pueda confundir un `CE-NNN`.** Establece que **hoy** ninguna busca un
  `E-\d+` suelto. El `/H-\d+/` sin anclar queda declarado y **no se arregla aquí**: tocarlo es
  entrar en el verificador de otro componente sin allocation que lo cubra — `CE-016`, la clase que
  `PT-127` acaba de dotar de detector.
- **Que citar bien una clase sea clasificar bien.** La clasificación es un juicio; `PT-125` la
  marcará `DECLARADO`.
- **Que la lista quede cerrada.** Cerrada **por versión**, ampliable por cambio de metodología
  (`SUITE-R06e`).

## El hallazgo que produjo la corrida completa

Correr la batería entera —lo que `PT-128` no hizo, y por eso hubo que corregirlo— sacó **dos
líneas** entre 1483 verdes:

```
selftest.sh: line 2402: git_fixture: command not found
selftest.sh: line 2404: con_phase: command not found
```

`git_fixture` se define en la **4803**, `con_phase` en la **6397**, y se usan en la **2402**. El
caso que va detrás sale **verde** con su fixture sin `git init` y su allocation sin `phase: 8`.
Pasa por la razón equivocada. Es `CE-005`.

Y hay un lint escrito exactamente para esto —`lint_helpers`, nacido de dos tropiezos previos—
que **no puede verlo por construcción**: sólo reconoce un helper cuando es el **comando** de un
caso, y estos dos se invocan como líneas de montaje sueltas. Su lista, además, está escrita a
mano.

**No se arregla aquí.** Tiene su propia causa y su propio alcance: va a `PT-135`, issue `#256`.
Arreglarlo de paso sería trabajo sin allocation — `CE-016`, la clase que `PT-127` acaba de dotar
de detector, aplicada a la sesión que la dotó.

---

## Estado

| | |
|:---|:---|
| Escenarios | 14 de 14 |
| Prueba inversa | 3 supresiones, 4 rojos distintos |
| Orphan Criterion | ninguno: los cuatro `AC` tienen `TS`, test y evidencia |
| `verify-suite` | sin errores de coherencia |
