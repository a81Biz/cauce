# CASOS DE USO — el catálogo

> **Qué es esto.** La lista de todo lo que alguien puede querer hacer con cauce, y por cada caso
> la ruta exacta hasta el final. No explica el marco: dice **dónde entrar** y **qué pasa después**.
>
> El manual que lo desarrolla es [`MANUAL.md`](MANUAL.md). Este archivo es su índice y su
> **contrato de cobertura**: un caso que no esté aquí es un hueco declarado, no un silencio.
>
> `SUITE-R21` · Aquí no se repiten reglas. Se citan por ID.

---

## Cómo leer una fila

```
ENTRADA      lo primero que se ejecuta o se dice
RECORRIDO    los pasos, con quién los resuelve
FIN          la condición observable de terminado
HUMANO       lo que no se automatiza nunca en ese caso
```

---

## A · Empezar

### A1 · Tengo una idea de negocio y no hay código

| | |
|:---|:---|
| **Entrada** | `[START FIDE]` |
| **Recorrido** | FIDE incuba el proyecto → instala la suite → **se retira** |
| | Luego `A3`, porque a partir de ahí ya hay código |
| **Fin** | El proyecto existe, tiene `REGISTRY.json` y su Declaración de Valor firmada |
| **Humano** | La Declaración de Valor: qué hace **válido** un producto no lo sabe el agente (`FND-R24`) |

### A2 · Tengo un proyecto nuevo con código ya empezado

| | |
|:---|:---|
| **Entrada** | `npx @a81biz/cauce install` y después, en la sesión, «instala el framework» |
| **Recorrido** | Instalación conversacional de nueve fases (`INSTALL.md`, `SUITE-R28`) |
| **Fin** | `cauce verify` sin errores |
| **Humano** | Firmar la Declaración de Valor y elegir modo de ejecución |

### A3 · Tengo un proyecto con código y quiero documentarlo antes de tocarlo

| | |
|:---|:---|
| **Entrada** | `[START FOUNDATION]` |
| **Recorrido** | Reverse-engineering → `docs/enterprise-documentation/` verificada |
| **Fin** | La documentación existe y **cada afirmación tiene su evidencia** |
| **Humano** | Validar la documentación: el agente describe lo que hay, no lo que sirve |

### A4 · Tengo un proyecto legado con una versión vieja de cauce

| | |
|:---|:---|
| **Entrada** | `node docs/methodology/tools/migrate.mjs .` — **informa, no toca nada** |
| **Recorrido** | Lee el informe → resuelve las acciones humanas → `migrate --apply` |
| **Fin** | `suite_version` al día y `cauce verify` sin errores |
| **Humano** | El bloque `ESTADO`, declarar `phase` en lo vivo, declarar plataforma, firmar excepciones de secretos |
| **Ojo** | Mientras queden pendientes, el proyecto está en **modo restringido** (`SUITE-R17`): solo `migrate`, `status` y terminar lo ya en vuelo |

### A5 · Empiezo una sesión en un proyecto ya instalado

| | |
|:---|:---|
| **Entrada** | `npx @a81biz/cauce start` |
| **Recorrido** | Imprime el estado del tablero y **después** el núcleo (`SUITE-R50`) |
| **Fin** | Sabes qué está abierto y en qué fase, sin haberlo recordado |
| **Humano** | Nada. Es solo lectura |
| **Ojo** | Si un subcomando dice que **no existe**, tu copia es anterior a la que lo trae. El mensaje da la salida: `npx @a81biz/cauce@latest …` |
| **Y además** | Si quedó proyección sin publicar de la sesión anterior, se ve aquí y se publica: `tracker proyectar --publicar` (`SUITE-R56`). El rastro de una tarea tiene que sobrevivir a su rama, y la rama se borra al fusionar |

### A6 · Estoy dentro del repositorio de cauce

| | |
|:---|:---|
| **Entrada** | `npm start` |
| **Recorrido** | El mismo que `A5` |
| **Por qué otro comando** | `npx` ve que el `package.json` local declara ese mismo nombre, da el paquete por presente y busca un binario que **no existe ni debe existir**: instalarlo como dependencia de sí mismo dejaría dos copias completas del marco (`SUITE-R41`) |
| **Fin** | Igual que `A5` |
| **Humano** | Nada |

