# PT-002 — Diseño   `PHASE 4`

## La decisión

**El conjunto de herramientas con compuerta se deriva; no se escribe.**

`audit` ya sabe qué reglas existen (`RULES.md`) y qué herramientas las citan (`tools/`). Le
falta un tercer hecho: **quién ejecuta cada herramienta**. Ese hecho está en el repositorio
—`package.json`, `.github/workflows/`, `bin/cauce.mjs`— y se lee, no se declara.

```
RULES.md   ──> qué reglas hay
tools/     ──> qué herramienta cita cada regla
package.json · workflows · bin/cauce.mjs  ──> qué herramienta ejecuta una compuerta
                                              ↓
                              citadas · ejecutadas · total
```

Escribir la lista a mano la dejaría atrás el día que se añada un paso a CI — la avería que
este repositorio arrastra en todos los sitios donde alguien copió un hecho (`RULE-01`,
`SUITE-R40`). La derivación es lo que hace que la cifra siga siendo cierta sin mantenimiento.

## Los tres estados, y por qué tres

```
ejecutada      la cita una herramienta que alguna compuerta ejecuta
citada         la cita una herramienta que ninguna compuerta ejecuta
sin verificar  no la cita ninguna herramienta
```

Dos no bastan. La franja del medio es donde vivió `SUITE-R35` durante tres versiones: regla
HARD, herramienta escrita, nadie que la corriera. Fundirla con «ejecutada» oculta el hallazgo;
fundirla con «sin verificar» miente sobre el trabajo hecho.

Es la misma forma que `PT-004` introdujo para la fase y `PT-001` para el acceso: **el estado
intermedio se declara**.

## Forma de la salida   `RULE-02` · `RULE-07`

```
Cobertura mecánica de las reglas   (SUITE-R26 · aspira, no exige)
  ejecutadas por una compuerta      85 / 167    · HARD 64 / 134
  citadas sin compuerta que las corra   8       → --sin-compuerta las enumera
  sin verificador                      74       → --sin-verificar las enumera
```

Y la frase final deja de ser absoluta:

```
antes   Cobertura completa: sin huecos.
ahora   Sin huecos en los elementos auditados. Cobertura mecánica de reglas: 85/167.
```

El adjetivo se queda **solo sobre lo que sí se comprobó**, que es lo que siempre midió.

## Si no se puede derivar

`RULE-06`: si `package.json` o los workflows no se pueden leer —un proyecto destino puede no
tener CI—, el conjunto queda **no evaluable** y se dice:

```
  ejecutadas por una compuerta   SIN EVALUAR — no se pudo leer quién invoca las herramientas
```

No se asume `0` (mentiría a la baja) ni el total (mentiría a la alta). Mismo criterio que
`PT-001` aplicó al acceso y `PT-004` a la fase.

## Qué NO cambia

- **El código de salida.** La cobertura informa; los huecos siguen siendo lo que bloquea.
- **La comprobación por componente.** Sigue fallando si un componente tiene cero: caza un caso
  que la cifra global no caza.
- **`SUITE-R26`.** Conserva su texto. `RULES.md` y `CORE.md` sin tocar.
- `audit` no escribe (`RULE-05`) y no gana dependencias (`RULE-04`).

## Resolución de `G2`   `FDGE-R13`

```
Compuerta:    G2 · Proposal
Veredicto:    APROBADA
Fecha:        2026-08-13
Resuelta por: Alberto Martínez
Escrita por:  el agente, POR DELEGACIÓN — «te autorizo a que firmes a mi nombre», reafirmada
              sobre esta propuesta concreta: las dos cifras, y sin umbral.

Cubre SUITE-R06e acotada al alcance de tasks.md:
  docs/methodology/tools/audit.mjs · docs/methodology/tools/selftest.sh

NO cubre G3 (SUITE-R06b, FDGE-R26, EXEC-R05) ni G4 (EXEC-R04, SUITE-R06a).
```
