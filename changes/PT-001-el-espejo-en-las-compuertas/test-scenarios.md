# PT-001 — Escenarios de test   `PHASE 4`

En `docs/methodology/tools/selftest.sh`. El fixture **no declara plataforma**, así que cada
escenario que la necesita la inyecta y la retira: es también la prueba de que sin ella no
cambia nada.

`gh` no se invoca en el arnés. Los escenarios que necesitan plataforma con acceso usan un
`gh` de mentira en el `PATH` — el mismo recurso que ya usa el arnés para no depender de la red.

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | plataforma declarada, allocation viva sin `issue`, `gh` de mentira que lista 0 issues | `tracker espejo` sale `1` y nombra `SUITE-R35` |
| `TS-02` | `AC-02` | issue abierto que ninguna allocation viva reclama | sale `1` y lo nombra |
| `TS-03` | `AC-04` | lo mismo, vía `verify-fdge --gate G4` | `✗ SUITE-R35` y la compuerta queda bloqueada |
| `TS-04` | `AC-04` | espejo cuadrando, vía `--gate G4` | la compuerta no se bloquea por el espejo |
| `TS-05` | `AC-06` | `REGISTRY.json` **sin** clave `tracker` | `tracker` sale `2`; `verify-fdge --all` no menciona `SUITE-R35`; nada falla |
| `TS-06` | `AC-05` | plataforma declarada, **sin** `gh` en el `PATH` | `tracker` sale `3` · `verify-fdge --all` dice `SIN EVALUAR` · `--gate G4` **falla** |
| `TS-07` | `AC-07` | plataforma, PT con `issue`, `gh` de mentira con las notas de transición | `FDGE-R52` pasa **sin** `bitacora.md` |
| `TS-08` | `AC-07` | **sin** plataforma, PT en `PHASE 4` sin `bitacora.md` | `✗ FDGE-R52` — el comportamiento de hoy, intacto |
| `TS-09` | `AC-08` | `tracker abrir --aplicar` con las etiquetas ausentes | las crea y lo dice; no revienta con el error crudo de `gh` |

## Los inversos, y por qué no son opcionales

`TS-04`, `TS-05` y `TS-08` son los que impiden que «apagarlo todo» pase por arreglo:

- `TS-04` — si el espejo bloqueara siempre, `TS-03` pasaría igual.
- `TS-05` — es la garantía para **todo proyecto que no declara plataforma**. Sin él, este PT
  podría romper a todos los proyectos destino instalados y el arnés no se enteraría.
- `TS-08` — sin él, «`FDGE-R52` acepta el issue» podría implementarse dejando de comprobar
  `FDGE-R52`, y los dos primeros pasarían.

## `TS-06` es el escenario de la decisión humana

Comprueba las **tres** mitades del criterio del 2026-08-13: que sin credencial no se aprueba
en silencio (`SIN EVALUAR` visible), que no bloquea donde no puede estar, y que **sí** bloquea
en `G4`, que es donde la credencial es exigible.

## Regresión

Los 188 casos existentes entran como regresión. El fixture no declara plataforma, así que
todos caen en la rama de hoy: si alguno cambia de resultado, el cambio ha alcanzado a
proyectos que no debía tocar.
