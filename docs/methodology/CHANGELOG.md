# CHANGELOG — Methodology Suite

Versionado semántico. `MAJOR` cambia reglas vinculantes o nombres canónicos; `MINOR` añade
capacidad sin romper; `PATCH` corrige texto.

`SUITE-R13` · Todo proyecto declara su `suite_version` en `REGISTRY.json` y en su `CLAUDE.md`.
El agente compara ambos con este archivo en PHASE 0 y reporta cualquier desajuste.

---

## 5.2.1 — 2026-08-12

### La frontera del proyecto se declara, y se dice qué la sostiene

La pregunta era si hacía falta un contenedor para poder empezar. No hace falta: cauce ya es por
proyecto —el paquete es una dependencia de desarrollo de cada uno y la suite se copia dentro—,
y con las credenciales de publicación fuera, un contenedor aporta aislamiento, no una
precondición.

Lo que **no** está cercado es el agente. Ninguna regla escrita en un `.md` impide que un proceso
lea la carpeta de al lado, y en la primera máquina donde se usó eso ya ocurrió: el historial de
permisos guarda órdenes concedidas que alcanzaban un proyecto hermano. Hay once alcanzables
desde esa raíz.

`SUITE-R39` nombra los dos niveles **con lo que garantiza cada uno**: configuración de permisos,
que ataja el alcance accidental y depende de que el arnés la respete; contenedor con solo esa
raíz montada, que lo impone el núcleo. Elegir es humano, y **empezar sin ninguno de los dos es
una opción legítima** — pero se escribe. `plan-layout` enumera la vecindad y detecta si el
proyecto ya se contiene.

**Cauce no genera contenedores.** Inventar un `Dockerfile` para un stack que no conoce es
imponer terreno, justo lo que `FND-R25` prohíbe, y obligaría a mantener plantillas por lenguaje
para siempre. Detecta si los hay y lo dice.

Tampoco se envía una cerca que no se puede comprobar. Se consideró generar un
`.claude/settings.json` con reglas `deny`, y se descartó: no se puede verificar desde aquí que
bloqueen de verdad, y un control de seguridad sin probar es el verde por omisión que este marco
existe para cazar.

Las credenciales de publicación se quedan **fuera** de cualquier contenedor (`SUITE-R06a`): una
credencial dentro del recinto convierte el recinto en el sitio desde donde se publica.

### El detector de escapes degradados solo miraba el código

Al escribir lo anterior apareció esto: el detector de bytes de control de la 4.8.0 recorría
únicamente las herramientas. Por eso nadie vio que el texto de `SUITE-R38` —la regla que existe
para cazar escapes degradados— tenía su propio `\b` convertido en el byte `0x08`.

Extendido a los documentos, encontró **siete más** en `CHANGELOG.md` y `FDGE-Prompts.md`. Los
siete estaban en párrafos que describen la avería. Un `0x08` no se ve al leer, y una regla se
cita, se copia y acaba dentro de un patrón: es la misma avería una capa más arriba.

566 elementos cubiertos, sin huecos.

### Migración

Ninguna. `SUITE-R39` se cumple escribiendo la decisión en `I0-bis`; los proyectos ya instalados
la atienden en su próxima instalación o actualización.

## 5.2.0 — 2026-08-12

**Un patrón puede estar mal y compilar.** Esa es la frase entera del problema que esta versión
ataca, después de ocho apariciones.

### Qué pasaba

Al editar, una secuencia de escape se perdía: `\b` quedaba como el byte `0x08`, `\s` como la
letra `s`. El regex resultante es **sintácticamente válido** y no casa nada — o casa otra cosa.
El verificador entonces informa «sin errores» porque no encuentra nada que reprochar, y **el
fallo es indistinguible del éxito**. Ninguna revisión por lectura lo ve: `/AC-d+/` y `/AC-\d+/`
se parecen demasiado.

La 4.8.0 añadió un detector de bytes de control. Eso trata un síntoma: caza `\b` → `0x08` y no
caza `\d` → `d`, que es el mismo fallo con un carácter imprimible. **Cazaba la mitad de los
casos, y dejaba fuera la mitad silenciosa.**

### Qué se hace ahora — `SUITE-R38`

`tools/patrones.mjs` define los patrones críticos **una vez**, cada uno con lo que tiene que
casar y lo que no debe casar. `tools/verify-patrones.mjs` ejecuta ese contrato: 10 patrones, 47
comprobaciones.

Un patrón degradado falla su propio ejemplo, con nombre y con el patrón impreso al lado. Para
pasar por bueno tendrían que romperse el patrón **y** sus ejemplos en la misma dirección.

Hacen falta las dos listas: solo `casa` deja pasar un patrón demasiado laxo; solo `noCasa`, uno
que no casa nada. Es la misma exigencia que el marco le pone a un criterio de aceptación — si no
se puede escribir la comprobación que lo tumba, no es un criterio.

Corre **el primero** en el CI y en `npm run verify`: si un patrón se degradó, todo lo que venga
después informa «sin errores» porque no encuentra nada, no porque no haya nada.

### Y de paso, las tres copias del sello

La fórmula estaba en `build-core`, `verify-suite` y `verify-fdge`. Normalizar dos dejó al tercero
contradiciendo a los otros y cinco casos del selftest en rojo. Ahora hay una, en `patrones.mjs`,
con su propio contrato: que el sello **no dependa del fin de línea** —la propiedad que rompió el
primer CI del marco— y que dos contenidos distintos no den el mismo sello.

### Publicar sin credencial

El `NPM_TOKEN` se ha eliminado del repositorio y el workflow ya no lo usa: publica con **OIDC
trusted publishing**, autenticándose como este repositorio y este workflow. No hay token que
rotar, que filtrar ni que caducar — y un secreto muerto en el repositorio es exactamente lo que
había hasta ahora.

Requiere configurarlo una vez en npmjs.com → el paquete → Settings → Trusted Publisher.

### Verificación

`selftest.sh`: **171 casos**, con el bloque **S** — que incluye degradar un escape a propósito y
comprobar que su ejemplo falla. `audit.mjs`: 531 elementos, 0 huecos.

---

## 5.1.0 — 2026-08-12

**El reanclaje se escribe.** La 5.0.0 dejó `FDGE-R52` diciendo «relee el estado antes de cada
transición de fase» y declarándola, en el propio texto, la regla más débil del marco. Lo era por
un motivo concreto: **releer no deja rastro**. No se puede exigir ni comprobar.

### `FDGE-R52`, reescrita

Cada transición de fase deja tres líneas **en la tarea** —comentario del issue si hay
plataforma, `changes/PT-NNN-slug/bitacora.md` si no—: qué se cierra, dónde se está, qué sigue.

```
2026-08-12 · PHASE 4 → 5
cierro:   diseño aprobado en G2, middleware en vez de decorador
estoy en: implementación, tocando src/middleware/
sigue:    tests de integración y manifiesto de evidencia
```

**Escribir obliga a releer; releer no obliga a nada.** Esa es toda la diferencia. La nota tiene
fecha, es observable y la encuentra la sesión siguiente sin preguntar — y `verify-fdge` puede
exigirla: un PT en `PHASE n` necesita `n-1` notas. Append-only: una bitácora que se reescribe
deja de ser un rastro.

### `FDGE-R53` · toda tarea declara cómo termina

Una línea observable en el intake. **La deriva ocurre en tareas sin forma**: la que declara su
final lo tiene; la que no, se estira hasta que nadie recuerda dónde empezó. Si la condición
necesita un «y además», son dos tareas — y partirlas ahí cuesta un minuto frente a descubrirlo
en `G3`.

### Ninguna de las dos invalida trabajo hecho

Ambas rigen **solo para lo abierto bajo 5.1.0 o posterior**, usando el sello por asignación de
`SUITE-R18`. Sin esa puerta, adoptarlas exigiría una bitácora retroactiva a cada PT ya
integrado: en el proyecto que motivó todo esto, 101 PTs en `PHASE 9` — ocho notas cada uno.
Obligar a rehacer trabajo válido es la forma más rápida de que un equipo abandone el marco.

### La portada declaraba una versión de hace ocho

`README.md` es la primera página del paquete en npm y de GitHub, y decía **4.5.0**. No mencionaba
seis de las doce herramientas y sus instrucciones eran anteriores a que el paquete existiera.
Nadie la miraba: `audit` enumera reglas, fases, artefactos y herramientas, y `verify-suite` busca
el patrón `Suite version: **X**` — la portada usaba otra redacción y se escapó. El mismo verde
por omisión, en la puerta de entrada.

### Seis verificadores viajaban sin correr

`cauce verify` invocaba tres de las doce herramientas. `verify-qa`, `verify-ptsa` y
`revisar-secretos` se instalaban y no las llamaba nadie — un verificador que no se ejecuta es
documentación. Ahora corren las seis, y el código de salida `2` («nada que verificar aquí») deja
de contar como fallo.

### Verificación

`selftest.sh`: **168 casos**, con el bloque **R**. `audit.mjs`: 522 elementos, 0 huecos.

---

## 5.0.0 — 2026-08-12

**Fases D, E, F y G del plan.** Sube a `MAJOR` porque cambia lo que un proyecto debe tener para
cumplir: un bloque de estado en `HANDOFF.md` y —si declara plataforma— un espejo verificable.
La guía de migración está al final de esta entrada.

### El estado sale de la memoria del agente — `SUITE-R33` · `SUITE-R34`

`SUITE-R03` dice desde la 4.0.0 que ninguna sesión depende de la memoria del agente. **Nada lo
comprobaba**: `verify-fdge` ni siquiera abría `HANDOFF.md`. Una regla que solo se cumple por
buena voluntad es una recomendación — y era la que decidía si mañana hay que explicarlo todo
otra vez.

`HANDOFF.md` abre ahora con un bloque `ESTADO` de campos fijos: qué implementación está abierta,
qué tarea y en qué fase, qué compuerta espera y a quién, **la siguiente acción concreta**, las
decisiones vivas y qué no hacer. El relato va debajo. Un `HANDOFF` de doscientas líneas cuenta
lo que se hizo; retomar necesita saber qué sigue, y eso cabe en una pantalla.

Y `SUITE-R34` lo exige **contra git**: si hubo commits en `changes/` después del último que tocó
`HANDOFF.md`, la sesión terminó sin dejar el estado retomable. Git es el único reloj que no
depende de que alguien se acuerde.

`FDGE-R52` añade el reanclaje en cada transición de fase, y se declara **la regla más débil del
marco**: de la deriva dentro de una sesión se consigue que se note al final, no impedirla.

### La plataforma espeja; el registro asigna — `SUITE-R35`

Nueva herramienta `tools/tracker.mjs`. El contrato es de la metodología y los adaptadores lo
implementan:

| Concepto | GitHub | Azure DevOps |
|:---|:---|:---|
| implementación abierta | milestone | epic work item |
| tarea | issue | task work item |
| compuerta `G4` | pull request | pull request |

`SUITE-R08` no se toca: el registro sigue siendo el único asignador y cada `allocation` guarda su
número de issue. El espejo se comprueba **por enumeración en las dos direcciones**. Y el issue
**referencia** el intake, no lo copia — dos copias del mismo texto divergen, que es la causa raíz
que la v4 nació para eliminar.

El adaptador habla **CLI, no MCP**: la verificación tiene que correr donde no hay nadie delante
para autorizar un OAuth. El de Azure declara el contrato y dice que no lo implementa todavía, en
vez de fingir que sí.

### Nada se publica sin revisar secretos — `FND-R29` · `FND-R30`

Nueva herramienta `tools/revisar-secretos.mjs`. Recorre el árbol y, con `--historial`, los
commits — porque **un secreto en la historia sigue ahí después de borrarlo del archivo**, y
publicar es irreversible justo ahí.

Bloquea y **propone la corrección**: un escáner que solo dice «hay un secreto» deja el trabajo
entero al que lo lee. Un falso positivo se firma por escrito, con nombre y motivo; no se silencia
el escáner.

