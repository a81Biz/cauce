# Intake — LOTE `EP-017` · la prueba de fuego

```yaml
---
id: EP-017
created: 2026-08-19
status: DRAFT
mode: SUPERVISED
origin: DIRECT
---
```

---

## 1. Objetivo común `[HUMANO]`

```
Aprobar la 9.0.0 antes de publicarla: demostrar que cauce sirve para un proyecto NUEVO y para
uno LEGADO, y cerrar los defectos del paquete que se descubrieron intentando demostrarlo.

Van juntos y no sueltos porque los ocho primeros son las herramientas con las que se ejecuta y
se mide la prueba. Arreglarlos después de probar obligaría a volver a probar; probar sin
arreglarlos mide una herramienta rota. El orden no es preferencia: es la dependencia.
```

## 2. Criterio de éxito del lote `[HUMANO]`

```
Que un proyecto ajeno —uno nuevo y uno legado— recorra el marco de principio a fin con las
herramientas que van dentro del paquete, y que los tres documentos que lee quien llega
describan lo que la prueba necesitó de verdad, no lo que creíamos que necesitaría.

Hoy la confianza en «que el marco sirva a un proyecto ajeno» es SIN EVALUAR (00-Baseline).
El lote cierra cuando deja de serlo. No es la suma de los AC: ninguna tarea suelta lo da.
```

## 3. Qué NO entra en el lote `[HUMANO]`

```
OUT: publicar la 9.0.0 — condición explícita del firmante, y es POSTERIOR al cierre del lote
OUT: PT-025 (adaptador de Azure) — salvo que el proyecto de prueba lo use de verdad
OUT: TD-02 partir verify-fdge/selftest/tracker por tamaño — la recomendación es no hacerlo
OUT: TD-04 QA/ vs qa/ — toca LEXICON, es SUITE-R06e y merece su propia decisión
OUT: TD-06 borrar origin/desarrollo — SUITE-R06f, acción humana
OUT: TD-07 implementar Azure DevOps — se escribe contra un caso real, y no lo hay
OUT: las 60 reglas sin verificador — PT-067 corrige el DENOMINADOR, no escribe los 60
OUT: tocar el proyecto de Mercados Energéticos de forma destructiva — sobre copia o sin --apply
```

## 4. Firma única `[HUMANO]`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-19
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

**Firmado por delegación, y se dice.** Autorización literal del 2026-08-19: «adelante, tienes mi
VoBo para firmar todo lo necesario para que comiences ahora y no pares hasta terminar todas las
tareas y el EP». `INTAKE-R06` reserva la firma a una persona; la «Regla de cumplimiento» admite
la excepción cuando un humano la autoriza **dejando registro**, y este párrafo es ese registro
(`SUITE-R27`). No prueba que leyera nadie: prueba quién responde.

