# PT-001 — Diseño   `PHASE 4`

## La decisión, y por qué esta y no otra

**Una sola herramienta habla con la plataforma.** `tracker` tiene el adaptador; `verify-fdge`
hace cumplir las reglas y le pregunta. La alternativa —un segundo cliente de GitHub dentro de
`verify-fdge`— obligaría a implementar Azure dos veces y a mantener dos clientes en sincronía:
la duplicación que este repositorio existe para eliminar.

```
compuertas  ──>  verify-fdge  ──(node tracker.mjs …)──>  tracker  ──(gh)──>  GitHub
                     │
                     └─ sin plataforma declarada: nada de esto ocurre
```

## Contrato de salida de `tracker`

El código de salida es lo que consumen las compuertas, así que es la superficie que hay que
diseñar primero.

| Código | Significado | Decisión de quien llama |
|:---|:---|:---|
| `0` | el espejo cuadra | seguir |
| `1` | divergencia: trabajo vivo sin issue, o issue sin trabajo | **fallar** |
| `2` | sin plataforma declarada | no aplica — no es un fallo |
| `3` | plataforma declarada y **sin acceso** | fallar donde la credencial es exigible; `SIN EVALUAR` donde no puede estar |

`2` y `3` estaban fundidos en `2`, y son decisiones opuestas: una es una elección legítima del
proyecto, la otra una precondición incumplida. Separarlos es lo mínimo para que quien llama
pueda decidir.

La comprobación de acceso se hace **antes de leer el registro** (`FND-R30`).

## Dónde bloquea y dónde declara

| Punto | Sin credencial | Cómo se implementa |
|:---|:---|:---|
| `npm run verify` | falla | script `verify:espejo`, encadenado |
| CI · `push` a `main` | falla | paso sin `if:` |
| CI · PR desde fork | `SIN EVALUAR` | `if: github.event.pull_request.head.repo.fork != true` |
| `verify-fdge --gate G4` | falla | código `3` → `fail` |
| `verify-fdge --all` / por PT | `SIN EVALUAR` | código `3` → `warn` |
| `cauce verify` | `SIN EVALUAR` | códigos `2` y `3` no cuentan como fallo |

El criterio humano —«la credencial tiene que estar desde antes»— se respeta entero donde el
proyecto opera. Donde no puede cumplirse por diseño de GitHub, se declara en vez de mentir.

## `FDGE-R52` con plataforma

`tracker` gana una acción de solo lectura que devuelve cuántas notas de reanclaje lleva un PT
en su issue. `verify-fdge` la usa **solo** si hay plataforma declarada y el PT tiene issue:

```
plataforma + issue + acceso   →  cuenta comentarios del issue
plataforma + issue + sin acceso → SIN EVALUAR (o fail en G4)
sin plataforma                →  bitacora.md, exactamente como hoy
```

Sin plataforma no cambia nada. Es la condición que protege a todo proyecto que no la declare.

**Qué cuenta como nota.** El mismo criterio que en `bitacora.md`: un comentario que declara
una transición de fase. Se reconoce por la forma que `CORE.md` fija —qué se cierra · dónde se
está · qué sigue— y no por su longitud: contar comentarios sueltos convertiría cualquier
conversación en cumplimiento.

## `tracker abrir` y las etiquetas

Crea las que falten antes de abrir el primer issue, y lo registra en su salida. `abrir` ya
escribe en la plataforma y lo declara en su nombre, así que no rompe `RULE-05`. Si no puede
crearlas, dice el comando exacto (`RULE-07`) en vez de fallar con el error crudo de `gh`.

## Qué NO cambia

- `RULES.md` — `SUITE-R35` y `FDGE-R52` conservan su texto. `CORE.md` no se regenera.
- `SUITE-R08` — el registro sigue siendo el único asignador.
- El issue sigue **referenciando** el intake, nunca copiándolo.
- El adaptador de Azure sigue declarando el contrato sin implementarlo, a propósito.
- Un proyecto sin `tracker.plataforma`: cero cambios de comportamiento.

## Resolución de `G2`   `FDGE-R13`

```
Compuerta:    G2 · Proposal
Veredicto:    APROBADA
Fecha:        2026-08-13
Resuelta por: Alberto Martínez
Escrita por:  el agente, POR DELEGACIÓN — «te autorizo a que firmes a mi nombre» (2026-08-13),
              reafirmada con «adelante, firma a mi nombre» y «sí, adelante» sobre esta
              propuesta concreta, incluido el reparto de credenciales.

Cubre SUITE-R06e para este PT y para el alcance declarado en tasks.md:
  docs/methodology/tools/verify-fdge.mjs · tracker.mjs · selftest.sh
  package.json · .github/workflows/verificacion.yml · bin/cauce.mjs
Fuera de ese alcance, no.

NO cubre: G3 —cerrar un BUG no lo automatiza ningún modo (SUITE-R06b, FDGE-R26, EXEC-R05)—
ni G4 (EXEC-R04, SUITE-R06a).
```
