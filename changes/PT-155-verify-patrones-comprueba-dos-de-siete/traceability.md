# `PT-155` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | **Ningún** regex de primer nivel queda fuera de `PATRONES` | TS-01 | `selftest` · barrido sobre el archivo | `evidence/PT-155/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | Cada uno lleva `para`, `casa` y `noCasa` | TS-04 | `verify-patrones`, que ya lo exige | `evidence/PT-155/salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-03 | La cifra sube y **se publica** | TS-04 | antes y después | `evidence/PT-155/salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-04 | Un patrón degradado **falla** | TS-02 · TS-03 | fixture: se rompe uno | `evidence/PT-155/salidas/bateria.out` | n/a | `CUMPLIDO` |

| | Antes | Ahora |
|:---|---:|---:|
| Patrones con contrato | **12** | **19** |
| Comprobaciones | **106** | **129** |
| Regex de primer nivel sin contrato | **7** | **0** |

**`AC-04` es el que decide si esto sirve.** Meter siete entradas a un objeto no prueba nada; que
**romper una** ponga la prueba en rojo, sí. Y hay un tercer caso que es el freno: sin tocar nada,
verde — porque «fallar siempre» pasaría los dos primeros.

**No eran menos críticos: eran menos visibles.** `SUITE-R59` lleva **doce** roturas medidas aquí, y
las que cazó una comprobación fueron las que estaban **en `PATRONES`**; las de fuera salieron por
casualidad —mirando bytes con `cat -A`, o viendo reventar el arranque—. **Tres de los siete se
escribieron durante este mismo lote.**

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Los doce patrones anteriores siguen cumpliendo | `verify-patrones` | `CUMPLIDO` |
| RC-02 | Los regex se declaran **antes** de `PATRONES`, que los referencia | el módulo carga | `CUMPLIDO` |

## Un caso negativo que es un **defecto vivo**, y se deja escrito

`ANUNCIA_AUTORIZACION` lleva `'Autorizacion expresa de excepcion'` en **`noCasa`** — porque **no
casa**: al patrón le falta la `d` de `autorizad`. Es lo que hizo que un merge saliera como **no
autorizado** teniendo la constancia entera escrita (`PT-170`).

**Dejarlo ahí no lo aprueba: lo fija.** Cuando `PT-170` decida si la constancia se reconoce por su
**forma** en vez de por su título, ese caso tendrá que **moverse a `casa`** — y el cambio será
visible en vez de silencioso.

## Lo que esta tarea destapó, y **se cerró aquí**

`SUITE-R19` bloqueaba: **`FDGE-R15a` estaba fuera de la guía de migración**. `EP-024` había escrito
cuatro reglas nuevas y el `CHANGELOG` declaraba tres. Escritas las cuatro.

**La fila «Entrada de `CHANGELOG.md`» de un cierre no es trabajo del final**: `SUITE-R19` la cobra
**cuando se escribe la regla**, y hace bien — una guía escrita al cierre se escribe de memoria.
