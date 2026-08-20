# PT-085 — Descubrimiento   `PHASE 2`

## `A` · dónde está, con archivo y línea

[verify-fdge.mjs](docs/methodology/tools/verify-fdge.mjs), en `checkHandoff`:

```js
const tEstado  = fecha('docs/implementation/HANDOFF.md');
const tTrabajo = fecha('changes');
if (tEstado < 0 || tTrabajo < 0) return;
if (tTrabajo && tEstado && tTrabajo > tEstado) { fail('SUITE-R34', …); }
```

`fecha()` es `git log -1 --format=%ct -- <ruta>`. **Compara cuándo se commiteó cada cosa.**

### Qué del bloque `ESTADO` es derivable, medido

`SUITE-R33` exige siete campos. Contrastados contra `REGISTRY.json`:

| Campo | ¿Derivable? | De dónde |
|:---|:---|:---|
| `implementación` | **sí** | la allocation `EP` viva |
| `tarea` | **sí** | las allocations no terminales, y su fase |
| `compuerta` | **parcial** | la compuerta que cierra la fase actual sale de `EXIGIBLE_DESDE` |
| `siguiente` | **parcial** | la fase siguiente sí; el orden entre tareas, no |
| `actualizado` | **sí** | la fecha del commit |
| `decisiones` | **no** | prosa |
| `no hacer` | **no** | prosa |

**Cuatro de siete se pueden contrastar.** Hoy no se contrasta ninguno.

### El caso real, y no es hipotético

Durante `EP-017` el bloque decía:

```
implementación: EP-016 (#91) CERRADA · … · 9.0.0 sellada · G4 pendiente de merge
tarea:          ninguna abierta. … Lo siguiente es EP-017 …, PROPUESTA y no abierta
```

…mientras `EP-017` llevaba **nueve tareas integradas**. `SUITE-R34` daba verde porque el archivo
se había tocado. Lo arreglé a mano cuando lo vi; nada me obligó a verlo.

## `B` · `sesion cerrar` escribe y no commitea

`tracker.mjs`, acción `sesion cerrar`: apila la entrada en `SESSION_LOG.md` y termina. La salida
dice «Apilado en `SESSION_LOG.md`» — y es cierto, pero **sólo en el árbol de trabajo**.

Medido el 2026-08-20: la entrada del cierre de la sesión del 19 seguía **sin commitear** a la
mañana siguiente. `SUITE-R09` hace este ledger append-only precisamente para que sea la prueba de
que algo ocurrió; una prueba que vive sólo en un árbol de trabajo no es una prueba.

## `C` · la deuda de sellado, medida sobre lo que pasó

| | |
|:---|:---|
| `main` sin merge | 2026-08-18 → 2026-08-19 |
| commits de retraso al detectarlo | **53** |
| issues bloqueados por `SUITE-R46` | **8** |
| `9.0.0` declarada | y **nunca publicada** — npm sirve `8.2.0` |
| lotes cerrados sin `G4` | `EP-016` |

Y el detonante fue una pregunta tuya —«aún hay 17 abiertos»—, no una comprobación.

### Lo que ya existe y no basta

`EXEC-R03` dice que `G4` es del lote y no se multiplica por tarea. Correcto, y por eso no hay que
forzar una `G4` por `PT`. Pero **entre `G4` y `G4` no hay techo**: un lote de 21 tareas puede
acumular 21 integraciones sin sellar, y eso fue exactamente lo que pasó.

### El precedente que da la forma

`EXEC-R11` · «Un hotfix con documentación retroactiva vencida **bloquea la apertura de todo `PT`
nuevo**. El bloqueo se levanta completando la documentación, nunca ignorándolo.»

Misma estructura: la deuda no se prohíbe, se hace **imposible de ignorar** bloqueando lo
siguiente. `SUITE-R57` copia esa forma sobre el sellado.

## `D` · qué envejeció sin que nada avisara

Medido con `git diff v9.0.0..HEAD --numstat`, que es exactamente lo que el sello podría mirar:

| Documento | Cambio desde `v9.0.0` |
|:---|:---|
| `RULES.md` | `+3 / -1` — las dos reglas nuevas y la versión |
| `LEXICON.md` | `+1 / -1` — sólo la versión |
| `EXECUTION-MODES.md` | `+1 / -1` — sólo la versión |
| `MANUAL.md` | `+12 / -3` |
| `CASOS-DE-USO.md` | `+14 / -3` |
| `Suite-CLAUDE-Template.md` | `+1 / -1` — sólo la versión |
| **`docs/methodology/README.md`** | **sin cambios** |
| **`README.md` (raíz)** | **sin cambios** |

Una versión `MAJOR` con dos reglas `HARD` nuevas, una rama de proyección publicada por primera
vez, la rama de integración protegida y el salto `9 → 10`, y **ninguno de los dos `README` se
tocó**.

Y `MANUAL` y `CASOS-DE-USO` sí cambiaron — pero **porque `PT-079` los puso en su lista de cinco
sitios**, no porque nada lo exigiera. Si aquella tarea no hubiera existido, la columna diría
«sin cambios» en los cinco.