Los dos casos que lo motivaron son reales: una contraseña de base de datos en claro en el código
de una API sin remoto, y un `.claude/settings.local.json` con la ruta absoluta de una máquina
dentro del primer `npm publish` de este mismo paquete — cazado por un humano leyendo la salida,
no por una comprobación.

`FND-R30` añade los accesos a la misma parada: descubrir a mitad de sesión que falta un permiso
es perder la sesión.

### Adoptar la plataforma sin arrastrar el pasado — `SUITE-R36` · `SUITE-R37`

**Solo migra lo vivo.** Lo cerrado no es estado, es evidencia, y se queda en el repositorio. En
el proyecto que motivó esto: 127 asignaciones, **dos** vivas. Migrar dos frente a 127 no es una
diferencia de esfuerzo — es la diferencia entre un tablero que se lee y uno que no.

`SUITE-R37` cierra qué se versiona: evidencia, ledgers y `docs/methodology/` sí; la salida del
grafo no; y los ledgers append-only **nunca** bajo una regla `*.log`, que se los traga en
silencio.

### Verificación

`selftest.sh`: **161 casos**, con los bloques **O** (continuidad), **P** (plataforma) y **Q**
(secretos). `audit.mjs`: 520 elementos, 0 huecos.

### Migración desde 4.x

1. `npm i -D @a81biz/cauce@5` y `npx cauce install`.
2. Añadir el bloque `ESTADO` al principio de `HANDOFF.md` — el formato está en `INSTALL.md` y en
   `FDGE-Prompts.md`. Sin él, `verify-fdge` falla con `SUITE-R33`.
3. Escribirlo **al cerrar cada fase**, no al terminar la sesión: una sesión no siempre avisa de
   que va a terminar.
4. Opcional: declarar `tracker.plataforma` en `REGISTRY.json` y ejecutar
   `tracker.mjs abrir --aplicar`. Sin declararla, nada cambia.

Ningún PT en vuelo se invalida: `SUITE-R18` sigue sellando cada asignación con su versión.

---

## 4.14.0 — 2026-08-12

**Fase C: la implementación deja de ser un plan y pasa a ser una unidad abierta.**

El síntoma que la motiva no es de disciplina, es mecánico. Sin una unidad abierta hay que
declarar **cada vez** que algo es nuevo — y eso es justo lo que se olvida a mitad de sesión.
Medido en un proyecto real: las cinco tareas de un mismo lote pagaron 87, 89, 90, 96 y 132
líneas de intake, cada una con su firma propia **además** de la del lote. Unas 500 líneas de
ceremonia para una sola implementación. Cobrar el ritual completo por cada arreglo tiene una
sola salida practicable: saltárselo, y perder el rastro.

### El default invertido — `FDGE-R48` · `FDGE-R49`

| | |
|:---|:---|
| `FDGE-R48` | Como mucho **una** implementación abierta. Con dos, «esto es lo mismo» deja de tener respuesta y el default no significa nada |
| `FDGE-R49` | Mientras haya una abierta, **todo le pertenece**. Lo raro pasa a ser abrir y cerrar; lo común no necesita marcador. Trabajar fuera exige cerrarla o abrir otra, y ambas cosas se dicen. `track: HOTFIX` es la única excepción: producción caída no espera a que se cierre nada |

Marcadores nuevos: **`[IMPLEMENTACIÓN]`** y **`[CIERRA]`**. Cerrar encadena `[START QA]` sobre
lo que la implementación entregó — QA deja de ser un recordatorio y pasa a ser un evento.

Y lo que resuelve de continuidad: **lo que está abierto lo dice el registro, no la memoria del
agente.** Por eso sobrevive a que la sesión termine.

### Nueva o parte de: el criterio está escrito — `FDGE-R50`

Es **parte de la abierta** si toca los productos que su objetivo declara, si sirve a su criterio
de éxito, o si corrige algo que ella misma introdujo. Es **nueva** si entrega valor que la
abierta no prometió, o si el criterio de éxito de la abierta se cumple igual sin ella. El agente
lo aplica y propone; el humano confirma. Dejarlo al juicio del momento hace que dos sesiones
respondan distinto sobre el mismo trabajo.

### El intake pesado pertenece a la implementación — `FDGE-R51`

Nueva plantilla `INTAKE/templates/TAREA.md`: qué se quiere, criterios de aceptación y qué no
entra. La firma, el veredicto de `G1` y la severidad **se heredan del lote** (`INTAKE-R08`).

Lo que **no** se hereda: los criterios de aceptación —son lo único que cambia de una tarea a
otra, y son contra lo que valida `G3`—, la evidencia y `G4`. La ligereza está en la entrada, no
en la salida.

`audit.mjs` distingue ahora dos clases de plantilla de admisión: exigirle a la ligera lo que
define a la pesada la volvería pesada otra vez.

### Verificación

`selftest.sh`: **143 casos**, con el bloque **N**. `audit.mjs`: 496 elementos, 0 huecos.

Y el detector de bytes de control de la 4.8.0 se ganó el sueldo: al escribir la comprobación de
`FDGE-R51` un `\b` volvió a convertirse en `0x08` y lo cazó en la misma pasada.

---

## 4.13.0 — 2026-08-12

**Fase A del plan: sanear la fuente antes de publicarla.** Un proyecto real corrigió cuatro
defectos de los verificadores bajo sus propios PT, y los cuatro vivían solo allí. Publicar la
suite como paquete sin traerlos habría repartido los defectos a todo el que la instalara.

### Las cuatro correcciones, y la quinta que apareció al traerlas

En JavaScript `\s` incluye el salto de línea. Con `\s*`, un campo de firma **vacío** capturaba
la etiqueta `Fecha:` de la línea siguiente y lo daba por firmado:

| | Consecuencia |
|:---|:---|
| `RE_VALOR_FIRMADA` | Una **Declaración de Valor sin firmar se leía como firmada**. `FND-R24` es la regla contra la que audita PTSA: el verde pasaba sobre nada |
| `RE_FIRMA_NOMBRE` | `SUITE-R27` se evalúa una vez sobre todos los intakes, así que **un solo intake honestamente sin firmar bloqueaba G4 para el proyecto entero**, acusándolo además de firma inválida |
| `RE_SIGNED_BY` | El mismo defecto en el campo de solicitud |
| `INTAKE-R08` | Los miembros de un lote se leían de todo el texto: citar un PT anterior como precedente lo convertía en miembro y disparaba un fallo sobre un PT ya cerrado. Obligaba a escribir los intakes **sin referencias cruzadas**, que es justo lo que da trazabilidad. Ahora una mención en prosa es una mención y una fila de tabla es un miembro |
| `verify-suite` | Marcaba 4 enlaces rotos en **toda** instalación brownfield, por no copiar `FIDE/` — que es lo que el propio `INSTALL.md` manda. Un componente que la instalación manda no copiar no puede contar como enlace roto |

**La quinta apareció al traer las otras.** `RE_FIRMA_NOMBRE` no incluía `revisado`, así que las
firmas de `LAYOUT.md` **nunca se contrastaban contra `firmantes:`** pese a que el verificador
decía «toda firma corresponde a un firmante declarado». Un verde que describía una comprobación
que no ocurría.

### La divergencia se mide — `SUITE-R31`

`tools/comparar-marco.mjs` entra en la suite. Nació en un proyecto que tuvo que inventárselo, y
apuntaba a una ruta absoluta de una máquina concreta; ahora exige una referencia y lo dice en
vez de comparar contra nada.

Dice qué difiere **y en qué dirección**. No sincroniza: si la corrección se hizo en el proyecto
falta propagarla, y si la referencia avanzó falta migrar. **Nunca a ciegas en ninguna
dirección** — sobrescribir la copia de un proyecto puede revertir correcciones suyas, que es
exactamente lo que estuvo a punto de pasar dos veces durante una instalación.

### Un espacio de trabajo nace con contenido — `SUITE-R32`

Git no versiona directorios vacíos. Un `PTSA/` creado por el instalador y nunca escrito
desaparece en el primer clon, y `verify-ptsa` lo reporta como «nada que auditar» — lo mismo que
diría si la auditoría no aplicara. Ocurrió: se creó en la instalación y hoy no existe.

### El núcleo no era el mismo en Linux que en Windows

Lo destapó el primer CI del propio marco, y es el defecto más serio de esta versión.

`build-core` cortaba la cabecera de `PHASES.md` con `indexOf('
---
')`, un literal que **nunca
casa en un archivo con CRLF**. En Windows el núcleo se llevaba esa cabecera; en Linux no. El
agente cargaba un `CORE.md` distinto según la plataforma donde se hubiera generado.

Y el sello hasheaba **bytes crudos**, así que con `autocrlf` el CI acusaba de desincronizado un
núcleo intacto. La fórmula estaba copiada en **tres sitios** —`build-core`, `verify-suite` y
`verify-fdge`— y arreglar dos dejó al tercero declarando desincronizado lo que los otros dos
daban por bueno: cinco casos del selftest se volvieron rojos al normalizar solo dos. Tres copias
de la misma fórmula son dos de más, y queda anotado.

Ahora los tres normalizan antes de hashear, y el selftest lo comprueba generando el núcleo sobre
una copia convertida a `LF`. Más `.gitattributes` con `eol=lf`, que es el cinturón además del
tirante.

### Verificación

`selftest.sh`: **132 casos**, con los cinco defectos de arriba y la instalación brownfield.
`audit.mjs`: 494 elementos, 0 huecos.

---

## 4.12.0 — 2026-08-06

**La instalación decidía y ejecutaba, y no dejaba rastro de lo segundo.** La primera
instalación completa movió 15 documentos, sustituyó un `.gitignore` y creó un repositorio, y el
único testimonio de todo ello era el árbol de archivos resultante: `SESSION_LOG.md`,
`HISTORY.log` y `MIGRATION.log` quedaron con su cabecera y nada más.

### `INSTALL.log` — los hechos, no solo las decisiones — `SUITE-R30`

`LAYOUT.md` guarda lo que se **decidió**. `docs/implementation/INSTALL.log` guarda lo que se
**ejecutó**: qué se movió y desde dónde, qué se sustituyó y con qué respaldo, qué commit lo
contiene, qué dependencia se instaló, con qué alcance se generó el grafo — y qué falló. Sin él,
revertir una instalación exige reconstruir a mano lo que pasó, y una auditoría posterior no
puede distinguir lo que hizo la instalación de lo que hizo alguien después.

`verify-fdge` **cruza los dos artefactos**: toda propuesta `ACEPTADA` o `MODIFICADA` en
`LAYOUT.md` tiene que tener su entrada en `INSTALL.log`, declarada con la etiqueta `[L<n>]`. La
primera versión cruzaba vocabulario y acusó de no ejecutada una acción que sí estaba registrada,
solo que descrita con otras palabras — el mismo error que la propia suite castiga en una celda
`NO_EVALUADA` sin motivo: no deducir, declarar. También falla al revés: una etiqueta que apunta
a una propuesta inexistente o `RECHAZADA` significa que se ejecutó algo que nadie aprobó. Una decisión sin ejecución registrada
es una decisión que nadie sabe si se cumplió. Lo que falla también se escribe: un registro que
solo cuenta lo que salió bien no sirve para revertir, que es para lo que existe.

### `REGISTRY.json` se siembra completo

El instalador sembraba `graph` y no `foundation`, así que el lector no podía distinguir si la
clave faltaba o no aplicaba. Ahora arranca con las dos.

### Verificación

`selftest.sh`: **125 casos**. `audit.mjs`: 489 elementos, 0 huecos.

---

## 4.11.0 — 2026-08-06

**El instalador dejaba las decisiones al agente, así que el resultado dependía de quién
instalara.** La 4.10.0 enumeraba el terreno y presentaba las opciones; elegir entre ellas era
del criterio del agente en ese momento. Dos instalaciones del mismo proyecto podían acabar
distintas — que es exactamente lo que un marco de gobernanza no puede permitirse.