---

## B · Trabajar

### B1 · Una tarea suelta

| | |
|:---|:---|
| **Entrada** | `[START PT]` |
| **Recorrido** | `PHASE 1` … `PHASE 10`. Antes de cada avance: `tracker siguiente` (`SUITE-R48`) |
| **Fin** | `INTEGRATED`, con su issue cerrado **después** del merge (`SUITE-R46`) |
| **Humano** | `G1` firma del intake · `G2` propuesta · `G3` validación · `G4` **merge, sin excepción** |

### B2 · Varias tareas relacionadas: un lote

| | |
|:---|:---|
| **Entrada** | `[START EP]` |
| **Recorrido** | Intake del lote con objetivo común, criterio de éxito y **análisis de solapamiento** (`INTAKE-R09`) |
| | Cada tarea lleva `Firmado por lote: EP-NNN` (`INTAKE-R08`) |
| **Fin** | Todas las tareas `INTEGRATED` y el lote `CLOSED` |
| **Humano** | Una firma para todo el lote, y `G4` |
| **Ojo** | Lo que el lote resuelve al cerrarse va en `## Cierre del lote` (`SUITE-R45`) y **en ningún otro sitio** |

### B3 · Un `BUG`

Igual que `B1`, con dos diferencias que no se pueden desactivar:

- `G3` es **humana en los tres modos** (`EXEC-R05`): un bug lo declara resuelto quien lo sufrió.
- Cerrarlo está en la lista de lo que **nunca se automatiza** (`SUITE-R06b`).

### B4 · Un cambio estructural

| | |
|:---|:---|
| **Entrada** | `[START PT]` con `structural: yes` |
| **Recorrido** | Exige **grafo presente**; `G2` no se resuelve con el grafo ausente o `STALE` (`FDGE-R43`) |
| **Fin** | Igual que `B1` |

### B5 · No sé si hay defecto: una investigación

| | |
|:---|:---|
| **Entrada** | `[START PT]` con `type: INVESTIGATION` |
| **Recorrido** | Puede cerrarse **sin implementar nada**: el hallazgo es el producto |
| **Fin** | `CLOSED` con su conclusión escrita, aunque sea «no hay defecto» |

### B6 · Aparece trabajo que no cabe en esta tarea

| | |
|:---|:---|
| **Entrada** | Una fila en `out-of-scope.md` |
| **Recorrido** | La columna «Dónde va» es **vocabulario cerrado** (`SUITE-R44`): `—`, o un identificador |
| | Si es para después: `allocation` en `DEFERRED`, con su `origin` citando de dónde viene, y **su issue abierto** |
| **Fin** | El aplazado está en el tablero. Aplazar algo lo **pone a la vista**, no lo saca |

---

## C · Comprobar

### C1 · ¿Cumple una tarea?

```bash
node docs/methodology/tools/verify-fdge.mjs PT-NNN
node docs/methodology/tools/verify-fdge.mjs --gate G4 PT-NNN   # precondiciones del merge
```

### C2 · ¿Es coherente la metodología?

```bash
node docs/methodology/tools/verify-suite.mjs docs/methodology
```

Vocabulario derogado, reglas citadas que no existen, obligaciones donde no deben estar, enlaces
rotos, versiones desalineadas.

### C3 · ¿El tablero y el registro dicen lo mismo?

```bash
node docs/methodology/tools/tracker.mjs espejo
```

Bloquea en la rama de trabajo; **informa** en la rama por defecto (`SUITE-R47`).

### C4 · ¿Todo a la vez, como en CI?

```bash
npm run verify
```

### C5 · ¿Sigo pudiendo rastrear una tarea, viva o cerrada?

| | |
|:---|:---|
| **Entrada** | `node docs/methodology/tools/tracker.mjs espejo` · y `verify-fdge.mjs --all` |
| **Recorrido** | Comprueba las **dos** formas de quedarse sin rastro: que ningún issue enlace a un ref que ya no existe (`SUITE-R56`), y que ninguno publique su ruta **sin enlace** teniendo ya un ref durable (`SUITE-R51`) |
| **Fin** | Desde el issue se llega al intake, a la evidencia y a la trazabilidad — **aunque la rama de la tarea se haya borrado, y aunque el issue naciera antes que su primer commit** |
| **Humano** | Nada para comprobarlo. Para corregirlo, `tracker abrir --aplicar`, que republica los cuerpos |
| **Ojo** | La rama efímera **se borra al fusionar** y eso es correcto (`FDGE-R19`). Lo que no puede morir con ella es el enlace: apunta a la rama de integración o al commit, nunca a la efímera. El día que se midió, **14 de 16 enlaces daban 404** y nada lo decía |

