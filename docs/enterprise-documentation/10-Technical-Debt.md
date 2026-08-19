# 10-Technical-Debt

> Foundation `PHASE 4` · 2026-08-19 · suite 9.0.0 · segunda ejecución
> **El único documento del paquete donde caben recomendaciones** (`FND-R02`). Todo lo demás
> describe hechos. Aquí van también los hechos **no determinados** (`FND-R01`).

## Deuda abierta

### `TD-01` · El alcance del grafo — resuelta en este repositorio, ABIERTA en la herramienta

`plan-layout` calculó el alcance `bin` y así se aceptó en `G0`
([LAYOUT.md](../implementation/LAYOUT.md), propuesta 2). El grafo tiene 18 nodos sobre
`bin/cauce.mjs`; los 5 441 líneas de `docs/methodology/tools/` quedan fuera porque la
herramienta no considera `docs/` como código propio.

**Consecuencia:** `FDGE-R43` se satisface formalmente —el grafo existe y está `FRESH`— sobre un
grafo que no describe el sistema. Un PT `MAJOR` sobre los verificadores resolvería `G2` con un
grafo que no los contiene.

**Recomendación:** o se amplía el alcance a `docs/methodology/tools/`, o se enseña a
`plan-layout` que un `tools/` con `.mjs` es código propio aunque cuelgue de `docs/`. Lo segundo
sirve a todos los proyectos; lo primero, solo a este.

> **RESUELTA por `PT-020` el 2026-08-15** — por la primera vía, la que sirve solo a este
> repositorio. `REGISTRY.graph.scope` pasa a `bin, docs/methodology/tools` y `pt_at_generation`
> de `0` a `48`; el grafo va de **18 nodos** —todos de `bin/cauce.mjs`— a **500 nodos, 635
> aristas y 14 comunidades** sobre los 16 archivos. `FDGE-R43`: `STALE` → `FRESH`. Seis casos
> nuevos en `selftest.sh` (495 → 501) impiden volver al alcance de ayer, y la comprobación
> inversa se ejecutó: revertido el registro, los dos casos que deben caer caen.
>
> **La segunda vía sigue abierta**, y con ella la parte de esta deuda que importa a los demás
> proyectos: `plan-layout` sigue sin reconocer `tools/` con `.mjs` bajo `docs/` como código
> propio, así que **cualquier instalación nueva nace con este mismo defecto** y hay que
> corregirlo a mano. Aquí se arregló el síntoma en un repositorio; la causa está en la
> herramienta que calcula el alcance.
>
> Y lo que `PT-020` midió abre una pregunta que no existía: **13 de las 14 comunidades son un
> archivo cada una**, y 8 de los 16 archivos no comparten una sola arista. El grafo describe
> bien y dice poco, porque hay poco que decir — 16 CLI casi autónomos. Queda medido en
> [`changes/PT-020-ampliar-el-grafo-a-tools/self-review.md`](../../changes/PT-020-ampliar-el-grafo-a-tools/self-review.md),
> junto con las **dos de tres** expectativas que no se cumplieron como estaban escritas.

### `TD-02` · `verify-fdge.mjs` concentra siete familias de reglas en 1 618 líneas

Junto a `selftest.sh` (3 541) y `tracker.mjs` (2 070) son el **63 %** de las 11 454 líneas de `tools/`.
**Actualizado en la segunda ejecución:** en 2026-08-13 eran 1 027 y 1 110, el 39 % de 5 441. El código
se ha duplicado y el reparto se ha concentrado más, no menos. `verify-fdge` verifica `SUITE-*`, `FND-*`,
`FDGE-*`, `INTAKE-*`, `LEX-*`, `EXEC-*` y la instalación.

**Consecuencia:** cada regla nueva lo hace más grande, y no hay frontera natural donde partirlo.

**Recomendación:** no partirlo por tamaño. Si se parte, que sea por **artefacto verificado**
—registro, terreno, PT, evidencia— y solo cuando haya un cambio que lo pida. Partir por partir
crea cinco archivos que se importan entre sí y un fallo de composición nuevo.

### `TD-03` · No hay pruebas unitarias

La verificación es de extremo a extremo: `selftest.sh` construye un proyecto sintético, inyecta
un defecto y comprueba que el verificador lo caza. **697 casos** contados como `chk`/`chkno`, 959
contando también las aserciones `PL`/`PLNO`/`trlib`. En la primera ejecución eran 179.