**Reservado y NO cubierto por esta firma:** `G4` y publicar la `9.0.0` —«`G4` y publicar son
míos. No publiques la 9.0.0», primer mensaje de la sesión, no retirado— (`SUITE-R06a`,
`EXEC-R04`).

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Viabilidad | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|:--|
| 1 | `PT-075` | BUG | S1 | SAFE | **Una regla sin verificador no ocurre** | `verify-fdge` · `CORE` · `PHASES` · `selftest` | — |
| 2 | `PT-055` | BUG | S2 | SAFE | `--gate G4` evalúa el lote que se le nombra | `verify-fdge` · `selftest` | — |
| 3 | `PT-076` | BUG | S1 | SAFE | **El arnés no escribe en el repositorio real** | `selftest` | — |
| 4 | `PT-068` | BUG | S1 | SAFE | La marca de sesión es de quien la abre | `tracker` · `patrones` · `selftest` | `PT-076` |
| 5 | `PT-074` | BUG | S2 | SAFE | La compuerta de viabilidad necesita una fase que la abra | `tracker` · `CORE` · `PHASES` · `selftest` | `PT-068` · `PT-075` |
| 6 | `PT-066` | BUG | S2 | SAFE | La regla que se consulta es la que se define | `regla` · `selftest` | — |
| 7 | `PT-067` | BUG | S2 | SAFE | El denominador de la cobertura está incompleto | `audit` · `selftest` | `PT-066` |
| 8 | `PT-078` | FEATURE | S1 | SAFE | **Ninguna regla queda sin clasificar** | `audit` · `selftest` | `PT-066` · `PT-067` |
| 9 | `PT-069` | FEATURE | S2 | SAFE | Los índices derivados necesitan generador | `tracker` · `selftest` | `PT-068` |
| 10 | `PT-070` | BUG | S2 | SAFE | El alcance del grafo lo calcula la herramienta | `plan-layout` · `selftest` | — |
| 11 | `PT-071` | BUG | S2 | SAFE | Publicar comprueba lo mismo que verificar | `publicar.yml` | — |
| 12 | `PT-077` | BUG | S2 | SAFE | La transición mira lo que la consulta bloquea | `tracker` · `selftest` | `PT-076` |
| 13 | `PT-072` | INVESTIGATION | S1 | **MARGINAL** | Un proyecto nuevo de verdad | ninguno del repo — produce evidencia | `PT-075`..`PT-077` |
| 14 | `PT-019` | CHORE | S2 | **MARGINAL** | El legado: uno sintético y uno real, no destructivo | ninguno del repo — produce evidencia | `PT-070` · `PT-072` |
| 15 | `PT-073` | CHORE | S2 | SAFE | Los tres documentos que lee quien llega | `MANUAL` · `CASOS-DE-USO` · `README` | `PT-072` · `PT-019` |

**Quince tareas.** El lote creció de diez a quince porque **cada una destapó la siguiente**, y
todas por ejecutar, no por leer: `PT-076` salió de intentar cumplir `FDGE-R54`, que creó
`PT-075`; `PT-077` salió de que `tracker avanzar` ignorara un bloqueo durante `PT-075`; y
`PT-078` salió de medir si el mecanismo de `PT-075` bastaba — y no bastaba.

## 5b. Viabilidad por tarea   `[AGENTE]` — `PT-059`

**Faltaba, y su ausencia es `PT-075`.** El lote se abrió sin consultar la compuerta de
viabilidad en ninguna de sus tareas. No lo detectó nada: `viabilidad` aparece **0 veces** en
`CORE.md`, `PHASES.md` y `verify-fdge.mjs`. Lo detectó el firmante preguntando.

Ejecutada el 2026-08-19 sobre las doce:

```
SAFE      diez tareas · coste tipico entre 665 y 2048 lineas (ESTIMADO),
          contra un precedente MEDIDO de 2408 en la sesion en curso

MARGINAL  PT-072 y PT-019 · coste SIN EVALUAR
          «no se puede comparar: el coste esta SIN EVALUAR. NO SE APRUEBA POR OMISION,
           y tampoco se prohibe sin evidencia»
```

**Las dos `MARGINAL` son las dos pruebas**, que es lo que este lote existe para hacer. Son
`MAJOR` y no hay ninguna `MAJOR` cerrada con la que comparar, así que el coste típico es
`SIN EVALUAR` — no «pequeño», **desconocido**. `PT-059` es explícita en que eso es
`MARGINAL` y no `UNSAFE`: prohibir sin evidencia bloquearía todo para siempre.

Consecuencia declarada, por `AC-02` de `PT-059` —«en `MARGINAL` no se inician operaciones
grandes: solo lo atómico»—: **`PT-072` y `PT-019` se ejecutan en pasos atómicos con
checkpoint entre ellos**, no de una vez. Si alguno no cabe, se corta con handoff y se declara,
que es justo lo que la compuerta existe para provocar.

**Aviso sobre esta medida:** el «mayor hecho» de `2408` está calculado leyendo `SESSION.json`,
el huérfano — `tracker sesion` dice `41aeaa8` y `tracker viabilidad` dice `258be16`. Es
`AC-07` de `PT-068` y `AC-04` de `PT-074`. La cifra se usa **sabiendo que su base está
mal**, y por eso el veredicto se revisará cuando `PT-068` cierre.

