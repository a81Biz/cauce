# PT-055 — Escenarios de prueba   `PHASE 4`

Todos sobre el fixture de `selftest.sh`, que construye un proyecto sintético. **Ninguno lee el
`REGISTRY` real**: el `HANDOFF` lo declara como defecto conocido —«correr un caso del arnés que
lea el REGISTRY real sin pasar el ROOT explícito»— y aquí se pasa el `ROOT` del fixture.

| AC | Escenario | Montaje | Se espera |
|:---|:---|:---|:---|
| `AC-01` | El lote que cierra está en verde y hay otro abierto en rojo | `EP-900` con filas resueltas · `EP-901` con filas sin resolver | `--gate G4 EP-900` → **sin error** de `SUITE-R45` por `EP-901` |
| `AC-02` | El lote que cierra tiene filas sin resolver | `EP-901` con filas sin resolver | `--gate G4 EP-901` → **falla** `SUITE-R45` |
| `AC-03` | `EP-NNN` se acepta como objetivo | el de `AC-01` | la salida **nombra** `EP-900`; hoy el argumento se descarta en silencio |
| `AC-04` | El objetivo es un PT y se deriva su lote | `PT-9xx` con `epic: EP-901` | `--gate G4 PT-9xx` → falla por `EP-901` y **no** por `EP-900` |
| `AC-05` | `--gate G4` sin objetivo | los dos lotes | **falla** por `EP-901`: sin objetivo se evalúan todos |
| `AC-06` | Lote `DONE` sin `--gate` | `EP-901` con `status: DONE` | **falla** aunque no se pase `--gate` |

## Comprobación inversa   — obligatoria, no opcional

Revertido el arreglo, estos deben **caer**:

```
AC-01  vuelve a fallar por EP-901        <- es el defecto original
AC-03  deja de nombrar EP-900            <- el argumento se descartaba
AC-04  falla por los dos lotes
```

Y estos deben **seguir pasando** revertido el arreglo, porque no dependen de él:

```
AC-02  AC-05  AC-06
```

Un caso que pase en las dos direcciones no está probando nada. Es la lección de `PT-050`:
cinco casos en una sola sesión casaban su propia definición.
