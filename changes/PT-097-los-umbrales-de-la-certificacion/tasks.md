# Tasks — `PT-097`

## `PT-097.1` · los tests en rojo

| | |
|:---|:---|
| **Objetivo** | Que la batería falle **por el defecto** |
| **Input** | `test-scenarios.md` |
| **Output** | `TS-01`…`TS-12` en `selftest.sh` |
| **Validación** | cada caso falla por su aserción, no por «la herramienta reventó» |
| **Archivos** | `docs/methodology/tools/selftest.sh` |
| **Estado** | PENDIENTE |

> `FDGE-R17`. Los casos de `letraDeCertificacion` **no podrán estar en rojo válido** —la función
> no existe— y eso se declara, como en `PT-096`. Los que sí pueden: los que comprueban que
> `§24.2`/`§24.4` existen y que `verify-ptsa` mira la letra.

## `PT-097.2` · `§24.2`, `§24.3` y `§24.4` `S-1` `S-2` `S-3` `D-1`

| | |
|:---|:---|
| **Objetivo** | `AC-01` `AC-02` `AC-04` |
| **Output** | `§24` renombrada, `24.1` con lo que ya había **intacto**, y las tres nuevas |
| **Validación** | `verify-suite` sin errores · las citas de `:569` y `:744` resuelven |
| **Archivos** | `PTSA/PTSA-V3-Especificacion-Oficial.md` |
| **Estado** | PENDIENTE |

## `PT-097.3` · `letraDeCertificacion` `S-4` `D-5`

| | |
|:---|:---|
| **Objetivo** | `AC-03` · determinista, pura, exportada |
| **Output** | la función, y `verify-ptsa` contrastando la letra publicada |
| **Validación** | un caso por banda y uno por tope · un dato ausente devuelve `null` **con aviso** |
| **Archivos** | `docs/methodology/tools/verify-ptsa.mjs` |
| **Estado** | PENDIENTE |

## `PT-097.4` · la `B` recalculada `S-5` `D-6`

| | |
|:---|:---|
| **Objetivo** | `AC-07` |
| **Output** | revisión **añadida** al `RESUMEN.md` · banda `(75-89)` retirada · lo anterior declarado no contrastable |
| **Validación** | `verify-ptsa` en verde contra el `RESUMEN` · `SUITE-R09` intacta |
| **Archivos** | `PTSA/RESUMEN.md` |
| **Estado** | PENDIENTE |

## `PT-097.5` · `CORE-PTSA.md` `S-6`

| | |
|:---|:---|
| **Objetivo** | `AC-08` |
| **Output** | regenerado por `build-core`, **no a mano** |
| **Validación** | `npm run core:check` |
| **Archivos** | `docs/methodology/CORE-PTSA.md` (generado) |
| **Estado** | PENDIENTE |

## `PT-097.6` · la prueba inversa

| | |
|:---|:---|
| **Objetivo** | `AC-06` · retirar cada cambio y ver caer **exactamente** lo previsto |
| **Output** | `salidas/inversa.txt` con el recuento por cambio |
| **Validación** | ninguna retirada en cero — y si alguna sale en cero, **se dice** |
| **Estado** | PENDIENTE |

## Rama propuesta — **NO se crea aquí** (`FDGE-R13`, `FDGE-R19`)

```
bug/alberto-martinez/PT-097-los-umbrales-de-la-certificacion
```

## Orden

```
.1  ->  .2 .3  ->  .4 .5  ->  .6
```

`.4` va **después** de `.3`: recalcular la letra a mano y luego escribir la función que la calcula
sería escribir la función para que dé lo que ya escribí. Primero la función, luego lo que dice.
