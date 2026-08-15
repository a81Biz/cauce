# PT-023 — Diseño   `PHASE 4`

## El texto que se sustituye

`FDGE-Prompts.md:183`, tal como está hoy:

```
**`SUITE-R44`: lo que el lote aplaza se asigna, no se narra.** Una fila de `out-of-scope.md`
que apunte a trabajo futuro cita el identificador que lo sostiene — normalmente una allocation
en `DEFERRED`, con su issue abierto. En `G4` bloquea; antes solo avisa, porque aplazar durante
el trabajo es legítimo.
```

Dos cosas fallan, y ninguna es un descuido de redacción:

- **«cita el identificador que lo sostiene»** describe el caso bueno y no dice que sea el
  **único**. Falta la mitad de la regla: `—` también vale, y **nada más** vale.
- **«normalmente»** admite excepciones que `SUITE-R44` no admite. En el documento del que se
  copia, esa palabra se convierte en prosa aplazada en cada `out-of-scope` que la use de modelo.

## Lo que se escribe en su lugar

La forma, no la intención: los dos valores admitidos, y los **tres** casos de reciprocidad que
`SUITE-R44` distingue —hermano del lote en cualquier estado, el propio lote solo en `DONE`/`CLOSED`,
cualquier otro `DEFERRED` con su `origin` mencionando el PT—. Sin «normalmente».

`*-Prompts` **cita, no legisla** (`LEX-R22`, `SUITE-R20`): el texto remite a `SUITE-R44` por ID y
reproduce su forma, no la reinterpreta ni la amplía.

## Por qué el caso mira el contenido de un documento

Es inusual y es deliberado. La medida de `PHASE 2` dice que la regla general no es verificable, y
`selftest.sh` ya tiene precedente —los casos que leen `$RAIZ/bin/cauce.mjs` y `$RAIZ/CLAUDE.md`—
para comprobar que un documento dice algo concreto.

Lo que este caso puede hacer: impedir que **este** contenido se pierda.
Lo que **no** puede hacer: garantizar que el texto copiable siga a la regla en general. Eso queda
declarado, no simulado.

## Lo que este diseño **no** hace

No toca `SUITE-R44` ni `FDGE-R22` —las dos son correctas—, no añade regla nueva, y no escribe el
verificador que la medida desaconseja. La versión **no sube**: es una corrección de documento
dentro de un lote que ya sube `MAJOR` por `PT-016`.