`PT-055` y `PT-019` están `DEFERRED` con issue abierto (#94, #26): entran **reabiertos**, no
duplicados. `SUITE-R08` — el ID no se reutiliza ni se inventa uno nuevo para lo mismo.

## 6. Análisis de solapamiento `[AGENTE]`

```
Pares que comparten archivos:
  PT-075 ↔ PT-055 ↔ PT-066 ↔ PT-067 ↔ PT-068 ↔ PT-074 ↔ PT-069 ↔ PT-070  (selftest.sh)  → SERIALIZADOS
  PT-068 ↔ PT-074 ↔ PT-069                               (tools/tracker.mjs)   → SERIALIZADOS
  PT-068 ↔ PT-069                                        (tools/patrones.mjs)  → SERIALIZADOS

  selftest.sh lo tocan OCHO de las doce. Es el mismo patrón que EP-015 declaró con
  tracker.mjs, y la conclusión es la misma: ejecución secuencial, ningún par en paralelo.

Orden de ejecución resultante:
  1. PT-075   que las reglas se puedan incumplir en silencio     <- exigido por el firmante
  2. PT-055   la compuerta que va a evaluar el lote entero
  3. PT-076   que el arnes deje de pisar el estado real     ┐
  4. PT-068   la marca la lee quien la abrio                ├ la CADENA de la sesion
  5. PT-074   el veredicto se espeja y se ve                ┘
  6. PT-066   la consulta de reglas                         ┐
  7. PT-067   el denominador de la cobertura                ├ la CADENA de la medida
  8. PT-078   ninguna regla queda sin clasificar            ┘
  9. PT-069   los indices derivados
 10. PT-070   el alcance del grafo
 11. PT-071   la tuberia que publica
 12. PT-077   la transicion mira lo que la consulta bloquea
 13. PT-072   greenfield
 14. PT-019   legado
 15. PT-073   los tres documentos

Motivo del orden: dependencia técnica y solapamiento, no prioridad declarada.
```

**Por qué `PT-055` va primera, y no es preferencia.** Es un defecto **en la compuerta que va a
evaluar este lote**. Con lotes nuevos abiertos vuelve a bloquear, y ya se integró una vez con el
rojo declarado como excepción. Un lote que existe para aprobar una versión no puede cerrarse con
la compuerta de cierre averiada.

**Por qué `PT-066` y `PT-067` van antes que las pruebas.** Son las dos herramientas con las que
se **mide**. `regla.mjs` ya indujo a error dentro de esta misma sesión: al consultar `FDGE-R19`
devolvió el texto de `SUITE-R42`, y estuvo a punto de usarse como autoridad. `audit` publica
cobertura sobre 181 reglas cuando el marco define 222.

**Por qué `PT-070` va antes que el greenfield.** `plan-layout` calcula `alcance: bin`. Si no se
corrige, el proyecto nuevo de `PT-072` nace con el grafo mal y la prueba mediría el defecto en
vez de medir el marco.

**Por qué los documentos van los últimos.** Escritos antes describen lo que uno cree que pasa;
escritos después, lo que pasó. Cada hueco que aparezca ejecutando es una línea que faltaba.

## 7. Supuestos compartidos `[AGENTE]`

```
- La 9.0.0 se prueba con «npm pack» desde este repositorio, NUNCA contra el paquete publicado.
  Si la prueba obliga a corregir el marco, se corrige y se vuelve a probar.
- Los diez tocan docs/methodology/ o el proceso que lo publica: SUITE-R06e aplica a todos, así
  que ninguno es trabajo de paso.
- El proyecto legado real (Mercados Energéticos) es CASO DE PRUEBA, no un proyecto donde
  trabajar: sobre copia o sin --apply. La autorización lo amplía a caso de prueba, no a destino.
- Foundation está recién regenerada (2026-08-19, pt_at_generation 65) y EXEC-R14 NO restringe.
  Si el lote se alarga más de 10 PTs, vuelve a restringir y hay que declararlo.
```

## 8. Observaciones del agente `[AGENTE]`

```
- PT que no encaja con el objetivo común: PT-071 es el más discutible. No es una herramienta de
  la prueba: es la tubería que publica. Entra porque «aprobar la 9.0.0» incluye que el verde que
  autoriza la publicación sea el mismo que verifica el repositorio, y hoy corre 5 de 8.

- Solapamiento que hace inviable el orden propuesto: ninguno. Seis tareas tocan selftest.sh, lo
  que impone secuencial, pero el orden por dependencia y el orden por solapamiento coinciden.

- Supuesto compartido que no está verificado: que exista un proyecto legado real accesible desde
  esta máquina. PT-019 lleva DEFERRED desde 2026-08-13 precisamente porque «depende de otro
  repositorio». Si no está accesible, PT-019 se hace SOLO con el sintético y se declara — no se
  inventa la mitad que falta.

- Lote demasiado grande para una sola firma: SÍ, y es la observación seria. Diez tareas es el
  lote más grande del repositorio: EP-016 tuvo cinco, EP-013 ocho. Se propone igualmente entero
  porque partirlo por la mitad dejaría la prueba de fuego en el segundo trozo, que es
  exactamente lo que lleva cuatro lotes aplazándose. Si el firmante prefiere partirlo, el corte
  natural es tras PT-071: las siete herramientas en un lote, las tres pruebas en otro.
```

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]  por delegación, con constancia
DoR-E5 EP asignado desde REGISTRY.json             [x]  tracker asignar EP --slug
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [ ]  PENDIENTE
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [ ]  PENDIENTE
DoR-E8 observaciones registradas                   [x]

