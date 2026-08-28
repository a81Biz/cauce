# `PT-196` — Lo que ocurre DESPUES de G4 no tiene dueno en el protocolo de cierre de lote

```yaml
---
id: PT-196
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: READY
phase: 1
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`verify-fdge --gate G4`, cerrando `EP-025`, bloqueó sobre **una fila que no se puede resolver**:

```
✗ SUITE-R45  EP-025: 1 fila(s) sin resolver en G4: «El tag y la publicación».
```

| Regla | Qué dice |
|:---|:---|
| `SUITE-R45` | La fila se resuelve **en** `G4` |
| `SUITE-R06a` | El tag va **después** del merge |

`G4` **es** el merge. En `G4` el tag no puede estar `HECHO` ni por definición. **No hay respuesta
correcta.**

## 2. Lo que hay debajo   `[HUMANO]`

`PHASE 9` termina en el merge. Todo lo que viene después **no pertenece a ninguna fase**:

```
integrar → cerrar → cierre del lote → proyectar → tag → borrar ramas
```

Está en `PHASES.md` como una lista de comandos: sin fase que lo posea, sin artefacto que lo cierre y
sin compuerta que lo mire.

**Y su consecuencia, medida al cerrar `EP-025`:**

```
tracker integrar  → escribe INTEGRATED en la rama de trabajo
tracker cerrar    → EXIGE que INTEGRATED este YA en main   (SUITE-R46)
```

**Cerrar un lote pasa por `G4` dos veces.** El `HANDOFF` lo tenía como hallazgo suelto —«el ciclo de
dos viajes al tablero»— **sin tarea que lo reclamara**, desde `PT-186`.

Lo nombró el firmante por su causa: *«no está contemplado dentro del marco la forma de "terminar" la
épica. Es decir, se termina hasta que está en `main` con todo lo necesario»*.

## 3. Cómo se arregla, y cómo NO

**No** quitando la fila del tag de `SUITE-R45`: la pregunta es legítima; lo que está mal es
**cuándo** se exige.

**Sí** dando dueño a lo posterior a `G4`. Candidatos —y la tarea elige—: una `PHASE 10` de cierre
distinta de `Rollback`, un estado del lote entre `G4` y `CLOSED`, o que `SUITE-R45` distinga las
filas que se resuelven **en** `G4` de las que se resuelven **al cerrar**.

## 4. Lo que NO promete   `SUITE-R26`

**No promete eliminar el segundo viaje a `main`.** Puede que sea inevitable —el estado terminal tiene
que estar en la rama por defecto para cerrar un issue, y eso es `SUITE-R46`, que existe por una
avería real—. Lo que sí promete es que **esté declarado** en vez de descubrirse cada vez.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Cada acto posterior a `G4` pertenece a una fase o a un comando **declarado** | `TS-01` |
| `AC-02` | Ninguna fila de `SUITE-R45` exige en `G4` algo que otra regla prohíbe antes | `TS-02` |
| `AC-03` | El ciclo de dos viajes está **resuelto o declarado** con su motivo | `TS-03` |

## Cómo termina   `FDGE-R53`

> Termina cuando: cerrar un lote se puede **ejecutar leyendo el marco**, sin recordar nada, y ninguna
> de sus reglas contradice a otra por el camino.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
