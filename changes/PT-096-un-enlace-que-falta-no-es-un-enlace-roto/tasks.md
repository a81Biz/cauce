# Tasks — `PT-096`

> `PHASE 4`. Objetivo único · input · output · validación · archivos · estado.
> Orden obligatorio: `PT-096.1` va primero porque el resto se mide contra ella en rojo.

---

## `PT-096.1` · los tests en rojo

| | |
|:---|:---|
| **Objetivo** | Que la batería falle **por el defecto**, no por otra cosa |
| **Input** | `test-scenarios.md` |
| **Output** | `TS-01`…`TS-08` en `selftest.sh`, en rojo, más las **dos inversiones** de `D-6` |
| **Validación** | `selftest.sh --solo <nombre>` falla, y el mensaje nombra el hecho, no el símbolo |
| **Archivos** | `docs/methodology/tools/selftest.sh` |
| **Estado** | PENDIENTE |

> `FDGE-R17`. El rojo tiene que ser **válido**: un fallo por un helper indefinido o por un
> `require` mal escrito no es un test en rojo. Se comprueba que cada caso falle **por su
> aserción**.

## `PT-096.2` · la nota no se emite sin enlace `S-1` `D-3`

| | |
|:---|:---|
| **Objetivo** | `AC-02` · que ningún cuerpo publique `null` |
| **Input** | `TS-01` `TS-02` en rojo |
| **Output** | `cuerpoDeIssue` con las tres ramas explícitas |
| **Validación** | `TS-01` `TS-02` verdes · `TS-07` (`PT-048`) sigue verde |
| **Archivos** | `docs/methodology/tools/tracker.mjs` |
| **Estado** | PENDIENTE |

## `PT-096.3` · un lote se reconoce por su ID, y pierde la lista `S-4` `D-1` `D-2`

| | |
|:---|:---|
| **Objetivo** | `AC-08` · cabecera correcta en los 19 lotes, y cero listas en prosa |
| **Input** | `TS-03` `TS-04` en rojo |
| **Output** | `esLote` derivado de `/^EP-/`; bloque `Tareas de este lote:` retirado |
| **Validación** | `TS-03` `TS-04` verdes · la inversión de `:1614` pasa a `trlibno` |
| **Archivos** | `docs/methodology/tools/tracker.mjs` · `selftest.sh` |
| **Estado** | PENDIENTE |

## `PT-096.4` · la reparación alcanza al cuerpo mudo `S-2` `D-4`

| | |
|:---|:---|
| **Objetivo** | `AC-04` · los 8 terminales |
| **Input** | `TS-05` en rojo |
| **Output** | `esCuerpoDelTracker` + la guarda separada en `repararEnlacesMuertos` |
| **Validación** | `TS-05` verde · `TS-08` (marcador atado) verde · un issue ajeno **no** se toca |
| **Archivos** | `docs/methodology/tools/tracker.mjs` |
| **Estado** | PENDIENTE |

## `PT-096.5` · el espejo reporta el enlace ausente `S-3` `D-5`

| | |
|:---|:---|
| **Objetivo** | `AC-03` · que la CI lo diga |
| **Input** | `TS-06` en rojo |
| **Output** | `compararEspejo` con `refDurable` inyectado y opcional |
| **Validación** | `TS-06` verde · los 12 casos existentes de `compararEspejo` **sin tocar** y verdes |
| **Archivos** | `docs/methodology/tools/tracker.mjs` |
| **Estado** | PENDIENTE |

## `PT-096.6` · la prueba inversa

| | |
|:---|:---|
| **Objetivo** | Comprobar que **retirando el arreglo** caen exactamente los casos previstos |
| **Input** | el árbol con `PT-096.2`…`.5` aplicados |
| **Output** | `evidence/PT-096/salidas/inversa.txt` con el recuento por cambio |
| **Validación** | caen los previstos y **solo** ésos |
| **Archivos** | ninguno del árbol — se revierte y se restaura |
| **Estado** | PENDIENTE |

> **Si la inversa sale en cero, no es un verde: es un aviso.** Es lo que destapó en `PT-095` que
> una entrada `CORRIGE` excusaba el ledger entero. Cada uno de los cuatro cambios se retira por
> separado; si alguno no hace caer ningún caso, ese cambio no está probado.

## `PT-096.7` · los documentos `S-5`

| | |
|:---|:---|
| **Objetivo** | `AC-07` |
| **Input** | `strategy.md` §2 `S-5` |
| **Output** | `C5` de `CASOS-DE-USO` cubre las **dos** formas de perder el rastro; la nota del paso 4 del `MANUAL` dice qué hacer si aún no hay ref durable |
| **Validación** | `verify-suite` sin errores · la omisión de `README`/`CLAUDE.md` **declarada** en `HISTORY` |
| **Archivos** | `docs/methodology/CASOS-DE-USO.md` · `docs/methodology/MANUAL.md` |
| **Estado** | PENDIENTE |

## `PT-096.8` · medir el tablero y republicar

| | |
|:---|:---|
| **Objetivo** | `AC-05` · la cifra real, con denominador |
| **Input** | el arreglo completo |
| **Output** | `salidas/tablero-antes.txt` y `tablero-despues.txt` · `tracker abrir --aplicar` |
| **Validación** | 0 cuerpos con `null`; 0 rutas mudas con ref durable; 0 listas en prosa |
| **Archivos** | ninguno — es medición y publicación |
| **Estado** | PENDIENTE |

---

## Rama propuesta — **NO se crea aquí** (`FDGE-R13`, `FDGE-R19`)

```
bug/alberto-martinez/PT-096-un-enlace-que-falta-no-es-un-enlace-roto
```

Nace de `trabajo` en `PHASE 5`. La rama actual —`chore/alberto-martinez/PT-096-apertura`— es la de
la **apertura**, no la de la tarea, siguiendo el precedente de `EP-019`.

## Orden y por qué

```
.1  ->  .2 .3 .4 .5  ->  .6  ->  .7  ->  .8
```

`.2`…`.5` son independientes entre sí —tocan funciones distintas del mismo archivo— pero **todas**
dependen de `.1`, porque sin el rojo no hay forma de saber que el verde significa algo. `.6` va
después de las cuatro y antes de documentar: si la inversa descubre que un cambio no estaba
probado, lo que se escriba en `.7` sería falso.
