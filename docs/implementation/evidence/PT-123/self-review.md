# `PT-123` — Autorrevisión   `PHASE 6`

## El hallazgo del cierre: rompí un caso escrito para cazar esto

Emití la comprobación bajo `SUITE-R35` y un caso existente se puso rojo. Su comentario decía,
literalmente:

> *«Sin plataforma, `G4` no se bloquea por el espejo: la garantía de los proyectos que no espejan.
> **Si este caso se pone rojo, el cambio ha alcanzado a proyectos que no debía tocar.**»*

**Alguien lo escribió previendo este error y dejó dicho qué significaría verlo en rojo.** Y
significaba eso: `SUITE-R35` es la regla del espejo **con la plataforma**, y yo la usé para una
comprobación que compara un archivo con el registro. Un proyecto que no espeja habría empezado a
recibir un error sobre `BACKLOG.md`.

Mi primer impulso fue mirar si el caso estaba sobre-especificado. **Lo estaba yo.**

## Y al corregirlo apareció el mismo patrón otra vez

`FDGE-R31` enumeraba **tres** índices y hay **cuatro**. Es **literalmente** lo que `PT-129`
encontró en `FDGE-R19`: una enumeración que se presenta como completa y no lo es.

**Dos reglas, el mismo defecto, dos tareas del mismo lote.** Va a la matriz con sus dos
instancias medidas hoy.

## La frontera, y por qué no se genera entero

```
DERIVABLE      el lote abierto, sus tareas, orden, estado, fase, issue · y los aplazados
NO DERIVABLE   el PORQUE del orden — «PT-088 va antes que PT-087 porque sus tres
               comprobaciones son el banco de pruebas del mecanismo»
```

Generarlo entero borraría el porqué en cada corrida, y la primera persona que lo notara volvería
a escribirlo a mano — que es **cómo se llegó a los ocho lotes de retraso**. Misma frontera que
`LEX-R26` traza en `CHECKPOINT.json` y `HANDOFF.md` entre lo derivado y la prosa.

## La herramienta se niega a tocar el archivo sin marcas

Deliberado. **Un generador que se añade sus propias marcas decide por su cuenta qué parte del
archivo le pertenece.** Añadirlas fue un acto aparte, y conservó la prosa entera.

## La cuarta rotura de escapado, resuelta de raíz

Van cuatro en la sesión, todas por **construir texto dentro del literal de otro lenguaje**. Esta
vez apliqué el remedio una capa más allá:

```
backlog-fn.txt   el cuerpo, texto plano, sin un solo escape
inserta.mjs      script generico: lee ancla y cuerpo de archivos y los inserta
```

En `inserta.mjs` **no hay ni un backtick que escapar**, y comprueba el ancla antes de escribir.
Es `PT-087` en su décima instancia —*«resuelto QUITANDO la necesidad en vez de escapando mejor»*—
aplicado a mi propia herramienta, después de tropezar cuatro veces.

## Lo que **no** establece

- **Que el porqué escrito sea cierto.** Se conserva; no se juzga.
- **Que alguien ejecute `indices --aplicar`.** `AC-04` avisa, que es lo máximo que puede hacer una
  comprobación.
- **Nada sobre el histórico de lotes cerrados.** El bloque describe **lo abierto**.