### Los cuatro criterios, escritos — `FND-R25..R28`

| | Criterio |
|:---|:---|
| `FND-R25` · **destino** | Carpeta con `package.json`, `docker-compose.yml` o `playwright.config.ts` **es una raíz de proyecto**: su contenido sube a la raíz. Sin esas marcas es una carpeta de código suelta y su sitio es `src/`. No es estético: esas herramientas buscan su configuración en la raíz, y la suite espera `playwright.config.ts` ahí para QA (`QA-R10`) — bajo `src/` el marco se enfrentaría a sí mismo. |
| `FND-R26` · **historia git** | Se conserva si el repositorio anidado tiene **más de un commit o un remoto**; se descarta si no. Preservar un único commit de andamio, sin remoto y con todo el trabajo real sin versionar, protege lo que no hay que proteger. |
| `FND-R27` · **qué se versiona** | Un repositorio que no versiona ni un archivo es tan inútil como no tenerlo. La herramienta **propone** un `.gitignore` del stack detectado; sustituirlo lo aprueba una persona en `G0`. |
| `FND-R28` · **alcance del grafo** | Código propio. Fuera: dependencias, salida de compilación, pruebas, fixtures, mocks y configuración suelta de la raíz. El grafo describe el sistema; las pruebas describen cómo se comprueba. |

`plan-layout.mjs` los aplica y publica el resultado con su motivo. El papel del humano deja de
ser elegir entre opciones que el agente improvisa: es **aprobar o corregir** lo que el criterio
produjo.

### La Declaración de Valor se produce en Foundation, no al instalar — `FND-R24`

Se pedía al instalar, y describir qué entrega un sistema exige haber leído el código. Ahora el
`CLAUDE.md` la deja como `PENDIENTE — Foundation PHASE 0`, ahí el agente la redacta leyendo
`README`, manifiestos, rutas, entry points y `docs/business/`, el humano la corrige y la firma, y
la primera auditoría PTSA la contrasta contra los productos reales. `verify-fdge` acepta el
marcador **antes** de Foundation y lo rechaza **después**: pedirla antes de saber es pedir
generalidades; dejarla pendiente después es dejar a PTSA auditando contra nada.

### Verificación

`selftest.sh`: **119 casos**, con los seis criterios y el ciclo de la Declaración de Valor.
`audit.mjs`: 488 elementos, 0 huecos.

---

## 4.10.0 — 2026-08-06

**Instalar deja de ser una lista de comandos: se le dice a Claude y lo conduce en la
conversación.** Copias `docs/methodology/` y escribes «instala el framework». Nada más.

### La conversación es la interfaz — `SUITE-R28`

La 4.9.0 enumeraba el terreno correctamente y después escribía un `.md` para que el humano lo
leyera y volviera. Eso desperdicia el único medio donde el humano ya está mirando, y convierte
una decisión de treinta segundos en una tarea pendiente.

Ahora el agente **ejecuta, resume en la conversación y pregunta ahí**. Los artefactos se siguen
escribiendo —son el registro auditable y sobreviven a la sesión— pero no son por dónde se
decide. Lo que no se puede sustituir es **quién decide**, no quién teclea.

Nuevo documento **`INSTALL.md`**, nuevo trigger **`[INSTALL SUITE]`** (también lo dispara
«instala el framework») y nueva sección `Instalación` en `PHASES.md`, así que el procedimiento
viaja en `CORE.md`: nueve fases `I0..I8` —terreno · decisión G0 · ejecutar · estructura ·
dependencias · grafo · Declaración de Valor · verificar · arrancar—.

### Dependencias declaradas y verificadas — `SUITE-R29`

`plan-layout.mjs` comprueba `node`, `git`, `python` y `graphifyy`, y dice para qué sirve cada
una. Se instalan **una por una y con permiso**. Descubrir a mitad de sesión que falta una es
perder la sesión — y sin `graphifyy` el grafo queda `MISSING`, que bloquea `G2` en los PT
`MAJOR` (`FDGE-R43`). QA añade `playwright` cuando se vaya a usar.

### Tres puntos ciegos más del auditor

| | |
|:---|:---|
| **Triggers** | El enumerador filtraba por los prefijos que ya existían (`[START`, `resume`, `delta`…). Un trigger con verbo nuevo —`[INSTALL SUITE]`— no entraba en el universo, así que su ausencia de los documentos operativos no se veía. Es el mismo modo de fallo que `PTSA-R76` corrige para las auditorías de producto. |
| **Secciones sin mapear** | La sección `Instalación` de `PHASES.md` no estaba en el mapa de `verify-suite`, y al no estarlo **se saltaba entera**: verde por omisión. |
| **Comodín equivocado** | Un bloque cuyo título no lleva `PHASE n` caía en el comodín `lotes` y se comparaba contra el criterio de otro: fallaba diciendo que faltaba algo que no era. |

Y `SUITE-R27` no reconocía **su propia plantilla**: la línea `firmantes:` que la suite reparte
lleva un comentario, y el parser exigía fin de línea limpio.

### Un repositorio vacío no es un repositorio

La primera instalación real destapó un caso que ninguna regla cubría: la raíz **era** un
repositorio git y aun así `G4`, `PHASE 10` y la evidencia anclada a commits seguían sin
sustancia, porque el `.gitignore` heredado contenía **`*`** y no había un solo archivo
versionado. `verify-fdge` lo detecta ahora y lo nombra: «el repositorio de la raíz no versiona
ningún archivo porque `.gitignore` contiene `*`».

### Verificación

`selftest.sh`: **113 casos**. `audit.mjs`: 484 elementos, 0 huecos.

---

## 4.9.0 — 2026-08-06

**Primera instalación real, y la suite se instaló en la carpeta equivocada sin que nada lo
dijera.** El repositorio git y todo el código estaban un nivel por debajo de la raíz. Con la
raíz fuera del repositorio, `G4` no tiene merge que verificar, `PHASE 10` no tiene dónde
revertir y la evidencia no se puede anclar a un commit. `verify-fdge` informó de dos artefactos
que faltaban y ni una palabra sobre que estaba gobernando la carpeta equivocada.

### El terreno se enumera antes de documentarlo — `FND-R19..R23`

| | |
|:---|:---|
| `FND-R19` | **La carpeta que recibe la suite manda.** Es la raíz, sin excepción; todo lo demás se acomoda bajo ella. Mover la raíz para acomodar lo que ya estaba es como se pierde la trazabilidad. |
| `FND-R20` | `PHASE 0` ejecuta `tools/plan-layout.mjs`: repositorios anidados, dónde vive el código de verdad, manifiestos, documentos sueltos y artefactos que faltan. |
| `FND-R21` | El plan **propone; no mueve un archivo**. Un `LAYOUT.md` firmado no se sobrescribe: se archiva y se regenera. |
| `FND-R22` | Pasa por **G0**: cada movimiento `ACEPTADO`, `RECHAZADO` con motivo o `MODIFICADO` con destino real. Lo aceptado se ejecuta como PT `REFACTOR` con `Estructural: sí`. |
| `FND-R23` | Sin terreno resuelto no se abre trabajo nuevo. Documentar y auditar una estructura que va a cambiar es trabajo que hay que rehacer. |

Nueva herramienta **`tools/plan-layout.mjs`** y nuevo artefacto **`docs/implementation/LAYOUT.md`**.
`verify-fdge` falla ante un repositorio git anidado y ante un `LAYOUT.md` sin firmar.

### La Declaración de Valor la redacta el agente — `FND-R24`

Se pedía en blanco al humano. `PHASE 0` la **propone** leyendo `README`, manifiestos, rutas,
entry points y los `.md` de negocio del repositorio; el humano corrige y firma. La diferencia
con `INTAKE-R01` es el tiempo verbal: un Intake declara **intención futura**, que solo el humano
tiene; la Declaración de Valor describe **lo que ya existe**, y eso está en el repositorio.

Lo que sigue siendo del humano: **qué hace válido** cada producto. El agente describe lo que el
sistema entrega; si eso sirve o no, lo decide quien conoce el negocio.

### El generador venía prefirmado

`plan-layout` imprimía el bloque de firma con el `SÍ` ya escrito, así que un `LAYOUT.md` recién
generado se daba por firmado — el mismo defecto de firma prerrellenada que ya costó un ciclo con
las plantillas de Intake. Ahora imprime `SÍ | NO` para que una persona borre una, exige
`Revisado por: <nombre>` contrastado contra `firmantes:` (`SUITE-R27`), y **dos veredictos en el
archivo son un error**: la línea se edita en su sitio.

### Verificación

`selftest.sh`: **108 casos**, con el bloque **M** de terreno —repositorio anidado, raíz sin git,
documentos sueltos, `LAYOUT` sin firmar, `LAYOUT` firmado que no se sobrescribe, dos veredictos—.
`audit.mjs`: 480 elementos, 0 huecos.

---

## 4.8.0 — 2026-08-06

**Segunda pasada adversaria: se atacó lo que la 4.7.0 acababa de construir.** Nueve huecos
más, y los dos peores estaban en las herramientas que declaran que todo lo demás está bien.

### El arnés certificaba verificadores reventados

`chkno` da por bueno un caso cuando la herramienta **no** imprime cierto patrón. Una
herramienta que revienta tampoco lo imprime. Se rompió `verify-qa.mjs` a propósito: el
selftest siguió en verde. Cada `chkno` era un falso positivo en potencia — y son la mitad de
los casos «⇒ pasa». Ahora un rastro de excepción invalida el caso, pase lo que pase.

### El auditor prometía comprobar la sintaxis y no lo hacía

Su cabecera declaraba «Herramientas → existen · **sintaxis válida** · ejercitadas por
selftest». Nunca lo comprobó: una herramienta que no compila pasaba la auditoría entera. Una
promesa sin implementar es peor que una ausencia, porque nadie va a buscar lo que cree
cubierto. `audit.mjs` ejecuta ahora `node --check` y `bash -n` sobre cada herramienta.

### `verify-qa`, recién nacido y ya burlable

| | Qué pasaba |
|:---|:---|
| **`QA-R03` al revés** | El patrón casaba la **palabra** «captura». Un caso que dice «no se pudo tomar captura» certificaba **tener** captura: la regla verificaba justo lo contrario de lo que exige |
| **Capturas fantasma** | Bastaba referenciar `evidence/paso1.png`; que el archivo existiera no se comprobaba |
| **`QD` inventados** | Sin `QA-DEFECTS.md`, la comprobación de existencia se saltaba entera y cualquier número pasaba |
| **Veredicto ambiguo** | Se tomaba el primer `resultado:` del archivo, que podía ser el de un ejemplo |

### `verify-ptsa`: tres formas de encoger el universo

Una fila **«P-001 y P-002»** valía por los dos productos y colapsaba ocho celdas en cuatro:
media auditoría desaparecía sin rastro. Una matriz **dentro de un bloque de código** —que un
humano lee como ejemplo— se verificaba como real. Y el margen de `0.02` del `coverage`, que
existía para el redondeo, permitía declarar dos puntos de más.

### El sello del núcleo solo paraba al descuidado

El sello de cuerpo de la 4.7.0 detecta un retoque a mano, pero **todo está en el repositorio**:
quien reescribe `CORE.md` y recalcula el hash pasa. Se comprobó. La defensa que sí cierra el
caso no es un hash más largo —no hay secreto con el que sellarlo— sino **regenerar desde las
fuentes y comparar**: el contenido tiene que ser exactamente lo que produce el generador.
`--check` señala la primera línea que difiere.

### Una migración a medias reabría el proyecto

`SUITE-R17` mantiene el modo restringido mientras `REGISTRY.suite_version` no cuadre con la
versión vigente. Pero `migrate --apply` **sella la versión** al final, con las decisiones
humanas todavía sin tomar: el desajuste desaparecía y el modo restringido se levantaba solo.
El aviso que el propio script imprime —«sigue en modo restringido»— dejaba de ser cierto en la
línea siguiente. Ahora migrate deja las pendientes en `REGISTRY.migration_pending` y
`verify-fdge` las hace cumplir hasta que una persona las resuelva y borre el campo.

