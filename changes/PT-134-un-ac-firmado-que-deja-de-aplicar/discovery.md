# Descubrimiento — `PT-134`   `PHASE 2`

## Dónde está el hueco, con archivo y línea

`verify-fdge.mjs:2137` exige `TS` a **toda** fila de la matriz:

```js
if (isEmptyCell(r.ts)) fail('FDGE-R15', `${pt}: ${r.ac} sin escenario de test (Orphan Criterion).`);
```

No hay ningún valor que signifique «este criterio dejó de aplicar». La celda o tiene un `TS` o
está vacía, y vacía es Orphan.

## Qué se hizo la vez que ocurrió, y por qué no vale

`PT-113` sacó su `AC-06` **fuera de la tabla** y lo explicó en prosa. Funcionó como decisión
—queda escrita— y falla como mecanismo: **un criterio que no está en la matriz no se puede
contar**. Ni el manifiesto ni el verificador saben que existe.

Su `traceability.md` lo dice con todas las letras:

> *«no hay herramienta que pueda decir "este criterio dejó de aplicar" — el marco no tiene ese
> vocabulario»*

## Las dos salidas que había, y por qué las dos son malas

```
verified: true      una afirmacion sobre algo que ya nadie comprueba
Orphan permanente   la tarea no puede cerrar y el AC no se puede quitar
```

La primera es peor porque **parece verde**.

## El riesgo, medido de frente

«Declarar un `AC` caído» puede convertirse en la salida cómoda para todo criterio incómodo. Es el
motivo por el que el mecanismo pide **dos** cosas —la palabra en la matriz y el motivo en el
manifiesto— y por el que un caído **no** puede declararse verificado.

Lo que **no** se puede comprobar es si el motivo es honesto. Se declara (`SUITE-R26`).

## Qué NO se midió

- **Cuántos `AC` de las 143 tareas estarían caídos.** Retrofechar es lo que `FDGE-R52` y `CE-014`
  desaconsejan.
