# Trazabilidad — `PT-132`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | El registro se guarda DESPUES DE CADA issue creado, no al final del bucle | `TS-01` | `tracker abrir --aplicar` sobre PT-132 | `salidas/espejo.txt` |
| AC-02 | Antes de crear se busca un issue ABIERTO con el titulo derivado: si existe se ADOPTA | `TS-02` `TS-03` | `selftest.sh:un issue huerfano con el titulo se adopta` | `salidas/casos.txt` |
| AC-03 | Adoptar se DICE, no se hace en silencio | `TS-04` | `tracker abrir --aplicar` | `salidas/espejo.txt` |
| AC-04 | Si no se puede consultar la plataforma NO se crea a ciegas | `TS-05` | `selftest.sh:sin saber que hay abierto, no se decide` | `salidas/casos.txt` |
| AC-05 | El contrato de reversibilidad queda escrito y los dos comandos lo cumplen | `TS-06` | `selftest.sh:sin titulo derivable no se adopta` | `salidas/casos.txt` |
| AC-06 | La guarda de PT-107 deja de acusar al propio comando cuando escribe dos veces | `TS-01` | `tracker abrir --aplicar` | `salidas/espejo.txt` |

**Seis criterios, seis con `TS`, seis con evidencia ejecutada.**

## `AC-06` salió implementando

No estaba en el intake. `AC-01` —guardar tras cada issue— **disparó la guarda de `PT-107`**:
`HUELLA_AL_LEER` era `const` y no se actualizaba nunca, así que la guarda asumía **una escritura
por ejecución** y la segunda del propio comando se denunciaba a sí misma.

`PT-107` la construyó para cazar a **otro proceso**. Como ningún comando escribía dos veces,
**nunca se ejercitó en el camino que ahora hacía falta**.

## La evidencia que decide

`salidas/casos.txt` · la inversa de `AC-02`:

```
✓ …y si no lo hay, no se adopta nada
```

Adoptar de más sería peor que duplicar: un issue ajeno absorbido en silencio no lo ve nadie.

Y `salidas/espejo.txt`: **22 allocation(s) viva(s) y 22 issue(s) abierto(s): el espejo cuadra**,
después de haber tenido 16 huérfanos.
