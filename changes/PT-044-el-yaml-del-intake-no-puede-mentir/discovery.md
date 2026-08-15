# PT-044 — Descubrimiento   `PHASE 2` · `2-B`

## Qué falla, con archivo y línea

**Tres artefactos declaran el estado de un PT y ninguno tiene que coincidir con los otros.**

| Dónde | Qué hace |
|:---|:---|
| `verify-fdge.mjs:878-883` | `faseDeclarada`: el YAML del intake **manda** sobre el registro, y si difieren no se dice |
| `verify-fdge.mjs:915` | `if (rigeAqui && fase >= 2)` — con `phase: 1` en el YAML, `FDGE-R52` **no llega a ejecutarse** |
| `verify-fdge.mjs:1289-1296` | `checkIndex`: comprueba que el estado del índice sea **canónico**, no que **coincida** con el registro |

Medido, no recordado — antes de esta tarea:

```
changes/PT-039..PT-042/intake.md   status: DRAFT   phase: 1
REGISTRY.json                      INTEGRATED      phase: 9
REFACTOR_SCOPE.md                  VALIDATION_PENDING / READY
tracker notas PT-039..PT-042       0  ·  0  ·  0  ·  0
```

Las cuatro pasaron su compuerta **sin que se evaluara nunca** si dejaban notas de reanclaje.

## Por qué la precedencia es correcta y aun así falla

`PT-004` la escribió con motivo: *«el YAML del intake manda sobre el registro, porque es lo que
el PT dice de sí mismo»*. Eso sigue siendo cierto. El defecto no es **cuál gana**: es que gana
**en silencio**.

Y el silencio no es neutro aquí. Un YAML que se queda atrás **apaga comprobaciones**: `FDGE-R52`
solo corre desde `phase >= 2`, y los artefactos se exigen «desde la fase que los produce». Un
`phase: 1` olvidado convierte a `verify-fdge` en un verificador que da verde por no haber mirado
— exactamente lo que `RULE-06` prohíbe, dentro del verificador que lo hace cumplir.

## El tercer sitio

`FDGE-R31` da `✓` sobre una línea de índice que dice `READY` mientras el registro dice
`INTEGRATED`. Comprueba la **forma** del estado, no su **verdad**. Es el mismo defecto en un
archivo que nadie mira.

## Lo que hace falta y no hay

`SUITE-R35` dice que **el registro asigna y la plataforma espeja**, y `tracker espejo` lo hace
cumplir contra GitHub. **Dentro del repositorio no existe el equivalente**: nada compara el
registro con el YAML ni con el índice, que son las otras dos copias del mismo hecho. La regla
existe; su comprobación cubre una de las tres direcciones.

## El tablero ya lo sabía

`PT-016` (#23), abierto en `EP-004`: *«decidir si `phase` pasa a ser obligatoria, y añadirla a la
plantilla `TAREA.md`»*. Tres lotes sin decidirse. La respuesta que este descubrimiento da no es
«obligatoria»: es que **si está y miente, se diga**.
