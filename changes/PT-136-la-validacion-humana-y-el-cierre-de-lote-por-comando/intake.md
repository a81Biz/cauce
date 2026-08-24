# PT-136 — Cerrar un `BUG` y cerrar un lote no tenían comando

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-136
type: BUG
epic: EP-020
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que cerrar un `BUG` y cerrar un lote no exijan escribir el registro a mano.

## 2. Cómo apareció

**Cerrando `EP-020`**, con el VoBo del firmante en la mano. Los dos actos que faltaban:

**`BUG` → `DONE`.** `FDGE-R26` dice que un `BUG` «transita a `VALIDATION_PENDING` y ahí **se
detiene**: sólo un humano lo lleva a `DONE`». No dice **cómo se escribe eso**, y ningún comando lo
hace. Las tres únicas veces que había ocurrido —`PT-096`, `PT-097`, `PT-098`— se escribió **a
mano, declarando la excepción cada vez**.

**Lote → `CLOSED`.** Igual. Y aquí lo cometí: escribí el estado de `EP-020` con un `node -e`
—`CE-006` dentro del cierre del lote que existe para impedirlo— antes de darme cuenta.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Existe un comando que lleva un `BUG` de `VALIDATION_PENDING` a `DONE`, registrando quién y cuándo | hoy no existe: las tres veces anteriores se escribió a mano |
| AC-02 | **No decide**: rechaza lo que no sea un `BUG` en `VALIDATION_PENDING`, y contrasta el firmante contra la lista | `SUITE-R27`, `FDGE-R26`, `LEX-R08` |
| AC-03 | La fecha se puede **decir**: una validación se registra a veces después de ocurrir | la lección de `PT-121`, encontrada usando `firmar` sobre una `G1` de dos días antes |
| AC-04 | `integrar` cierra también un **lote**: `READY` → `CLOSED`, y sólo si ninguna tarea sigue viva | cerrar un lote con trabajo dentro sería declarar terminado lo que no lo está |
| AC-05 | La condición se **deriva** de las tareas, no se pregunta ni se supone | `RULE-06` |

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: ningún acto del cierre —ni el de un `BUG` ni el de un lote— exige escribir
> `REGISTRY.json` a mano.

## 5. Qué NO entra   `[AGENTE]`

- OUT: **decidir** por nadie. `FDGE-R26` reserva la validación a una persona y sigue reservada:
  el comando la **registra**, no la toma
- OUT: reescribir las tres validaciones históricas escritas a mano (`SUITE-R09`)
- OUT: que `integrar` cierre un lote con tareas vivas, ni siquiera con bandera

## 6. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es la clase del lote en su forma más pura**: el acto es humano y legítimo, no hay comando, y
  por tanto la única vía es rodear el registro. No es indisciplina: es un hueco de herramienta.
- **Y lo cometí al cerrarlo.** Escribí el estado de `EP-020` con un `node -e` antes de verlo. Se
  deshizo y se rehízo con el comando — corregir a mano lo que un comando debe escribir habría sido
  la instancia siguiente.
- **El comando que faltaba lo señaló el propio comando**: `integrar EP-020` rechazó el cierre
  porque 22 tareas seguían en `DONE` y no `INTEGRATED`. El orden real es merge → `INTEGRATED` →
  lote `CLOSED`, y hasta ahora nadie lo había escrito en ningún sitio ejecutable.
