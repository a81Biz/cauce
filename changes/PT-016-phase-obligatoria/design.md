# PT-016 — Diseño   `PHASE 4`

## La exigencia

```js
// SUITE-R08 · toda allocation de tipo PT VIVA declara su fase. Falta ⇒ ERROR.
// Un EP no la declara: su ciclo es abrir → ejecutar sus tareas → cerrar, y «phase»
// en un lote es un prestamo del vocabulario de la tarea (RULE-06: no se inventa).
if (faseDeclarada === null) {
  if (enRegistroPT?.type === 'EP' || ESTADOS_TERMINALES.has(enRegistroPT?.status)) {
    warn(regla, `${pt}: sin fase declarada — exento …`);   // como hasta hoy
  } else {
    fail('SUITE-R08', `${pt}: no declara «phase» …`);       // desde esta version
  }
  return false;
}
```

## `ESTADOS_TERMINALES`, una vez y con contrato

Tres reglas de este mismo lote preguntan lo mismo y cada una trae su lista:

```
FDGE-R52   PT-044   ['INTEGRATED','CLOSED','REVERTED','REJECTED','DEFERRED']
FDGE-R19   PT-047   ['INTEGRATED','CLOSED','REVERTED','REJECTED','DEFERRED']
SUITE-R08  PT-016   (seria la tercera copia)
```

`SUITE-R38`: un patrón crítico vive en **un solo sitio** y viaja con su contrato. Se exporta
desde `patrones.mjs`, donde ya viven los patrones compartidos, y `verify-patrones` comprueba lo
que **tiene** que contener y lo que **no**:

```js
export const ESTADOS_TERMINALES = new Set([
  'INTEGRATED', 'CLOSED', 'REVERTED', 'REJECTED', 'DEFERRED',
]);
// contiene: los cinco de arriba       no contiene: DONE
```

**`DONE` no es terminal, y eso importa:** un PT en `DONE` está esperando `G4`, sigue vivo, y las
tres reglas tienen que seguir exigiéndole lo suyo. Si alguien lo añadiera «porque suena a
terminado», las tres compuertas se apagarían **a la vez** — por eso el contrato lo declara y un
caso lo comprueba.

## Las plantillas

Las cuatro de tarea traen `phase` en su YAML con el valor inicial de su caso. `EPIC-INTAKE.md`
**no lo trae**: un lote no tiene fase de tarea, y ponerlo ahí enseñaría a rellenarlo con un
número inventado.

## La migración

`migrate.mjs` ya enumera las allocations vivas sin `phase` desde el tramo de `5.0.0`. Lo único
que cambia es el texto: pasa de «esas comprobaciones salen `SIN EVALUAR`» a decir que **desde
esta versión fallan**, y el `CHANGELOG` lleva la guía.

## Lo que este diseño **no** hace

No adivina la fase, no la exige a los `EP` ni a lo terminado, y **no hace que el campo sea
cierto**: hace que faltar cueste. Que mentir se vea ya lo hizo `PT-044`.
