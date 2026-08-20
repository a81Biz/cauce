# PT-081 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Cada regla lleva **su propia** versión de entrada | E1..E5 | `selftest.sh`: los cinco casos de `rigeDesde` | `salidas/rige-desde.txt` | PENDIENTE |
| AC-02 | `FDGE-R54` no rige sobre una tarea anterior a su versión | E6 | `selftest.sh`: «8.2.0 sin viabilidad ⇒ FDGE-R54 NO alcanza» | `salidas/par-de-versiones.txt` | PENDIENTE |
| AC-03 | …y sí sobre una posterior | E7 | `selftest.sh`: «10.0.0 sin viabilidad ⇒ FDGE-R54 SI alcanza» | `salidas/par-de-versiones.txt` | PENDIENTE |
| AC-04 | `FDGE-R53` conserva su comportamiento | E3 · E4 | `selftest.sh`: los casos de `5.1.0` y `5.0.9` | `salidas/rige-desde.txt` | PENDIENTE |
| AC-05 | `EP-017` sale como `10.0.0` | E11 | `version.mjs` sobre los 21 documentos | `salidas/version.txt` | PENDIENTE |
| AC-06 | La guía `9.0.0 → 10.0.0` existe y enumera lo que rompe | E12 | la entrada del `CHANGELOG` nombra `FDGE-R54` y `SUITE-R56` con qué hacer | `salidas/changelog.txt` | PENDIENTE |
| AC-07 | La entrada `9.0.0` **no** se reescribe | E13 | `git diff` sobre esa sección: sin cambios | `salidas/changelog.txt` | PENDIENTE |
| AC-08 | Una regla `HARD` nueva sin versión **se detecta** | E8..E10 | `selftest.sh`: los tres de `reglasNuevasSinVersion` + «verify-suite invoca el detector» | `salidas/ac08-inversa.txt` | PENDIENTE |

## `E6` y `E7` son un par, no dos casos

La **misma** tarea, la **misma** falta, dos `suite_version`. Por separado, cada uno pasaría con un
`rigeDesde` que devolviera siempre lo mismo. Lo que mide es la diferencia.

## `AC-08` se verifica en tres piezas, y una de ellas a mano

La inversa completa —quitar la fila de `FDGE-R54` y ver saltar el aviso— **no cabe en la batería**,
y el motivo es el diseño del propio detector: compara contra `origin/main`, así que fuera de un
repositorio con ese remoto devuelve `null` y no inventa nada (`RULE-06`). Sobre la copia del
fixture callaría siempre, y un caso que pasa por vacío es lo que `lint_aserciones` enumera.

| Pieza | Dónde |
|:---|:---|
| Que el detector **funciona** | `patlib`, tres casos |
| Que `verify-suite` lo **invoca** | un caso sobre la fuente — sin él, desconectarlo no costaría un rojo |
| Que sin versión anterior **calla** | un caso sobre la copia del fixture |
| Que el aviso **cae** al quitar la fila | **ejecutado a mano**, en `salidas/ac08-inversa.txt` |

Lo intenté dentro de la batería haciendo la inversa sobre `$SUITE` y restaurando con
`git checkout`. Es lo que `PT-076` prohíbe —el arnés no escribe en el repositorio real— y habría
dejado `patrones.mjs` roto si la batería se interrumpía en medio.

## Dos casos previos cambiaron de forma, no de intención

`FDGE-R54` rige ahora **desde la `10.0.0`**, y el fixture nace en `5.2.0`. Los casos que exigían
que la regla saltara pasan a declarar `suite_version: 10.0.0` en la allocation. Siguen midiendo
lo mismo —sin veredicto registrado, `G2` no se resuelve— y de paso dejan escrito que la regla no
alcanza a lo escrito antes de existir.

No los hice pasar: los leí. Es la lección de `PT-079`, donde de seis casos tocados **uno cambiaba
de sentido** y era el núcleo del arreglo.

## `AC-05` tiene un límite declarado

Las tareas **vivas** de `EP-017` pasan a `10.0.0`; las **cerradas** se quedan como cerraron.
Cambiar la versión de una tarea integrada sería retrofechar, y el campo existe para decir bajo qué
versión se escribió (`SUITE-R18`), no bajo cuál se publicó.
