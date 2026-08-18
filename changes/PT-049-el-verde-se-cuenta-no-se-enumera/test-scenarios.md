# PT-049 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `verify-fdge --all -q` sobre un árbol sano | **no** aparece el bloque `PASA` |
| E2 | AC-01 | …y los avisos **sí** siguen apareciendo | aparecen: no es lo que esta tarea calla |
| E3 | AC-02 | `verify-fdge --all -q` | imprime «PTs verificados: N» |
| E4 | AC-02 | `selftest.sh -q` con la batería en verde | imprime «OK · N casos» |
| E5 | AC-01 | `selftest.sh -q` | **no** aparece ningún `✓` |
| E6 | AC-03 | `selftest.sh -q` con un caso roto | el `✗` aparece **igual** |
| E7 | AC-03 | `verify-fdge -q` sobre un PT con error | el bloque `ERRORES` aparece **igual** |
| E8 | AC-04 | `exit` de `selftest.sh` con y sin `-q`, árbol sano | idénticos |
| E9 | AC-04 | `exit` de `selftest.sh` con y sin `-q`, árbol roto | idénticos, y distintos de cero |
| E10 | AC-04 | `-q` no se toma como `[dir-temporal]` | `WORK` no contiene `-q` |
| E11 | AC-01 | La salida **sin** `-q` no cambia | idéntica a la de antes del cambio |

`E11` es el que protege lo que la CI lee. `E10` es el que protege un defecto que solo se ve
ejecutando: `selftest.sh [dir-temporal]` toma `$1` como ruta, así que `selftest.sh -q` crearía
`-q/mth-selftest` si nadie lo filtra.

## Lo que ningún caso puede comprobar

**Que la salida en `-q` siga siendo suficiente para decidir.** Se puede comprobar que el recuento
está y que los fallos están; que eso baste para que alguien confíe en un «sin errores» es un
juicio, no una aserción.

Por eso `-q` **no** es el defecto: la primera lectura sigue siendo la completa, y `E11` garantiza
que esa no ha cambiado.
