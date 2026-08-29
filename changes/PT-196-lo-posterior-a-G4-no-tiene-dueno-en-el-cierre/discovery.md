# `PT-196` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. El defecto: está descrito, y no es de nadie

```
docs/methodology/PHASES.md · dentro de «### PHASE 9 · Integration — G4»
```

```
EL VIAJE DE VUELTA · lo que ocurre DESPUES del merge, y lo escribe un comando  [PT-121]
      node tools/tracker.mjs integrar PT-NNN --aplicar
      node tools/tracker.mjs cerrar --aplicar
      node tools/tracker.mjs proyectar --publicar
```

Más el tag y el borrado de ramas, en el bloque de arriba. **Seis actos**, escritos como **prosa
dentro de una fase que ya terminó**: `PHASE 9` cierra en el merge.

Ninguna fase los posee. Ningún artefacto los cierra. Ninguna compuerta los mira. Se ejecutan **de
memoria**, y por eso fallan siempre en el mismo sitio.

## 2. Las tres averías medidas al cerrar `EP-025`

### 2.1 · Una fila que no se puede resolver

```
✗ SUITE-R45  EP-025: 1 fila(s) sin resolver en G4: «El tag y la publicación».
```

| Regla | Qué dice |
|:---|:---|
| `SUITE-R45` | La fila se resuelve **en** `G4` |
| `SUITE-R06a` | El tag va **después** del merge |

`G4` **es** el merge. En `G4` el tag no puede estar `HECHO` ni por definición. **No hay respuesta
correcta**, y la única salida fue mover la fila a esta tarea.

### 2.2 · El ciclo de dos viajes

```
tracker integrar  → escribe INTEGRATED en la rama de trabajo
tracker cerrar    → EXIGE que INTEGRATED este YA en main   (SUITE-R46)
```

**Cerrar un lote pasa por `G4` dos veces.** El `HANDOFF` lo tenía anotado como hallazgo suelto —«el
ciclo de dos viajes al tablero»— **sin tarea que lo reclamara**, desde `PT-186`.

**`SUITE-R46` ya lo explica**, y con precisión: *«el apunte `DONE → INTEGRATED` se escribe después de
integrar y sólo llega a la principal en el merge siguiente»*. **Está en la regla y no en el
procedimiento**, así que quien ejecuta `PHASES.md` lo descubre chocando.

### 2.3 · Nada sabe qué toca

`tracker siguiente EP-026` responde `PHASE 1 · Intake`, que es la fase del **intake del lote** — no
tiene nada que decir sobre el cierre. La herramienta que existe para contestar «qué toca ahora»
(`SUITE-R48`) se queda muda justo donde más se olvida.

## 3. Por qué NO es una `PHASE` nueva

Las fases son **del `PT`**: `LEXICON` declara 0 a 10 y `PHASE 10` es `Rollback`. Meter aquí una fase
obligaría a renumerar o a inventar vocabulario que `LEX-R21` no admite.

**El viaje de vuelta es del LOTE.** Un lote tiene su propio ciclo —`DRAFT → READY → CLOSED`— y su
propio comando, `tracker cierre`. Ahí está el dueño, y no hay que inventarlo.

## 4. Lo que ya existe y se puede usar

| Pieza | Qué hace hoy |
|:---|:---|
| `tracker cierre EP-NNN` | publica el comentario de cierre y comprueba los estados terminales |
| `tracker siguiente` | contesta «qué toca», **derivado** del registro (`SUITE-R48`) |
| `SUITE-R46` | ya explica el porqué del doble viaje |
| `SUITE-R45` | ya tiene el concepto de fila resuelta |

No hay que construir un mecanismo: hay que **darle dueño a los seis actos** y **quitar la
contradicción**.

## 5. Lo que NO está roto

- **`SUITE-R46`.** Su exigencia es correcta y nació de una avería real. El doble viaje es su
  **consecuencia**, no su defecto.
- **`SUITE-R45`.** Preguntar qué se resuelve al cerrar es lo correcto. Lo que está mal es **cuándo**
  lo exige.