**El enlace que falta no es un enlace roto, y por eso son dos comprobaciones y no una.**

Un issue se abre en `PHASE 1`, cuando el `intake.md` **acaba de escribirse y todavía no está en
ningún commit**. En ese instante no hay ref durable —la respuesta correcta es «ninguno»— y el
cuerpo lo dice en vez de inventar una URL. El enlace aparece **después**, cuando el trabajo se
commitea y algo vuelve a publicar el cuerpo.

Si nadie vuelve a publicarlo, el issue se queda mudo para siempre. Pasó: **10 de 115 cuerpos** del
tablero de este repositorio publicaban su ruta en texto plano, y eran exactamente los abiertos
después de que `PT-079` midiera «0 de 85 rotos» — porque `PT-079` arregló el enlace **muerto** y
el **ausente** no era el mismo caso.

```
commitea primero, abre el issue despues   ->  nace con enlace
abre el issue, commitea despues           ->  nace mudo, y «espejo» lo dice en cuanto
                                              el intake entre en un commit
```

Las dos secuencias son válidas. La segunda **no se penaliza**: se detecta y se corrige con un
comando. Lo que ya no ocurre es que nadie se entere.

### C6 · ¿El sistema hace lo que el negocio necesita?

| | |
|:---|:---|
| **Entrada** | `[START PTSA]` |
| **Recorrido** | Audita los productos reales contra la Declaración de Valor firmada |
| **Fin** | Matriz de auditoría **sin celdas en blanco** (`PTSA-R77`) |

### C7 · ¿Puede el usuario usarlo de verdad?

| | |
|:---|:---|
| **Entrada** | `[START QA]` |
| **Recorrido** | Navegador real, recorridos reales |
| **Fin** | Cada caso con su evidencia; un happy path fallido no es `QA-A` |

### C8 · ¿Hay secretos en el árbol o en la historia?

```bash
node docs/methodology/tools/revisar-secretos.mjs
```

Un falso positivo se **firma** en `SECRETOS-EXCEPCIONES.md`, con nombre y motivo. Firmar **no
silencia**: la excepción sigue apareciendo en cada revisión (`FND-R29`).

---

## D · Decidir

### D1 · ¿Qué construimos ahora?

| | |
|:---|:---|
| **Entrada** | `[START FPGE]` |
| **Recorrido** | Prioriza con evidencia trazable |
| **Fin** | Un orden con su porqué, que alimenta `PHASE 1` de FDGE |

### D2 · ¿Qué toca ahora mismo?

```bash
node docs/methodology/tools/tracker.mjs siguiente [PT-NNN]
```

La salida **es** la respuesta, no una sugerencia (`SUITE-R49`).

### D3 · ¿Qué exige esta regla que acaba de fallar?

```bash
node docs/methodology/tools/regla.mjs SUITE-R44     # qué exige, dónde vive, quién la comprueba
node docs/methodology/tools/regla.mjs --fallos      # TODO lo que puede fallar, derivado
```

Deducirla no es el camino (`SUITE-R53`).


---

## E · Publicar y mantener

### E1 · Integrar trabajo terminado

El orden **no es opcional** (`SUITE-R46`):

```
1. estado terminal apuntado en la rama de trabajo
2. merge  ← G4, humana sin excepción
3. tracker cerrar --aplicar
```

Al revés, la rama principal queda declarando trabajo vivo con el issue cerrado, y su compuerta
falla **tras cada merge**.

### E2 · Publicar una versión   · **DE LA FUENTE**   `LEX-R25` · `PT-202`

> **Este caso es del repositorio que PRODUCE el paquete, no del que lo instala.**
> `publicar.yml` **no viaja**: `package.json.files` no incluye `.github/`, y no lo copia ni el
> instalador ni `plan-layout` ni `migrate`. Un proyecto que instala cauce **no tiene este
> recorrido**, y lo que publicaría no sería suyo.

