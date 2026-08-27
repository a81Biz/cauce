# `PT-164` — renumerar una regla no es una operación, y una cita al ID equivocado pasa en verde

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-164
type: CHORE
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué pasa

**Renumerar una regla se hace a mano, y sus citas se quedan atrás.**

Ocurrió dos veces **en dos días**:

- `PT-148` renumeró `LEX-R33`/`LEX-R34` a `LEX-R35`/`LEX-R36` al descubrir que los IDs estaban
  ocupados. El cambio alcanzó también a `RULES.md:94`, y `SUITE-R44` quedó citando `retomada` como
  `LEX-R35` en un sitio y como `LEX-R33` en otro, **dentro de la misma regla**.
- `PT-163` renumeró `EXEC-R08` a `EXEC-R15` **hoy**, y hubo que comprobar a mano quién lo citaba.

**Y lo que ninguna herramienta caza**: `verify-suite` comprueba que una regla citada **exista**.
`LEX-R35` existe — sólo que es otra. **Una cita al ID equivocado-pero-real pasa en verde**,
`build-core` la copia, y `CORE.md` la publica al agente como si fuera cierta.

## 2. Criterios de aceptación

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | Existe un **comando** que renumera una regla y **mueve todas sus citas** | fixture: se renumera y ninguna cita queda atrás |
| `AC-02` | El comando **se niega** si el ID destino ya existe | fixture: destino ocupado → falla |
| `AC-03` | El comando **dice qué va a tocar** antes de tocarlo, y sólo escribe con `--aplicar` | ejecución sin la bandera |
| `AC-04` | Renumerar **no cambia** el número de reglas de `CORE.md` | antes y después |
| `AC-05` | Lo que **no** se puede detectar se declara: una cita a un ID equivocado pero real | `SUITE-R26` |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: renumerar una regla es **un comando** que mueve sus citas, se niega si el
> destino está ocupado, y lo que sigue sin poder detectarse está escrito.

## 4. Qué NO entra

- **OUT**: detectar una cita a un ID **equivocado pero real**. No es mecanizable sin saber qué
  quiso decir quien la escribió. Se declara (`AC-05`).
- **OUT**: renumerar automáticamente cuando se detecte un ID duplicado. Elegir el número nuevo es
  humano; el comando lo **ejecuta**, no lo decide.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-02` es el que evita que la herramienta cause el defecto que arregla.** Renumerar sobre un
  ID ocupado es exactamente lo que hizo `PT-148`, y un comando que lo permitiera lo haría más
  rápido y en más sitios.

- **`AC-03` no es cortesía.** `SUITE-R06e` cubre `docs/methodology/`: un comando que reescribe
  reglas en varios archivos tiene que poder mirarse antes de correr.