### Verificación

`selftest.sh`: **100 casos**, con el bloque **L** de falsificación —sello recalculado a mano,
capturas que no existen, productos agrupados en una fila, matriz escondida en una valla,
`coverage` inflado, migración a medias, herramienta que no compila—. `audit.mjs`: **469
elementos**, 0 huecos.

Cuatro de los nueve huecos de esta ronda estaban en código escrito hace menos de una hora. Es
la razón de que la auditoría se ejecute en vez de leerse.

---

## 4.7.0 — 2026-08-06

**Auditoría adversaria: no qué dice el marco, sino cómo se le burla.** Cada hallazgo de aquí
se confirmó ejecutando el ataque, no leyendo el documento. Doce huecos, todos cerrados con su
caso de regresión.

### El agujero de fondo: `CORE.md` se podía reescribir a mano

El sello `<!-- fuentes: -->` hasheaba las **fuentes**, nunca el resultado. Editar el cuerpo de
`CORE.md` dejando la cabecera intacta pasaba `build-core --check`, `verify-suite` y
`verify-fdge` a la vez. Se comprobó degradando `SUITE-R06` de `HARD` a `SOFT` e invirtiendo su
texto a «SE PUEDEN automatizar»: los tres verificadores en verde. Y `CORE.md` es **lo único
que el agente carga**. El único test que existía —«CORE.md editado a mano»— solo detectaba que
se borrara la cadena `GENERADO por tools`, una decoración.

Ahora `build-core.mjs` emite un segundo sello `<!-- cuerpo: sha -->` sobre lo generado,
normalizado a `
` para que no dependa de si el archivo se guardó en Windows. Cubre `CORE.md`
y `CORE-PTSA.md`.

### `verify-ptsa` rechazaba lo correcto y certificaba lo vacío

| | Qué pasaba | Prueba |
|:---|:---|:---|
| **Falso negativo** | **Toda** `NO_EVALUADA` correctamente justificada se rechazaba: el chequeo buscaba el literal `NO_EVALUADA — motivo` y la plantilla lo escribe entre comillas invertidas, así que `indexOf` devolvía −1 y el corte se quedaba en el último carácter | una matriz con su tabla de motivos completa → `✗ PTSA-R78` |
| **Falso positivo** | Un universo de **una fila** con todo en `PASS` certificaba: nada contrastaba el universo declarado contra `Products/` ni contra `inventory/` | 2 productos en disco, 1 en la matriz → certificaba |
| **Falso positivo** | **Todo** `NO_APLICA` → cero errores. Y `NO_APLICA` contaba en el denominador, así que el `coverage` no llegaba nunca a 1.00 y el aviso `PTSA-R79` era permanente: ruido | matriz entera en `NO_APLICA` → «auditoría verificable» |
| **Sin comprobar** | Una celda `FAIL` no necesitaba imputar hallazgo, y el `H-NNN` citado podía no existir | — |

`PTSA-R76` pasa a tener verificación real (universo contra `Products/` e `inventory/`),
`NO_APLICA` sale del denominador y exige justificación, y toda celda `FAIL` imputa un `H-NNN`
que debe existir en `Findings/`.

### 57 de las 80 reglas de PTSA llegaban vacías o no llegaban

La 4.6.0 creó el overlay para que las 80 llegaran al agente. La auditoría midió **qué** llega:
**15 llegaban sin nada que ejecutar** — 8 axiomas reducidos a su título (`A1 — Evidencia sobre
Opinión`) y 7 cortadas en los dos puntos que introducían su tabla o su lista. El auditor las
daba por buenas porque solo comprobaba que el identificador apareciera: un criterio **vacío por
construcción**, ya que el overlay se genera de la misma fuente que se enumera.

El extractor ahora arrastra el enunciado del axioma, las filas de la tabla, los ítems de la
lista, las fórmulas del bloque de código y la prosa de continuación. El auditor exige
**enunciado ejecutable**, no presencia del ID.

### Dos componentes enteros sin una sola comprobación

La cobertura mecánica regla a regla, medida por primera vez:

| | antes | ahora |
|:---|:---|:---|
| **QA** | **0 / 19** | 9 reglas verificadas |
| **FPGE** | **0 / 10** | 5 reglas verificadas |
| `SUITE-R06` — la lista cerrada de acciones que nadie automatiza | **0 apariciones en las herramientas** | integración sin nombre humano ⇒ falla |
| `AUTONOMOUS` | ninguna comprobación adicional: el modo de mayor riesgo era el menos verificado | sin lote `EP-NNN` que declare el alcance ⇒ falla |

Nueva herramienta **`tools/verify-qa.mjs`**: `QA-R03` captura por caso · `QA-R04` veredictos
cerrados · `QA-R06`/`R07` todo `FAIL` con su `QD` y todo `QD` con captura · `QA-R09` un `HP` en
fallo fuerza `QA-F` · `QA-R11` ningún `QD` cerrado sin humano · `QA-R13` `QR-NNN` desde
`REGISTRY` · `QA-R16` sin esperas fijas · `QA-R19` todo caso cita su `AC-nn` · `FPGE-R01`
evidencia de origen · `FPGE-R03` read-only sobre artefactos ajenos · `FPGE-R05`/`R08` frescura
· `FPGE-R07` bloqueo por `QA-F`.

`SUITE-R26` (nueva, CHECK): toda regla `HARD` aspira a comprobación mecánica, y `audit.mjs`
enumera la cobertura por componente. Un componente con cero deja de pasar inadvertido.

### Qué prueba una firma — `SUITE-R27`

Nada distinguía una firma humana de una escrita por el agente, y no hay solución técnica
completa: el agente escribe el archivo. Lo que sí se puede es hacerla **contrastable**. El
`CLAUDE.md` del proyecto declara `firmantes:` y `verify-fdge` rechaza toda firma ajena a esa
lista, la plantilla sin personalizar (`Nombre Apellido`) y la ausencia de lista.

La regla dice con precisión qué garantiza y qué no: **hay un nombre concreto y autorizado
asociado a cada decisión irreversible**; la voluntad detrás no se puede garantizar. Quien
figura en `firmantes` responde de lo que lleva su nombre.

### El escáner de secretos miraba donde no hacía falta

`FDGE-R45` solo recorría `evidence/`. Una credencial en `intake.md` —el sitio **más** probable:
una persona pegando el reporte de un bug tal cual lo recibió— no se detectaba, y el directorio
del PT se commitea igual. Ahora escanea evidencia **y** directorio de trabajo.

### El fallo silencioso que lleva seis veces

`\b` volvió a quedar como byte **0x08** dentro de una regex al editar. El regex compila, no
casa nada, y el verificador informa «sin errores» porque no encuentra nada que reprochar. Es
invisible a cualquier revisión por lectura.

`audit.mjs` enumera ahora los **bytes de control** en el código de las herramientas. Se probó
inyectando uno: detectado, con el comando de reparación en el mensaje.

### El auditor enumeraba de menos — tres clases más

| Clase | Antes | Ahora |
|:---|:---|:---|
| plantillas | solo `INTAKE/templates/` | todos los `templates/`, criterios por familia |
| artefactos | solo ledgers de `LEXICON §6.2` | + espacios de trabajo §6.3–§6.5 |
| reglas de PTSA | presencia del ID | enunciado ejecutable |
| herramientas | existe · citada · ejercitada | + sin bytes de control |
| — | — | + cobertura mecánica por componente |

Cobertura: **460 elementos**, 0 huecos. `selftest.sh`: **89 casos**, con los bloques **J** (QA y
FPGE) y **K** (integridad del núcleo, secretos, irreversibles y firmas). Cada hueco de esta
versión tiene su caso de regresión: es la diferencia entre arreglarlo y evitar que vuelva.

### Nuevo también

`PTSA/templates/COVERAGE.md` — plantilla copiable de la matriz, con universo, motivos de
`NO_EVALUADA`, justificaciones de `NO_APLICA` y checklist de cierre. `verify-ptsa` detecta que
se copió sin completar.

---

## 4.6.0 — 2026-08-06

**PTSA adopta la enumeración, y la economía de tokens se vuelve regla.** La 4.5.0 arregló el
método con que se audita **la metodología**. Esta versión lo lleva al componente que audita
**el producto**, y escribe como norma lo que hasta ahora era solo una intención declarada.

### PTSA audita por enumeración — `PTSA-R76..R80`

`PTSA-R11` ya exigía declarar `audit_coverage`, pero nada enumeraba el universo contra el que
se medía esa cobertura: un producto que nadie miró simplemente no aparecía. Es el mismo modo
de fallo por el que dos auditorías del mismo sistema sacaban hallazgos distintos sin que nada
hubiera cambiado.

| | |
|:---|:---|
| `PTSA-R76` | El universo se enumera desde fuentes **mecánicas** —`inventory/*.md`, productos de `PHASE 4`, reglas de `PHASE 0`—, no desde lo que el auditor encuentre. Lo que está en el código y no en el inventario es un hallazgo D4. |
| `PTSA-R77` | Matriz **universo × D1-D4** en `PTSA/COVERAGE.md`. Toda celda con `PASS` · `FAIL` · `NO_APLICA` · `NO_EVALUADA`. No existe la celda en blanco. |
| `PTSA-R78` | `NO_EVALUADA` no es un aprobado: no penaliza Health, degrada Confidence. `coverage = evaluadas / universo`, publicado junto al score. |
| `PTSA-R79` | Parada por **matriz completa**, no por agotamiento del hallador. |
| `PTSA-R80` | `tools/verify-ptsa.mjs`. Un score cuya matriz no cuadra no se certifica. |

`PTSA-R74` (criterios de compleción) suma los puntos 8 y 9. Nuevo artefacto:
`PTSA/COVERAGE.md`. Nueva herramienta: `tools/verify-ptsa.mjs`.

### Economía de tokens, ahora vinculante

| | |
|:---|:---|
| `SUITE-R23` | **Disciplina de respuesta.** Lo que el agente escribe: nunca lo que salió bien, por qué una decisión es correcta, justificaciones de diseño, recapitulaciones ni preámbulos. Solo lo que falla, lo que cambió, lo que queda y lo que necesita decisión. El porqué vive en `design.md`, `HISTORY.log` y `CHANGELOG.md`. |
| `SUITE-R24` | **Directiva sin relato.** Lo que el agente lee: `PHASES.md` telegráfico (`LEE·HAZ·SALE·NO·PARA`), `CORE.md` recortado a la primera frase imperativa. Se recorta el porqué, nunca la precisión de la regla. |

El lenguaje cavernícola **no se le aplica al humano**: `INTAKE-R01` sigue exigiendo que sea
una persona quien redacte los criterios de aceptación.

Nueva sección **§14 del README** — los tres flujos de texto, la tabla de qué se recorta y qué
no, y un checkpoint antes/después.

### Plantilla de la matriz — `PTSA/templates/COVERAGE.md`

El formato vivía dentro de la especificación, que en runtime no se carga. Ahora es una
plantilla copiable con las cuatro secciones obligatorias (universo, matriz, motivos de
`NO_EVALUADA`, justificaciones de `NO_APLICA`) y su checklist de cierre. `verify-ptsa` detecta
que se copió sin completar (marcadores `YYYY-MM-DD` intactos).

### Overlay por componente — `SUITE-R25`

**De las 80 reglas de la especificación de PTSA, 57 no llegaban nunca al agente.** `CORE.md`
solo llevaba las 23 que `RULES.md` cita, y `SUITE-R15` prohíbe cargar la especificación: al
invocar `[START PTSA]` se auditaba con el 29 % del propio ruleset. Nadie lo veía porque el
enumerador de reglas de `audit.mjs` solo miraba `RULES.md`, `LEXICON.md` y `EXECUTION-MODES.md`.