| | |
|:---|:---|
| **Entrada** | El merge de `E1` ya está en la rama por defecto |
| **Recorrido** | `publicar.yml`, manual, solo desde la rama por defecto |
| **Humano** | Todo: publicar y rotar credenciales están en `SUITE-R06g` |

### E3 · Subir de versión un proyecto ya instalado

```bash
npx @a81biz/cauce@latest install .     # avisa si hay divergencia, no sobrescribe a ciegas
npx @a81biz/cauce compare .            # qué difiere entre tu copia y la versión
```

`SUITE-R31` · Sincronizar a ciegas es imposible en las dos direcciones.

### E4 · Evolucionar el propio marco

Las reglas van a `RULES.md`, los nombres a `LEXICON.md`, las compuertas a `EXECUTION-MODES.md`.
Ningún otro documento enuncia obligaciones: las **cita** por ID (`LEX-R22`).


### E5 · Dar de alta un componente

| | |
|:---|:---|
| **Entrada** | Cinco pasos, **ninguno opcional** — `PT-149` los midió ejecutando este caso: (1) su entrada en `COMPONENTES`, con los nueve campos de `LEX-R35`; (2) su tabla de fases en `LEXICON` §3, sin la cual el rango es **inventado**; (3) su archivo de prompts declarado en `LEXICON` §6.6; (4) ese archivo, con sus fases; (5) `build-core` |
| **Recorrido** | `verify-patrones` comprueba el contrato → `build-core` lo cuela en `CORE.md` con sus fases y sus triggers → `audit` lo audita → `verify-suite` ve sus reglas |
| **Fin** | `npm run verify` en verde **con el componente dentro** |
| **Humano** | Decidir que el componente existe. Y si toca `docs/methodology/`, `SUITE-R06e` |

**Ninguna herramienta se toca** (`SUITE-R60`). Si hace falta editar una para que el componente
aparezca, ese sitio es un literal que quedó sin derivar — y es un defecto, no un paso.

**Esta frase era falsa hasta `PT-149`, y lo dijo ejecutarla.** Dar de alta un componente de
prueba obligaba a editar **dos** herramientas: `verify-patrones` fijaba que hubiera *exactamente*
seis componentes y que el único opcional fuera `FIDE`, y `build-core` llevaba los bloques de
fases y de triggers **escritos a mano**, así que el componente nuevo no llegaba a `CORE.md` —
y `CORE.md` es lo único que el agente carga. Las dos aserciones de `verify-patrones` se
convirtieron en lo que sí es un contrato —**ninguno de los seis puede desaparecer**, en vez de
«no puede haber un séptimo»—, y los dos bloques de `build-core` se **completan** con lo que falte:
el texto redactado sigue mandando, y nada puede quedar ausente en silencio.

**Y antes de dar de alta nada, decide qué estás dando de alta** (`LEX-R36`): un **componente**
tiene fases, triggers y directorio; una **familia de reglas** es sólo un prefijo con un documento
propietario. `SUITE`, `LEX`, `EXEC` e `INTAKE` son familia y **no** componente, y confundirlos
es lo que hacía que `build-core` afirmara la lista dos veces con cifras distintas.

### E6 · Dar de baja un componente

| | |
|:---|:---|
| **Entrada** | Quitar su entrada del contrato |
| **Recorrido** | El mismo, a la inversa |
| **Fin** | El árbol queda **como estaba, byte a byte** |
| **Humano** | Lo mismo que en `E5` |

**«Byte a byte» no es una floritura.** Que la baja no deje residuo es la mitad de la propiedad:
sin ella, «restable» significa sólo que el componente deja de funcionar, no que se pueda quitar.
`FIDE` es el único componente hoy declarado no obligatorio (`FIDE-R01`), y es el caso que el
`selftest` ejercita.


---

### E7 · Abrir y cerrar una implementación

| | |
|:---|:---|
| **Entrada** | `[IMPLEMENTACIÓN]` para abrirla · `[CIERRA]` para cerrarla |
| **Recorrido** | Una implementación es una **unidad abierta**, no un plan: se abre, se construye —con las mejoras y arreglos que hagan falta, que **son** la construcción— y se cierra. Si es nueva o parte de la abierta lo decide un criterio **escrito** (`FDGE-R50`), no el juicio del día |
| **Fin** | El lote cierra con sus filas de `## Cierre del lote` resueltas (`SUITE-R45`) y su poda publicada (`SUITE-R61`) |
| **Humano** | Decidir que la implementación termina. `G4` sigue siendo humana (`EXEC-R04`) |

