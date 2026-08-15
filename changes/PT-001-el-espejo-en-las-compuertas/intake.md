# PT-001 — El espejo entra en las compuertas

> Tarea dentro de la implementación abierta `EP-001` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-001
type: BUG
epic: EP-001
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 5.2.3
---
```

## 1. Qué se quiere   `[HUMANO]`

> «no veo que uses github para dar de alta las tareas y desde ahí se desprenda el seguimiento
> para no perder lo que se está haciendo»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una allocation viva sin issue hace fallar la verificación | Caso de `selftest.sh` con un `REGISTRY.json` de fixture con una allocation `DRAFT` sin `issue`: el verificador sale distinto de 0 |
| AC-02 | Un issue abierto que ninguna allocation viva reclama hace fallar la verificación | Caso de `selftest.sh` sobre la dirección inversa del espejo |
| AC-03 | El espejo se ejecuta en CI, no solo a mano | `.github/workflows/verificacion.yml` tiene un paso que lo invoca y el paso puede fallar el job |
| AC-04 | El espejo es precondición de `G4` | `verify-fdge --gate G4` lo enumera entre las precondiciones de `FDGE-R34` y falla si no cuadra |
| AC-05 | La ausencia de credencial de plataforma no produce un rojo permanente | Comportamiento declarado y probado: sin `gh` autenticado el resultado es distinguible de «el espejo no cuadra», y qué se hace con él está escrito |
| AC-06 | Un proyecto sin `tracker.plataforma` declarada no se ve afectado | Caso de `selftest.sh`: `REGISTRY.json` sin la clave `tracker` no falla ninguna compuerta nueva |
| AC-07 | `FDGE-R52` acepta el reanclaje donde `CORE.md` manda escribirlo | Con plataforma declarada, un comentario en el issue satisface la regla; sin plataforma, sigue exigiendo `bitacora.md`. Caso de `selftest.sh` para las dos ramas |
| AC-08 | `tracker` no falla por etiquetas inexistentes | Las etiquetas que usa se crean o se declaran precondición con mensaje accionable (`RULE-07`) |

### AC-07 — por qué se añadió después de firmar

Encontrado el 2026-08-13 ejecutando `PHASE 2` de otra tarea del lote. `CORE.md` §El bloque
ESTADO dice del reanclaje: «**issue si hay plataforma** · `changes/PT-NNN-slug/bitacora.md`
si no». El reanclaje se escribió como comentario del issue, que es lo que manda el
procedimiento, y `verify-fdge` falló igualmente:

```
✗ FDGE-R52   PT-004: está en PHASE 2 y su bitácora tiene 0 nota(s); faltan 1.
```

El verificador solo busca `bitacora.md` y no sabe que hay plataforma. Es la misma causa que
esta tarea ataca —el espejo existe y las compuertas no lo conocen— manifestada en una regla
distinta. Cumplir el procedimiento al pie de la letra deja la compuerta en rojo; ponerla en
verde exige escribir el reanclaje **dos veces**, que es justo lo que `SUITE-R35` prohíbe
(«el issue referencia el intake, no lo copia: dos copias divergen»).

AC-08 recoge la desviación de la apertura: las etiquetas `implementación` y `tarea` no
existían en el repositorio y `gh issue create` falla sin ellas.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `npm run verify` y el job de CI fallan sobre un repositorio con una
> allocation viva sin issue, y pasan cuando el espejo cuadra.

## 4. Qué NO entra   `[AGENTE]`

- OUT: crear milestones o pull requests — el contrato incompleto es materia de `PT-003`
- OUT: cambiar el texto de `SUITE-R35` en `RULES.md`. La regla ya dice lo que tiene que decir; lo que falta es quien la ejecute
- OUT: el adaptador de Azure DevOps, que declara el contrato y no lo implementa a propósito
- OUT: espejar trabajo cerrado (`SUITE-R36`: solo lo vivo)

## 5. Firma

```
Firmado por lote: EP-001
```

---

## Evidencia de que el defecto existe

Medido el 2026-08-13 sobre este repositorio:

```
grep -n "tracker\|SUITE-R35\|issue" docs/methodology/tools/verify-fdge.mjs   → 0 coincidencias
npm run verify   → verify:patrones · verify:suite · core:check · audit · verify:secretos · selftest
.github/workflows/verificacion.yml   → los 7 pasos, ninguno invoca tracker
```

`SUITE-R35` es **HARD**, tiene herramienta (`tools/tracker.mjs`, 205 líneas) y ninguna
compuerta la ejecuta. Una regla que solo se cumple por buena voluntad es una recomendación.

---

## Revisiones

> Append-only (`SUITE-R09`). El intake se firmó por lote el 2026-08-13.

### Revisión 1 — 2026-08-13 · ampliación de archivos

**Qué cambia.** El intake declaraba cuatro archivos (`verify-fdge.mjs`, `package.json`,
`verificacion.yml`, `selftest.sh`). Se añaden dos:

| Archivo | Por qué |
|:---|:---|
| `docs/methodology/tools/tracker.mjs` | los códigos de salida que distinguen «sin plataforma» de «sin acceso», la acción `notas` que `FDGE-R52` necesita, y las etiquetas de `AC-08` |
| `bin/cauce.mjs` | mapear el código de salida nuevo en `cauce verify` |

**Motivo.** La solución de `PHASE 3` mantiene el adaptador de plataforma en una sola
herramienta: `verify-fdge` hace cumplir la regla y le pregunta a `tracker`, que es quien tiene
el cliente CLI. La alternativa —un segundo cliente de GitHub dentro de `verify-fdge`— es la
duplicación que este repositorio existe para eliminar.

**No es desvío de complejidad** (`FDGE-R21`): es el mismo trabajo declarado, en los archivos
donde vive. `tasks.md` queda actualizado y es lo que fija el scope lock (`FDGE-R20`).

### Revisión 2 — 2026-08-13 · `AC-05` resuelto por decisión humana

**Qué cambia.** `AC-05` decía «la ausencia de credencial no produce un rojo permanente» y
dejaba abierto el comportamiento.

**Decisión humana** del 2026-08-13, literal: «las credenciales necesitan estar desde antes,
asegurarse que empieza con las credenciales». Y confirmado el reparto para los dos casos que
el proyecto no controla:

> El espejo **bloquea** donde la credencial es exigible —`npm run verify`, `push` a `main`,
> `G4`— y sale **`SIN EVALUAR`** donde no puede estarlo: un PR desde un fork, que por diseño
> de GitHub no recibe los secretos del repositorio, y una máquina recién instalada sin
> `gh auth login`.

Esto es `FND-R30` («los accesos se comprueban antes de necesitarlos») aplicada con la puerta
que `RULE-06` exige para lo que no se puede comprobar.

### Revisión 3 — 2026-08-13 · el adaptador se separa de la lógica

**Qué cambia.** `PHASE 4` planteaba probar las ramas de plataforma con un `gh` de mentira en
el `PATH`. **No funciona.** Comprobado el 2026-08-13 en sus dos formas —script con shebang y
`.cmd`—: node siguió resolviendo el `gh.exe` real y devolvió los issues verdaderos del
repositorio. Sombrear un ejecutable de forma portable entre Windows y Ubuntu no es fiable, y
el arnés corre en los dos.

Encima hay una restricción dura: **ningún caso del arnés puede exigir `gh` autenticado**,
porque el arnés corre en CI y en un PR desde fork no hay credencial. Un caso así convertiría
la batería en el rojo permanente que este mismo PT existe para evitar.

Eso explica por qué el bloque `P` que ya existía solo probaba las rutas sin `gh`: no era una
omisión, era el límite.

**Decisión humana** del 2026-08-13, opción **B** de dos presentadas: separar en `tracker.mjs`
el **adaptador** —que habla con `gh`— de la **lógica del espejo**, que pasa a ser una función
pura: recibe las allocations vivas y los issues abiertos, y devuelve las divergencias. El
arnés prueba la lógica sin plataforma ninguna.

**Motivo de elegir B sobre A** (cobertura parcial declarada + evidencia de ejecución real):
`SUITE-R35` lleva desde la 5.0.0 sin compuerta precisamente porque nada la ejercía. Dejar seis
ramas nuevas sin caso repetiría el patrón que este lote arregla, y la primera regresión no la
vería nadie.

**Alcance.** Sigue siendo `tracker.mjs`, ya declarado en la Revisión 1. Lo que crece es la
profundidad del cambio dentro de ese archivo: la lógica se extrae y el módulo gana un guard
para poder importarse sin ejecutarse. No es un backdoor de pruebas —no se añade ninguna
plataforma falsa ni ninguna bandera que solo use el arnés—: es separar adaptador de lógica,
que es lo que hace la diferencia entre poder probar y no poder.

`test-scenarios.md` queda reescrito en consecuencia.

### Revisión 4 — 2026-08-13 · la guarda de fork se retira

**Qué cambia.** El paso de CI que ejecuta el espejo llevaba
`if: github.event.pull_request.head.repo.fork != true`. Se quita.

**Motivo.** Pregunta humana del 2026-08-13: «¿cuándo se hizo un fork?». Comprobado:
**cero forks**, y el único PR de la historia de este repositorio salió de una rama propia. La
guarda protegía un caso que aquí no ha ocurrido nunca y que no se puede probar desde aquí —
yo mismo lo había declarado en el self-review como «no verificado».

El marco ya resolvió esto en la 5.2.1, descartando enviar un `.claude/settings.json` con
reglas `deny`: «no se puede verificar desde aquí que bloqueen de verdad, y un control de
seguridad sin probar es el verde por omisión que este marco existe para cazar». La guarda era
lo mismo, en CI.

Cuando aparezca el primer PR desde un fork habrá un caso real contra el que escribir — que es
exactamente como se trata el adaptador de Azure: se escribe contra un caso, no contra ninguno.

`AC-05` no cambia: el reparto entre bloquear y declarar sigue vivo en `tracker` (código `3`) y
en `cauce verify`, y **eso sí está probado** por cuatro casos del arnés.

### Revisión 5 — 2026-08-13 · el recorrido de reanclaje, rehecho

**Qué cambia.** `FDGE-R52`, ya funcionando sobre el issue, denunció que `PT-001` y `PT-004`
tenían el reanclaje **consolidado**: comentarios que cubrían varias transiciones de golpe en
vez de una nota por transición.

**Decisión humana** del 2026-08-13, entre tres opciones presentadas —firmar una excepción,
rehacer el recorrido, o revisar la regla—: **rehacer el recorrido**.

Se escribió una nota por transición en los issues #3 y #6, con lo que ocurrió realmente en
cada una, y **cada una declara que se escribe retroactivamente**. La fecha no se disimula: el
registro dice lo que pasó, incluido que se reanclaba mal y se corrigió.

Se descartó revisar la regla para que una nota de rango contara por varias transiciones: es la
forma más fácil de ablandar una regla justo cuando molesta, y la regla tenía razón.

Resultado: `verify-fdge --all` **sin errores**, y `G4` de `PT-004` desbloqueada.