| | tokens |
|:---|---:|
| especificación completa | ~27 500 |
| **`CORE-PTSA.md`** — las 80 reglas en su frase imperativa | **~2 600** |

`SUITE-R25`: un componente cuyo ruleset propio no cabe en `CORE.md` sin encarecer **todas** las
sesiones recibe un overlay generado, que se carga solo al invocarlo. `build-core.mjs` lo emite
junto a `CORE.md` y `--check` verifica su hash por separado. `migrate.mjs` lo exige al subir de
versión: un proyecto de 4.5.x o anterior no lo tiene.

### El auditor enumeraba de menos

Tres clases estaban infra-enumeradas, y por eso la auditoría daba verde sin mirarlo todo:

| Clase | Antes | Ahora |
|:---|:---|:---|
| plantillas | solo `INTAKE/templates/` | **todos** los directorios `templates/`, con criterios por familia |
| artefactos | solo los ledgers de `LEXICON §6.2` | + espacios de trabajo de §6.3–§6.5, con criterio propio: los escribe una fase, no el instalador |
| reglas | solo `RULES` · `LEXICON` · `EXECUTION-MODES` | + las 80 de la especificación de PTSA (clase `regla-ptsa`) |

Cobertura: **442 elementos**, 0 huecos. De paso, `PHASES.md` nombra literalmente
`enrichment.md`, `RESUMEN.md`, `AUDIT_LOG.md` y `ESTADO_ACTUAL.md`: escritos como
`discovery|enrichment|scope .md` o `RESUMEN` a secas, ninguna comprobación podía encontrarlos.

### Verificación

`selftest.sh` sube a **70 casos** con el bloque **I** (ocho casos de PTSA por enumeración:
matriz completa, celda en blanco, `COVERAGE.md` ausente, coverage inflado, producto en
`DRAFT`, `BUG` cerrado sin humano, score sin cobertura, plantilla sin completar, proyecto sin
`PTSA/`, `PTSA/` sin auditoría, overlay obsoleto) más la exigencia del overlay en migración.
`audit.mjs`: **442 elementos cubiertos, 0 huecos**.

---

## 4.5.0 — 2026-08-06

**Cambia el método de auditoría, no solo los artefactos.** Hasta aquí cada revisión
encontraba defectos nuevos, y la causa no era falta de rigor: era falta de **enumeración**.
`verify-suite` comprueba lo que se le enseñó a comprobar; todo lo demás dependía de que una
persona mirara, y cada pasada miraba cosas distintas.

### `tools/audit.mjs` — cobertura por enumeración

No busca defectos concretos. Enumera **todos los elementos** del sistema y comprueba, para
cada uno, que tenga lo que un elemento de su clase debe tener:

| Clase | Qué exige |
|:---|:---|
| Regla | definida · citada en algo operativo · si es `CHECK`, verificada por un script · presente en `CORE.md` |
| Fase | en `PHASES.md` · en su archivo de prompts · en `CORE.md` · en un diagrama del README |
| Trigger | en `LEXICON` · en `CORE` · en algún documento operativo |
| Artefacto | declarado en `LEXICON` §6 · creado por el instalador · usado en el procedimiento |
| Plantilla | existe · referenciada por el protocolo · con bloque de firma y veredicto |
| Estado y enumeraciones | definidos · presentes en `CORE.md` |
| Herramienta | existe · sintaxis válida · ejercitada por `selftest` · documentada |

En su primera ejecución encontró **41 huecos** que cinco auditorías por inspección no habían
visto. Hoy: **338 elementos cubiertos, 0 huecos.**

### El defecto que ocultaba a los demás: CRLF

`CORE.md` llevaba **25 reglas menos de las que creía**: todas las de `LEXICON` y
`EXECUTION-MODES`, más `SUITE-R00` y `SUITE-R14`. El agente cargaba un núcleo incompleto y
nada avisaba.

Causa: en JavaScript `.` **no** casa `
` —es un terminador de línea—, así que un regex
anclado en `$` sin flag `m` falla en cualquier archivo guardado en Windows. Todo el parseo
por líneas usa ahora `split(/
?
/)`, y los cuatro scripts lo llevan anotado en su
cabecera.

Fue también el **quinto** tropiezo con `new RegExp` construido desde strings: los patrones
dinámicos con `\d`/`\s` se pierden según la capa de escapado. El extractor usa ahora un
regex **literal** y filtra por prefijo en código.

### Ordenar el código de un desarrollo sin orden

La reconciliación de 4.1.0 ordenaba la **documentación**. El **código** desordenado seguía
sin gobierno: la única mención vivía como texto libre en una instrucción de instalación.

- `FND-R16` · `PHASE 1` cataloga también el desorden del código: fuera de `src/` · módulos
  duplicados o casi duplicados · huérfanos sin importadores · configuración dispersa · tests
  mezclados · archivos desproporcionados · rutas que contradicen `11-Conventions`.
- `FND-R18` · La estructura **objetivo** se cita de `11-Conventions` §Folder Structure. Si no
  existe, se define primero —es parte del paquete— y solo después se propone mover nada. Sin
  destino declarado, «ordenar» es preferencia personal.
- `FND-R17` · **Foundation no mueve código.** Diagnostica y propone; ejecuta FDGE. Cada
  normalización aprobada en **G0** se convierte en un PT `REFACTOR` con `Estructural: sí`, con
  sus compuertas, tests de regresión y rollback. Mover código sin red de tests es
  exactamente lo que el marco prohíbe: permitírselo a Foundation abriría la puerta trasera de
  todas sus reglas.

  La documentación sí se mueve en `PHASE 1`: no tiene tests que romper y su desorden bloquea
  a `PHASE 2`.

### Cerrado además

- Clasificaciones (`tipo`, `complejidad`, `severidad` `S1`..`S4`, `track`, `modo`) llegan a
  `CORE.md`: un agente no sabía qué significa `S2`.
- Nueve reglas que `PHASES.md` citaba y `FDGE-Prompts.md` no mencionaba: en modo `MANUAL` el
  humano no las habría visto.
- `audit.mjs` incorporada al `selftest` y al inventario.

### `selftest.sh` — 57 casos

`A` 5 · `B` 13 · `C` 3 · `D` 16 · `E` 6 · `F` 4 · `G` 7 · `H` 3.

---

## 4.4.0 — 2026-08-06

Auditoría multidisciplinar del sistema completo: robustez de herramientas, seguridad,
proceso, operaciones y roles. Ocho defectos, ninguno visible leyendo los documentos.

### Seguridad · el marco causaba la filtración que decía prevenir

`FDGE-R24` ordena capturar **request y response reales**, logs y volcados de BD en
`evidence/PT-XXX/`. Ese directorio vive en el repositorio y `HISTORY.log` es append-only:
**un secreto que entra ahí no se puede retirar.** Ninguna regla lo mencionaba.

`FDGE-R45` · Antes de escribir evidencia se redactan credenciales, tokens, claves privadas,
cookies de sesión y datos personales, sustituyéndolos por «REDACTADO» y anotando qué se
redactó. `verify-fdge` rechaza patrones conocidos: claves privadas, JWT en `Authorization`,
claves AWS, tokens de GitHub y Slack, claves `sk-`, y campos `password`/`api_key` con valor.
Probado con cuatro casos, incluido el negativo (`"password":"REDACTADO"` pasa).

### Robustez · tres formas de tumbar los verificadores

- `allocations` con un tipo inesperado → `TypeError` y el proceso entero caía.
- `REGISTRY.json` con `null` → decía «falta el archivo» cuando el archivo existía.
- `build-core` sin sus fuentes → excepción `ENOENT` sin explicación.

Los tres normalizan o fallan con un mensaje accionable. También se verificó que los parsers
toleran `CRLF`, que es lo que producen los editores en Windows.

### Proceso · el lote exigía un archivo que nadie definía

`INTAKE-R08` obligaba a `changes/EP-NNN-slug/intake.md` sin decir qué contiene.
`INTAKE-R09` + **`EPIC-INTAKE.md`**: objetivo común, criterio de éxito **del lote** —no la
suma de los AC—, out-of-scope, tabla de PTs con sus archivos, análisis de solapamiento,
supuestos compartidos y firma única.

### Proceso · el trabajo parado no caducaba

Los defectos QA envejecían (`QA-R18`); el trabajo de desarrollo no. Un PT podía quedar
`BLOCKED` para siempre, indistinguible de un abandono.
`FDGE-R47` · A los 30 días se reporta como estancado; a los 60 se propone `DEFERRED` o
`REJECTED`.

### Operaciones · la suite no se medía a sí misma

Defecto detectado en la **primera** auditoría y nunca implementado hasta ahora. Medía el
producto —Health de PTSA, Score de QA— y nunca el proceso.
`FDGE-R46` · `status FDGE` reporta: tasa de rechazo por compuerta · % de PTs con delta
distinto de «según plan» · PTs revertidos · hotfixes y su deuda documental · antigüedad del
trabajo parado. Sin esas cifras no se sabe si el marco ayuda o solo cuesta.

### Roles · el silencio se leía como olvido

`SUITE-R22` · La suite **no exige** que las cuatro compuertas las resuelvan personas
distintas: está pensada también para equipos de una persona asistida por IA, donde exigirlo
la haría inaplicable. Lo que sí exige es que quede **registrado quién resolvió cada una**.
Con más de una persona se recomienda —no se obliga— que quien valida un `BUG` no sea quien
lo implementó. Declararlo evita que la ausencia de la regla parezca un descuido.

### Corregido

- `SUITE-R15` citaba «el núcleo cuesta menos de 6 000 tokens»: cifra de la 4.1.0 dentro del
  texto de una regla.
- Quinto y sexto caso del mismo fallo de escape en `verify-fdge` y `build-core`.

### Las tres últimas reglas `CHECK` sin chequeo

`CHECK` significa «verificada hoy». Tres lo declaraban sin cumplirlo:

- `INTAKE-R09` — `verify-fdge` comprueba ahora que todo `changes/EP-NNN-slug/intake.md`
  declare objetivo común, criterio de éxito del lote, out-of-scope, solapamiento y firma; y
  que **cada PT del lote lleve `Firmado por lote: EP-NNN`**, sin lo cual es indistinguible
  de uno sin firmar.
- `FND-R14` — un `REGISTRY.graph` incompleto emite ahora un aviso con su ID.
- `SUITE-R19` — `migrate.mjs` cita la regla al reportar el resultado del encadenado.

**Reglas `CHECK` sin chequeo: 0.**

### `selftest.sh` — 56 casos

`A` 5 casos límite · `B` 13 defectos inyectados · `C` 2 coherencia · `D` 16 migración ·
`E` 6 reconciliación · `F` 4 instalación · **`G` 7 robustez y seguridad** · **`H` 3 lotes**.

---

## 4.3.1 — 2026-08-06

Auditoría completa del marco. Nueve defectos, ninguno de reglas: todos de **coherencia entre
lo que la metodología declara y lo que sus artefactos e instaladores hacen**.

### El más grave: un proyecto nacido de FIDE arrancaba sin núcleo

`SUITE-R15` obliga al agente a cargar `CORE.md`. Los dos instaladores de FIDE enumeran los
archivos a copiar uno a uno, y esa lista se escribió antes de que existieran `CORE.md`,
`PHASES.md`, `build-core.mjs`, `migrate.mjs` y `selftest.sh`. **Un proyecto incubado hoy
nacía sin lo único que hay que cargar**, y nada lo detectaba.

Es el mismo patrón que el defecto C-02 de la 4.0.0: FIDE produciendo algo incompatible con lo
que todos los demás consumen, porque enumera en vez de copiar el directorio.

- Ambos instaladores actualizados, con `build-core --check` tras copiar.
- `verify-fdge` comprueba ahora que el proyecto tenga `CORE.md`, que conserve su marca de
  generado y que sus cuatro fuentes hayan viajado con él.
- `LEX-R25` · `CORE.md`, `PHASES.md` y `tools/` forman parte del paquete instalable.

