# PT-076 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Ningún caso escribe en el repositorio real | E1 | huella `md5sum` de `SESSION-<persona>.json` y `SESSION_LOG.md` antes y después de la pasada completa | `salidas/huella.txt` | - | VERIFICADO |
| AC-02 | Los casos que necesitan historial real siguen leyéndolo | E2 | `selftest.sh`: «coste sigue leyendo el historial real» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-03 | `sesion abrir`/`cerrar` se prueban en el fixture | E3 · E4 · E5 | `selftest.sh`: «sesion abrir escribe la marca del FIXTURE» · «…y abrir otra vez la sobrescribe» · «sesion cerrar da el handoff» · «…y dice que NO borra la marca» · «…y que HANDOFF.md queda INTACTO» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-04 | Algo falla si vuelve a colarse una acción que escribe por `TRR` | E6 · E7 | `selftest.sh`: «ninguna accion que escriba va por TRR» | `salidas/inversa.txt` | - | VERIFICADO CON LÍMITE |
| AC-05 | Las 140 entradas ya escritas se declaran | E8 | `selftest.sh`: «las entradas del arnes estan declaradas» | `salidas/selftest-completo.txt` | - | VERIFICADO |

## `AC-01` es el criterio de verdad

Los demás explican por qué. Si `AC-01` pasa y los otros fallan, el daño está contenido; si
`AC-01` falla, lo demás da igual. Por eso es una huella y no una aserción sobre texto: no se
puede satisfacer por accidente.

## `AC-04` se declara **con límite**

La guarda deriva del código qué acciones escriben, pero **tres disparadores se nombran a mano**
—`abrir`, `cerrar`, `--registrar`— porque derivarlos exigiría saber en qué rama de cada función
cae el `writeFileSync`. Una heurística equivocada ahí haría fallar casos correctos, que es peor
que no tenerla (`PT-023`).

**Qué no cubre:** un disparador nuevo añadido a `sesion`, `viabilidad` o `asignar`. Lo cubre
`AC-01`, que mide el resultado y no la forma.

## La inversa demuestra las dos guardas a la vez

Devuelto **un solo caso** a `TRR`:

```
✗ ninguna accion que escriba va por TRR      la guarda de FORMA cae
a5518790… → a4a7817a…                        la huella CAMBIA
```
