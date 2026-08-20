# PT-055 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `--gate G4 EP-A` con `EP-B` abierto y en rojo NO falla por `EP-B` | E1 | `selftest.sh`: «el lote que cierra no mira al que abre» | `salidas/caso-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | `--gate G4 EP-A` SI falla si `EP-A` tiene filas sin resolver | E2 | `selftest.sh`: «…y el que cierra SI bloquea si le toca» | `salidas/caso-real.txt` | - | VERIFICADO |
| AC-03 | `verify-fdge` acepta `EP-NNN` como argumento posicional | E3 | `selftest.sh`: «EP-NNN se acepta como objetivo» · «…y sin objetivo no nombra ninguno» | `salidas/caso-real.txt` | - | VERIFICADO |
| AC-04 | `--gate G4 PT-NNN` evalua el lote de ese PT, no todos | E4 | `selftest.sh`: «el lote sale del epic del PT» · «…y no arrastra al otro lote» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-05 | `--gate G4` sin objetivo conserva el alcance de hoy: todos | E5 | `selftest.sh`: «sin objetivo se evaluan todos» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-06 | Un lote `DONE` exige sus filas resueltas sin `--gate` | E6 | `selftest.sh`: «un lote DONE exige sus filas sin --gate» | `salidas/selftest-completo.txt` | - | VERIFICADO |

## La comprobación inversa, ejecutada

Revertido `enG4` al alcance global, sobre el **repositorio real**:

```
--gate G4 EP-016
  ✗ SUITE-R45   EP-017: «## Cierre del lote» está vacía
```

`EP-017` vuelve a bloquear el cierre de `EP-016`. Es el defecto original del 2026-08-15,
reproducido. Con el arreglo puesto, la misma orden lo deja en **aviso**.

## Y `E3` pasaba en vacío antes de existir el arreglo

Asertaba que la salida **mencionara** `EP-050`, y `checkEpics()` nombra todos los lotes igual:
salía verde sin probar nada. Se cazó porque los casos se ejecutaron **en rojo primero**
(`FDGE-R17`). Endurecido a exigir `lote(s) bajo evaluacion: EP-050`, lo que obligó a que el
arreglo lo imprima — un caso mejor produjo una herramienta mejor.