### El residuo de la renumeración PTSA sobrevivía en seis documentos

La 4.0.1 corrigió la colisión de IDs renumerando los axiomas de PTSA a `PTSA-R14..R21`. El
arreglo se aplicó a `RULES.md`. **Sobrevivió en seis archivos más**, y se corrigieron en dos
tandas: `PTSA-Prompts.md` en la 4.3.0, y en esta versión `README.md`, `Framework-QA.md`,
`Framework-FPGE.md`, `FPGE-Implementation.md`, `FPGE-Prompts.md` y `RULES.md`.

`verify-suite` no podía verlo: los IDs viejos **existen** en la especificación, solo que
significan otra cosa. `PTSA-R04` es una regla real; no es la Regla del Agua Potable.

Nuevo chequeo: cualquier cita de `PTSA-R01..R12` fuera de la especificación se marca como
sospechosa, con el ID real que probablemente se quería citar.

### El inventario canónico estaba desactualizado

`LEXICON` §6.6 es la lista de archivos de la metodología y no incluía los cinco nuevos de
4.1–4.3. Es el documento que dice qué existe; llevaba dos versiones sin enterarse.

### Otros

- `EXEC-R13` (registrar el cambio de modo en `HISTORY.log`) era **regla muerta**: definida y
  no citada en ningún documento operativo. Ahora está en `PHASES` y en `FDGE-Prompts`.
- El instalador del README raíz no creaba `RECONCILIATION.log` ni `MIGRATION.log`, ni
  ejecutaba `build-core`, ni listaba `migrate` y `selftest` entre las herramientas.
- Cifras de tokens desactualizadas en el README (eran de 4.2.0).
- **Cuarto caso del mismo fallo de escape.** `new RegExp(\`\b${id}\b\`)` dentro de un
  template literal produce un byte de retroceso: el chequeo de residuos PTSA existía y no
  podía dispararse. Eliminados **todos** los regex dinámicos con `\b`/`\s` del código, y
  añadido un barrido que verifica que no vuelvan.

### `CORE.md` no era autosuficiente

Las 15 reglas de PTSA que el resto de la suite cita viven en `RULES.md` §Parte 6 como tabla
de **cita** —sin columna de severidad, porque su dueño es la especificación—. El extractor
solo leía filas con severidad, así que **ninguna llegaba a `CORE.md`**: un agente que
encontraba `[PTSA-R44]` en el procedimiento no tenía dónde mirar qué dice.

`build-core.mjs` lee ahora también ese formato. `CORE.md` contiene las **171** directivas
—todas las de `RULES.md`, `LEXICON.md`, `EXECUTION-MODES.md` y las de PTSA citadas— y es
autosuficiente: ninguna regla que el procedimiento menciona queda fuera.

### `selftest.sh` — 46 casos

`A` 5 casos límite · `B` 13 defectos inyectados · `C` coherencia · `D` 16 de migración ·
`E` 6 de reconciliación · **`F` 4 de instalación**: proyecto sin `CORE.md`, con núcleo y
fuentes, sin fuentes, y con `CORE.md` editado a mano.

---

## 4.3.0 — 2026-08-06

Cierra los dos cabos que la 4.2.0 dejó sueltos, y el hallazgo que salió al medirlos.

### El `CLAUDE.md` del proyecto también se carga siempre

`SUITE-R21` · El template llevaba un resumen de reglas de **5 591 tokens** que se cargaba en
**cada** sesión, encima de `CORE.md`. Era a la vez coste de tokens y **una copia más de las
reglas** — la causa raíz que la v4 nació para eliminar, sobreviviendo en el único archivo que
nunca se puede no cargar.

Reducido a puntero puro: parametrización del proyecto, Declaración de Valor y la lista de
acciones nunca automatizadas. **5 591 → 971 tokens.**

| Se carga siempre | 4.2.0 | 4.3.0 |
|:---|---:|---:|
| `CLAUDE.md` del proyecto | 5 591 | **971** |
| `CORE.md` | 13 834 | 14 121 |
| **total** | **19 425** | **15 092** |

### `PHASES.md` y los prompts ya no pueden divergir

`SUITE-R20` · `PHASES.md` es canónico y es lo que acaba en `CORE.md`, que es lo que se
ejecuta; los `*-Prompts.md` son su expansión legible para modo `MANUAL`. Si se separan, el
humano lee una cosa y el agente ejecuta otra.

`verify-suite` comprueba que toda fase declarada en `PHASES.md` existe en el archivo de
prompts de su componente, y que toda regla citada allí está citada también en el prompt.

**Divergencias reales que encontró al estrenarse:**

- `PTSA-Prompts.md` **seguía citando los IDs renumerados** `PTSA-R01..R12` — residuo de la
  corrección C03 de la 4.0.1, que arregló `RULES.md` y olvidó el archivo de prompts. Los 12
  reasignados a sus IDs reales de la especificación.
- `FDGE-Prompts.md` no mencionaba `FDGE-R27`, `FDGE-R43`, `FDGE-R44` ni `SUITE-R17`: en modo
  `MANUAL`, el humano no habría visto la frescura del grafo, el marcado estructural ni la
  compuerta de migración.
- `Foundation-Prompts.md` no tenía `PHASE 5` (inventario y grafo) ni `PHASE 6` (validación).
- `QA-Prompts.md` no advertía que la promoción de un defecto **no firma** el Intake.

### La migración se verifica, no solo se ejecuta

`SUITE-R19` · Tras `--apply`, `migrate.mjs` encadena `verify-fdge --all` y reporta el
resultado; su código de salida lo refleja. Una migración que deja el proyecto en estado
inválido es peor que no haber migrado: **parece terminada**.

### Tres reglas `CHECK` que ningún script comprobaba

`CHECK` significa «verificada hoy» (4.0.1). Tres la declaraban sin cumplirlo:

- `FND-R13` — ahora se comprueba que `00-Baseline.md` declare inventario, divergencias y
  confianza de partida, y que no haya `RECONCILIATION.log` sin línea base que lo justifique.
- `FND-R14` — un `REGISTRY.graph` sin fecha de generación cuenta como `UNKNOWN`.
- `SUITE-R19` — cubierta por el encadenado anterior.

Además `FND-R03` solo miraba `05-UIUX-Brief.md`; ahora detecta toda la numeración de FIDE v3
(`01-PRD`, `02-ARCHITECTURE`, `03-CONVENTIONS`, `00-BUSINESS_CASE`).

### Corregido

- **`verify-fdge` crasheaba entero**: `ED` se usaba en el chequeo de reconciliación y nunca
  se declaró. `ReferenceError` en cada ejecución. Detectado por el selftest.
- **Tercer caso del mismo fallo de escape**: `new RegExp(\`PHASE\s+${n}\b\`)` producía
  `/PHASEs+0/` porque en un template literal `\s` es «s». Los regex dinámicos se sustituyen
  por normalización a clave plana, y queda anotado en el propio código.
- Falso positivo de `SUITE-R16`: `build-core` usaba cuatro fuentes y `verify-suite` comparaba
  tres.
- Antipatrón nuevo: **Prompt Drift**.

### `selftest.sh` — 42 casos

`A` 5 casos límite · `B` 13 defectos inyectados · `C` coherencia y sincronía ·
`D` 16 de migración · **`E` 6 de reconciliación y migración verificada**.

---

## 4.2.0 — 2026-08-06

`CORE.md` sustituye también a los prompts en runtime · reconciliación ejecutable suelta ·
garantías de migración para proyectos nuevos, legados, de versiones anteriores y **con
sesiones activas**.

### `CORE.md` absorbe el procedimiento

En 4.1.0, `CORE.md` llevaba las reglas pero no el procedimiento: el agente seguía necesitando
los `*-Prompts.md`, otros ~29 000 tokens.

- **`PHASES.md`** — nueva fuente canónica: la directiva densa de las 40 fases de los seis
  componentes, en formato `LEE · HAZ · SALE · NO · PARA`. Los `*-Prompts.md` pasan a ser su
  **expansión legible** para copiar y pegar en modo `MANUAL`; en runtime no se cargan.
- `build-core.mjs` la inserta íntegra en `CORE.md`, que ahora es reglas **y** procedimiento.
- `verify-suite` comprueba la sincronía sobre las **cuatro** fuentes. (En 4.1.0 comparaba
  tres mientras `build-core` usaba cuatro: falso positivo permanente en cuanto se tocara
  `PHASES.md`.)

| | tokens por sesión |
|:---|---:|
| Suite completa con los 5 archivos de prompts | 59 527 |
| **`CORE.md` 4.2.0** | **13 834** |

**77 % menos, con el procedimiento dentro.**

### Reconciliación suelta — `[START RECONCILE]`

`FND-R15` · La reconciliación nació en 4.1.0 dentro de Foundation, así que solo la
alcanzaban los proyectos que ejecutaran Foundation de cero. Los que ya la tenían instalada
—precisamente los que más desorden acumulan— no podían llegar a ella sin regenerar todo el
paquete.

Ahora `PHASE 1` se ejecuta aislada: inventaría lo que aún no tiene decisión, mide la
divergencia actual contra el código, conserva la línea base anterior para ver si el proyecto
mejora, y **no reabre** lo ya decidido en `RECONCILIATION.log`. La compuerta **G0** sigue
viva. No regenera el paquete.

### Migración con garantía para sesiones activas

`SUITE-R17` · Si `REGISTRY.suite_version` no coincide con la vigente, el proyecto entra en
**modo restringido**: solo `[START MIGRATE]`, los `status *` y **terminar los PTs en vuelo**.
No se abre trabajo nuevo.

`SUITE-R18` · **Cada `allocation` lleva su propio `suite_version`.** Un PT abierto bajo 4.1.0
se cierra bajo las reglas de 4.1.0 aunque el proyecto ya esté en 4.2.0. Migrar nunca invalida
trabajo en curso — obligar a rehacer trabajo válido es la forma más rápida de que un equipo
abandone el framework.

`SUITE-R19` · **`tools/migrate.mjs`** — `--dry-run` por defecto. Detecta la versión instalada
por sus artefactos característicos y separa lo mecánico de lo que exige criterio:

| Desde | Automático | Requiere una persona |
|:---|:---|:---|
| **3.x** | `REGISTRY` con contadores al **máximo ID ya usado**, nunca a 0 · `SESSION_SUMMARY`→`SESSION_LOG` · las cuatro carpetas de PTSA al inglés · archivar `instrucctions.md` y `Motor-PTSA.md` | los tres archivos globales al PT que corresponda · convertir los índices · migrar estados · Intake retroactivo por PT vivo · `[START RECONCILE]` · `[START FOUNDATION]` si vino de FIDE |
| **4.0.x** | `REGISTRY.graph` · `allocation.structural` · sellar `suite_version` | regenerar el grafo · `Estructural:` en `HISTORY` · `[START RECONCILE]` |
| **4.1.x** | generar `CORE.md` con los prompts dentro | — |

Lo que no puede automatizarse **se lista, no se inventa**. `MIGRATION.log` lo registra.

### Corregido

- **`verify-fdge` habría lanzado `ReferenceError` en cada ejecución.** `SUITE_VERSION` se
  usaba en `checkRegistry` y se declaraba 340 líneas después: zona muerta temporal de `const`.
  Detectado ejecutando el selftest, no leyendo.
- Falso positivo permanente de `SUITE-R16` por la lista de fuentes desalineada entre
  `build-core` y `verify-suite`.
- Antipatrones nuevos: **Version Drift**, **Migration Amnesia**.

### `selftest.sh` — 34 casos

`A` 5 casos límite bien formados · `B` 13 defectos inyectados · `C` coherencia y sincronía
de `CORE` · **`D` 16 casos de migración** desde v3 y 4.0.x, incluida la comprobación de que
`--dry-run` no toca nada y de que un PT en vuelo sobrevive con su versión.

---

## 4.1.0 — 2026-08-05

