# PT-003 — Discovery   `PHASE 2` · investigación

## La pregunta

El intake decía: `SUITE-R35` declara tres mapeos —milestone, issue, pull request— y el
adaptador implementa uno. ¿Se implementan los otros dos, o se recorta el contrato?

## Lo que resultó ser

**La pregunta estaba mal planteada, y la respuesta cambia por eso.**

`SUITE-R35` **no declara tres mapeos**. Declara uno:

> «`REGISTRY.json` sigue siendo el único asignador de identificadores y cada `allocation`
> guarda **su número de issue**.»

Contado sobre los archivos: `RULES.md` tiene **cero** apariciones de «milestone» y **cero** de
«pull request». `LEXICON.md`, cero. El contrato de tres mapeos está solo en
[`PHASES.md:250-256`](../../docs/methodology/PHASES.md), **bajo el encabezado `[SUITE-R35]`**.

Es decir: un documento de procedimiento enuncia dos obligaciones **atribuyéndoselas a una
regla que no las contiene**.

## Por qué eso importa, y no es una sutileza

`LEX-R21` fija el orden de autoridad: `LEXICON` → `RULES` → `EXECUTION-MODES` → `CLAUDE.md` →
`PHASES` → `Framework-*`. `PHASES.md` está **por debajo** de `RULES.md`.

Y `CLAUDE.md` §Reglas para evolucionar el framework lo dice sin rodeos: «Las reglas van a
`RULES.md`. Ningún otro documento enuncia obligaciones: las **citan** por ID».

Así que el adaptador **no incumple el contrato**: cumple la regla entera. Lo que hay es un
documento subordinado legislando por su cuenta, que es exactamente la avería que la v4 nació
para eliminar —la misma regla escrita en varios sitios, divergiendo— en su forma más sutil: no
dos copias que se separan, sino **una copia que dice de más**.

Yo mismo lo leí como «el contrato declara tres y el adaptador cubre uno» sin comprobar dónde
estaba escrito el contrato. La investigación existía para determinar qué implementar, y lo
primero que determinó es que la premisa era falsa.

## El milestone

**No se implementa, y se retira del procedimiento.**

- **Evidencia de uso:** cero milestones en toda la historia del repositorio.
- **Ya existe su equivalente:** la implementación abierta tiene **su propio issue** (`EP-001` →
  #2, etiqueta `implementación`) y cada tarea referencia su `epic` en el cuerpo. La agrupación
  ya está.
- **Y añadirlo sería el defecto que la regla previene:** un milestone daría a `EP-001` **dos
  representaciones en la misma plataforma** —issue y milestone— que solo pueden divergir.
  `SUITE-R35` existe para impedir dos representaciones del mismo hecho.

## El pull request

**Se conserva, pero sube a `RULES.md` en vez de quedarse en el procedimiento.**

- **La práctica ya existe:** el PR #1 (`trabajo` → `main`) se abrió y se fusionó el 2026-08-13.
  No es una capacidad inventada: es la que se usa.
- **Abrir un PR no es automatizar `G4`.** `SUITE-R06a` prohíbe «merge o push a la rama
  principal». Un PR no es ninguna de las dos: es la propuesta de merge, y el botón sigue
  siendo humano. `EXEC-R07` describe justamente esto — preparar todo, detenerse en el punto
  exacto y dejar la acción irreversible a una persona.
- **Y es comprobable:** `verify-fdge --gate G4` puede exigir que exista un PR abierto para la
  rama, con el mismo camino que ya usa para el espejo — preguntándole a `tracker`, que es
  quien tiene el adaptador.

Lo que **no** puede hacer el agente es fusionarlo. Eso no cambia.

## Alternativa considerada y rechazada

**Subir también el milestone a la regla y luego implementarlo.** Rechazada: no hay ningún caso
real que lo pida —cero milestones en la historia— y el adaptador de Azure ya sienta el
precedente de cómo se trata esto: «se escribe contra un caso real, no contra ninguno». Escribir
una regla para una capacidad que nadie ha necesitado es el mismo error, en el nivel normativo.

## Conclusión

**Qué se determinó.** `SUITE-R35` declara un solo mapeo —tarea → issue— y el adaptador lo
implementa entero. Los otros dos mapeos no son deuda de implementación: son texto que
`PHASES.md` añadió por su cuenta, atribuyéndoselo a la regla. El defecto es de **nivel de
autoridad**, no de cobertura.

**Qué evidencia lo sustenta.** Recuento sobre `RULES.md` y `LEXICON.md` (cero apariciones de
ambos términos), `PHASES.md:250-256`, `LEX-R21`, `CLAUDE.md` §Reglas para evolucionar, y el
estado real de la plataforma: 0 milestones, 1 pull request fusionado.

**Qué quedó sin determinar.** Si el mapeo `G4` → pull request debe subir a `RULES.md` como
parte de `SUITE-R35` o como regla propia, y si su comprobación entra en las precondiciones de
`G4`. Es una decisión normativa: cambia lo que un proyecto destino debe tener para cumplir, y
por tanto la decide una persona, no esta investigación.

**PT de seguimiento propuesto.** Uno, de tipo `CHORE`, con dos partes indivisibles:

1. Retirar de `PHASES.md` el mapeo del milestone y el del pull request, dejando el contrato
   citando lo que `SUITE-R35` dice.
2. Añadir a `RULES.md` —si el humano lo aprueba— el mapeo `G4` → pull request, con su
   comprobación en `verify-fdge --gate G4` vía `tracker`.

**No pertenece a `EP-001`** (`FDGE-R50`): el criterio de éxito de este lote se cumple sin él,
y toca `RULES.md` y `CORE.md`, que están en el out-of-scope de todas sus tareas. Va a la
implementación siguiente, junto al pendiente de llevar la documentación al issue.

Confianzas: RootCause 95 % · Architecture 90 % · Solution 85 %.
