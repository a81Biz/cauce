# PT-134 — no hay forma de declarar un `AC` caído

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).
>
> **Nació aplazada en `EP-020`** y la retomó `tracker retomar` el 2026-08-24 (`PT-137`, `AC-06`):
> este intake es su `PHASE 1`, que hasta entonces no existía porque un aplazado está exento de
> artefactos (`SUITE-R44`).

```yaml
---
id: PT-134
type: CHORE
epic: EP-021
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-23
structural: no
suite_version: 13.0.0
origen_parada: PT-113
---
```

## 1. Qué se quiere   `[HUMANO]`

`FDGE-R15` exige un `TS` a **todo** `AC`. Cuando un criterio **decae** —deja de aplicar porque el
mundo cambió debajo— no puede tener uno, y el marco no tiene forma de declararlo. Quedan dos
salidas y las dos son malas:

```
fingir que sigue verde      un AC-nn con verified: true sobre algo que ya no se comprueba
bloquear la tarea           un Orphan Criterion permanente que nadie puede cerrar
```

Salió de `PT-113`: su `AC-06` decayó con el reanclaje a la `13.0.0`, y hubo que elegir.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un `AC` puede declararse **caído** con motivo, y eso no es un `Orphan Criterion` | un caso con un manifest que lo declara |
| AC-02 | Un `AC` caído **no** cuenta como verificado: no se confunde con verde | un caso que comprueba que el conteo lo excluye |
| AC-03 | Declararlo caído **exige motivo**: sin él, falla | un caso sin motivo |
| AC-04 | El `AC-06` de `PT-113` se declara caído en su evidencia, sin reescribir lo afirmado | `FDGE-R29`: entrada `CORRIGE`, no borrado |
| AC-05 | `FDGE-R15` declara el caso, y `LEXICON` el vocabulario | `verify-suite` sin errores |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: un `AC` puede declararse caído con motivo, no cuenta como verificado, y el
> `AC-06` de `PT-113` está declarado así en vez de fingido o bloqueante.

## 4. Qué NO entra   `[AGENTE]`

- OUT: decidir automáticamente que un `AC` ha decaído. Eso lo sabe quien conoce el cambio; el
  marco sólo le da dónde escribirlo.
- OUT: revisar los `AC` de las 143 tareas buscando caídos. Retrofechar es lo que `FDGE-R52` y
  `CE-014` desaconsejan.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **Esta tarea es la prueba de `PT-137`.** Estuvo aplazada bajo `EP-020`, que está `CLOSED`, y
  ningún comando podía sacarla. Que exista este archivo es el `AC-06` de `PT-137` cumplido.
- **El riesgo es evidente y hay que decirlo:** «declarar un `AC` caído» puede convertirse en la
  salida cómoda para todo criterio incómodo. Por eso `AC-03` exige motivo y `AC-02` impide que se
  cuente como verde. Lo que **no** se puede mecanizar es si el motivo es honesto (`SUITE-R26`).
