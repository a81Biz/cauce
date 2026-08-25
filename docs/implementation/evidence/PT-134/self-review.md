# Autorrevisión — `PT-134`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

Un `AC` puede declararse **caído**: `CAÍDO` en la celda del escenario **y** un motivo en
`manifest.json`. Hasta ahora `FDGE-R15` exigía `TS` a **todo** criterio, y uno que deja de aplicar
no puede tenerlo.

## Esta tarea es la prueba de `PT-137`

Estuvo `DEFERRED` bajo `EP-020`, que está `CLOSED`, y **ningún comando podía sacarla**. Que exista
este archivo es el `AC-06` de `PT-137` cumplido: la retomó el comando, no la mano.

## Las dos salidas que había, y por qué las dos eran malas

```
verified: true      una afirmacion sobre algo que ya nadie comprueba
Orphan permanente   la tarea no cierra y el AC no se puede quitar
```

La primera es **peor**, porque parece verde. `PT-113` eligió una tercera —sacar el `AC` fuera de la
tabla y explicarlo en prosa— que funcionó como decisión y falla como mecanismo: **un criterio que
no está en la matriz no se puede contar**.

## Por qué se piden **dos** cosas

| Sólo la palabra | Sólo el motivo |
|:---|:---|
| Cinco letras que apagan una comprobación sin que nadie responda | No se ve al leer la matriz, que es donde se mira la cobertura |

## El riesgo, de frente

«Declarar un `AC` caído» puede convertirse en la salida cómoda para todo criterio incómodo. Lo
frenan `AC-03` —motivo con contenido— y `AC-02` —no cuenta como verde—, **las dos juntas**.

Lo que **no** se puede comprobar es si el motivo es honesto. Se declara (`SUITE-R26`) en vez de
fingir que se detecta.

## `AC-04` — lo que se hizo con `PT-113`, y su límite

Su `AC-06` **vuelve** a la matriz declarado `CAÍDO`, con el motivo en su manifiesto. **La prosa
anterior se conserva** y encima se escribe la corrección con su fecha: `SUITE-R09` es append-only y
`FDGE-R29` dice que una corrección se **añade**.

**El límite se dice:** `PT-113` está `INTEGRATED` y `verify-fdge` no juzga lo terminal
(`SUITE-R36` — lo cerrado es evidencia, no estado). La declaración es **documental**; el mecanismo
se demuestra sobre fixture. Afirmar que «el verificador la aprueba» sería falso, porque no la mira.

## El defecto que apareció construyéndolo

**Una rotura de escapado que el auditor cazó.** El `\b` del reconocedor se convirtió en un byte de
control `0x08` al insertarlo: el regex **compilaba y no casaba nada** — un fallo silencioso, que es
`CE-002`. Lo detectó `audit.mjs`, que tiene esa comprobación exactamente para esto, y dio el
comando para arreglarlo.

Se rehízo sin secuencias escapadas: clases de caracteres explícitas y `(?![A-ZÁ-Ú])` en vez de
`\b`. Es la respuesta de `SUITE-R59`.

## Lo que esta tarea NO establece

- **Que ningún `AC` del repositorio esté caído sin declarar.** Retrofechar es lo que `FDGE-R52` y
  `CE-014` desaconsejan.
- **Que el motivo de `PT-113` sea suficiente.** Es el que su propia trazabilidad ya daba.

## Estado

| | |
|:---|:---|
| Escenarios | 6 de 6 |
| Negativo | `TS-06` — sin la palabra, sigue siendo Orphan |
| Orphan Criterion | ninguno |
