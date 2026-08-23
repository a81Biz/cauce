# `PT-131` — Estrategia   `PHASE 3`

> Los caminos descartados, con su por qué.

---

## Los cuatro caminos

```
A  meter DONE en ESTADOS_TERMINALES
B  bajar o quitar el umbral de sellado
C  retag de v12.0.0 sobre main
D  cambiar el OBSERVABLE: del registro del tag al ARBOL del tag
```

### `A` — que `DONE` cuente como terminal

**Descartado.** `SUITE-R08` lo declara explícitamente: *«`DONE` no está en ella, y no es un
olvido: un `PT` en `DONE` espera `G4` y sigue vivo»*. `ESTADOS_TERMINALES` la comparten
`FDGE-R52`, `FDGE-R19` y `SUITE-R08` desde una sola constante (`SUITE-R38`). Tocarla arregla este
síntoma y **apaga seis comprobaciones** que se eximen de lo terminal.

Arreglar un falso positivo rompiendo la constante que evita cuatro copias es un mal negocio.

### `B` — bajar el umbral

**Descartado.** Es apagar la compuerta en vez de arreglar su medida. Y no resuelve nada: con
umbral 20 el mismo defecto vuelve al lote 21.

### `C` — retag de `v12.0.0` sobre `main`

**Descartado.** Mover un tag publicado es reescritura de historia (`SUITE-R06f`), y el paquete de
npm apunta a `5b184af`: el tag y el tarball dejarían de coincidir. Peor que el problema.

### `D` — el observable pasa a ser el árbol — **ELEGIDO**

El hecho que la regla persigue está escrito en su propio comentario: *«lo que ya viajó en algún
tag»*. Eso se mide en el **árbol** del tag, no en lo que su `REGISTRY.json` declaraba.

```
hoy    git show <tag>:REGISTRY.json   ->  qué DECLARABA el tag
así    git ls-tree <tag> changes/     ->  qué CONTIENE el tag
```

## Lo medido antes de elegir

```
candidatas terminales de lotes cerrados        112
  de esas, con trabajo en changes/             110
  de esas, NO dentro de v12.0.0  = DEUDA         0
umbral                                           3
                                          -> G2 se desbloquea, y la regla sigue viva
```

**Un solo comando de git** para las 131 entradas: `git ls-tree --name-only <tag> changes/`. No hay
un `cat-file` por tarea.

### Las dos que el observable ingenuo contaba mal

Con «está el directorio dentro del tag» a secas salían **dos**: `PT-025` y `PT-032`. Ninguna de
las dos tiene `changes/` **en ningún sitio**:

```
PT-025  DEFERRED  ·  aplazada, nunca se trabajó
PT-032  CLOSED    ·  de EP-008, cerrada sin artefactos
```

Una tarea **sin trabajo no tiene nada que sellar**. El observable final tiene dos condiciones, no
una: *tiene trabajo en el árbol actual* **y** *ese trabajo no está en el tag más alto*.

## La estrategia, en tres movimientos

| # | Qué | Dónde |
|:--|:---|:---|
| `E-1` | Una función **única y exportada** que derive «lo sellado» del árbol del tag | `patrones.mjs`, junto a `sinSellar` |
| `E-2` | Los **dos** llamadores la usan: `verify-fdge` y `tracker sellar` dejan de tener cada uno su copia | `verify-fdge.mjs:1805` · `tracker.mjs:2995` |
| `E-3` | La inversa que prueba que la regla **sigue bloqueando** trabajo real sin sellar | `selftest.sh` |

**`E-2` es la mitad menos visible y la que más importa.** La lectura del registro del tag está
**duplicada** en los dos archivos, con el mismo comentario de `PT-087` copiado palabra por
palabra. Arreglar uno solo dejaría a `tracker sellar` y a `verify-fdge` midiendo distinto sobre
el mismo hecho — que es `SUITE-R38`, y es cómo nació este defecto.

## El riesgo declarado

**Si el observable nuevo se equivoca, se equivoca hacia el verde**: contaría como sellado algo que
no lo está, y la compuerta dejaría de proteger. Por eso `E-3` no es opcional y su inversa es la
que decide si esta tarea vale: **una tarea terminal cuyo `changes/` no viajó en ningún tag tiene
que seguir contando.**

## Lo que esto NO arregla

Que el estado terminal de un lote llegue a la rama por defecto **después** del tag. Eso es la
causa de fondo, es `PT-121`, y la cita es recíproca. `PT-131` hace que esa demora deje de bloquear
`G2`; no hace que deje de ocurrir.
