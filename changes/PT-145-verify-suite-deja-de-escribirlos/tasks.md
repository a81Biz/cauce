# PT-145 · `tasks.md` — `PHASE 4` Proposal

## Archivos

```
docs/methodology/tools/patrones.mjs        <- solo AÑADE las funciones de patrón
docs/methodology/tools/comparar-marco.mjs
docs/methodology/tools/verify-suite.mjs
docs/methodology/tools/selftest.sh
```

**Cuatro pasos atómicos con checkpoint entre ellos** — `FDGE-R54` dio `MARGINAL`, y `PHASES` lo
traduce a eso.

## `PT-145.1` — las funciones de patrón, con su contrato

| | |
|:---|:---|
| **Objetivo** | `reglaRE()`, `reglaEnTabla()`, `reglaEnLinea()`, `PFX()` en `patrones.mjs`, construidas sin barras invertidas |
| **Validación** | `verify-patrones` las comprueba: casan los **diez** prefijos, y **no** casan `XYZ-R01` ni `SUITE-R` sin número |
| **Archivos** | `tools/patrones.mjs` · `tools/verify-patrones.mjs` |
| **Cubre** | `AC-02`, `RC-02` |

Va primero porque es lo único que nadie consume todavía: si un escape se degrada, se ve aquí.

## `PT-145.2` — `comparar-marco` deriva, y gana su import

| | |
|:---|:---|
| **Validación** | `grep 'FIDE'` en el archivo: cero · su salida sobre el árbol, **idéntica** |
| **Archivos** | `tools/comparar-marco.mjs` |
| **Cubre** | `AC-01`, `AC-04`, `RC-04` |

Es el paso más pequeño **y el único con una dependencia nueva**: si el import falla, se sabe con
un solo sitio tocado.

## `PT-145.3` — `verify-suite`, los seis sitios que **no** cambian comportamiento

| | |
|:---|:---|
| **Objetivo** | `:425` y las cinco alternancias completas |
| **Validación** | salida de `verify-suite` sobre el árbol real **idéntica**, byte a byte |
| **Archivos** | `tools/verify-suite.mjs` |
| **Cubre** | `AC-01`, `AC-04`, `RC-01`, `RC-03` |

## `PT-145.4` — `:708`, el que sí cambia

| | |
|:---|:---|
| **Objetivo** | La sexta alternancia pasa de ocho prefijos a diez |
| **Validación** | Una matriz de prueba con `FPGE-R05` **falla** · lo que destape sobre el árbol real se **declara** |
| **Archivos** | `tools/verify-suite.mjs` · `tools/selftest.sh` |
| **Cubre** | `AC-03`, `RC-05` |

**Va solo y va último.** Lo que destape no puede confundirse con un fallo de los tres anteriores.