VEREDICTO: CHALLENGE
Motivo: DoR-E6 y DoR-E7 no se pueden marcar en el momento de firmar el lote. E6 exige el
intake de las diez tareas, que se escriben al entrar en cada una; E7 exige BACKLOG.md, que
SUITE-R35 obliga a derivar del registro y que NINGUNA herramienta genera — es PT-069, una
tarea de este mismo lote. Cerrar E7 hoy significaría editarlo a mano, que es lo que el
HANDOFF prohíbe explícitamente.

El CHALLENGE es real y no formal: este lote no puede cumplir su propio DoR hasta que una de
sus tareas exista. Es el cuarto caso de la familia de PT-029 —una comprobación que hace
imposible el estado que otra obliga a atravesar— y se declara aquí en vez de fabricar dos
casillas en verde.

CHALLENGE aceptado por: Alberto Martínez, por delegación con constancia (2026-08-19)
Alcance de la aceptación: abrir el lote con E6 y E7 abiertas, y cerrarlas conforme cada
tarea escribe su intake y PT-069 entrega el generador. NO cubre G4 ni publicar.
```

---

## Cierre del lote

| PT | Estado | Resuelta por |
|:---|:---|:---|
| `PT-055` | INTEGRATED | HECHO · la compuerta del lote mira al lote que evalúa |
| `PT-066` | INTEGRATED | HECHO · la definición es la que EMPIEZA por el ID, no la que lo menciona |
| `PT-067` | INTEGRATED | HECHO · el universo son 223 reglas, no 181, y una mención no es un verificador |
| `PT-068` | INTEGRATED | HECHO · la marca de sesión es de quien la abre |
| `PT-069` | INTEGRATED | HECHO · `tracker indices` · 86 PT indexados, cero fuera |
| `PT-070` | INTEGRATED | HECHO · el alcance del grafo se deriva, y coincide con lo que `PT-020` escribió a mano |
| `PT-071` | INTEGRATED | HECHO · `publicar` corre las 8 comprobaciones, no 5 |
| `PT-072` | INTEGRATED | HECHO · **un proyecto nuevo de verdad** · siete huecos, dos `S1` |
| `PT-073` | INTEGRATED | HECHO · los tres documentos, escritos con lo que las pruebas enseñaron |
| `PT-074` | INTEGRATED | HECHO · la viabilidad se ve en el tablero |
| `PT-075` | INTEGRATED | HECHO · una regla sin verificador no ocurre |
| `PT-076` | INTEGRATED | HECHO · el arnés no escribe en el repositorio real |
| `PT-077` | INTEGRATED | HECHO · `avanzar` respeta el `STATE_MISMATCH` que `siguiente` bloquea |
| `PT-078` | INTEGRATED | HECHO · ninguna regla sin clasificar · 94 + 5 + 125 = 224 |
| `PT-079` | INTEGRATED | HECHO · el rastro sobrevive a la rama · 0 de 85 enlaces rotos |
| `PT-080` | INTEGRATED | HECHO · ninguna regla con dos textos · `EXECUTION-MODES` de 17 a 14 |
| `PT-081` | INTEGRATED | HECHO · una regla nueva no rige hacia atrás · `EP-017` es la `10.0.0` |
| `PT-082` | INTEGRATED | HECHO · un caso no depende de quién lo ejecuta · `trabajo` protegida |
| `PT-083` | INTEGRATED | HECHO · la plantilla del paquete pasa su propio verificador |
| `PT-084` | INTEGRATED | HECHO · la plataforma es opcional de verdad · nota en `TRANSICIONES.log` |
| `PT-085` | INTEGRATED | HECHO · el sello de versión · el estado retomable dice la verdad |
| `PT-086` | INTEGRATED | HECHO · la batería corre lo afectado · 134 de 1118 casos, 106 s |
| `PT-019` | INTEGRATED | HECHO · **el legado real se puede migrar** · `4.12.0`, 127 tareas, `0` cambios |
| `PT-025` | DEFERRED | DIFERIDA a `PT-025` · Azure sigue sin proyecto que lo use (`F3`). Deuda declarada, no resuelta |

## Lo que el lote entrega, en tres cifras

```
tareas                21 integradas + 1 diferida, declarada
reglas nuevas         SUITE-R56 · FDGE-R54 · SUITE-R57
selftest              976 → 1118 casos
```

## Y lo que NO se hizo, dicho aquí y no en una nota al pie

**El ciclo `QA → PTSA → FPGE` sigue sin ejecutarse** (`TD-15`). El intake lo pedía al cerrar, y no
se hizo: son **componentes**, con sus propios identificadores y compuertas, y meterlos en el
cierre de este lote habría convertido una prueba de fuego en tres.

Queda como lo que es —deuda declarada, no un olvido— y `SUITE-R57` garantiza que se vea: son tres
componentes sin ejecutar sobre una versión que ya se sella.

**`migrate --apply` tampoco se ejecutó** (`PT-019`): se validó que el informe es correcto y
accionable, no que aplicarlo funcione.

`EP-017` pasa a `CLOSED` cuando las trece estén `INTEGRATED`/`CLOSED` o retiradas
explícitamente, con entrada propia en `HISTORY.log`.

### Y al cerrar se ENCADENA el ciclo, que es lo que falta para usar el marco entero

`CORE.md` lo prescribe: «`[CIERRA]` → el lote pasa a `DONE` y **ENCADENA** `[START QA]` sobre lo
entregado», y `CLAUDE.md` declara el ciclo `FDGE → QA → PTSA → FPGE → FDGE PHASE 1`.

**Tres de los seis componentes no se han ejecutado nunca** (`TD-15`): los contadores `QA`, `QR`,
`QD`, `H` y `R` están todos a cero, `QA/` y `PTSA/` sólo tienen su `README`, y no hay
`ROADMAP.md`. Cerrar el lote sin esto aprobaría que las herramientas corren, no que el producto
sirve — y **`PTSA` es justo el componente que audita los productos contra la Declaración de
Valor**, que está firmada y nunca se ha usado.

| Orden | Trigger | Qué se espera |
|:--|:---|:---|
| 1 | `[START QA]` | **La declaración de inaplicabilidad**, no una campaña: `QA-R01` dice que opera sólo desde el navegador y cauce no tiene interfaz. Hoy `verify-qa` responde «nada que verificar», que es silencio, no una declaración |
| 2 | `[START PTSA]` | Auditoría de `P-001`..`P-004` contra la Declaración de Valor, con `CORE-PTSA.md` cargado (`SUITE-R25`) y `COVERAGE.md` sin celdas en blanco (`PTSA-R77`) |
| 3 | `[START FPGE]` | `ROADMAP.md` derivado de la evidencia de los tres componentes |

Ninguno es un `PT` de este lote: son **componentes**, con sus propios identificadores
(`QD-NNN`, `H-NNN`, `R-NNN`) y sus propias compuertas. Se ejecutan **después** del cierre, sobre
lo entregado.

Si una se bloquea, **el lote entero se detiene** (`FDGE-R41`) y `EP-017` pasa a `BLOCKED` con la
causa en `BACKLOG.md`.


---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

## Revisión 1 — 2026-08-19

**Qué cambia:** el lote pasa de diez tareas a doce. Entra `PT-075` **la primera** y `PT-074` en
sexto lugar. Se añade §5b con la viabilidad de cada tarea.

**Motivo:** dos peticiones del firmante en la misma sesión, las dos sobre lo mismo.

La primera: *«me hace falta la parte del cálculo de la sesión, no lo veo aplicado a ningún pt o
ep»*. No estaba aplicado. Al buscar por qué: `viabilidad` aparece 0 veces en `CORE.md`,
`PHASES.md` y `verify-fdge.mjs` — la compuerta que `PT-059` escribió no la abre ninguna fase.
Eso es `PT-074`, y la medida que faltaba es §5b.

La segunda: *«llevas dos reglas que no quieres seguir y no hay nada que te lo exija, debemos
entonces empezar por ahí, por aumentar la exigencia para que lo sigas igual que el resto, mete
ésto como un PT y que se resuelva antes que todo»*. Eso es `PT-075`, en primer lugar por
instrucción explícita. Las dos reglas, medidas: la compuerta de viabilidad, y la mitad de
`SUITE-R42` que dice que el agente no abre el PR ni empuja — `verify-fdge` sólo comprueba que
el PR **exista**, nunca quién lo abrió.

**Las dos son incumplimientos del agente en esta sesión, no hipótesis.** Y las dos pasaron sin
que ninguna comprobación las viera.

**Firmado por:** Alberto Martínez, por delegación con constancia.

## Revisión 2 — 2026-08-19

**Qué cambia:** entra `PT-076` en quinto lugar. El lote pasa a **trece** tareas. Se registra la
viabilidad de las trece (`FDGE-R54`) y se declara `EXEC-R14` **de nuevo en vigor**.

**Motivo:** *«se supone que ya debes seguir todas las reglas de cauce, como el cálculo de
sesión»*. Al ir a cumplirlo —`FDGE-R54` la creó `PT-075` hace una hora— el cálculo daba **1
commit y 248 líneas** en una sesión de decenas.

No era un error de lectura. `selftest.sh` invoca `tracker` contra el repositorio **real** por
`TRR()`, y tres casos de `sesion abrir` y seis de `sesion cerrar` **escriben** ahí: pisan la
marca de sesión y apilan en `SESSION_LOG.md`, que es append-only. **140 entradas acumuladas**,
nueve más por pasada. Reproducido con un solo caso: la marca pasó de `78fbcd9` a `a6913da`.

Va en quinto lugar y antes que `PT-068` porque **corrompe la base de cálculo de lo que
`PT-068` arregla**, y porque la compuerta que `PT-075` acaba de crear decide sobre ese dato.

**Y `EXEC-R14` vuelve a restringir.** El propio §7 lo anticipó: «si el lote se alarga más de 10
PTs, vuelve a restringir y hay que declararlo». Con `PT-076` el contador llega a 76 contra un
`pt_at_generation` de 65: **antigüedad 11**, por encima del umbral. Se opera como `MANUAL`
—que con la delegación vigente sólo retira el `G3` automático de `EXEC-R06`— y queda declarado
aquí y en `SESSION_LOG.md`. No se toca `CLAUDE.md`: es restricción temporal, no cambio de modo.

**Viabilidad de las trece:** once `SAFE`, y `PT-072` y `PT-019` `MARGINAL` — las dos pruebas,
sin precedente `MAJOR` con el que comparar. Sin cambio respecto a la Revisión 1, salvo que
ahora **consta en el registro** en vez de sólo en este documento.

**Firmado por:** Alberto Martínez, por delegación con constancia.

## Revisión 3 — 2026-08-19

**Qué cambia:** `PT-076`, `PT-068` y `PT-074` suben a los puestos 3, 4 y 5, juntas y en ese
orden. `PT-066` y `PT-067` bajan. `PT-077` entra en el 14.

**Motivo:** *«sigo sin ver el cálculo de la sesión»*, por tercera vez. Está calculado y
registrado en las catorce —`FDGE-R54`—, pero **no se ve, y su base está mal**. Tres capas, las
tres medidas:

1. **No se espeja.** `cuerpoDeIssue` no incluye `viabilidad`, así que desde GitHub el veredicto
   es invisible. `SUITE-R35` dice que el registro asigna y la plataforma **espeja**: este trozo
   de estado no lo hace. Es `AC-02` de `PT-074`.
2. **Se midió contra la sesión huérfana.** Los catorce `medido_en` dicen `258be16`, una sesión
   cerrada ayer. `SESSION.json` frente a `SESSION-alberto-martinez.json`. Es `AC-07` de `PT-068`.
3. **Y la marca real la pisa la batería.** `tracker sesion` dice `desde f532dc1 · 0 commits`,
   que es un commit de hace diez minutos. Es `PT-076`.

**Por qué el orden es este y no otro.** Enseñar el veredicto antes de arreglar la base sería
mostrar una cifra calculada sobre la sesión equivocada **con formato de dato medido** — que es
exactamente lo que `PT-058` corrigió y lo que el `no hacer` del `HANDOFF` prohíbe. La cadena va
de abajo arriba: que la marca no se pise (`PT-076`) → que la lea quien la abrió (`PT-068`) →
que el veredicto se vea con su `medido_en` (`PT-074`).

`PT-066` y `PT-067` bajan porque no bloquean a nadie: son herramientas de consulta y de medida,
y ninguna de las tres de la cadena depende de ellas.

**Firmado por:** Alberto Martínez, por delegación con constancia.

---

## Cierre efectivo   `2026-08-20`

```
G4 ejecutada:  PR #171 · trabajo -> main · CI en verde antes de fusionar
merge:         29d1681
tag:           v10.0.0 · 9ce9853 · creado DESPUES del merge
integrado por: Alberto Martínez
```

**El orden de `G4` y el tag no fue cosmético.** Un tag creado antes del merge apunta a un árbol
sin lo que la versión trae, y la línea base de `FDGE-R43` y del detector de reglas nuevas quedaría
mintiendo. Es el error que `PT-081` cometió eligiendo `origin/main`, en otra forma.

**Trece issues cerrados** al llegar el estado terminal a la rama por defecto (`SUITE-R46`). `#35`
(`PT-025`, `DEFERRED`) sigue abierto **a propósito**: `PT-013` declaró que un aplazado está vivo
para el espejo, porque aplazar algo debe ponerlo a la vista y no sacarlo de ella.

**Auditado antes de cerrar.** `PTSA-2026-08-20`, certificación `B`, `Health` 79.9,
`coverage` 0.89. Nueve hallazgos: dos cerrados, siete abiertos en `EP-018`.

**`PUBLICAR` sigue sin autorizar.** El lote cierra sin publicar, y eso se dice.

### El issue del lote no cierra en su propio ciclo, y es correcto

`tracker cerrar` lo rechaza:

```
✗ SUITE-R46  EP-017 (aqui CLOSED, en main DONE). El orden es: apuntar el estado terminal
   AQUI, mergear, y cerrar DESPUES.
```

**Es un huevo y gallina real**, no un defecto: `G4` **es** lo que convierte el lote en terminal,
así que su estado terminal no puede estar en `main` en el momento de `G4`.

`#127` cerrará en el siguiente merge a la rama por defecto, que es el `G4` de `EP-018`. Es lo que
hicieron los dieciséis lotes anteriores —los dieciséis están `CLOSED` con su issue cerrado— y
forzar un merge extra sólo para cerrar un issue multiplicaría `G4`, que es justo lo que
`EXEC-R03` prohíbe.
