# `PT-206` · `test-scenarios.md`

## `TS-01` — `LEX-R31` ve las que **sí** se declaran   → `AC-01`

```
DADO   «Clase de evento: CE-005 — verde por no haber mirado»   (la forma MAYORITARIA)
CUANDO se lee la clase
ENTONCES devuelve CE-005
```

Y la escueta también, **que es la que ya funcionaba**: el arreglo no rompe lo que había.

## `TS-02` — una entrada que **no** declara clase sigue sin declararla   → `AC-02`

```
DADO   un texto sin la linea, y otro con la etiqueta y SIN identificador
CUANDO se lee la clase
ENTONCES null en los dos casos
```

**Es el que impide arreglarlo en la dirección peligrosa.** Un regex que acepte cualquier cosa
cumple `TS-01` y **apaga la regla**: sin esto, «arreglar» `LEX-R31` sería quitarla.

## `TS-03` — la lectura vive en **un** sitio, con contrato   → `AC-03`

```
DADO   patrones.mjs
CUANDO se busca el patron
ENTONCES esta declarado con su `casa` y su `noCasa`, y verify-patrones lo comprueba
```

Y `verify-fdge` **ya no trae su propia expresión**.

## `TS-04` — la expresión vieja ya no se **usa**   → `AC-04`

```
DADO   verify-fdge.mjs
CUANDO se busca la llamada que la usaba
ENTONCES no esta: solo queda CITADA en el comentario que la documenta
```

Es un **cero de lo prohibido**, que es lo único que un caso puede fijar (`HANDOFF -18`).

## Lo que NO se cubre, y consta   `SUITE-R26`

- **La cifra de la familia no se fija en un caso.** Once expresiones anclan un campo a fin de línea
  y **cinco** exigen un valor concreto —`Estructural`, `certificacion`, `confidence`, `health`,
  `health_unstable`—. Fijar ese número sería fijar **el número de lo correcto** y además caducaría
  (`CE-010`). **Se declara** en la evidencia y en `HISTORY`.
- **Las cinco no se arreglan**: ninguna ha fallado todavía, y hacerlo es otro trabajo.
- **No se unifica con `eventos.mjs`**: mide otra cosa.
- **`LEX-R31` sigue avisando**, no bloqueando.