Tres huecos que ninguna de las dos auditorías anteriores vio, porque los tres eran
**ausencias**, no contradicciones. Una auditoría busca lo que se contradice; estos eran
cosas que simplemente no estaban.

### El legado desordenado no estaba gobernado

`FND-R04` sobrescribe el paquete de Foundation y **no tocaba nada más**. Un repositorio con
40 markdown obsoletos en `docs/` los conservaba intactos, contradiciendo al paquete recién
generado, y FDGE `PHASE 2` leía «la documentación» sin saber cuál mandaba. La única mención
a limpiar un proyecto legado vivía como texto libre dentro de una instrucción copiable del
README: sin fase, sin reglas, sin artefacto, sin compuerta, sin verificación.

**Documentar bien encima del desorden no produce orden: produce dos verdades.**

Nueva **`PHASE 1 — Reconciliation`** en Foundation, con compuerta **G0**:

- `FND-R09` inventario de **toda** la documentación preexistente, con decisión por archivo:
  `KEEP` · `SUPERSEDE` · `ARCHIVE` · `DELETE` → `00-Baseline.md`.
- `FND-R10` **G0**: nada se mueve, archiva ni borra sin ACK humano.
- `FND-R11` nada se borra, se archiva en `docs/_archive/<fecha>/` conservando la ruta.
  `DELETE` solo para regenerables. Un documento que nadie entiende no es basura: es una
  pista sobre por qué el sistema es así.
- `FND-R12` tras la reconciliación, `docs/enterprise-documentation/` es la **única** fuente
  de arquitectura, dominio y convenciones. Lo que sobreviva y trate esas materias declara a
  qué documento se subordina.
- `FND-R13` línea base de divergencia código ↔ documentación previa: la fotografía del
  desorden de partida, y la referencia contra la que se mide si el proyecto mejora.
- Registro append-only en `docs/implementation/RECONCILIATION.log`.

La fase se ejecuta también en greenfield, donde se cierra en dos líneas. Saltársela es
*Phase Collapse*.

### El grafo era una dependencia fantasma

`FDGE-R07` (HARD) exigía consultar el grafo de dependencias. `FDGE-R08` (SOFT) permitía no
tenerlo: «declara y baja la confianza». Resultado real: el grafo nunca existía, `FDGE-R08`
se invocaba siempre, y una regla HARD se satisfacía **declarando que no se podía cumplir**.

Cero reglas de frescura, cero verificación mecánica, sin dueño en la matriz de propiedad, y
Foundation ni lo generaba ni lo exigía.

- `FND-R14` el grafo **forma parte del paquete** de Foundation: se genera sobre `src/` y se
  registra en `REGISTRY.graph` con `generated`, `scope` y `pt_at_generation`.
- `FDGE-R43` **frescura computable**: el grafo es `STALE` si desde su generación se integró
  algún PT estructural. Un `MAJOR` **no resuelve G2** con el grafo ausente o `STALE`; un
  `STANDARD` avisa; `TRIVIAL`/`CHORE` no se ven afectados.
- `FDGE-R44` todo PT declara `Estructural: sí | no` en `HISTORY.log`. Es lo que hace
  computable la frescura.
- `FDGE-R32` sube de SOFT a HARD: un PT estructural solicita la regeneración y la anota como
  pendiente en `HANDOFF.md`.
- `graphify-out/` entra en la matriz de propiedad.
- `verify-fdge` lo comprueba. Seis casos probados: sin grafo, fresco, `STALE` tras un PT
  estructural, `MAJOR` bloqueado, marcado ausente, marcado presente.

### La suite costaba 39 000 tokens por sesión

Cargar `LEXICON` + `RULES` + `EXECUTION-MODES` + `Suite-CLAUDE-Template` + `FDGE-Prompts`
son ~39 618 tokens **antes de leer una sola línea del proyecto**. La mayor parte no es
directiva: es justificación, historia de la v3, ejemplos y explicaciones de por qué una
regla es como es. Material para **entender** el método, no para **ejecutarlo**.

- **`CORE.md`** — núcleo operativo con las 152 directivas: ID, severidad y enunciado
  imperativo cortado en la primera frase. Fases, compuertas, estados, IDs, triggers, rutas.
  **7 235 tokens · 82 % menos.**
- `SUITE-R15` el agente carga `CORE.md`; abre un documento completo solo cuando `CORE.md` lo
  remite.
- `SUITE-R16` `CORE.md` es **generado**, nunca editado a mano. Un resumen mantenido a mano
  es una quinta copia de las reglas, y la v3 demostró qué pasa con las copias.
  `tools/build-core.mjs` lo produce; `verify-suite` comprueba que está sincronizado
  comparando el hash de sus fuentes.

La respuesta a «¿conviene lenguaje telegráfico?» es **sí para las directivas, no para las
reglas**. Quitar el porqué del texto que se ejecuta es ganancia pura: el porqué vive en los
`Framework-*.md`, que no se cargan nunca. Quitar precisión de la regla en sí no lo es: una
regla ambigua se aplica mal justo en los casos límite, que es donde importa.

### Otros

- **Las fases de Foundation tenían nombres distintos en `LEXICON` y en su implementación.**
  Solo coincidía la 0. Alineadas, y ahora son siete.
- `verify-fdge` tenía un byte de retroceso (`0x08`) incrustado en un regex —residuo de un
  `\b` procesado por una herramienta de edición—, que lo hacía imposible de casar. El
  chequeo existía y nunca podía dispararse. Mismo modo de fallo que apareció en el
  `CHANGELOG` de la 4.0.1: dos veces el mismo error de escape.
- Antipatrones nuevos: **Documented Chaos**, **Phantom Graph**, **Context Bloat**.

---

## 4.0.1 — 2026-08-05

**Auditoría adversaria de la propia 4.0.0.** No añade capacidad: corrige los defectos que
la 4.0.0 introdujo. Cuatro de ellos se encontraron **ejecutando** los verificadores contra
un proyecto de prueba, no leyendo los documentos — es la diferencia entre revisar y probar.

### Críticos

| # | Defecto | Corrección |
|:--|:---|:---|
| C01 | **Ningún BUG podía integrarse jamás.** `FDGE-R34` exigía para G4 estado `DONE` «o `CLOSED` si es BUG»; `LEXICON` §5.1 sitúa `CLOSED` **después** de `INTEGRATED`. Con `DONE` el verificador lo rechazaba; con `CLOSED` se contradecía la máquina de estados. Bloqueo circular. | G4 exige `DONE` y, para un `BUG`, la firma humana de G3 registrada en `HISTORY.log` como `G3 YYYY-MM-DD [nombre]` (`FDGE-R26`, `FDGE-R34`). |
| C02 | **El verificador rechazaba el 100 % de los Intakes bien firmados.** Buscaba `## Firma` y `DoR: PASS`; las tres plantillas escriben `## 10. Firma [HUMANO]` y `VEREDICTO: PASS`. Además el patrón terminaba en un límite de palabra, que no casa con «SÍ»: en JavaScript ese límite es ASCII y tras «Í» no existe. | Parsers tolerantes a la numeración de sección, y un bloque `PARSERS` documentado como contrato explícito con las plantillas. |
| C03 | **Colisión de IDs de regla.** `RULES.md` §Parte 6 renumeraba los axiomas de PTSA como `PTSA-R01..R12`, chocando con reglas distintas ya existentes en la especificación (`PTSA-R10` allí regula la aplicabilidad del Nivel 4 de IA). Exactamente el defecto que la v4 nació para eliminar. | §Parte 6 **cita** los IDs reales (`PTSA-R14..R21` para los axiomas). `SUITE-R14` y `LEX-R23` prohíben la doble definición, y `verify-suite` la detecta. |
| C04 | `RULES.md` se declaraba «única fuente de verdad para reglas» mientras `LEX-*` vivían en `LEXICON.md` y `EXEC-*` en `EXECUTION-MODES.md`; `EXEC-` ni siquiera figuraba en la tabla de prefijos, que además afirmaba «todas viven en RULES.md». | Tabla de propiedad por familia en ambos documentos. `RULES.md` es la fuente de las reglas **de componente**. |

### Altos

- **`INVESTIGATION` era estructuralmente inverificable**: `FDGE-R10` dice que no produce
  código, pero `FDGE-R15` y `FDGE-R23` exigían trazabilidad `AC→test` y manifiesto. El
  verificador fallaba toda investigación. → exención explícita + `FDGE-R42` (criterio de
  cierre: sección `## Conclusión` en `discovery.md`).
- **`HOTFIX` obligaba a violar una regla HARD por construcción**: difiere PHASE 4, que es
  donde nace `test-scenarios.md`, del que `FDGE-R17` exige derivar los tests. → en `HOTFIX`
  la obligación se mantiene en su forma mínima: un test que reproduzca el fallo, en rojo.
- **`FDGE-R18` (excepción de tests) era inaplicable**: el verificador marcaba *Orphan
  Criterion* cualquier `AC` sin test. → `Test: —` admitido para `CHORE` y `EXPRESS`, con
  aviso; `Evidencia` sigue siendo obligatoria.
- **`FDGE-R15` no declaraba desde qué fase aplica**: `traceability.md` nace en PHASE 4 con
  `Test` y `Evidencia` vacíos, y el verificador los marcaba huérfanos. → `AC` y `TS` desde
  PHASE 4; `Test` y `Evidencia` desde PHASE 6.
- **Orden de partes roto en `RULES.md`**: 1,2,3,4,5,6,7,**10**,8,9. → reordenado.
- **Esquema de `REGISTRY.json` inconsistente** entre `LEXICON`, `FDGE-Implementation` y el
  instalador; `verify-fdge --all` depende de `status`, que `LEXICON` no declaraba. →
  esquema canónico único, con campos obligatorios enumerados.
- **Diagrama de transiciones roto**: ASCII ilegible, sin `REOPENED` ni `BLOCKED_DOMAIN`, sin
  el retorno desde `BLOCKED`, y con `CLOSED` colocado de forma que alimentaba C01. →
  `stateDiagram-v2` completo, con notas de lectura.
- **`FDGE-R01` decía «los cuatro tipos»** cuando la v4 introdujo cinco (`CHORE`).
- **La firma por lote era incompatible con el verificador**: `INTAKE-R08` permitía firmar un
  `EP` una sola vez, pero el verificador exigía firma en cada `intake.md`. → línea
  `Firmado por lote: EP-NNN` en cada Intake del lote, reconocida por el verificador.
- **`EXEC-R12` vs `EXEC-R14`**: «solo un humano cambia el modo» contra «descenso automático
  a MANUAL». → `EXEC-R14` se reformula como **restricción temporal de compuertas**: el valor
  de `CLAUDE.md` no se toca y la restricción se levanta sola.

### Medios

- `AC-01` aparecía dos veces en cada plantilla (versión del humano y versión formalizada)
  sin decir cuál era canónica. → el humano escribe sin numerar; el agente asigna los `AC-nn`,
  y esa es la lista que citan `traceability.md`, `manifest.json` y los casos QA.
- `FDGE-R27` no cubría `CHORE` ni `INVESTIGATION`. → condiciones de `DONE` por los cinco tipos.
- Severidades `CHECK` en reglas que ningún script comprobaba (`QA-R13`, `FIDE-R04`,
  `FPGE-R09`, `FDGE-R40`). → reclasificadas a `HARD`; `CHECK` ahora significa «verificada hoy».
- Sub-IDs `SUITE-R06a` sin gramática declarada. → `LEX-R24`.
- `LEXICON` §5.1 omitía `QA-NNN` de las entidades con `Lifecycle`, contradiciendo §5.2.
- `EMPTY()` en `verify-fdge` usaba `|` (bitwise) en vez de `||`.
- El filtro de argumentos era lógica muerta (`X && Y || X` ≡ `X`), y al corregirlo se
  introdujo una regresión que excluía el índice 0 cuando no había `--gate`. Ambas
  detectadas ejecutando.
