# PT-004 — Self-Review   `PHASE 6` · `FDGE-R25`

No es un control: es la preparación de `G3`. Lo que sigue es lo que le pediría a otro que
mirase, no un resumen de lo que salió bien.

## Lo que cambió, en una línea

`checkPT()` distingue ahora **fase declarada** de **fase ausente**, y las dos comprobaciones
de existencia de artefactos consultan esa fase en vez de exigir siempre.

## Diff revisado

`docs/methodology/tools/verify-fdge.mjs`

- `faseDeclarada` — resuelve YAML del intake → `REGISTRY.allocations[].phase` → `null`. La
  precedencia no es nueva: estaba en la línea que se sustituye. Lo nuevo es el `null`.
- `fase` se conserva como `faseDeclarada ?? 0` **para no alterar `FDGE-R52`**, que ya la
  consumía y cuyo comportamiento este PT no toca.
- `exigible(regla, desde, artefacto)` — una función, tres salidas, usada dos veces.
- `FDGE-R42` y `FDGE-R15` la consultan antes de fallar.

`docs/methodology/tools/selftest.sh` — 8 casos.
`docs/implementation/REGISTRY.json` — `phase` en las cuatro allocations vivas.

## Lo que un revisor debería atacar

**1. `fase` sigue siendo `faseDeclarada ?? 0`, y eso conserva el `?? 0` que critiqué.**
Deliberado y acotado: solo lo consume `FDGE-R52`, que ya se comportaba así y no está en el
alcance de este PT (`FDGE-R20`). Si `FDGE-R52` debe distinguir también fase ausente, es una
decisión aparte. **Está anotado y no escondido.**

**2. `exigible()` emite un aviso y devuelve `false`; el llamador tiene que acordarse de no
fallar.** Es un contrato implícito entre dos líneas. Con dos usos es legible; con seis sería
frágil. No lo generalizo hoy porque no hay un tercer caso que lo pida.

**3. La rama `else if (trace === null) { /* aviso ya emitido */ }` es una rama vacía.** La
alternativa —invertir la condición— duplicaría la lectura de `trace`. Elegí la rama vacía con
comentario. Es fea y es discutible.

**4. Un PT podría declarar una fase falsa y esquivar la comprobación.** Cierto, y no lo
resuelve este PT: `phase` la escribe quien conduce la sesión. Lo mismo vale para cualquier
campo declarativo del marco, y `SUITE-R27` ya dice qué prueba una declaración. La defensa real
es `FDGE-R52`, que exige una nota por transición: saltar de `PHASE 1` a `PHASE 8` para esquivar
`FDGE-R15` deja siete notas que escribir.

## Lo que NO he verificado

- **Ningún proyecto destino real.** El efecto sobre un repositorio ya instalado está razonado
  (`strategy.md`, regresión) y probado en el fixture, no observado fuera. El proyecto legado
  de la sesión sigue en 4.12.0 y no lleva este código.
- **`AC-06` no queda satisfecha por este PT.** Queda un error de `FDGE-R52` ajeno al alcance.
  Está en la Revisión 1 del intake, en `strategy.md` y en `traceability.md`. No lo tapo.

## Lo que se rompería si esto estuviera mal

Que un PT en fase avanzada dejara de ser comprobado. Es el riesgo alto de `strategy.md`, y es
lo que cubren los dos casos inversos: `PHASE 4` sin `traceability.md` sigue fallando y
`PHASE 2` sin `discovery.md` sigue fallando. Sin esos dos, apagar la comprobación entera
habría pasado los otros seis.

SELF_REVIEW_COMPLETE
