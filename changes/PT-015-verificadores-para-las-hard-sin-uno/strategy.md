# PT-015 — Estrategia   `PHASE 3`

## Objetivo

Que las reglas `HARD` que **deciden algo** emitan su ID al fallar, y que el resto quede **medido**
en vez de prometido.

## El alcance, reducido por escrito

> «Acotar a las HARD que deciden algo; el resto, deuda medida» — decisión del firmante, 2026-08-14

```
ENTRA   3 reglas cuya comprobacion YA EXISTE y no dice su nombre
          SUITE-R38  verify-patrones ejecuta su contrato y no emite nada
          FND-R29    revisar-secretos es su comprobacion y no emite nada
          SUITE-R47  tracker decide donde bloquea el espejo y no lo cita
        1 regla que decide y NADIE comprueba
          FDGE-R39   todo archivo de un PT vive bajo changes/PT-XXX-slug/

QUEDA   FDGE-R13 y FDGE-R20, mecanizables pero caras: exigen comparar git
FUERA     contra la fase y parsear el campo «Archivos» de cada tasks.md.
          Se declaran con su motivo, no se prometen.
        89 HARD mas, la mayoria NO mecanizables: describen el razonamiento,
          no una propiedad de un artefacto. SUITE-R26 dice «aspira» por esto.
```

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Bajar las 105 a cero | Es el trabajo más grande del tablero y el firmante lo descartó. Y no se puede: la mayoría no es mecanizable |
| Escribir un verificador por regla, en serie | Produce comprobaciones que no deciden nada, y una comprobación que no puede fallar es ruido (`SUITE-R38`) |
| Cerrar la tarea porque `regla --sin-comprobar` ya lo declara | Descartado por el firmante. Y declarar no es lo mismo que cubrir lo que decide |
| **Cubrir lo que decide, medir el resto** | Es la decisión, y coincide con dónde el silencio hace daño |

## Por qué las tres «anónimas» primero

Cuesta **una línea por herramienta** y convierte tres reglas de «si falla no lo dirá con su
nombre» a «lo dice». Es la mejor relación entre lo que cuesta y lo que cierra, y es literalmente
lo que `SUITE-R53` pide: *«todo mensaje de fallo cita su regla, y deducirla no puede ser el
camino»*. Que las tres herramientas que existen **por** una regla no la citen es el defecto de
`SUITE-R53` ocurriendo dentro de las tres herramientas que más lo necesitan.

## `FDGE-R39`, la que sí falta

*«Todo archivo de trabajo de un PT vive bajo `changes/PT-XXX-slug/`. Ninguna ruta global es
sobrescribible por un PT. Sin esta regla, dos PTs en vuelo se destruyen mutuamente.»*

Comprobable y barato: los artefactos de fase de un PT —`intake`, `discovery`, `strategy`,
`design`, `tasks`, `test-scenarios`, `out-of-scope`, `traceability`— **no** pueden existir en
`docs/implementation/`. Es donde v3 los tenía, y es de donde la migración los saca.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `verify-patrones` con salida nueva | Su código de salida no cambia; solo el texto lleva el ID. Caso propio |
| `revisar-secretos` idem | Igual, y es bloqueante: el ID no puede cambiar cuándo bloquea |
| `tracker espejo` idem | `SUITE-R47` se cita **donde ya decide**, no se añade una decisión |
| `FDGE-R39` sobre este repositorio | Se ejecuta: no hay artefactos de PT en rutas globales, así que cero errores nuevos |
| `regla --fallos` y `--sin-comprobar` | Se derivan del código: los cuatro IDs nuevos aparecen **solos**. Es la prueba de que la derivación funciona |

## Criterios de éxito, derivados de los AC

- `AC-01` → el universo está enumerado y clasificado, no estimado
- `AC-02` → las cuatro emiten su ID al fallar
- `AC-03` → el alcance reducido está escrito, con lo que queda fuera y por qué
- `AC-04` → `regla --sin-comprobar` baja de 105 y sigue declarando el resto con su número

## Autorrevisión

Contradicciones: ninguna con `SUITE-R26` —sigue siendo «aspira»— ni con `RULE-06`, que es
justamente lo que permite declarar el resto en vez de fingirlo.

**Lo que asumo y digo:** que «decide algo» significa *un gate lo consulta o una herramienta
bloquea por ello*. Es una definición mía, defendible pero mía, y por eso queda escrita aquí y en
el intake en vez de dejarse entender.
