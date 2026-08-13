# PT-004 — Diseño   `PHASE 4`

## La decisión, y por qué esta y no otra

**Consultar la fase que ya se calcula, en vez de introducir una fuente nueva.**

`verify-fdge.mjs:757` resuelve la fase con una precedencia que ya existe y que el arnés
ejerce: `phase:` del YAML del intake, si no `REGISTRY.allocations[].phase`, si no nada. El
diseño no la cambia. Añade una única cosa: **distinguir «fase 0» de «fase no declarada»**.

Hoy el `?? 0` funde los dos casos en uno. Un PT recién abierto y un PT cuya fase nadie
escribió producen el mismo valor, y sobre ese valor no se puede decidir nada honestamente
(`RULE-06`). El diseño separa:

```
faseDeclarada  →  número  ·  el PT dice en qué fase está
               →  null    ·  nadie lo dice — SIN EVALUAR, con aviso
```

Es lo mínimo que hace la comprobación posible sin inventar un valor.

## Umbrales, y de dónde salen

No son criterio del agente: salen de `CORE.md` §Procedimiento por fase, que declara qué
artefacto produce cada fase.

| Artefacto | Fase que lo produce | Se exige desde |
|:---|:---|:---|
| `discovery.md` | `PHASE 2` (`2-B`) | `fase >= 2` |
| `traceability.md` | `PHASE 4` | `fase >= 4` |

`RULE-01` en su forma práctica: el umbral se deriva del procedimiento, no se decide aparte.

## Qué NO cambia

- `FDGE-R15` y `FDGE-R42` siguen siendo obligatorias, con el mismo texto en `RULES.md`. No se
  toca la norma: se corrige **cuándo** la comprueba la herramienta.
- Las comprobaciones **internas** de la matriz —`AC` sin `TS`, `Test`/`Evidencia` desde
  `PHASE 6`— quedan intactas. Ya distinguen fase correctamente.
- `afterPhase6` sigue infiriéndose de `manifest.json`. Ahí la inferencia es correcta y
  sustituirla por la fase declarada sería un cambio sin defecto que lo motive.
- `FDGE-R52` no se toca: es de `PT-001` (scope lock, `FDGE-R20`).

## Forma de la salida   `RULE-02` · `RULE-07`

Tres estados distinguibles, no dos:

```
✓ FDGE-R15   PT-00X: traceability.md presente, 4 criterios con TS asignado.
✗ FDGE-R15   PT-00X: está en PHASE 4 y falta traceability.md. …
! FDGE-R15   PT-00X: aún sin traceability.md (se escribe en PHASE 4; el PT está en PHASE 2).
! FDGE-R15   PT-00X: no declara fase — la exigencia de traceability.md queda SIN EVALUAR.
             Declara «phase: N» en el intake o «phase» en su allocation de REGISTRY.json.
```

El cuarto es el que cumple `RULE-06`: no aprueba y no bloquea; **dice que nadie miró**, que es
distinto de decir que está bien. Y `RULE-07`: nombra el campo y los dos sitios donde escribirlo.

Se usa el canal de avisos que ya existe (`warn`), no uno nuevo. Los avisos no cambian el
código de salida, así que un PT en fase temprana deja de romper CI sin que la regla se relaje.

## Resolución de `G2`   `FDGE-R13`

```
Compuerta:   G2 · Proposal
Veredicto:   APROBADA
Fecha:       2026-08-13
Resuelta por: Alberto Martínez
Escrita por:  el agente, POR DELEGACIÓN — «adelante, firma a mi nombre» (2026-08-13)

Cubre también SUITE-R06e para este PT: la autorización explícita para modificar
docs/methodology/tools/verify-fdge.mjs y selftest.sh dentro del alcance declarado en
tasks.md. Fuera de ese alcance, no.

NO cubre: G3 —el cierre de un BUG no lo automatiza ningún modo (SUITE-R06b, FDGE-R26,
EXEC-R05)— ni G4 (EXEC-R04, SUITE-R06a).
```

A partir de aquí se pueden escribir líneas de código. Antes de aquí, cero.