- `FDGE-R41` detenía el lote sin declarar a qué estado pasa el `EP`. → `BLOCKED`.
- Un veredicto `CHALLENGE` aceptado por el humano no tenía dónde registrarse. → línea
  `CHALLENGE aceptado por:` en las tres plantillas; sin ella, el PT no avanza.
- `verify-suite` no detectaba definiciones duplicadas de un mismo ID — por eso no vio C03.
  → chequeo de propiedad y de duplicados, discriminando **definir** (lleva severidad) de
  **citar** (no la lleva).

### Lección

Los cuatro defectos críticos comparten causa: **la 4.0.0 se escribió y se revisó leyendo,
no ejecutando.** Los verificadores existían pero nunca se habían corrido contra un proyecto
con PTs reales. Desde la 4.0.1, `tools/` incluye un fixture de referencia con los cuatro
casos límite (`BUG` validado, `INVESTIGATION`, `CHORE` en `EXPRESS`, `FEATURE` a medio
camino) y el contrato entre plantillas y parsers está documentado en el propio verificador.

---

## 4.0.0 — 2026-08-05

Reescritura de gobernanza. Se conservan el modelo conceptual y los algoritmos de scoring;
se corrigen las contradicciones normativas, se añade la capa de admisión y se completa el
ciclo de vida del trabajo.

### Contexto

Una auditoría completa de los 18 documentos de la v3 encontró 8 defectos críticos —cambios
que rompían proyectos reales, no inconsistencias cosméticas— más una docena de defectos altos
y tres causas raíz. Esta versión los corrige.

### Añadido

- **`LEXICON.md`** — vocabulario canónico. Una sola palabra de paso (`PHASE`), una sola
  enumeración de estados, un solo nombre por archivo, una sola gramática de triggers.
- **`RULES.md`** — todas las reglas con ID estable y severidad `HARD` / `SOFT` / `CHECK`.
  Los demás documentos citan el ID; no reformulan el texto.
- **`EXECUTION-MODES.md`** — modos `MANUAL` / `SUPERVISED` / `AUTONOMOUS`, cuatro compuertas,
  lista cerrada de acciones nunca automatizadas, y lotes `EP-NNN`.
- **Capa de admisión (`INTAKE/`)** — protocolo, tres plantillas y checklist de Definition of
  Ready. El humano declara la intención; el agente la expande.
- **Eje de severidad `S1`..`S4`**, ortogonal a la complejidad, y track `HOTFIX` para `S1`.
- **`PHASE 9 — Integration`** y **`PHASE 10 — Rollback`** en FDGE.
- **`PTSA-Prompts.md`** — el motor operativo de PTSA, que se citaba como autoridad en cuatro
  documentos y nunca existió.
- **`FPGE-Prompts.md`** y **`Foundation-Prompts.md`** — ahora todo componente tiene
  exactamente un archivo de prompts.
- **`REGISTRY.json`** — asignador único de identificadores.
- **`manifest.json`** y **`traceability.md`** — cadena verificable
  `AC → TS → test → evidencia → caso QA`.
- **`INCIDENTS.log`** y **`BACKLOG.md`**.
- **`tools/verify-suite.mjs`** y **`tools/verify-fdge.mjs`** — verificación mecánica.
- **`CHANGELOG.md`** — este archivo.

### Corregido — defectos críticos

| # | Defecto | Corrección |
|:--|:---|:---|
| C-01 | El ruleset vinculante ordenaba *«Create or overwrite `ENRICHMENT.md`»* mientras los otros dos documentos lo declaraban append-only. Un agente obediente destruía todos los enriquecimientos anteriores en cada feature — y con ellos la entrada de FPGE. | `LEX-R12`: los tres archivos son índices append-only; el cuerpo del análisis vive en el directorio del PT. |
| C-02 | FIDE generaba `docs/enterprise-documentation/` con numeración propia (`01-PRD`, `02-ARCHITECTURE`…). Todo proyecto nacido de FIDE arrancaba roto: FDGE abría `02-PRD.md` y encontraba la arquitectura. El guardarraíl pasaba en verde porque comprobaba la carpeta, no los archivos. | `FIDE-R04` nombres canónicos · `FND-R08` la existencia se verifica por archivos del núcleo · `FIDE-R06` el paquete declara que documenta intención, no observación. |
| C-03 | PTSA citaba `Motor-PTSA.md` y `PTSA.md` como autoridad normativa en cuatro documentos. Ninguno de los dos existió nunca; el instalador creaba archivos vacíos. | `PTSA/PTSA-Prompts.md`, y ambas referencias derogadas. |
| C-04 | FPGE se declaraba read-only en dos documentos y en un tercero escribía `CLOSED-WONTFIX` en hallazgos de PTSA y `CLOSED-ACCEPTED` en defectos de QA — violando su propio principio, `PTSA-R06` y `QA-R11`, e inventando estados inexistentes. | `FPGE-R03`: FPGE **emite instrucciones**, no escrituras. Las ejecuta el componente dueño bajo su trigger. |
| C-05 | Dos esquemas incompatibles para `DISCOVERY.md`; **tres** formatos distintos de `HISTORY.log` en tres documentos; `PLAN_ACTUAL.md` declarado «solo TRIVIAL» en uno y sobrescrito siempre en otro. | Un solo formato canónico por artefacto, en `FDGE-Implementation.md`. |
| C-06 | `PHASE 2-R` escribía `SCOPE_PENDING`; la fase de persistencia buscaba `REFACTOR_PENDING`. **Ningún refactor se cerraba nunca**, y FPGE los re-proponía indefinidamente. | `LEX-R07`: enumeración única de estados, con tabla de migración. |
| C-07 | `05-UIUX-Brief.md` en el ruleset vinculante vs `05-UI-UX-Brief.md` en QA, que lo declara fuente obligatoria. | `LEX-R10` §6.1: `05-UI-UX-Brief.md`. Verificado por `verify-fdge`. |
| C-08 | `QR-NNN` se derivaba contando `qa-score-history.json`, donde los ciclos delta también se appendean. El contador se desalineaba con el primer delta. | `SUITE-R08` · `QA-R13`: `REGISTRY.json` es el único asignador. |

### Corregido — defectos altos

- **El ciclo de git terminaba a medias.** Especificado hasta el último commit y nada sobre
  merge, PR, CI, tag o borrado de rama: la rama quedaba abierta para siempre. → `PHASE 9`.
- **No había camino de rollback.** Un PT integrado que rompía producción no tenía ninguna
  ruta dentro del framework. → `PHASE 10`, `INC-NNN`, estado `REVERTED`.
- **El loop QA ↔ FDGE no cerraba.** Ambas mitades enunciadas, ninguna conectada: nadie decía
  quién re-ejecuta el caso ni cuándo. → `FDGE-R28` y el procedimiento explícito en
  `QA-Implementation.md`.
- **`QA-STALE` no tenía efecto.** Se afirmaba que FPGE lo trata como baja confianza; el
  algoritmo no tenía ningún factor que lo consumiera. → `FPGE-R08`, factor `Confidence = 0.7`.
- **Contradicción tests-first.** *No Tests After Code* absoluto vs el atajo TRIVIAL que los
  eximía. → `FDGE-R18`, excepción declarada y acotada.
- **`SESSION_SUMMARY.md` no se instalaba** aunque PHASE 0 escribía en él. → `SESSION_LOG.md`,
  en la estructura.
- **`resume PTSA` significaba dos cosas.** → `resume` y `delta` separados (`LEX-R17`).
- **`Sprint S-nnn` era un concepto huérfano** que aparecía una vez en un template. → `EP-NNN`.
- **Graphify: dependencia dura y opcional a la vez**, sin regla de fallback. → `FDGE-R08`.
- **Dos filosofías de autonomía opuestas** (PTSA autónomo, QA prompt-driven) sin criterio
  declarado. → `EXEC-P1`, y la explicación en `Framework-QA.md`.
- **Sin versionado ni procedimiento de actualización.** → `SUITE-R13` y este archivo.
- **La suite no se medía a sí misma.** → `verify-suite.mjs` y `verify-fdge.mjs`.

### Cambios que rompen compatibilidad

1. **`PHASE` sustituye a `Estado n` / `STATE n` / `FASE n` / `F-n` / `FIDE-n`.**
   La colisión más dañina: `Estado 4` era *diseñar la estrategia* y `STATE 4` era *escribir
   código*. Un agente que leía ambos documentos recibía órdenes contradictorias.
   Los `Framework-*.md` dejan de numerar sus estados cognitivos (`LEX-R01`).

2. **Estado del trabajo por PT, no global.** `PLAN_ACTUAL.md`, `PENDING_TASKS.md` y
   `CONTEXT_ANALYSIS.md` desaparecen como archivos globales → `changes/PT-XXX-slug/`
   (`FDGE-R39`). Era la condición necesaria para que dos PTs pudieran estar en vuelo.

3. **Enumeración única de estados** en inglés (`LEX-R07`). Tabla de migración en
   `LEXICON.md` §5.4.

4. **`instrucctions.md` → `FDGE-Prompts.md`** (`LEX-R15`).

5. **Renumeración de las fases de PTSA:** `F-1`..`F12` → `PHASE 0`..`PHASE 14`.
   Equivalencia completa en `LEXICON.md` §3.3 y junto al diagrama de la Parte VII de la
   especificación.

6. **IDs de regla con prefijo de componente:** `[R45]` → `PTSA-R45`, `[R-FIDE-01]` →
   `FIDE-R01` (`LEX-R05`). `[R45]` colisionaba con `R-045`, un ítem de roadmap.

7. **Directorios de PTSA en inglés:** `Fases/` `Hallazgos/` `Evidencias/` `Productos/` →
   `Phases/` `Findings/` `Evidence/` `Products/`.

8. **La admisión es obligatoria.** Ningún trabajo empieza sin `intake.md` firmado, incluidos
   los promovidos desde QA, PTSA y FPGE.

### Cómo migrar un proyecto de la v3

```
1.  Copiar docs/methodology/ v4 sobre la v3. Borrar instrucctions.md.
2.  Crear docs/implementation/REGISTRY.json. Inicializar los contadores al máximo ID YA
    USADO en el proyecto — no a 0 (LEX-R04: los IDs no se reutilizan).
3.  Renombrar SESSION_SUMMARY.md → SESSION_LOG.md. Crear INCIDENTS.log y BACKLOG.md.
4.  Convertir DISCOVERY.md, ENRICHMENT.md y REFACTOR_SCOPE.md en índices: una línea por PT
    con su estado canónico. Mover el cuerpo del análisis de cada PT a su directorio en
    changes/.
5.  Para cada PT en vuelo: crear changes/PT-XXX-slug/ con intake.md (firmar retroactivamente
    o marcar «heredado de v3, sin firma»), y mover PLAN_ACTUAL.md → strategy.md,
    PENDING_TASKS.md → tasks.md, la entrada de CONTEXT_ANALYSIS.md → context.md.
6.  Migrar los estados con la tabla de LEXICON.md §5.4. Atención especial a SCOPE_PENDING:
    esos refactors llevan abiertos desde que se escribieron.
7.  Renombrar PTSA/Fases → Phases, Hallazgos → Findings, Evidencias → Evidence,
    Productos → Products.
8.  Si el proyecto nació de FIDE: renombrar docs/enterprise-documentation/ a los nombres
    canónicos, o ejecutar [START FOUNDATION] para regenerarlos desde el código —
    recomendable, porque el paquete de FIDE documenta intención, no observación.
9.  Reemplazar la sección de la suite en CLAUDE.md por Suite-CLAUDE-Template.md v4.
    Declarar suite_version y execution_mode.
10. Ejecutar los dos verificadores y resolver lo que reporten.
```

---

## 3.0.0 — 2026-06-25

Versión anterior. Cinco componentes (Foundation, FDGE, QA, PTSA, FPGE) más FIDE. Introdujo
el Proposal Gate, el componente QA sobre Playwright y el algoritmo de priorización de FPGE.

Sus defectos conocidos son los que corrige la 4.0.0.