**Consecuencia:** una función interna puede estar mal sin que ningún caso la señale, si su fallo
no cambia el veredicto. El caso «versión desalineada ⇒ restringido» estuvo así: pasaba sin
comprobar nada, porque el fixture y el verificador tenían la misma versión escrita a mano.

**Recomendación:** mantener el enfoque de extremo a extremo —es el que prueba lo que importa— y
añadir el contrato `casa`/`noCasa` de `patrones.mjs` a cualquier función pura nueva que sea
crítica. No introducir un framework de test: contradiría `RULE-04`.

### `TD-04` · `QA/` y `qa/` no pueden coexistir en Windows ni en macOS

`INSTALL.md` `I3` enumera dos espacios que se distinguen solo por la caja: `QA/` (casos,
defectos, informes) y `qa/` (las pruebas que `verify-qa` busca en `qa/tests/`). Comprobado en
este host: se creó `QA/` y `qa/` resolvió al mismo directorio.

**Consecuencia:** en Windows y macOS el instalador crea uno solo, y qué contiene depende de en
qué orden se escribieron los archivos. En Linux y en CI son dos. El mismo proyecto tiene dos
estructuras según dónde se instaló.

**Recomendación:** unificar la caja en `LEXICON.md` §6 — `QA/cases/`, `QA/tests/`,
`QA/reports/` bajo un único directorio— y ajustar `verify-qa`. Toca `docs/methodology/`, así que
es `SUITE-R06e`: se decide, no se hace de paso.

### `TD-05` · La corrección de `SUITE-R40` está sin versionar   ✅ RESUELTA 2026-08-13

`verify-fdge`, `migrate` y el fixture del selftest dejaron de fijar la versión en una constante
([INSTALL.log](../implementation/INSTALL.log), corrección posterior). El cambio está en el árbol
de trabajo **sin entrada en `CHANGELOG.md`**.

**Consecuencia:** ninguna hoy — `package.json` y el `CHANGELOG` siguen alineados en 5.2.3. Pero
`publicar.yml` publica desde `main`: si el merge ocurre sin decidirlo, se publica un contenido
que no corresponde a lo que su `CHANGELOG` describe.

**Recomendación:** decidir antes del merge si lleva entrada y con qué número, y ejecutar
`version.mjs --aplicar`. Es `PATCH`: corrige comportamiento sin romper compatibilidad.

**Resuelta el 2026-08-13.** Entró en la entrada de `5.3.0` del `CHANGELOG` junto al cierre de
`EP-001`, y `version.mjs --aplicar` alineó los 21 documentos y `package.json`. Se decidió
`MINOR` y no `PATCH` porque la entrada cubre además tres capacidades nuevas; la corrección de
`SUITE-R40` por sí sola habría sido `PATCH`, como decía esta recomendación.

### `TD-06` · `origin/desarrollo` sobra

Este documento y `CLAUDE.md` describían `desarrollo` como la rama de trabajo mientras el trabajo
ocurría en `trabajo` (divergencia `D8`). Se corrigió la documentación; la rama remota sigue ahí.

**Recomendación:** `git push origin --delete desarrollo` cuando se confirme que no cuelga nada.
Es `SUITE-R06f` — borrado de ramas remotas, humano.

### `TD-07` · El adaptador de Azure DevOps declara su contrato y no lo implementa

