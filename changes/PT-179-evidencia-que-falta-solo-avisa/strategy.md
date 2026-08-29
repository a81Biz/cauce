# `PT-179` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: usar el helper que ya existe

```js
const exigible = (regla, desde, artefacto) => { … }      // verify-fdge.mjs:2213
```

Ya está escrito, ya tiene las tres salidas que `RULE-02` pide, y ya lo usan `FDGE-R42` y `FDGE-R15`.
Se aplica a **`FDGE-R23`**, **`FDGE-R25`** y **`FDGE-R29`**.

**No se sustituye `exigibleEn(gate, …)`: se suma.** Bajo `--gate G4` la exigencia por compuerta es
correcta y sigue. Lo que se añade es la exigencia **por fase**, para cuando no hay compuerta de por
medio — que es como corre `npm run verify` y como corre CI.

```
exigibleEn(gate, …)  ||  exigible(regla, desde, artefacto)   ->  falla
```

Para `FDGE-R29`, que vive en otra función, la fase **viaja** en el objeto de opciones. Dos líneas de
llamada.

---

## Los caminos descartados

### 1 · Escribir un helper nuevo

**Descartado: habría dos formas del mismo criterio.** `SUITE-R38` existe para esto — el mismo juicio
escrito dos veces diverge. Y el existente ya resuelve el caso difícil (fase ausente ⇒ `SIN EVALUAR`),
que es el que se hace mal si se reescribe deprisa.

### 2 · Convertir el aviso en error siempre

**Descartado: pondría en rojo a todo `PT` recién abierto.** El comentario de `:2206` ya lo explica:
CI corre `verify-fdge --all`, así que un repositorio no podría tener trabajo en curso y la compuerta
en verde a la vez. *«Una compuerta que se pone roja sobre comportamiento correcto enseña a
saltársela.»*

### 3 · Arreglar sólo `FDGE-R23`

**Descartado por incoherente.** `FDGE-R25` usa `afterPhase6` —un proxy que deduce la fase de que
exista el manifest— y `FDGE-R29` no mira nada. Arreglar una dejaría a las otras dos diciendo *«se
escribe en `PHASE 8`»* a una tarea que **ya declara estar en 8**. Son el mismo defecto.

### 4 · Conservar `afterPhase6` como está en `FDGE-R25`

**Descartado, y merece explicación.** `afterPhase6` funciona **cuando el manifest existe**. Falla
justo en el caso peor: una tarea en `PHASE 7` **sin manifest y sin self-review** se escapa entera,
porque el proxy que debía delatarla también falta. Se conserva la condición —no rompe nada— y se le
**suma** la fase, que es el hecho.

### 5 · Exigirlo desde el registro en vez de desde el intake

**Descartado: `faseDeclarada` ya resuelve la precedencia** y `SUITE-R35` ya gobierna la divergencia
entre las dos fuentes. Reabrir eso aquí sería tocar una decisión ajena a este defecto.

---

## Lo que este arreglo NO promete   `SUITE-R26`

**No revisa todas las reglas que conceden sin mirar la fase.** Cubre las tres que exigen artefactos
de evidencia y persistencia, que son las que se midieron. Si al ejecutarlo aparecen otras, se
declaran — no se arreglan de paso.

## La comprobación inversa

Con el arreglo puesto, una tarea en `PHASE 4` sin evidencia debe seguir dando **aviso**, y una sin
fase declarada debe seguir **sin evaluarse**. Un arreglo que convierta las tres salidas en una sola
—error siempre— pasaría el caso de `PHASE 7` y rompería el marco.
