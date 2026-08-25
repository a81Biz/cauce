# PT-137 — `DEFERRED` no tiene transición de vuelta

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-137
type: BUG
epic: EP-021
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

Nace de una pregunta del firmante sobre `PT-134`: *«como aplazado, ¿de qué sirve? ¿cuándo se
retoma? el mismo issue no indica cuándo se tomará ni qué pasará con ése»*.

Medida contra el código, la respuesta es **nunca**:

- `SUITE-R44` declara que un aplazado queda **exento de artefactos** — no tiene intake.
- `integrar` es el único comando que acepta un estado destino arbitrario, y **exige** que el
  intake declare `status:` (`tracker.mjs:4148`).
- Las únicas cuatro asignaciones de estado del tracker (`3279`, `3285`, `4214`, `4284`) escriben
  `DONE`, `VALIDATION_PENDING` y `READY`. **Ninguna toca `DEFERRED`.**

Es un lazo cerrado: **la regla que pone la tarea en el tablero es la misma que la deja
inalcanzable**. Retomar `PT-134` hoy exige escribir `REGISTRY.json` a mano — el acto que
`SUITE-R08` y todo este marco existen para impedir. Es `CE-006`: el acto fuera del comando.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker retomar PT-NNN` lleva un `DEFERRED` a un estado vivo **sin exigir intake**, y el destino se **deriva** de si el intake existe | dos casos: aplazado sin intake → `DRAFT`/`PHASE 1`; aplazado con intake → `READY` |
| AC-02 | Retomar es una **decisión**, no un efecto: exige firmante contrastado contra `CLAUDE.md` y acepta la fecha real | dos casos: firmante válido escribe; firmante inventado falla |
| AC-03 | Se niega sobre lo que no está `DEFERRED`, y lo dice con el estado que encontró | un caso por cada estado terminal y uno vivo |
| AC-04 | Puede reasignar la épica al retomar, porque un aplazado sin lote que responda vuelve al limbo | un caso con `--epica` y otro sin ella |
| AC-05 | Deja rastro contrastable: quién, cuándo, y de qué aplazamiento venía | el registro declara `retomada` y el issue lo publica |
| AC-06 | `PT-134` se retoma **con el comando**, y ese acto es la prueba | la salida real, no un fixture |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `PT-134` deja de estar `DEFERRED` **por comando**, con su firmante y su fecha
> en el registro, y ninguna línea de `REGISTRY.json` se ha escrito a mano.

## 4. Qué NO entra   `[AGENTE]`

- OUT: exigir condición de reentrada o fecha de revisión a un aplazado. Es `PT-138`: aquí se
  construye **la puerta**, no el requisito de usarla.
- OUT: caducar un aplazado viejo. Es `PT-139`.
- OUT: crear el intake de lo retomado. Retomar devuelve la tarea a `PHASE 1`; escribir su intake
  **es** `PHASE 1` y no lo hace un comando de estado.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **El defecto lo destapó usar el marco, no leerlo.** Al intentar mover `PT-134` a este lote
  descubrí que ningún comando podía, y que la única vía era la mano. `EP-020` cerró por la misma
  ruta con `tracker validar`: la carencia se ve **al chocar con ella**.
- **`SUITE-R44` no está equivocada en lo que dice**, sino en lo que calla. Que un aplazado esté
  exento de artefactos es correcto y deliberado. Lo que falta es que esa exención no lo deje
  fuera del alcance de todos los comandos a la vez.
- **`LEXICON` §5.1 ya declaraba `DEFERRED --> READY`**, y ningún comando podía ejecutarla: la
  transición estaba escrita y nada la echaba en falta (`CE-007`). Pero §5.1 declara también
  `READY --> DEFERRED`, mientras `SUITE-R44` dice que un aplazado no tiene intake: **eran dos
  aplazados distintos con el mismo nombre**. Por eso el destino se deriva y no se elige.
- **Hay un tercer hallazgo que no es de esta tarea y se declara:** `LEX-R27` dice que un lote
  **no lleva `type`**, y `FDGE-R19` manda nombrar la rama de lote «con el `type` del propio
  lote». Se contradicen, y `LEXICON` manda sobre `RULES` (`LEX-R21`). Por eso `EP-021` no tiene
  nombre de rama derivable y esta tarea carga el commit de apertura del lote. Va a `PT-142`.