```js
azure: { abiertos() { throw new Error('El adaptador de Azure DevOps declara el contrato y no
  lo implementa todavía. Se escribe contra un caso real, no contra ninguno…'); } }
```
[tools/tracker.mjs:75-85](../methodology/tools/tracker.mjs#L75-L85)

**No es deuda accidental**, y por eso está aquí y no en un hallazgo: es una decisión declarada.
Escribirlo contra ningún caso real es lo que evitó que el de GitHub naciera con suposiciones.

**Recomendación:** implementarlo cuando exista un proyecto que use Azure DevOps, no antes.

### `TD-08` · 60 reglas sin verificador, 51 de ellas `HARD` — y el denominador está incompleto

`PT-015` escribió verificadores para las reglas `HARD` **que deciden algo**, y el firmante acotó
ahí el alcance a propósito: *«acotar a las HARD que deciden algo; el resto, deuda medida»*.
Esto es esa deuda, **recontada** el 2026-08-19 con la herramienta, no estimada:

```
$ node docs/methodology/tools/audit.mjs docs/methodology
  ejecutadas por una compuerta          112 / 181     · HARD  89 / 148
  citadas sin compuerta que las corra     9
  sin verificador                         60          · HARD  51
```

### Y el denominador está incompleto   — hallazgo de la segunda ejecución

`audit` publica la cobertura sobre **181** reglas. Ese número es exactamente el de filas de
`RULES.md`. Pero el marco define reglas en **tres** documentos:

```
RULES.md            181   contadas
EXECUTION-MODES.md   15   EXEC-R01..R15   NO contadas
LEXICON.md           26   LEX-R01..R26    NO contadas
                    ───
                    222   universo real
```

**41 reglas —el 18 %— quedan fuera del denominador**, y entre ellas están las que gobiernan las
compuertas: `EXEC-R04` (G4 humana sin excepción), `EXEC-R03`, `EXEC-R07` y `EXEC-R14`. Esa
última llevaba en vigor desde `PT-043` sin que nadie lo viera (`D17`), y no aparecía como
descubierta porque **no aparecía en absoluto**.

Este documento ya advertía del riesgo, dos párrafos más abajo: *«el día que se redondee a
"cobertura completa", vuelve a ser un engaño»*. No hizo falta redondear al alza el numerador:
bastó con que el denominador no incluyera una familia entera.

**Recomendación:** ampliar el universo de `audit` a los tres documentos propietarios —el mismo
mapa que `regla.mjs` ya tiene escrito en su constante `DUENO`— antes de escribir un solo
verificador nuevo. Medir sobre una base incompleta ordena mal el trabajo que venga después.
Va a `EP-017` junto con `D17`.

Las 60 sin verificador, enumeradas por `audit --sin-verificar`:

```
SUITE-R02 R04 R05 R10 R12 R23 R24 R32 R39
FND-R01 R02 R06 R07 R09 R12 R16 R17 R18
FDGE-R02 R05 R06 R09 R11 R12 R13 R14 R16 R20 R21 R28 R30 R32 R35 R37 R38 R40 R41 R46 R47 R50
INTAKE-R02 R03 R05 R07
QA-R02 R05 R08 R12 R14 R15 R17 R18
FPGE-R04 R06 R09 R10 · FIDE-R02 R03 R05 R06
```

**Dos menos que en `EP-013`**, y la diferencia es exactamente `SUITE-R22` y `SUITE-R31`: el
resto de la lista es idéntico. Cuatro lotes de trabajo y la deuda bajó de 62 a 60 — que es lo
que cabía esperar, porque ninguno de los cuatro se propuso reducirla.

**No todas son deuda del mismo tipo, y mezclarlas sería el error.** Tres grupos:

| Grupo | Ejemplos | Qué se puede hacer |
|:---|:---|:---|
| **Verificable y sin escribir** | `FDGE-R40` (solapamiento entre PTs), `INTAKE-R05` | Deuda real: hay datos en el repositorio para comprobarlas |
| **Verificable solo con el sistema delante** | Las de `QA-*` —el navegador—, `FIDE-*` —una idea de negocio— | No se comprueban desde el repositorio y probablemente nunca se comprueben desde aquí |
| **Sobre el juicio de una persona** | `FND-R12` (qué documento manda), `SUITE-R22` | `SUITE-R26` dice que una `HARD` **aspira** a comprobación mecánica; aquí la aspiración no se cumple y decirlo es el trabajo |

`PT-023` midió lo mismo desde otro ángulo y llegó a la misma frontera: escribir un verificador
que se equivoca tres de cada cuatro veces es peor que no tenerlo, porque se silencia y ocupa el
sitio del que haría falta.

**Consecuencia:** `SUITE-R26` dice «aspira, no exige», y `audit` publica el denominador en cada
ejecución. Mientras la cifra esté a la vista, la deuda es una decisión; el día que se redondee a
«cobertura completa», vuelve a ser un engaño — que es literalmente lo que `PT-002` corrigió.

**Recomendación:** atacar el primer grupo por orden de daño, no de facilidad, y **no** convertir
el segundo y el tercero en casillas que comprueban que un archivo existe.

### `TD-09` · `SUITE-R22` se cuenta como cubierta porque el caso que prueba que NO lo está la nombra

Descubierto al recontar `TD-08`. `SUITE-R22` desapareció de la lista de reglas sin verificador
entre `EP-013` y hoy, y **ninguna herramienta la emite**. La única aparición en `tools/` es esta:

```bash
# selftest.sh:3314
chk   "una sin verificador lo DICE"   "ningún verificador"  RG2 SUITE-R22 --donde
```

Es el caso que comprueba que `regla.mjs --donde` **avisa correctamente cuando una regla no tiene
verificador**, y usa `SUITE-R22` justamente **porque no lo tiene**. `audit` cuenta esa mención
como cobertura.

**Consecuencia:** la regla elegida como ejemplo canónico de «sin verificador» figura como
verificada, y el contador de `TD-08` dice 60 donde debería decir 61. Es la misma familia de
defecto que `PT-051` ya atajó dentro de `regla.mjs` —una mención literal en un comentario contada
como emisión— pero en `audit`, y desde `selftest.sh`.

**Recomendación:** `audit` no debe contar `selftest.sh` como fuente de cobertura. El arnés
**ejercita** verificadores; no es uno. Va a `EP-017` con `TD-08`.

### `TD-10` · `tools/regla.mjs` reporta mal 47 de las 196 reglas que sabe buscar

Una línea, [`regla.mjs:55`](../methodology/tools/regla.mjs#L55):

```js
if (linea.includes(`\`${id}\``) && /HARD|SOFT/.test(linea)) {
```

Dos fallos con una causa común —decidir por *mención* y no por *definición*—:

- El filtro de severidad omite **`CHECK`**, que usan 20 reglas de `RULES.md`. Y las 15
  `EXEC-*` son prosa, sin severidad en la línea. Resultado: **21 reglas existentes se declaran
  inexistentes**, entre ellas `FDGE-R34`, la que `CLAUDE.md` nombra precondición de `G4`.
- Gana la primera línea `HARD|SOFT` que **menciona** el ID, no la que lo **define**: **26
  reglas devuelven el texto de otra** bajo la cabecera «definida en `RULES.md`». `FDGE-R43`
  devuelve `SUITE-R29`; `FDGE-R19` devuelve `SUITE-R42`.

Lo segundo es lo grave, y el propio archivo lo tiene escrito veinte líneas más abajo, en un
comentario de `PT-051`: *«una linea equivocada y creible es peor que ninguna»*. El mensaje del
primer caso es además una acusación: dice que quien cita la regla apunta a una que no existe.

`verify-suite` pasa limpio. Nada lo cubre. Divergencia `D20`. Va a `EP-017`.

### `TD-11` · `SESSION.json` quedó huérfano y sigue siendo el respaldo de quien no esté declarado

`PT-065` movió la **escritura** de la marca de sesión a `SESSION-<persona>.json` y dejó la
**lectura** con `?? SESSION.json` ([tracker.mjs:1462](../methodology/tools/tracker.mjs#L1462)).
Nadie vuelve a escribir ese archivo, así que se congeló con la marca de una sesión ya cerrada.
Reproducido con un usuario no declarado:

```
$ GIT_CONFIG_KEY_0=user.name GIT_CONFIG_VALUE_0="github-actions[bot]" tracker sesion
  sesion desde 258be16 (2026-08-18)
    commits    8 (MEDIDO)        <- trabajo de OTRA persona, de una sesion CERRADA
    lineas     2252 (MEDIDO)
  Otras sesiones abiertas:
    Alberto Martinez · desde 41aeaa8     <- la real
    Alberto Martinez · desde 258be16     <- el huerfano: la MISMA persona, dos veces
```

Rompe `AC-03` de `PT-065` —«todo lo que la sesión deriva sale del trabajo de **su** persona»— y
`AC-06` —«una sesión de otra persona se ve, y **se distingue** de la propia»—. Pasó los dos
porque `AC-05` pide que con una sola persona nada cambie: con una persona declarada el respaldo
no se ejercita nunca.

Y hay un agravante de diagnóstico: `sesion abrir` imprime «`SESSION.json` escrito» mientras
escribe el archivo por persona, y `sesion cerrar` afirma «*SESSION.json NO se borra: la sesion
siguiente lo sobrescribe*», que **ya es falso**. Eso es lo que mantuvo el defecto invisible.

**Recomendación:** decidir si el respaldo desaparece o si `SESSION.json` se migra y se borra; y
corregir los dos mensajes, que son los que engañan. Divergencia `D19`. Va a `EP-017`.

### `TD-12` · Los índices derivados no tienen generador, y tres instrucciones se contradicen

`PHASE 8` paso 3 ordena «regenerar `BACKLOG` desde `REGISTRY` y `changes/`». `SUITE-R35` exige
que los índices espejen el registro, y `verify-fdge` lo comprueba —hoy con 3 divergencias vivas—.
El `no hacer` del `HANDOFF` prohíbe editarlos a mano, con motivo: `REFACTOR_SCOPE.md` acabó con
catorce filas pegadas en una línea por hacerlo.

**Ninguna herramienta los genera.** `grep writeFileSync` sobre `tools/` no devuelve una sola
escritura de `BACKLOG.md`, `DISCOVERY.md`, `ENRICHMENT.md` ni `REFACTOR_SCOPE.md`.

**Consecuencia:** la única acción que cumple las tres instrucciones no existe, así que en la
práctica se incumple alguna. Hoy `BACKLOG.md` declara `EP-015` abierta y `EP-016` `DEFERRED`
cuando el registro dice las dos `CLOSED`.

**Recomendación:** `tracker indices` —o el nombre que se decida— que los derive y los escriba,
como `tracker checkpoint` hace con el checkpoint. Divergencia `D18`. Va a `EP-017`.

### `TD-13` · La tubería que publica corre menos comprobaciones que la que verifica

```
verificacion.yml   patrones · suite · core:check · audit · selftest · secretos ·
                   espejo · verify-fdge --all                                     8
publicar.yml       suite · core:check · audit · selftest · secretos               5
```

Al publicar **no** corren `verify:patrones`, `tracker espejo` ni **`verify-fdge --all`** — la que
`FDGE-R34` llama precondición de `G4`.

**Consecuencia:** el verde que autoriza una publicación no es el mismo verde que verifica el
repositorio. Y ya hay precedente de que la asimetría entre workflows muerde: el `HANDOFF` recoge
que `publicar.yml` clonaba en superficial y los casos derivados del historial fallaban solo ahí.

**Recomendación:** que `publicar.yml` corra el mismo conjunto, o que declare por escrito cuál
omite y por qué. Divergencia `D15`. Va a `EP-017`.

### `TD-14` · Quién abrió un pull request no es determinable desde el repositorio

Declarado por `PT-075`, y se declara **en vez de** escribir el verificador.

`SUITE-R42` dice que **el agente no abre el PR ni lo fusiona**. La mitad comprobable de esa
frase ya lo es: `verify-fdge` detecta que el trabajo de un PT esté escrito directamente en la
rama de integración en vez de llegar por su pull request. La otra mitad —**quién** pulsó el
botón— no lo es.

**Por qué no.** El agente actúa con la identidad git de la persona. `gh pr view --json author`
devuelve el mismo login lo abra quien lo abra, así que un verificador sobre ese campo diría
«correcto» siempre. `PT-023` midió exactamente ese fallo desde otro ángulo: un verificador
equivocado tres de cada cuatro veces **se silencia y ocupa el sitio del que haría falta**.

**Lo que sí hay, y su alcance.** `EXEC-R07` obliga a **describir** el comando reservado al
humano, y desde `PT-075` ese artefacto —`changes/PT-NNN-slug/acciones-humanas.md`— se exige en
`PHASE 9`. Si el agente ejecutó en vez de describir, la descripción falta y **la omisión se
ve**. No prueba que no lo ejecutara: es el mismo estatuto que `SUITE-R27` da a una firma —no
prueba que firmara una persona, pero convierte la afirmación en contrastable, y quien aparece
responde de ella.

**Recomendación:** no escribir el verificador de autoría. Si algún día la plataforma distingue
la identidad de un agente de la de su persona, esta deuda se cierra sola; forzarlo antes
produce un verde que no significa nada.

### `TD-15` · Tres de los seis componentes no se han ejecutado nunca

Contado el 2026-08-19, no estimado:

```
$ node -p "require('./docs/implementation/REGISTRY.json').counters"
{ PT:76, EP:17, QA:0, QR:0, QD:0, H:0, E:0, P:0, R:0, INC:0 }

QA/    solo README.md          PTSA/  solo README.md          ROADMAP.md  no existe
```

`Foundation` y `FDGE` llevan 76 tareas y dos ejecuciones completas. **`FQAGE`, `PTSA` y `FPGE`
no han corrido ni una vez**, y sus verificadores lo dicen con claridad:

```
verify-ptsa  → PTSA/ existe pero no contiene una auditoria (sin RESUMEN.md ni Products/)
verify-qa    → No hay QA/ ni ROADMAP.md: nada que verificar
```

**Por qué importa para aprobar la `9.0.0`, y no es simetría por la simetría.** `PTSA` es
literalmente el componente que **audita los productos contra la Declaración de Valor**. Esa
declaración existe y está firmada —`P-001` marco normativo, `P-002` procedimiento ejecutable,
`P-003` verificación mecánica, `P-004` paquete e instalación—, con su criterio de validez
escrito para cada uno. Nadie los ha auditado nunca contra ella. «Aprobar la versión» sin eso es
aprobar que las herramientas corren, no que el producto sirve.

**Los tres no están en el mismo caso:**

| Componente | Situación |
|:---|:---|
| `PTSA` | **Aplica y no se ha hecho.** Hay Declaración de Valor firmada y cuatro productos que auditar |
| `FPGE` | **Aplica y no se ha hecho.** Hay evidencia `FDGE` de sobra —76 tareas, `HISTORY`, `INCIDENTS`, los tres índices— para derivar un `ROADMAP` |
| `FQAGE` | **Probablemente no aplica**, y ahí está el defecto: `QA-R01` dice que opera «solo desde el navegador, nunca lee código», y cauce no tiene interfaz. Pero eso **no está declarado en ninguna parte**: `verify-qa` responde «nada que verificar», que es silencio, no una declaración. Un componente inaplicable tiene que decirlo, igual que `05-UI-UX-Brief` dice por qué no existe |

**Recomendación:** al cerrar `EP-017`, encadenar el ciclo que `CORE.md` ya prescribe —«`[CIERRA]`
→ el lote pasa a `DONE` y **ENCADENA** `[START QA]` sobre lo entregado»— y recorrer
`QA → PTSA → FPGE`. Para `FQAGE`, la salida esperada no es una campaña: es la **declaración de
inaplicabilidad**, comprobable, con el mismo criterio con que el paquete de Foundation declara
sus tres documentos omitidos.

## Hechos no determinados   `FND-R01`

Lo que no pudo verificarse con una fuente citable en este repositorio:

| | Por qué no se determinó |
|:---|:---|
| Cuántos proyectos destino tienen cauce instalado y en qué versión | No hay telemetría ni registro de instalaciones. `cauce compare` responde por proyecto, uno a uno |
| Si el ahorro declarado de contexto (~59 500 → ~16 000 tokens) se cumple en la práctica | La cifra está en `SUITE-R15` y en la cabecera de `build-core`; no hay medición reproducible en el repositorio |
| Cuántas de las 209 reglas se violan en la práctica y cuáles | `audit` mide **cobertura mecánica**, no cumplimiento observado en proyectos reales |
| Si el Trusted Publisher de npm está configurado | `publicar.yml:64-72` documenta que hay que configurarlo una vez en npmjs.com. Eso vive fuera del repositorio y no es verificable desde aquí |

## Deuda saldada durante esta instalación

Se registra para que una auditoría posterior distinga lo que arregló la instalación de lo que
arregló alguien después.

| Qué | Dónde |
|:---|:---|
| `*.log` en `.gitignore` se tragaba los ledgers append-only (`SUITE-R37`) | [INSTALL.log](../implementation/INSTALL.log) `[L3]` |
| La versión fijada en constante en `verify-fdge`, `migrate` y el fixture (`SUITE-R40`) | [INSTALL.log](../implementation/INSTALL.log) · corrección posterior |
| El procedimiento de instalación duplicado en `README.md`, divergente y ordenando borrar documentación contra `FND-R11` | [RECONCILIATION.log](../implementation/RECONCILIATION.log) `N1` |
| Cuatro cifras del número de casos escritas a mano, las cuatro erróneas | `N2` |
| `revisar-secretos` no corría en ningún workflow, con `FND-R29` declarándolo bloqueante | `N6` |
| `verify-fdge` no corría sobre los artefactos propios, con `FDGE-R34` pidiéndolo para `G4` | `N7` |
| `audit.mjs` tomaba el `README` de la raíz como «el instalador» | Consecuencia de `N1`, corregida en el mismo acto |
