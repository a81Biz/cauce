# PT-001 — Contexto   `PHASE 2` · análisis `2-B`

## Documentación consultada   `FDGE-R07`

| Fuente | Qué aportó |
|:---|:---|
| `CORE.md` §La plataforma de trabajo | El contrato de `SUITE-R35`: qué espeja, qué asigna, y que el issue **referencia** y no copia |
| `CORE.md` §El bloque ESTADO | El reanclaje de `FDGE-R52` va «issue si hay plataforma · `bitacora.md` si no» — la frase que el verificador ignora |
| [11-Conventions.md](../../docs/enterprise-documentation/11-Conventions.md) | `RULE-02` fallo distinguible · `RULE-04` cero dependencias · `RULE-06` lo no comprobable se declara · `RULE-07` la salida dice qué hacer |
| `RULES.md` | `FND-R30` — «los accesos se comprueban **antes** de necesitarlos». Es la regla que resuelve `AC-05`, y ya existía |
| [10-Technical-Debt.md](../../docs/enterprise-documentation/10-Technical-Debt.md) | `TD-05` sigue abierto y bloquea el merge a `main` |
| `changes/PT-004-*/` | El defecto hermano ya cerrado: mismo patrón —una comprobación que ignora el contexto declarado— en otra regla |

## Estado del grafo   `FDGE-R43` · `FDGE-R08`

`FRESH`, alcance `bin`, no cubre `docs/methodology/tools/` (`TD-01`). Igual que en `PT-004`, se
sustituye por enumeración directa de consumidores, exhaustiva sobre 15 herramientas sin
dependencias externas (`RULE-04`). Declarado, no omitido.

## Los cuatro frentes, medidos

```
1 · verify-fdge no conoce el espejo
    grep -c "tracker|SUITE-R35|issue"  docs/methodology/tools/verify-fdge.mjs   → 0

2 · ninguna compuerta ejecuta tracker
    npm run verify   → patrones · suite · core:check · audit · secretos · selftest
    verificacion.yml → los mismos + revisar-secretos --historial + verify-fdge --all
    bin/cauce.mjs    → verify-suite · build-core · verify-fdge · verify-qa · verify-ptsa
                       · revisar-secretos
    En ninguno aparece tracker.

3 · FDGE-R52 ignora la plataforma declarada
    verify-fdge.mjs:788-795   lee changes/PT-NNN-slug/bitacora.md y nada más
    CORE.md                   «issue si hay plataforma · bitacora.md si no»
    Efecto observado: PT-004 quedó en DONE con G4 BLOQUEADA por este motivo.

4 · tracker asume etiquetas que no crea
    tracker.mjs:64-69   gh issue create --label «implementación» --label «tarea»
    gh label list       ninguna de las dos existía el 2026-08-13
    Efecto observado: hubo que crearlas a mano antes de abrir los issues del lote.
```

Los frentes 3 y 4 **no son teoría**: los dos se observaron ejecutando el marco en esta misma
sesión, y están registrados en `SESSION_LOG.md`.

## Cómo se comporta hoy `tracker` sin credencial

```
tracker.mjs:99-102   if (!adaptador.disponible()) { … process.exit(2) }
tracker.mjs:95       sin plataforma declarada    → exit 2
                     espejo con divergencias     → exit 1
                     todo en orden               → exit 0
```

`2` significa hoy dos cosas distintas —«no hay plataforma declarada» y «hay plataforma y no
hay acceso»— y son decisiones opuestas: la primera es una elección legítima del proyecto, la
segunda es una precondición incumplida.

## Decisión humana recibida   `AC-05`

2026-08-13, literal: «las credenciales necesitan estar desde antes, asegurarse que empieza con
las credenciales».

Cierra `AC-05` y lo hace **más estricto** de lo que el intake planteaba. El intake temía el
rojo permanente; la decisión dice que un proyecto que declara plataforma y no tiene acceso a
ella no está en un caso tolerable, está en uno que hay que resolver antes de empezar. Eso ya
tiene regla: `FND-R30`. La comprobación se adelanta al arranque en vez de esperar a la
compuerta.

## Restricciones

`RULE-04` cero dependencias — `gh` se invoca como proceso, igual que `git` ya se invoca en
`verify-fdge` · `RULE-05` un verificador no escribe: `tracker espejo` solo lee; `abrir` y
`cerrar` escriben y lo declaran en su nombre · `SUITE-R35` el issue referencia, no copia ·
`SUITE-R08` el registro sigue siendo el único asignador · `LEX-R25` el cambio viaja a todos
los proyectos destino.

## Confianzas declaradas   `FDGE-R09`

| Eje | Valor | Sustento |
|:---|:---|:---|
| Root Cause | **95 %** | Los cuatro frentes están localizados con archivo y línea, y dos se observaron en ejecución |
| Architecture | **80 %** | Consumidores enumerados; el grafo no cubre `tools/` (`TD-01`) |
| Solution | **75 %** | Queda abierto **dónde** se ejecuta el espejo en CI y qué pasa en un fork sin token, que es donde la decisión de `AC-05` toca terreno que no controlamos |

Ninguna bajo el 70 %: no se activa el Investigation Gate.