**Estos dos triggers no tenían caso hasta `PT-161`**, y son el bucle por el que pasa **todo** el
trabajo de `FDGE`. El catálogo se declara «contrato de cobertura» desde su encabezado, y la puerta
más transitada no estaba en él.

### E8 · Reconciliar la documentación sin regenerar el paquete

| | |
|:---|:---|
| **Entrada** | `[START RECONCILE]` |
| **Recorrido** | `PHASE 1 — Reconciliation` de Foundation, **aislada**: actualiza `00-Baseline.md` y `RECONCILIATION.log`, y **no** regenera el paquete (`FND-R15`) |
| **Fin** | `G0` resuelta con `ACK` humano. Nada se mueve sin él |
| **Humano** | El `ACK` de `G0`. La compuerta sigue viva aunque la fase corra suelta |

**Cuándo hace falta**, y `FND-R15` lo enumera: proyectos que instalaron `4.0.x` —donde la fase no
existía—, proyectos migrados desde `v3`, y proyectos donde la documentación **ha vuelto a
divergir**.

### E9 · Dar por validada la documentación de Foundation

| | |
|:---|:---|
| **Entrada** | `[FOUNDATION VALIDATED]` |
| **Recorrido** | `PHASE 6` de Foundation. Es su **compuerta final**: hasta que se dice, la documentación generada no es la base de nada |
| **Fin** | El paquete queda validado y `FDGE` puede apoyarse en él |
| **Humano** | **Todo el caso.** El trigger *es* el acto humano: nadie más puede afirmar que la documentación describe el sistema |


### E10 · Migrar el proyecto a la versión vigente

| | |
|:---|:---|
| **Entrada** | `[START MIGRATE]` |
| **Recorrido** | `SUITE-R17` · si `REGISTRY.suite_version` no coincide con la versión vigente de `CHANGELOG.md`, el proyecto entra en **modo restringido**: sólo se permiten `[START MIGRATE]`, los `status *` y **terminar los PT ya en vuelo**. No se abre trabajo nuevo |
| **Fin** | Las versiones coinciden y la restricción se levanta |
| **Humano** | Decidir migrar. **La restricción se levanta migrando, nunca ignorándola** |

**Este trigger no pertenece a ningún componente: es de la suite**, y por eso no estaba en el
contrato — no tenía sitio. `PT-152` le dio uno, y **la comprobación que `PT-161` acababa de
escribir lo cazó en la primera corrida**: una puerta del marco que quedaba fuera del contrato de
cobertura **y fuera de quien lo vigila**.

## F · Configuración

### F1 · Sin plataforma declarada

Todo funciona salvo el tablero. `tracker` sale con código `2` y lo **declara**: `SIN EVALUAR`, no
«no hay nada abierto».

### F2 · Con GitHub

```yaml
plataforma: github
```

Activa el espejo (`SUITE-R35`), `G4` sobre pull request (`SUITE-R42`), la lectura obligatoria de
comentarios humanos (`SUITE-R43`) y los sub-issues (`SUITE-R51`).

### F3 · Con Azure

El adaptador existe. **Sin proyecto que lo ejercite**, y eso se dice en vez de presentarlo como
soportado: escribir contra ningún caso es código sin ejecución.

### F4 · Equipo de una sola persona asistida por IA

Soportado explícitamente (`SUITE-R22`). No cambia nada: las compuertas siguen siendo humanas, y
la lista `firmantes` sigue siendo la única defensa mecánica contra una firma inventada
(`SUITE-R27`).

### F5 · Elegir modo de ejecución

`MANUAL` · `SUPERVISED` (por defecto) · `AUTONOMOUS`.

Lo único que cambia es **quién resuelve las compuertas y cuándo se pide confirmación**. Nunca qué
se exige (`EXEC-R08`). `G4` es humana en los tres, sin excepción (`EXEC-R04`).

---

## Huecos declarados

Lo que este catálogo **no** cubre hoy, dicho en vez de callado (`RULE-06`):

