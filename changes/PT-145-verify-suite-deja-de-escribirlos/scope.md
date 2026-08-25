# PT-145 · `scope.md` — `PHASE 2` Analysis (`2-R`)

## 1. Qué cambia internamente

**Ocho sitios en dos archivos** — uno más de los siete del intake, porque `PT-144` destapó la
sexta alternancia:

```
verify-suite.mjs  250 · 254 · 256 · 289 · 403   la alternancia de diez prefijos, cinco veces
                  708                            la SEXTA, con OCHO — le faltan FPGE y FIDE
                  425                            COMPONENTES_OPCIONALES = new Set(['FIDE'])
comparar-marco.mjs 39                            OPCIONALES = new Set(['FIDE'])
```

Los ocho pasan a derivarse de `prefijos()` y `opcionales()`, que `PT-144` dejó en
`patrones.mjs`.

## 2. `comparar-marco.mjs` no importa nada del marco

El grafo lo dijo en `PHASE 2` de `PT-144` y aquí se confirma leyendo el archivo:

```js
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
```

**Tres imports, los tres de `node:`.** Es la única de las nueve herramientas del lote que no
consume `patrones.mjs`, así que aquí **no basta con sustituir un literal: hay que añadir la
arista de import que no existe**.

Ese dato se supo antes de abrir esta tarea porque el grafo se regeneró al empezar el lote. Sin
él, se habría averiguado aquí a mano.

## 3. El sitio `:708` no es una copia: es un guardarraíl con dos agujeros

```js
const RE_REGLA = /\b(?:SUITE|FDGE|INTAKE|LEX|FND|QA|PTSA|EXEC)-R\d+\b/;
```

Guarda `EXEC-R08`: la matriz de compuertas de `EXECUTION-MODES.md` **no puede citar una regla**,
porque un modo decide *quién* resuelve y no *qué* se exige. Con ocho prefijos, una celda que
citara **`FPGE-R05`** o **`FIDE-R03`** pasaría en verde.

**Al derivarlo del contrato, `FPGE` y `FIDE` entran en esa comprobación por primera vez.** Puede
destapar citas que hoy nadie ve. Si las destapa: **se declaran, no se arreglan aquí** — un
`REFACTOR` que empieza a corregir contenido normativo dejó de ser un `REFACTOR`.

## 4. Qué NO debe cambiar

```
No cambia — comportamiento observable:  verify-suite y comparar-marco dan el MISMO
                                        resultado sobre el arbol actual. Es la barra.
No cambia — que comprueba verify-suite: cambia de donde saca la lista, no que hace con ella.
No cambia — el criterio de :425:        «deliberadamente estrecho», dice su comentario: solo
                                        se perdona cuando falta el DIRECTORIO ENTERO.
No cambia — patrones.mjs:               PT-144 ya lo dejo. Aqui solo se consume.
No cambia — EXECUTION-MODES.md:         si :708 destapa una cita de regla, se DECLARA.
```

## 5. Barra de calidad — medible

| Métrica | Actual | Objetivo | Cómo se comprueba |
|:---|:---|:---|:---|
| Literales de componente en `verify-suite.mjs` | **7** | **0** | `grep` de los diez prefijos y de `'FIDE'` |
| Literales en `comparar-marco.mjs` | **1** | **0** | `grep` |
| Imports de `patrones.mjs` en `comparar-marco.mjs` | **0** | **1** | lectura |
| Salida de `verify-suite` sobre el árbol | — | **idéntica** | ejecución antes/después |
| Salida de `comparar-marco` | — | **idéntica** | ejecución antes/después |
| Prefijos que ve `:708` | **8** | **10** | un caso con una cita `FPGE-Rnn` |

La última fila es la única que **cambia** comportamiento, y es a propósito: es el agujero.

## 6. Riesgo de regresión

```
RC-01  Las cinco alternancias siguen casando lo mismo.
       Test: verify-suite sobre el arbol real, salida identica.

RC-02  Se construyen SIN una barra invertida escrita (SUITE-R59).
       Test: NUEVO. Es el riesgo real de esta tarea — cinco patrones que hoy son
       literales pasan a construirse, y un escape que se degrada NO FALLA: casa de
       menos, y casar de menos aqui es pasar en verde.

RC-03  El criterio de :425 se conserva: solo perdona el directorio ENTERO ausente.
       Test: el caso de FIDE/ ausente, que el propio comentario documenta.

RC-04  comparar-marco da la misma salida.
       Test: ejecucion antes/despues.

RC-05  :708 pasa a ver diez prefijos, y lo que destape se DECLARA.
       Test: NUEVO. Una cita FPGE-Rnn en una matriz de prueba tiene que fallar.
```

## 7. Out of scope

```
OUT: build-core.mjs y audit.mjs. Son PT-146 y PT-147.
OUT: corregir lo que :708 destape en EXECUTION-MODES.md. Que aparezca es el objetivo;
     que salga limpio no lo es.
OUT: cambiar el criterio de COMPONENTES_OPCIONALES. Se conserva tal cual.
OUT: anadir a comparar-marco cualquier otra cosa de patrones.mjs. Se anade UNA arista,
     la que necesita opcionales().
```

## 8. Complejidad

```
Complejidad: STANDARD
```

Ocho sitios en dos archivos, con un cambio de comportamiento deliberado (`:708`) y cinco patrones
que pasan de literales a construidos. No es `TRIVIAL`.
