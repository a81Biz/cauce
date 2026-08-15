# PT-016 — Descubrimiento   `PHASE 2` · `2-R`

## La vía de escape, con archivo y línea

```js
// tools/verify-fdge.mjs:916-919
if (faseDeclarada === null) {
  warn(regla, `${pt}: no declara fase — la exigencia de ${artefacto} queda SIN EVALUAR. `
    + 'Declara «phase: N» en el YAML de su intake.md o «phase» en su allocation de '
    + 'REGISTRY.json. Sin fase no se puede afirmar que falte ni que sobre (RULE-06).');
  return false;
}
```

`SIN EVALUAR` **no aprueba ni bloquea**, y eso es correcto: `RULE-06` prefiere el «no lo sé» al
falso verde. Lo que **no** es correcto es que sea gratis: un intake sin `phase` desactiva todas
las exigencias por fase —`traceability`, `manifest`, `self-review`, `FDGE-R52`, y desde hoy la
rama de `FDGE-R19`— sin que nada bloquee nunca.

`PT-044` cerró el caso de un `phase` que **miente**. Este es el de un `phase` que **falta**.

## Medido, no recordado

```
plantillas de INTAKE/templates/ que declaran «phase»    0 de 5
intakes de este repositorio sin «phase»                10
```

Los diez son los **seis `EP`** —que no lo declaran por convención— y **`PT-001` a `PT-004`**,
los cuatro primeros, escritos antes de que el campo existiera.

## Los dos casos que la decisión tiene que separar

**Un `EP` no tiene fase de PT.** Su ciclo es abrir → ejecutar sus tareas → cerrar; `phase` en un
lote es un préstamo del vocabulario de la tarea. Los seis `EP` sin `phase` **no son un defecto**:
exigírsela sería inventar un dato.

**Un `PT` sin `phase` sí lo es.** Y los cuatro que hay están `INTEGRATED`: pedirles la fase hoy es
pedir que se invente, el mismo criterio con que `PT-044` acotó `FDGE-R52` y `PT-047` acotó la
rama. **Es la tercera vez en este lote que aparece la misma frontera**, y conviene decirlo: lo
que se exige, se exige a lo **vivo**.

## Lo que rompe, y por eso es `MAJOR`

Un proyecto instalado con PTs vivos sin `phase` pasa de `SIN EVALUAR` a **error**. No es
hipotético: el proyecto legado de referencia tiene `EP-009` y `EP-014` sin fase declarada, y
`migrate` ya los enumera como decisión humana pendiente.

La migración **ya existe** —`migrate.mjs` lo pide desde el tramo de `5.0.0`— así que lo que falta
no es escribir el paso: es que dejar de hacerlo tenga consecuencia.

## Lo que este descubrimiento NO puede afirmar

Que exigir el campo lo haga cierto. `PT-044` hace que un `phase` que miente **se vea**; esto hace
que faltar **cueste**. Ninguna de las dos hace que alguien lo mantenga al día, y decirlo ahora
evita que la regla prometa lo que no puede.