| Hueco | Por qué |
|:---|:---|
| Azure ejercitado de punta a punta | No hay proyecto que lo use (`F3`, `PT-025`) |
| Monorepo con varios `REGISTRY.json` | No probado. El marco asume uno por repositorio — aunque `PT-070` derivó bien el alcance de un monorepo real de cuatro aplicaciones |
| Varios agentes trabajando a la vez | El espejo detecta divergencia; nada **reparte** el trabajo. `EP-016` resolvió la identidad, los rangos de ID y la marca de sesión por persona — la coordinación sigue abierta |
| Migración desde una suite que no sea cauce | Fuera de alcance del marco |
| **Migrar de verdad un legado** | `PT-019` validó que el **informe** de `migrate` es correcto y accionable sobre un legado real de `4.12.0` con 127 tareas. **No se ejecutó `--apply`**: entre «dice bien qué hacer» y «lo hace bien» queda un paso |
| **Un legado sintético** | `PT-019` lo declaró reducido: el real provoca los casos mejor, y un sintético habría medido mi capacidad de inventar defectos |
| **`comparar-marco` ejecutada desde el marco** | Llama «canónica» al argumento, así que ejecutada desde cauce contra un destino **invierte las etiquetas**. El contenido es correcto; el rótulo miente. Está pensada para correr **desde el proyecto**, y eso no estaba escrito (`HL-1` de `PT-019`) |

| **`FQAGE` sobre un paquete sin interfaz** | **No aplica, y no es lo mismo que «no probado».** `QA-R01` dice que el componente *opera SOLO desde el navegador, nunca lee código*, y `inventory/routes.md` y `endpoints.md` declaran que este sistema no tiene rutas ni API. Un caso de QA sin navegador no es un QA relajado: es otra cosa con el mismo nombre. Lo más cercano a «el usuario puede usar el sistema» para un paquete de línea de comandos —instalarlo limpio y cerrar un trabajo entero— **ya está hecho** y es `PT-072`, una tarea de `FDGE` |

Un caso que aparezca y no esté aquí **entra como `PT`**, no como párrafo.

## `QA` no aplica, y por qué se declara en vez de forzarlo

`PT-092` tenía que ejecutar `QA` y `FPGE`. **`FPGE` se ejecutó** —`ROADMAP.md`, ocho candidatos con
su evidencia—. `QA` **no**, y la razón está medida arriba.

Montar un `QA/` con casos que no usan navegador habría puesto `verify-qa` en verde y dejado este
catálogo diciendo que el ciclo completo se ha ejercitado. **Sería fabricar un verde en el
componente cuyo lema es *«sin captura el paso no ocurrió»***.

Es la misma decisión que `PT-072` tomó al **no declarar plataforma** en el proyecto de prueba: un
caso configurado para que salga bien no prueba nada — y aquel silencio fue lo que destapó `H7`, el
único hueco crítico de aquella prueba.

## Lo que `EP-017` cerró, y ya no es hueco

`CASOS-DE-USO` declaraba «varios agentes a la vez» como si nada de eso estuviera resuelto. `EP-016`
cerró la identidad, los rangos y la sesión por persona; el hueco real y más estrecho es **la
coordinación del reparto**, y así queda escrito arriba.

Y estos dos casos **dejaron de ser una promesa** porque se ejecutaron:

| Caso | Qué se hizo, y qué salió |
|:---|:---|
| **Un proyecto nuevo, de cero a un `PT` cerrado** (`PT-072`) | Instalado desde `npm pack`, Foundation, un `PT` completo con tests en rojo primero, `cauce verify` en **cero errores**. Y **siete huecos**, dos de ellos `S1` |
| **Un legado de cinco majors atrás** (`PT-019`) | `4.12.0`, 127 tareas. `migrate` separa **1 acción automática de 6 decisiones humanas** y dice por qué cada una lo es. **36 de sus 39 archivos difieren.** El original, con `0` cambios |

Los dos `S1` que salieron del proyecto nuevo se arreglaron en el mismo lote: `PT-084` —la
plataforma era obligatoria de hecho— y `PT-083` —la plantilla que el paquete distribuye fallaba
su propio verificador—. **Ejecutar el marco encontró lo que leerlo no encontraba.**
