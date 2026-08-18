# PT-056 — El árbol corresponde al checkpoint

> Tarea de la implementación abierta `EP-015` (`FDGE-R51`).

```yaml
---
id: PT-056
type: CHORE
epic: EP-015
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.1.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Al comenzar una nueva sesión, el framework debe validar el estado antes de continuar… Si existe
> discrepancia: `STATE_MISMATCH`. La tarea no debe continuar automáticamente.»

Que al retomar se compruebe que el árbol **es el que el checkpoint describe**, no solo que el `sha`
declarado exista.

`PT-052` puso el `sha` y `verify-fdge` exige que sea **alcanzable**. Eso impide la avería obvia —un
checkpoint que apunta a nada— y **no** impide la peligrosa: un `sha` real que describe un árbol que
ya no existe. Ése miente **sin que nada lo note**.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Al retomar se compara el árbol con lo que el checkpoint declara | selftest |
| AC-02 | Un `HEAD` distinto del `sha` declarado **detiene**: no continúa sobre una suposición | selftest |
| AC-03 | Un árbol **sucio** no es una discrepancia: es lo normal mientras se trabaja | selftest |
| AC-04 | La discrepancia dice **cuál** es, no solo que la hay | selftest |
| AC-05 | Reanudar es una decisión **humana** cuando hay discrepancia (`SUITE-R06`) | selftest |

`AC-03` es el que separa esta tarea de una que molesta: **cambios sin commitear son el estado
normal de una tarea en curso**, y tratarlos como discrepancia haría que el aviso se ignorara desde
el primer día.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: un checkpoint cuyo `sha` **no es** el `HEAD` actual detiene la reanudación
> diciendo **qué** cambió, y un árbol con cambios sin commitear **no** la detiene.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| El presupuesto de sesión y su compuerta | PT-059 |
| `SESSION.json` y el handoff derivado | PT-060 |
| Reparar automáticamente una discrepancia | — |
| Comparar el **contenido** de los archivos, no solo el `sha` y el estado de git | — |

La tercera lleva `—` porque **no se va a hacer**: `SUITE-R06` deja en manos humanas lo que no se
puede deshacer, y decidir si un árbol divergente se descarta o se conserva es exactamente eso.

La cuarta también: comparar contenido archivo a archivo diría *qué* cambió con más detalle y
costaría leer el árbol entero en cada arranque — el gasto que este lote existe para reducir.

## 5. Firma

```
Firmado por lote: EP-015
```