Eso es lo que hace mecanizable `AC-13`: **la comparación ya se puede hacer**, sólo que nadie la
hace. Lo que no es mecanizable es decidir si un cambio en `RULES.md` obliga a reescribir el
manual — eso lo sabe quien escribió la regla, y por eso `AC-11` pide una **decisión**, no una
actualización.

## `E` · el grafo, medido

`graphify-out/` existe, tiene **500 nodos y 635 aristas**, y `FDGE-R43` lo evalúa en cada `PT`.
También lleva cinco días sin regenerarse:

```
archivos que el grafo describe    16
MODIFICADOS desde generarlo       12      75 % de deriva
desaparecidos                      0
tareas integradas desde entonces  26
veredicto de FDGE-R43           FRESH
```

### La prueba más clara: el módulo más importado

| | Cuántos |
|:---|---:|
| Importadores de `patrones.mjs` **según el grafo** | `audit` · `comparar-marco` → **2** |
| Importadores **reales** | `audit` · `build-core` · `migrate` · `tracker` · `verify-fdge` · `verify-patrones` · `verify-suite` · `version` → **8** |

Preguntarle hoy «¿a qué afecta tocar `patrones.mjs`?» devuelve una respuesta **incorrecta con
autoridad de dato derivado**. Es el mismo modo de fallo que `PT-067` encontró en `audit` y
`PT-066` en `regla`.

### Por qué dice `FRESH`

`FDGE-R43` mira `structural: true`, que sólo marca **crear, mover, renombrar o eliminar**
archivos. En todo el registro **una sola allocation lo tiene: `PT-034`**. Modificar no cuenta.

Es la misma forma que `A`: **un proxy en vez de la cosa**. Y con peor consecuencia, porque
`FDGE-R43` bloquea `G2` en los `PT` `MAJOR` — se está aprobando trabajo grande contra un grafo que
no conoce el código.

### El dato para arreglarlo ya está

`graphify-out/manifest.json` guarda por archivo:

```json
{ "mtime": 1786748499.71, "ast_hash": "db1abb…", "semantic_hash": "db1abb…" }
```

**Nadie lo consulta.** La deriva de las 12 de arriba se midió con ese mismo manifiesto, en diez
líneas.

### Y una corrección a lo que iba a proponer para `PT-086`

`selftest.sh` **está fuera del grafo** — 16 herramientas reales, 15 descritas. Y es **correcto**:
`FND-R28` excluye pruebas, fixtures y mocks a propósito, porque el grafo describe el sistema y no
cómo se comprueba.

Consecuencia para `PT-086`: el grafo resuelve el lado **herramienta → herramienta**, no el lado
**sección → herramienta**. La mitad que falta hay que declararla, no derivarla del grafo.

## Un dato que cambia `PT-086` y conviene tener aquí

Medido hoy, porque la propuesta lo necesitaba:

```
corrida completa                    ~600 s · 1073 casos
corrida con --solo, UN caso          171 s · 1 de 1073
build_fixture, llamadas              211, TODAS a nivel superior
```

`--solo` filtra **aserciones**, no **andamiaje**: `salta()` decide si un caso corre, y
`build_fixture` está fuera de los casos. Así que **171 s son suelo** y `--solo` no sirve para lo
que se le va a pedir. Es el descubrimiento que justifica que `PT-086` sea `MAJOR` y no un retoque.

## Conclusión

**Cinco defectos independientes con una raíz común: el marco registra lo que pasa y no comprueba
que lo registrado siga siendo cierto.** `SUITE-R34` mira la fecha en vez del contenido,
`sesion cerrar` escribe sin sellar, nada mira cuánto se acumula sin publicar, nada mira si lo que
lee quien llega sigue describiendo el marco que hay, y `FDGE-R43` mira si se movieron archivos en
vez de si el grafo describe el código.

**Dos de los cinco —`A` y `E`— son literalmente el mismo error**: verificar un proxy barato en
lugar del hecho. Y los dos gobiernan compuertas.

Es la misma familia que `PT-081` encontró en la guía de migración de la `9.0.0` —texto que fue
verdad y dejó de serlo— y que `PT-075` enunció primero: **una regla sin verificador no ocurre**.
Aquí es un escalón más arriba: *un registro sin verificador deja de ser cierto*.

Los cuatro son atómicos y se pueden hacer por separado, que es lo que `MARGINAL` admite.

| | Qué lo cierra |
|:---|:---|
| `A` | derivar los cuatro campos derivables del bloque `ESTADO` y contrastarlos |
| `B` | que `sesion cerrar` commitee, o no diga que cerró |
| `C` | `SUITE-R57` y el acto de sellar, con batería completa |
| `D` | que sellar exija **resolver** cada documento de entrada, y que lo digan las instrucciones |
| `E` | que `FDGE-R43` mire la deriva de contenido, y que sellar exija el grafo al día |
