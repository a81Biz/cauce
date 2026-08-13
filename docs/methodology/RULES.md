# RULES — Reglas Normativas de la Suite

> **Estatus:** normativo. Fuente de verdad de las reglas **de componente**.
> Ningún documento operativo puede enunciar una obligación: **citan** el ID (`FDGE-R07`) y
> explican su porqué; nunca reformulan el texto.
> **Autoridad:** ver `LEX-R21`. Vocabulario: [LEXICON.md](LEXICON.md).
>
> Suite version: **5.2.1**

---

## Dónde vive cada familia de reglas

Este archivo **no** contiene todas las reglas de la suite: contiene las de componente. Tres
familias viven en el documento que las gobierna, porque separarlas de su contexto las haría
ilegibles. Cada una tiene un propietario único y no se duplica en ningún otro sitio.

| Familia | Propietario | Cubre |
|:---|:---|:---|
| `SUITE-Rnn` · `FND-Rnn` · `FDGE-Rnn` · `INTAKE-Rnn` · `QA-Rnn` · `FPGE-Rnn` · `FIDE-Rnn` | **este archivo** | Reglas de componente |
| `LEX-Rnn` | [LEXICON.md](LEXICON.md) | Nombres: fases, IDs, estados, archivos, triggers |
| `EXEC-Pn` · `EXEC-Rnn` | [EXECUTION-MODES.md](EXECUTION-MODES.md) | Compuertas, modos de ejecución, lotes |
| `PTSA-Rnn` | [PTSA/PTSA-V3-Especificacion-Oficial.md](PTSA/PTSA-V3-Especificacion-Oficial.md) | Norma exhaustiva de auditoría |
| `RULE-nn` | `11-Conventions.md` del proyecto | Hard Rules específicas del codebase |

`SUITE-R14` · **(CHECK)** Un mismo ID de regla no puede definirse en dos documentos. La
§Parte 6 de este archivo **cita** las reglas de PTSA por su ID real en la especificación; no
las renumera. `tools/verify-suite.mjs` rechaza cualquier definición duplicada.

---

## Cómo leer este documento

Cada regla tiene: un **ID estable**, un **enunciado** en una frase imperativa, una
**severidad de violación** y, cuando existe, el **chequeo automático** que la verifica.

| Severidad | Significado |
|:---|:---|
| **HARD** | Violarla invalida el trabajo. El agente se detiene y reporta. Sin excepciones por urgencia, trivialidad o familiaridad con el código. |
| **SOFT** | Violarla requiere una justificación registrada en el artefacto correspondiente. El trabajo continúa. |
| **CHECK** | **Realmente** comprobada hoy por `tools/verify-fdge.mjs` o `tools/verify-suite.mjs`. Bloquea la integración. Marcar `CHECK` una regla que ningún script verifica es una promesa falsa: si quieres exigirla, escribe el chequeo. |

`SUITE-R00` · **(HARD)** Ninguna regla de este documento puede ser derogada, relajada o
reinterpretada por el `CLAUDE.md` de un proyecto destino. El `CLAUDE.md` del proyecto
**parametriza** (modo de ejecución, dominio, rutas); no legisla.

---

# Parte 1 — Reglas transversales de la suite

| ID | Sev | Regla |
|:---|:---:|:---|
| `SUITE-R01` | HARD | **Evidence Before Action.** Toda decisión técnica se apoya en evidencia verificable en un artefacto o en la ejecución observada. Nunca en memoria del agente, intuición, suposición ni contexto conversacional. |
| `SUITE-R02` | HARD | **Evidence After Execution.** El código no es evidencia. La ejecución verificable sí. Toda modificación produce evidencia antes de considerarse completa. |
| `SUITE-R03` | HARD | **Session Independence.** Ninguna sesión depende de la memoria del agente. Todo conocimiento relevante persiste en artefactos del repositorio antes de terminar la sesión. |
| `SUITE-R04` | HARD | **No Hidden Reasoning.** El razonamiento estratégico se materializa en un artefacto. Una decisión importante que solo existe en el chat no existe. |
| `SUITE-R05` | HARD | **Human Governance.** Toda acción irreversible requiere decisión humana explícita. Ver `SUITE-R06`. |
| `SUITE-R06` | HARD | **Lista cerrada de acciones irreversibles.** Ningún modo de ejecución automatiza: (a) merge o push a la rama principal; (b) cierre de un ítem de tipo `BUG`; (c) migración, borrado o transformación destructiva de datos; (d) cualquier operación contra un entorno de producción; (e) modificación de los documentos de la propia metodología; (f) `git push --force`, reescritura de historia, borrado de ramas remotas; (g) rotación o exposición de credenciales. |
| `SUITE-R07` | HARD | **No Foundation Skip.** Ningún componente opera sobre un proyecto sin `docs/enterprise-documentation/` generada y validada con `[FOUNDATION VALIDATED]`. Ver `FND-R08` para la verificación real. |
| `SUITE-R08` | CHECK | **Un solo asignador de identificadores.** Todo ID se obtiene de `docs/implementation/REGISTRY.json`. Derivarlo contando entradas en un `.md` o `.json` está prohibido (`LEX-R04`, `LEX-R06`). |
| `SUITE-R09` | HARD | **Append-only es literal.** Un artefacto declarado append-only nunca se reescribe, reordena ni compacta. Corregir un error pasado se hace con una entrada nueva que lo referencia, no editando la anterior. |
| `SUITE-R10` | HARD | **Propiedad de artefactos.** Cada artefacto tiene exactamente un componente dueño. Solo el dueño escribe en él. Ver la matriz de §Parte 9. |
| `SUITE-R11` | SOFT | **Declared coverage.** Ningún score (Health PTSA, QA Health, confianza de fase) es válido sin cobertura y freshness declaradas junto al número. |
| `SUITE-R12` | HARD | **Sin auto-activación.** Ningún componente se activa sin su trigger explícito (`LEX-R18`). |
| `SUITE-R15` | HARD | **Carga mínima de contexto.** El agente carga `CORE.md` —el núcleo operativo compilado— y **no** los documentos completos de `docs/methodology/`. Abre un documento completo solo cuando `CORE.md` lo remite explícitamente para un caso concreto. Cargar la suite entera cuesta ~59 500 tokens por sesión; el núcleo más el `CLAUDE.md` del proyecto cuestan ~16 000 y contienen todas las directivas. |
| `SUITE-R16` | CHECK | **`CORE.md` es generado, nunca editado a mano.** Lo produce `tools/build-core.mjs` desde `RULES.md`, `LEXICON.md` y `EXECUTION-MODES.md`. Editarlo a mano reintroduce exactamente la divergencia entre copias que la v4 nació para eliminar. `verify-suite` comprueba que está sincronizado con sus fuentes. |
| `SUITE-R17` | HARD | **Compuerta de migración.** Si `REGISTRY.suite_version` no coincide con la versión vigente de `CHANGELOG.md`, el proyecto entra en **modo restringido**: solo se permiten `[START MIGRATE]`, los `status *` y **terminar los PTs ya en vuelo**. No se abre trabajo nuevo. La restricción se levanta migrando, nunca ignorándola. |
| `SUITE-R18` | HARD | **Las sesiones activas sobreviven a una migración.** Cada `allocation` de `REGISTRY.json` lleva su propio `suite_version`. Un PT abierto bajo una versión **la conserva hasta cerrar**; los PTs nuevos usan la vigente. Una migración nunca invalida trabajo en curso ni obliga a rehacerlo — obligar a rehacer trabajo válido es la forma más rápida de que un equipo abandone el framework. |
| `SUITE-R19` | CHECK | **Migración verificada, no solo ejecutada.** `tools/migrate.mjs` detecta la versión instalada, ejecuta en `--dry-run` por defecto y solo modifica con `--apply`. Lo que no puede automatizarse —firmas retroactivas, decisiones de reconciliación— se lista como acción humana pendiente, **nunca se inventa**. Tras `--apply`, encadena `verify-fdge --all` y reporta su resultado: una migración que deja el proyecto en estado inválido es peor que no haber migrado, porque parece terminada. |
| `SUITE-R20` | CHECK | **`PHASES.md` y los `*-Prompts.md` no pueden divergir.** `PHASES.md` es canónico. Todo bloque de fase declarado allí existe en el archivo de prompts de su componente, y toda regla citada en un bloque de `PHASES.md` está también citada en ese archivo de prompts. `verify-suite` lo comprueba. Sin este chequeo, la expansión legible y la directiva ejecutada se separan en silencio — exactamente el fallo que la v4 nació para eliminar, reintroducido por la puerta de atrás. |
| `SUITE-R21` | HARD | **El `CLAUDE.md` del proyecto no repite reglas.** Contiene parametrización (modo, dominio, rutas) y punteros. Todo resumen de reglas que se cargue en cada sesión es a la vez coste de tokens y una copia que puede divergir. |
| `SUITE-R22` | SOFT | **Quién es «el humano».** La suite **no exige** que las cuatro compuertas las resuelvan personas distintas: está diseñada también para equipos de una sola persona asistida por IA, donde exigirlo la haría inaplicable. Lo que sí exige es que **quede registrado quién resolvió cada una** (`FDGE-R26`, línea `Compuertas:` de `HISTORY.log`). Con más de una persona se recomienda —no se obliga— que quien valida un `BUG` en G3 no sea quien lo implementó, y que G4 la resuelva alguien distinto del autor. Declararlo evita que la ausencia de la regla se lea como un olvido. |
| `SUITE-R23` | HARD | **Disciplina de respuesta.** Lo que el agente escribe al humano cuesta tokens y tiempo de lectura. **No incluye:** lo que salió bien · por qué una decisión es correcta · justificaciones de diseño · recapitulaciones de lo ya acordado · preámbulos ni cierres valorativos. **Sí incluye:** lo que falla · lo que cambió · lo que queda · lo que necesita decisión. Explica el porqué **solo si el humano lo pide**: el porqué vive en los artefactos —`design.md`, `HISTORY.log`, `CHANGELOG.md`—, que se leen cuando hacen falta y no en cada turno. |
| `SUITE-R24` | HARD | **Directiva sin relato.** Lo que el agente **lee** sigue la misma economía: `PHASES.md` usa forma telegráfica (`LEE` · `HAZ` · `SALE` · `NO` · `PARA`) y `CORE.md` recorta cada regla a su primera frase imperativa. El rationale vive en los `Framework-*.md`, que no se cargan nunca. Quitar el porqué del texto que se **ejecuta** es ganancia pura; quitar precisión de la regla no lo es: una regla ambigua se aplica mal justo en los casos límite, que es donde importa. |
| `SUITE-R25` | HARD | **Overlay por componente.** `CORE.md` lleva las reglas que toda sesión necesita. Un componente cuyo ruleset propio no cabe ahí sin encarecer todas las sesiones recibe un **overlay** que se carga solo al invocarlo: `[START PTSA]` carga `CORE.md` **y** `CORE-PTSA.md`. Los overlays los genera `build-core.mjs` desde la especificación del componente y no se editan a mano (`SUITE-R16`). |
| `SUITE-R26` | CHECK | **Toda regla HARD aspira a comprobación mecánica.** Una regla que solo se cumple por buena voluntad es una recomendación. `tools/audit.mjs` publica la cobertura mecánica por componente; cuando una HARD no la tenga, el hueco se declara, no se ignora. Verificadores vigentes: `verify-fdge.mjs` · `verify-ptsa.mjs` · `verify-qa.mjs` · `verify-suite.mjs`. |
| `SUITE-R27` | HARD | **Qué prueba una firma.** Una firma es una **declaración de responsabilidad**, no una prueba criptográfica: el agente escribe el archivo y podría escribir cualquier nombre. Por eso el `CLAUDE.md` del proyecto declara `firmantes:` y `verify-fdge` rechaza toda firma ajena a esa lista. Lo que el marco garantiza es que **hay un nombre concreto asociado a cada decisión irreversible** y que ese nombre estaba autorizado; lo que no puede garantizar es la voluntad detrás. Quien figura en `firmantes` responde de lo que lleva su nombre. |
| `SUITE-R28` | HARD | **La conversación es la interfaz; el artefacto es el registro.** El agente ejecuta las herramientas, **presenta el resultado en la conversación** y pregunta ahí lo que haya que decidir. Escribir un `.md` y decir «léelo y vuelve» desperdicia el único medio donde el humano ya está mirando, y convierte una decisión de treinta segundos en una tarea pendiente. Los artefactos se siguen escribiendo —son el registro auditable y sobreviven a la sesión— pero no son por dónde se decide. Lo que no se puede sustituir es **quién decide**, no quién teclea. |
| `SUITE-R29` | HARD | **Dependencias declaradas, comprobadas e instaladas con permiso.** `tools/plan-layout.mjs` comprueba `node`, `git`, `python` y `graphifyy`; QA añade `playwright`. Cada instalación se pide **una por una y con su motivo**. Descubrir a mitad de sesión que falta una es perder la sesión — y sin `graphifyy` el grafo queda `MISSING`, que bloquea `G2` en los PT `MAJOR` (`FDGE-R43`). |
| `SUITE-R30` | HARD | **La instalación deja registro de lo que ejecutó.** `LAYOUT.md` guarda las **decisiones**; `docs/implementation/INSTALL.log` guarda los **hechos**: qué se movió y desde dónde, qué se sustituyó y con qué respaldo, qué commit lo contiene, qué dependencia se instaló, con qué alcance se generó el grafo, y qué falló. Append-only. Sin él, revertir una instalación exige reconstruir a mano lo que pasó, y una auditoría posterior no puede distinguir lo que hizo la instalación de lo que hizo alguien después. Toda propuesta `ACEPTADA` en `LAYOUT.md` tiene su entrada correspondiente: una decisión sin ejecución registrada es una decisión que nadie sabe si se cumplió. |
| `SUITE-R31` | HARD | **La divergencia del marco se mide.** La suite se instala **copiando** `docs/methodology/` al proyecto, así que cada proyecto tiene la suya y nada avisa cuando se separan — lo que `SUITE-R21` intenta evitar y la instalación por copia garantiza que ocurra. `tools/comparar-marco.mjs` dice qué difiere y **en qué dirección**; decidir si se propaga o se migra es humano (`SUITE-R06e`). Nunca se sincroniza a ciegas en ninguna de las dos direcciones: sobrescribir la copia de un proyecto con la de referencia puede revertir correcciones que ese proyecto hizo bajo sus propios PT. |
| `SUITE-R32` | HARD | **Un espacio de trabajo nace con contenido.** Git no versiona directorios vacíos: un `PTSA/` creado por el instalador y nunca escrito desaparece en el primer clon, y el verificador lo reporta como «nada que auditar» — la ausencia se vuelve indistinguible de «no aplica». Cada espacio nace con un archivo que lo sostiene y explica para qué sirve. |
| `SUITE-R33` | HARD | **El estado se declara en un bloque corto y fijo.** `HANDOFF.md` abre con un bloque `ESTADO` delimitado que responde, siempre en el mismo orden: qué implementación está abierta · qué tarea y en qué fase · qué compuerta espera y a quién · **la siguiente acción concreta** · las decisiones vivas que no se deducen del repositorio · qué NO hacer. El relato histórico va debajo. Un `HANDOFF` de doscientas líneas de prosa cuenta lo que se hizo; retomar necesita saber qué está abierto y qué sigue, y eso tiene que caber en una pantalla. |
| `SUITE-R34` | HARD | **El estado tiene que ser más reciente que el trabajo.** Si hay commits que tocaron `changes/` **después** del último que tocó `HANDOFF.md`, la sesión terminó sin dejar el estado retomable y `SUITE-R03` deja de cumplirse. Se comprueba contra git, que es el único reloj que no depende de nadie. Es la comprobación que convierte «ninguna sesión depende de la memoria del agente» de declaración en exigencia. |
| `SUITE-R35` | HARD | **El registro asigna; la plataforma espeja.** `REGISTRY.json` sigue siendo el único asignador de identificadores (`SUITE-R08`) y cada `allocation` guarda su número de issue. La plataforma —GitHub, Azure— responde **qué está abierto y qué sigue**; el repositorio responde **qué se decidió y qué se probó**. El espejo se comprueba por enumeración en las dos direcciones: toda allocation viva tiene issue abierto, y todo issue abierto tiene allocation viva. **El issue referencia el intake; no lo copia** — dos copias del mismo texto divergen, que es la causa raíz que la v4 nació para eliminar. Declarar plataforma es opcional; con ella, el estado deja de vivir en la memoria del agente. |
| `SUITE-R36` | HARD | **Al adoptar la plataforma, solo migra lo vivo.** Un proyecto en marcha lleva una implementación abierta y unas pocas tareas; lo cerrado **no es estado, es evidencia**, y se queda en el repositorio junto al código que lo produjo. Crear un issue por cada trabajo terminado llena la plataforma de cadáveres que el espejo tendría que reconciliar para siempre. La adopción **reduce** trabajo: solo lo que está abierto necesita estar consultable. |
| `SUITE-R37` | HARD | **Qué se versiona, decidido de una vez.** Evidencia, ledgers y `docs/methodology/` **sí**: auditar un commit antiguo exige saber qué reglas lo gobernaban, y sin la carpeta eso depende de que el paquete siga publicado. La salida del grafo **no**: es regenerable y su frescura vive en `REGISTRY.graph`. Los ledgers append-only de la suite **nunca** caen bajo una regla `*.log` — sin ellos `G4` no tiene qué verificar, `PHASE 10` no tiene a qué volver y un clon pierde la trazabilidad entera. |
| `SUITE-R38` | HARD | **Un patrón crítico vive en un solo sitio y viaja con su contrato.** `tools/patrones.mjs` los define una vez, cada uno con lo que **tiene** que casar y lo que **no** debe casar, y `tools/verify-patrones.mjs` ejecuta ese contrato. Un patrón puede estar mal **y compilar**: ocho veces en este proyecto una secuencia de escape se perdió al editar —`\b` quedó como el byte `0x08`, `\s` como la letra `s`— y el regex resultante era válido y no casaba nada. El verificador informaba «sin errores» porque no encontraba nada que reprochar: **el fallo era indistinguible del éxito**. Detectar bytes de control caza la mitad de los casos y deja fuera la silenciosa. Solo `casa` deja pasar un patrón demasiado laxo; solo `noCasa`, uno que no casa nada: hacen falta las dos listas. |
| `SUITE-R39` | HARD | **La frontera del proyecto se declara, y se dice qué la sostiene.** Cauce es por proyecto y eso ya funciona; lo que ninguna regla escrita cerca es **el agente**. En la primera máquina donde se usó, el historial de permisos guarda órdenes concedidas que alcanzaban un proyecto hermano. `I0-bis` enumera la vecindad y nombra los dos niveles con lo que garantiza cada uno: **configuración de permisos**, que ataja el alcance accidental y depende de que el arnés la respete, y **contenedor** con solo esta raíz montada, que lo impone el núcleo. Elegir es humano, y empezar sin ninguno de los dos es una opción legítima que se escribe. **Cauce no genera contenedores**: un Dockerfile inventado para un stack que no conoce es imponer terreno, justo lo que `FND-R25` prohíbe — detecta si los hay y lo dice. Y las credenciales de publicación se quedan **fuera** de cualquier contenedor: `SUITE-R06a` mantiene el merge y la publicación en manos humanas, y una credencial dentro del recinto convierte el recinto en el sitio desde donde se publica. |
| `SUITE-R40` | HARD | **La versión vigente se deriva; no se escribe dos veces.** La fuente es la primera entrada de `CHANGELOG.md`, que viaja dentro de la suite y por tanto existe también en un proyecto destino. Ninguna herramienta la fija en una constante: `verify-suite` la tuvo escrita a mano siendo **la autoridad contra la que se comprueban todos los documentos**, y quedó una versión por detrás de `package.json` sin que nada lo notara — el verificador que existe para cazar versiones desalineadas era él mismo una copia más del número. Es el defecto de la v3, el mismo hecho escrito a mano en varios sitios divergiendo, dentro de la herramienta que lo persigue. En el repositorio de cauce, `package.json` debe coincidir con esa entrada: publicar un número que no corresponde a su contenido deja el registro mintiendo, y npm no permite deshacerlo. |
| `SUITE-R13` | CHECK | **Versionado.** Todo proyecto destino declara `suite_version` en `REGISTRY.json` y en su `CLAUDE.md`. Un desajuste con `docs/methodology/CHANGELOG.md` se reporta al inicio de sesión. |

---

# Parte 2 — Foundation Protocol

| ID | Sev | Regla |
|:---|:---:|:---|
| `FND-R01` | HARD | **Nothing is invented.** Todo hecho documentado cita su fuente: ruta de archivo y línea, o el comando que lo evidencia. Un hecho no citable no se documenta: se registra como «No determinado» en `10-Technical-Debt.md`. |
| `FND-R02` | HARD | Foundation **descubre**, no diseña. Las recomendaciones van exclusivamente a `10-Technical-Debt.md`, separadas de los hechos observados. |
| `FND-R03` | CHECK | Los nombres de archivo generados son exactamente los de `LEX-R10` §6.1. Cualquier otra grafía es un defecto. |
| `FND-R04` | HARD | Re-ejecutar Foundation **sobrescribe** el paquete completo. No es un merge: es una fotografía nueva. El `Delta Log` de `11-Conventions.md` es la única excepción incremental. |
| `FND-R05` | CHECK | `11-Conventions.md` contiene, como mínimo: estructura de carpetas, convenciones de naming con ejemplos reales, patrones arquitectónicos con ejemplo de código, y **al menos 3 Hard Rules** en formato `RULE-nn`. Menos de 3 indica análisis superficial y bloquea la validación. |
| `FND-R06` | HARD | Foundation está completo solo tras `[FOUNDATION VALIDATED]` emitido por un humano que declaró explícitamente haber leído el PRD y el TRD. |
| `FND-R07` | SOFT | Se re-ejecuta cuando: cambia la arquitectura principal, se añade un módulo mayor, pasan 3 meses de desarrollo activo, u otro componente detecta discrepancias. |
| `FND-R09` | HARD | **Inventario del desorden.** Antes de generar nada, Foundation cataloga **toda** la documentación preexistente del repositorio (`*.md`, wikis locales, notas, ADRs, READMEs de subcarpeta) en `00-Baseline.md`, con una decisión por archivo: `KEEP` · `SUPERSEDE` · `ARCHIVE` · `DELETE`. Un documento sin decisión queda `KEEP` por defecto y se declara como riesgo. |
| `FND-R10` | HARD | **Compuerta de reconciliación (G0).** Nada se mueve, archiva ni borra sin ACK humano sobre `00-Baseline.md`. Es la única compuerta de Foundation además del `[FOUNDATION VALIDATED]` final. |
| `FND-R11` | HARD | **Nada se borra: se archiva.** Los documentos marcados `ARCHIVE` o `SUPERSEDE` se mueven a `docs/_archive/<fecha>/` conservando su ruta original. `DELETE` solo aplica a artefactos regenerables (builds, cachés, temporales). La decisión y su motivo se registran en `docs/implementation/RECONCILIATION.log` (append-only). |
| `FND-R12` | HARD | **Fuente única tras la reconciliación.** Al cerrar Foundation, `docs/enterprise-documentation/` es la **única** documentación de arquitectura, dominio y convenciones vigente. Cualquier documento superviviente marcado `KEEP` que trate esas materias debe declarar en su cabecera a qué documento del paquete se subordina, o pasa a `SUPERSEDE`. Sin esta regla, FDGE `PHASE 2` lee «la documentación» sin saber cuál manda. |
| `FND-R13` | CHECK | **Línea base de divergencia.** Verificado: si existe `00-Baseline.md`, debe declarar totales de inventario, divergencias y confianza de partida; si existen decisiones en `RECONCILIATION.log`, debe existir `00-Baseline.md`. `00-Baseline.md` declara: nº de documentos inventariados y su decisión · divergencias detectadas entre lo que la documentación previa afirmaba y lo que el código hace · áreas del código sin documentación previa · fecha y alcance. Es la fotografía del desorden de partida, y la referencia contra la que se mide si el proyecto mejora. |
| `FND-R14` | CHECK | **El grafo forma parte del paquete.** Foundation genera o exige `graphify-out/` sobre `src/` y registra en `REGISTRY.json` el bloque `graph` con `generated`, `scope` y `pt_at_generation`. Sin grafo, Foundation cierra con confianza `BAJA` declarada y `FDGE-R43` bloquea el trabajo `MAJOR`. |
| `FND-R19` | HARD | **La carpeta que recibe la suite manda.** Es la **raíz**, sin excepción. Todo lo demás —repositorios anidados, código suelto, documentos de investigación— se acomoda bajo ella. Mover la raíz para acomodar lo que ya estaba es como se pierde la trazabilidad: `G4` es un merge real (`FDGE-R33`), `PHASE 10` es un rollback real y la evidencia se ancla a commits. Con la raíz fuera del repositorio, esas tres cosas no tienen dónde ocurrir. |
| `FND-R20` | HARD | **El terreno se enumera antes de documentarlo.** `PHASE 0` ejecuta `tools/plan-layout.mjs`: repositorios anidados, dónde vive el código de verdad, manifiestos, documentos sueltos y artefactos que faltan. Documentar y auditar una estructura que está a punto de cambiar es trabajo que hay que rehacer. |
| `FND-R21` | HARD | **El plan de terreno propone; no ejecuta.** Se escribe en `docs/implementation/LAYOUT.md` y **ningún archivo se mueve al generarlo**. Mover código rompe importaciones, historias de git y rutas de despliegue. Un `LAYOUT.md` ya firmado no se sobrescribe: se archiva y se regenera. |
| `FND-R22` | HARD | **El plan de terreno pasa por G0.** Cada movimiento se resuelve `ACEPTADO`, `RECHAZADO` con motivo o `MODIFICADO` con el destino real, y el bloque de firma lo cierra una persona. Ningún modo de ejecución lo automatiza. Lo aceptado se ejecuta como PT `REFACTOR` con `Estructural: sí` (`FND-R17`). |
| `FND-R23` | HARD | **Sin terreno resuelto no se abre trabajo nuevo.** Mientras `LAYOUT.md` exista sin firmar, `verify-fdge` bloquea la apertura de PTs. Los que ya estén en vuelo se terminan. |
| `FND-R24` | HARD | **La Declaración de Valor no se pide al instalar: la produce Foundation.** Instalar es poner el terreno en orden; describir qué entrega el sistema exige haber leído el código, y eso es `PHASE 0` de Foundation. El agente la **redacta** ahí —leyendo `README`, manifiestos, rutas, entry points y `docs/business/`— y el humano la corrige y la firma. La primera auditoría PTSA la contrasta contra los productos reales y la corrige si hace falta. Pedirla en blanco al instalar es pedir trabajo que el agente puede hacer, y en blanco se responde con generalidades. La diferencia con `INTAKE-R01` es el tiempo verbal: un Intake declara **intención futura**, que solo el humano tiene; la Declaración de Valor describe **lo que ya existe**. | `PHASE 0` la propone leyendo lo que hay —`README`, manifiestos, rutas, entry points, y los documentos de negocio del repositorio— y el humano la **corrige y la firma**. Pedírsela en blanco es pedir trabajo que el agente puede hacer, y se responde con generalidades. La diferencia con `INTAKE-R01` es el tiempo verbal: un Intake declara **intención futura**, que solo el humano tiene; la Declaración de Valor describe **lo que ya existe**, que está en el repositorio. Sin firma humana no es válida: PTSA audita contra ella. |
| `FND-R25` | HARD | **Destino canónico, por criterio y no por gusto.** Una carpeta con `package.json`, `docker-compose.yml`, `playwright.config.ts` o equivalente **es una raíz de proyecto**: su contenido sube a la raíz. Sin esas marcas es una carpeta de código suelta y su sitio es `src/`. El criterio no es estético: esas herramientas buscan su configuración **en la raíz**, y la suite espera `playwright.config.ts` ahí para QA (`QA-R10`) — meterlo bajo `src/` enfrentaría al marco consigo mismo. |
| `FND-R26` | HARD | **La estrategia de historia git sale de los hechos.** Se conserva (`subtree`/`filter-repo`) si el repositorio anidado tiene **más de un commit o un remoto publicado**; se descarta (`git init` en la raíz) si no. Conservar una historia de un solo commit de andamio, sin remoto y con todo el trabajo real sin versionar, protege lo que no hay que proteger: lo que hay que salvar está en el árbol de trabajo. |
| `FND-R27` | HARD | **Qué se versiona es una decisión humana.** Un repositorio que no versiona ni un archivo —un `.gitignore` con `*`, por ejemplo— es tan inútil como no tenerlo: `G4` no tiene qué fusionar, `PHASE 10` no tiene a qué volver y la evidencia no se puede anclar. La herramienta **propone** un `.gitignore` para el stack detectado; sustituirlo lo aprueba una persona en `G0`. |
| `FND-R28` | HARD | **El grafo cubre el código propio y nada más.** Fuera: dependencias de terceros, salida de compilación, pruebas, fixtures y mocks. El grafo describe **el sistema**; las pruebas describen cómo se comprueba, y las dependencias no son del sistema. Meterlas ahoga las señales propias entre miles de nodos ajenos y encarece cada consulta. El alcance lo calcula `tools/plan-layout.mjs`, no el criterio del momento. |
| `FND-R29` | HARD | **Nada se publica sin revisar secretos, y la revisión bloquea.** Instalar la suite implica que el repositorio va a publicarse, y publicar es irreversible donde importa: **un secreto en la historia sigue ahí después de borrarlo del archivo**. `tools/revisar-secretos.mjs` recorre el árbol y, con `--historial`, los commits. Bloquea y **propone la corrección** — un escáner que solo dice «hay un secreto» deja el trabajo entero al que lo lee. Un falso positivo se firma como se firma el plan de terreno: por escrito, con nombre y motivo. **No se silencia el escáner.** |
| `FND-R30` | HARD | **Los accesos se comprueban antes de necesitarlos.** `PHASE 0` de la instalación verifica que existan y estén autenticados los accesos que el proyecto va a usar: `gh` o `az` si declara plataforma, credenciales de despliegue si las hay. Descubrir a mitad de sesión que falta un permiso es perder la sesión — el mismo argumento de `SUITE-R29` para las dependencias, aplicado a lo que no se instala sino que se concede. |
| `FND-R15` | HARD | **Reconciliación suelta.** `PHASE 1 — Reconciliation` puede ejecutarse aislada sobre un proyecto que **ya** tiene Foundation, con `[START RECONCILE]`. Actualiza `00-Baseline.md` y `RECONCILIATION.log` y **no regenera** el paquete. Necesaria en tres casos: proyectos que instalaron 4.0.x —donde la fase no existía—, proyectos migrados desde v3, y proyectos donde la documentación ha vuelto a divergir. La compuerta **G0** sigue viva: nada se mueve sin ACK. |
| `FND-R16` | HARD | **Inventario estructural del código.** `PHASE 1` cataloga también el desorden del **código**, no solo de la documentación: código fuera de `src/` · módulos duplicados o casi duplicados · módulos huérfanos que nadie importa · configuración dispersa · tests mezclados con el código · archivos desproporcionados · rutas que contradicen la estructura declarada en `11-Conventions.md`. Va a `00-Baseline.md` §Desorden estructural con su propuesta de normalización. |
| `FND-R17` | HARD | **Foundation no mueve código.** Diagnostica y propone; **ejecuta FDGE**. Cada normalización estructural aprobada en **G0** se convierte en un PT de tipo `REFACTOR` con `Estructural: sí`, y pasa por sus compuertas, sus tests de regresión y su rollback. Mover código sin red de tests es exactamente lo que el marco prohíbe: permitírselo a Foundation sería abrir la puerta trasera de todas sus reglas. |
| `FND-R18` | HARD | **La estructura objetivo no se improvisa.** Toda propuesta de normalización cita la estructura declarada en `11-Conventions.md` §Folder Structure. Si esa sección no existe o no la cubre, se define **primero** —es parte del paquete de Foundation— y solo después se propone mover nada. Sin destino declarado, «ordenar» es preferencia personal. |
| `FND-R08` | CHECK | La verificación de existencia de Foundation comprueba **los archivos del núcleo**, no la carpeta. Un `docs/enterprise-documentation/` que existe pero no contiene `02-PRD.md`, `03-TRD.md`, `06-Backend-Architecture.md` y `11-Conventions.md` cuenta como **ausente**. (Deroga el falso positivo de v3 que dejaba pasar los proyectos nacidos de FIDE.) |

---

# Parte 3 — FDGE: Desarrollo Gobernado por Evidencia

## 3.1 Intake y admisión (PHASE 1 · Compuerta G1)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R01` | HARD | **Todo trabajo entra por un Intake.** Ningún PT avanza a PHASE 2 sin `changes/PT-XXX-slug/intake.md` firmado. Aplica a los **cinco** tipos (`BUG` · `FEATURE` · `REFACTOR` · `INVESTIGATION` · `CHORE`) y a los tres tracks, incluidos `EXPRESS` y `HOTFIX`. |
| `FDGE-R02` | HARD | **El humano declara la intención; el agente la expande.** Los campos de intención del Intake los escribe el humano. El agente puede redactar un borrador, pero no puede firmarlo ni darlo por bueno. Ver `INTAKE-R01`..`INTAKE-R06`. |
| `FDGE-R03` | HARD | **Definition of Ready (G1).** Un PT pasa a `READY` solo si su Intake cumple la checklist de `Intake-Protocol.md` §DoR. Si falla, el PT permanece `DRAFT` y el agente reporta exactamente qué campo falta. **Detenerse aquí es el gate más barato del ciclo.** |
| `FDGE-R04` | HARD | **Severidad y complejidad son ejes distintos.** La severidad (`S1`..`S4`) la declara el humano en el Intake. La complejidad (`TRIVIAL`/`STANDARD`/`MAJOR`) la propone el agente en PHASE 2 y la confirma el humano. Ninguna deriva de la otra (`LEX-R19`). |
| `FDGE-R05` | HARD | **Request Waste.** Iniciar análisis, diseño o implementación sobre una solicitud sin Intake admitido está prohibido. Un request sin comportamiento esperado, sin criterios de aceptación y sin out-of-scope no es una especificación: es ruido con intención, y construirlo es el desperdicio más caro del ciclo. |

## 3.2 Análisis (PHASE 2)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R06` | HARD | **Discovery Before Design.** La señal inicial nunca es la especificación. Se expande hasta ser un problema definido antes de diseñar nada. |
| `FDGE-R07` | HARD | **Architecture Before Solution.** Ninguna solución se diseña sin haber consultado `11-Conventions.md`, la arquitectura y el grafo de dependencias. Modificar código sin ese paso es *Architecture Blindness*. |
| `FDGE-R08` | SOFT | **Fallback de grafo.** Si `graphify-out/` no existe o está `STALE`, el agente lo declara en `context.md`, baja su Architecture Confidence y lo registra como riesgo. No puede afirmar que consultó un grafo inexistente. **Declarar la ausencia no sustituye al grafo**: ver `FDGE-R43`. |
| `FDGE-R43` | CHECK | **Frescura del grafo.** El grafo es `STALE` si desde su generación se integró algún PT que creó, movió, renombró o eliminó archivos (`REGISTRY.graph.pt_at_generation` vs los PTs `INTEGRATED` con `structural: true`), o si han pasado más de 30 días con actividad. Efectos: un PT `MAJOR` **no puede resolver G2** con el grafo `STALE` o ausente; un `STANDARD` avisa; `TRIVIAL`/`CHORE` no se ven afectados. Corrige el agujero de la 4.0.x, donde `FDGE-R07` era HARD y se satisfacía declarando que no se podía cumplir — una regla dura que se cumple diciendo que no se cumple no es una regla. |
| `FDGE-R44` | HARD | **Marcado estructural.** Todo PT declara en su entrada de `HISTORY.log` la línea `Estructural: sí \| no`. `sí` cuando creó, movió, renombró o eliminó archivos, o cambió un límite de módulo. Es lo que hace computable `FDGE-R43`. |
| `FDGE-R09` | HARD | **Investigation Gate.** Si la causa raíz, el impacto arquitectónico o las dependencias son desconocidas, o si cualquier confianza declarada está por debajo del 70 %, el trabajo se reclasifica a `INVESTIGATION` de inmediato. Planificar implementación queda prohibido hasta que la investigación eleve la confianza. |
| `FDGE-R10` | HARD | Una `INVESTIGATION` **no produce código**. Cierra con hallazgos documentados y puede originar un PT nuevo de otro tipo. Por eso queda **exenta** de `FDGE-R15` (trazabilidad `AC→test`) y de `FDGE-R23` (manifiesto): su evidencia es la conclusión documentada en `discovery.md`, con las fuentes consultadas y su fecha. Lo que sí exige es `FDGE-R42`. |
| `FDGE-R52` | HARD | **El reanclaje se escribe, no se relee.** Cada transición de fase deja tres líneas en la **tarea** —comentario del issue si hay plataforma, `bitacora.md` del PT si no—: qué se cierra · dónde se está · qué sigue. Escribir obliga a releer; releer no obliga a nada, y por eso una regla que dice «relee» no se puede exigir ni comprobar. La nota queda con fecha, es observable, y la siguiente sesión la encuentra sin preguntar. Append-only: una bitácora que se reescribe deja de ser un rastro. |
| `FDGE-R53` | HARD | **Toda tarea declara cómo termina.** Una línea, observable, en el intake: la condición que hace que la tarea esté hecha. **La deriva ocurre en tareas sin forma**: una tarea que declara su final lo tiene; una que no, se estira hasta que nadie recuerda dónde empezó. Si la condición necesita un «y además», son dos tareas — y partirlas ahí es más barato que descubrirlo en `G3`. |
| `FDGE-R48` | HARD | **Una sola implementación abierta.** Como mucho un `EP-NNN` en `IN_PROGRESS` a la vez. Con dos abiertas, «esto es lo mismo» deja de tener respuesta y el default de `FDGE-R49` no significa nada. Cerrar una es un acto explícito; abrir otra antes de cerrar es un error, no una preferencia. |
| `FDGE-R49` | HARD | **Mientras haya una implementación abierta, todo le pertenece.** El default se invierte: lo raro es abrir y cerrar, no continuar. Todo PT vivo declara el `epic` de la implementación abierta; la única excepción es `track: HOTFIX`, porque producción caída no espera a que se cierre nada. Trabajar fuera de la abierta exige cerrarla o abrir otra — y ambas cosas se dicen, no se deducen. Sin este default hay que declarar cada vez que algo es nuevo, y **eso es exactamente lo que se olvida a mitad de sesión**. |
| `FDGE-R50` | HARD | **Nueva o parte de: el criterio está escrito.** Es **parte de la abierta** si toca los productos que su objetivo declara, si sirve a su criterio de éxito, o si corrige algo que ella misma introdujo. Es **nueva** si entrega valor que la abierta no prometió, o si el criterio de éxito de la abierta se cumple igual sin ella. El agente aplica el criterio y **propone**; el humano confirma o corrige. Dejarlo al juicio del momento hace que dos sesiones respondan distinto sobre el mismo trabajo. |
| `FDGE-R51` | HARD | **El intake pesado pertenece a la implementación, no a cada cambio dentro de ella.** Un PT que declara `epic` de una implementación firmada lleva solo **qué se quiere** y sus criterios de aceptación: la firma, el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`). Que en medio de una construcción haga falta arreglar algo no es una decisión que firmar — es la construcción. Cobrar el ritual completo por cada arreglo tiene una sola salida practicable: saltárselo, y perder el rastro. |
| `FDGE-R42` | CHECK | **Criterio de cierre de una `INVESTIGATION`.** `discovery.md` contiene una sección `## Conclusión` con: qué se determinó, qué evidencia lo sustenta, qué quedó sin determinar, y el PT de seguimiento propuesto (o «ninguno», justificado). Sin esa sección, la investigación no cierra. |

## 3.3 Estrategia y propuesta (PHASE 3–4 · Compuerta G2)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R11` | HARD | La estrategia declara: objetivo, solución propuesta, **al menos una alternativa evaluada**, alternativas rechazadas con su motivo, dependencias, riesgos, restricciones citando `11-Conventions.md`, y criterios de éxito derivados de los `AC-nn` del Intake. |
| `FDGE-R12` | HARD | **Análisis de regresión obligatorio** en PHASE 3 para `STANDARD` y `MAJOR`: qué puede romperse, workflows, servicios, APIs, flujos de UI y riesgos de integridad de datos afectados. |
| `FDGE-R13` | HARD | **Proposal Gate (G2).** No se crea rama, no se modifica una sola línea de código fuente y no comienza la implementación hasta que la compuerta G2 se resuelve conforme a `EXECUTION-MODES.md`. Antes de G2: **0 líneas modificadas, 0 ramas abiertas.** |
| `FDGE-R14` | HARD | El Proposal Package es la **fuente de verdad** durante toda la implementación. Si algo no está en él, no estaba planificado. Aparecer después exige actualizar el paquete y registrar el delta. |
| `FDGE-R15` | CHECK | **Matriz de trazabilidad.** `traceability.md` enlaza cada `AC-nn` con al menos un `TS-nn`, cada `TS-nn` con al menos un archivo de test, y cada `AC-nn` con al menos una entrada de evidencia. Un `AC` huérfano bloquea G3. **Momento de aplicación:** las columnas `AC` y `TS` se exigen desde PHASE 4; `Test` y `Evidencia`, solo desde PHASE 6 —antes están legítimamente vacías—. **Excepción de test:** un `AC` puede llevar `Test: —` si el PT invocó `FDGE-R18` y lo declaró en `strategy.md`; la columna `Evidencia` sigue siendo obligatoria. Sin estas dos precisiones la regla contradecía a `FDGE-R18` y marcaba huérfano todo trabajo en curso. |
| `FDGE-R16` | HARD | Toda tarea de `tasks.md` tiene objetivo único, input definido, output definido y método de validación. Una tarea con dos objetivos no está atomizada. |

## 3.4 Implementación (PHASE 5)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R17` | HARD | **Tests first.** Los tests derivados de `test-scenarios.md` existen y **fallan** antes de escribir la primera línea de implementación. Si no puedes escribir el test, no entendiste el requisito. **En track `HOTFIX`**, donde PHASE 4 está diferida y `test-scenarios.md` aún no existe, la obligación se mantiene en su forma mínima: escribir primero **un test que reproduzca el fallo, en rojo**, antes de tocar el código. La batería completa llega con la PHASE 4 retroactiva. Sin esta precisión, `FDGE-R22` obligaba a violar una regla HARD por construcción. |
| `FDGE-R18` | SOFT | **Excepción de tests para cambios sin lógica.** Un PT de tipo `CHORE` o de complejidad `TRIVIAL` cuyo diff no toca lógica ejecutable (texto, estilo, documentación, configuración declarativa) puede omitir tests nuevos. La omisión se declara en `strategy.md` con el motivo y la verificación alternativa. Deroga la contradicción v3 entre «No Tests After Code» y el atajo TRIVIAL. |
| `FDGE-R19` | HARD | **Commits atómicos.** Un commit = un cambio lógico. Formato obligatorio: `<type>: PT-XXX <descripción específica>` con `type` ∈ `feat`·`fix`·`refactor`·`test`·`docs`·`chore`. Prohibidos: `WIP`, `fix`, `changes`, `update`, `final`, y todo commit que mezcle cambios lógicos. |
| `FDGE-R20` | HARD | **Scope lock.** Está prohibido tocar archivos fuera de lo declarado en `tasks.md`, y prohibido implementar cualquier ítem de `out-of-scope.md`. |
| `FDGE-R21` | HARD | **Alerta de desvío.** Si durante la implementación el trabajo resulta más complejo de lo planificado: detención inmediata y reporte con evidencia. Un desvío dentro del scope declarado continúa con ACK. Un desvío que eleva la complejidad de `TRIVIAL` a `STANDARD`/`MAJOR` obliga a reiniciar desde PHASE 2. |
| `FDGE-R22` | HARD | **Carril HOTFIX.** Solo para `severity: S1`. Permite recorrer PHASE 1 → 5 → 6 → 9 con G1 y G4 vivas y G2/G3 diferidas. Obliga a: rama `hotfix/PT-XXX-slug`, un `INC-NNN` abierto, y **completar PHASE 2, 3, 4, 7 y 8 de forma retroactiva dentro de las 48 h siguientes**. Un hotfix sin documentación retroactiva completada bloquea todo PT nuevo. Existe precisamente para que nadie tenga que saltarse el framework en silencio. |

## 3.5 Evidencia y validación (PHASE 6–7 · Compuerta G3)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R23` | CHECK | **Manifiesto de evidencia.** `evidence/PT-XXX/manifest.json` existe y mapea cada `AC-nn` a al menos un artefacto de evidencia real presente en disco. Sin manifiesto válido no hay PHASE 7. |
| `FDGE-R24` | HARD | La evidencia es **proporcional al tipo de cambio**, no un formato fijo. Backend: salida completa de tests, cobertura, logs. API: request y response reales. UI: capturas antes/después y flujo navegado. Datos: consulta ejecutada y su resultado. Exigir capturas de pantalla a un PT de backend es ceremonia, no evidencia. |
| `FDGE-R45` | CHECK | **Higiene de la evidencia.** La evidencia se guarda en el repositorio y `HISTORY.log` es append-only: un secreto que entra ahí **no se puede retirar**. Antes de escribir en `evidence/PT-XXX/`, el agente redacta credenciales, tokens, claves privadas, cookies de sesión y datos personales identificables, sustituyéndolos por «REDACTADO» y anotando qué redactó. `FDGE-R24` ordena capturar request/response y logs reales: sin esta regla, el marco **causa activamente** la filtración que dice prevenir. `verify-fdge` rechaza patrones de secreto conocidos en la evidencia. |
| `FDGE-R25` | HARD | El Self-Review **no es un control**: es una preparación. No sustituye a la revisión humana ni a `verify-fdge`. Un checklist que el propio agente rellena sobre sí mismo no puede ser la única barrera. |
| `FDGE-R26` | HARD | **No Bug Auto-Close.** Un ítem de tipo `BUG` transita a `VALIDATION_PENDING` y ahí se detiene. Solo un humano lo lleva a `DONE`, y al hacerlo **registra quién y cuándo** en la línea `Compuertas:` de `HISTORY.log` (`G3 YYYY-MM-DD [nombre]`). Un `BUG` en `DONE` sin esa firma es indistinguible de un auto-cierre. Aplica igualmente a los `BUG` promovidos desde `QD-nnn` y desde `H-nnn` (`LEX-R08`). |
| `FDGE-R27` | HARD | **Condiciones de `DONE` por tipo.** `FEATURE`: todos los tests pasan, manifiesto válido y **todos** los `AC-nn` verificados con evidencia. `REFACTOR`: comportamiento observable preservado por tests y barra de calidad de `scope.md` alcanzada. `CHORE`: la verificación declarada en `strategy.md` pasa y la suite sigue en verde. `INVESTIGATION`: `FDGE-R42` cumplida, y pasa directamente a `CLOSED` sin `INTEGRATED` —no produce código que integrar—. `BUG`: ver `FDGE-R26`. |
| `FDGE-R28` | SOFT | **Cierre asistido por QA.** Si el PT se originó en un `QD-nnn`, la validación humana puede apoyarse en `delta QA PT-XXX` con resultado `PASS` del caso de origen. La ejecución QA es evidencia; la decisión de cerrar sigue siendo humana. Cierra el loop QA↔FDGE que en v3 quedaba sin procedimiento. |

## 3.6 Persistencia (PHASE 8)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R29` | CHECK | `HISTORY.log` recibe exactamente una entrada por PT, en el formato canónico de `FDGE-Implementation.md`. Append-only (`SUITE-R09`). |
| `FDGE-R30` | HARD | `HANDOFF.md` se sobrescribe **en modo merge**: antes de escribir, se lee el existente y se preservan todas las validaciones pendientes e investigaciones activas ajenas al PT que se cierra. |
| `FDGE-R31` | CHECK | El índice de origen (`DISCOVERY.md`, `ENRICHMENT.md` o `REFACTOR_SCOPE.md`) actualiza el estado del PT al valor canónico correspondiente. Un PT cerrado que sigue figurando como pendiente hace que FPGE lo re-proponga indefinidamente. |
| `FDGE-R47` | SOFT | **Envejecimiento del trabajo parado.** Un PT en `DRAFT` o `BLOCKED` durante más de 30 días se reporta en `status FDGE` como estancado, con su antigüedad y el motivo declarado. A los 60 días se propone explícitamente `DEFERRED` o `REJECTED`. Los defectos QA ya envejecían (`QA-R18`); el trabajo de desarrollo no, y un `BLOCKED` sin caducidad es indistinguible de un abandono. |
| `FDGE-R32` | HARD | Si el PT es `Estructural: sí` (`FDGE-R44`), el agente **solicita explícitamente** la regeneración del grafo antes de cerrar PHASE 8, y la anota como pendiente en `HANDOFF.md`. La regeneración la dispara el humano (`/graphify` sobre `src/`, nunca sobre la raíz); el agente actualiza entonces `REGISTRY.graph`. |

## 3.7 Integración y rollback (PHASE 9–10 · Compuerta G4)

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R33` | HARD | **Integration Gate (G4).** El merge a la línea principal es **siempre** una decisión humana, en todos los modos de ejecución, sin excepción (`SUITE-R06a`). |
| `FDGE-R34` | CHECK | Precondiciones de G4, todas verificables: CI en verde · `verify-fdge` sin errores · entrada en `HISTORY.log` · `manifest.json` válido · `self-review.md` presente · `traceability.md` sin `AC` huérfanos · **estado del PT en `DONE`** · si es `BUG`, además la firma humana de G3 registrada (`FDGE-R26`). `CLOSED` **no** es un estado válido en G4: es posterior a `INTEGRATED` (`LEXICON` §5.1). Exigirlo antes del merge creaba un bloqueo circular que impedía integrar cualquier bug — defecto detectado y corregido dentro de la propia 4.0.0. |
| `FDGE-R35` | HARD | Tras el merge: el PT pasa a `INTEGRATED`, la rama se borra, `changes/PT-XXX-slug/` se marca `CLOSED` en su `intake.md` y el directorio se conserva (**nunca se borra**: es el registro de la propuesta). |
| `FDGE-R36` | HARD | **Rollback.** Revertir un PT integrado abre un `INC-NNN` en `INCIDENTS.log`, lleva el PT a `REVERTED` y **añade** una entrada nueva a `HISTORY.log` referenciando la original. La entrada original nunca se edita (`SUITE-R09`). |
| `FDGE-R37` | HARD | Todo `INC-NNN` genera, al cerrarse, un PT de tipo `INVESTIGATION` o `BUG` con la causa raíz. Un incidente sin trabajo de seguimiento queda abierto. |

## 3.8 Lotes

| ID | Sev | Regla |
|:---|:---:|:---|
| `FDGE-R38` | HARD | Un `EP-NNN` agrupa PTs; **no los sustituye**. Cada PT del lote conserva su ciclo completo, su directorio y su entrada en `HISTORY.log`. |
| `FDGE-R39` | HARD | **Aislamiento de estado.** Todo archivo de trabajo de un PT vive bajo `changes/PT-XXX-slug/` (`LEX-R13`). Ninguna ruta global es sobrescribible por un PT. Sin esta regla, dos PTs en vuelo se destruyen mutuamente y ningún lote es posible. |
| `FDGE-R40` | HARD | Antes de ejecutar un lote, el agente calcula el **solapamiento de scope** entre sus PTs a partir de `tasks.md`. Los PTs que comparten archivos se serializan. El resultado se declara en `BACKLOG.md`. |
| `FDGE-R46` | SOFT | **Métricas del propio proceso.** `status FDGE` reporta, calculadas desde `HISTORY.log`: tasa de rechazo por compuerta · proporción de PTs con delta distinto de «según plan» · nº de PTs revertidos · hotfixes y su deuda documental · antigüedad del trabajo parado. La suite mide el producto (Health de PTSA, Score de QA) y hasta 4.3.1 no se medía a sí misma: sin esas cifras no se sabe si el framework ayuda o solo cuesta. |
| `FDGE-R41` | HARD | Un lote se detiene completo ante el primer `BLOCKED` o el primer fallo de compuerta no resuelto. **El `EP-NNN` pasa a `BLOCKED`**, con el PT causante y el motivo declarados en `BACKLOG.md`; los PTs ya `INTEGRATED` del lote conservan su estado. No continúa «con los que sí pudieron»: los PTs de un lote suelen compartir supuestos, y seguir sobre un supuesto falso multiplica el rework. El humano puede retirar el PT causante y ordenar reanudar. |

---

# Parte 4 — Intake (capa de admisión)

| ID | Sev | Regla |
|:---|:---:|:---|
| `INTAKE-R01` | HARD | **El comportamiento esperado de un bug lo declara el humano.** Es un hecho de negocio, no una propiedad derivable del código. Un agente que lo deduce del código deduce el comportamiento con el defecto dentro. |
| `INTAKE-R02` | HARD | **Los criterios de aceptación de un feature los declara el humano.** El agente los formaliza, los numera como `AC-nn`, los hace medibles y deriva de ellos los `TS-nn`. No los inventa. |
| `INTAKE-R03` | HARD | **El out-of-scope lo declara el humano.** Es la única defensa contra el alcance que crece solo. |
| `INTAKE-R04` | HARD | **La severidad la declara el humano** (`FDGE-R04`). |
| `INTAKE-R05` | HARD | Un criterio de aceptación debe poder responderse con ✓/✗ observando el sistema. «Funciona correctamente» no es un criterio. «`POST /items` responde 201 con el ID creado cuando el payload es válido» sí lo es. |
| `INTAKE-R06` | HARD | **Firma.** El Intake lleva un bloque `## Firma` con nombre, fecha y la declaración explícita de que el contenido refleja la intención. El agente **no puede** escribir ese bloque. |
| `INTAKE-R07` | SOFT | El agente puede y debe **desafiar** el Intake: señalar criterios ambiguos, contradicciones con el PRD, out-of-scope que en realidad es indispensable, o severidad que no se corresponde con el impacto descrito. Lo registra en `intake.md` §Observaciones del agente. Aceptar un Intake malo en silencio es una violación de `SUITE-R01`. |
| `INTAKE-R09` | CHECK | **El lote tiene su propia plantilla.** `changes/EP-NNN-slug/intake.md` se crea desde `INTAKE/templates/EPIC-INTAKE.md` y declara: objetivo común · PTs que lo componen · orden y su motivo · dependencias · solapamiento de archivos · criterio de éxito del lote · firma única. Sin plantilla, `INTAKE-R08` exigía un archivo cuyo contenido nadie definía. |
| `INTAKE-R08` | HARD | Un `EP-NNN` admite firma por lote: un solo bloque de firma en `changes/EP-NNN-slug/intake.md` que cubre los Intakes de todos sus PTs, siempre que cada Intake individual esté completo. **Cada `intake.md` de PT debe entonces llevar en su bloque `## Firma` la línea `Firmado por lote: EP-NNN`** — sin ella el PT es indistinguible de uno sin firmar y `verify-fdge` lo rechaza. |

---

# Parte 5 — FQAGE (QA)

| ID | Sev | Regla |
|:---|:---:|:---|
| `QA-R01` | HARD | **User-First Execution.** El agente QA opera exclusivamente desde el navegador contra la URL desplegada. No lee código fuente, no inspecciona endpoints, no consulta la base de datos. Lo que no es verificable desde el navegador está fuera del alcance de QA. |
| `QA-R02` | HARD | **Proposal Before Execution.** No se ejecuta ningún caso sin ACK humano al `QA-PLAN.md`, ni ningún spec sin ACK humano a los specs generados. Un caso no autorizado es un caso prohibido. |
| `QA-R03` | HARD | **Evidence Is Screenshot.** Todo paso relevante produce captura. Sin captura, el paso no fue ejecutado. |
| `QA-R04` | HARD | **Explicit Pass/Fail.** Solo `PASS` o `FAIL`. No existe «parcialmente correcto». La ambigüedad es `FAIL` hasta que se demuestre lo contrario. |
| `QA-R05` | HARD | **Defect Isolation.** QA no corrige. Documenta, crea un `QD-NNN`, se detiene y reporta. |
| `QA-R06` | HARD | Todo caso `FAIL` genera un `QD-NNN`. Sin `QD`, el fallo no existe como hallazgo e invalida el reporte. |
| `QA-R07` | HARD | Todo `QD-NNN` lleva captura del paso fallido. Sin captura, el `QD` es inválido. |
| `QA-R08` | HARD | **Regression by Default.** Los casos `REG` se ejecutan siempre primero. Un `REG` que falla es prioridad máxima con independencia de su causa. |
| `QA-R09` | HARD | **Score crítico.** Si cualquier caso `HP` resulta `FAIL`, la clasificación es `QA-F` con independencia del porcentaje global. |
| `QA-R10` | HARD | QA no arranca sin `QA_BASE_URL` definida y alcanzable, ni contra un entorno de producción sin aislamiento declarado. |
| `QA-R11` | HARD | El agente no cierra ni promueve un `QD-NNN` sin decisión humana. |
| `QA-R12` | HARD | Durante la ejecución, el agente no modifica código, no reinicia servicios y no altera el estado del sistema. Si la URL no responde: detención inmediata y reporte de bloqueo. |
| `QA-R13` | HARD | El número de ciclo `QR-NNN` se obtiene de `REGISTRY.json` (`SUITE-R08`). Derivarlo de la longitud de `qa-score-history.json` está prohibido: los ciclos delta también se appendean y desalinean el contador. |
| `QA-R14` | SOFT | **Aislamiento de datos.** Ningún caso QA depende del estado dejado por otro. Si un caso requiere un usuario preexistente, ese usuario se provisiona en el setup del caso. |
| `QA-R15` | SOFT | **Selectores.** Preferencia estricta: `data-testid` → rol ARIA → label → texto visible → CSS como último recurso documentado. Nunca clases de estilo. |
| `QA-R16` | HARD | **Sin esperas fijas.** `waitForTimeout` está prohibido. Se espera una condición observable. |
| `QA-R17` | SOFT | **Freshness.** El QA Health Score es `STALE` si se integraron más de 3 PTs o pasaron más de 30 días desde el último ciclo completo. Un score `STALE` se reporta con alerta. |
| `QA-R18` | SOFT | **Escalado de defectos.** Un `QD` sin acción durante 2 ciclos completos sube un nivel de severidad; a los 3 ciclos se reporta como deuda crítica acumulada. El escalado se anota en el historial del `QD` y solo se revierte por decisión humana explícita. |
| `QA-R19` | HARD | Todo `QA-NNN` generado a partir de un PT **cita el `AC-nn` de origen**. Un caso QA sin trazabilidad al criterio que verifica es una exploración, no un caso certificable. Cierra el hueco de trazabilidad v3. |

---

# Parte 6 — PTSA (reglas citadas, no redefinidas)

> `SUITE-R14` · Los `PTSA-Rnn` se definen **únicamente** en
> [PTSA/PTSA-V3-Especificacion-Oficial.md](PTSA/PTSA-V3-Especificacion-Oficial.md).
> Esta tabla **cita** los IDs reales de esa especificación para que el resto de la suite
> pueda referenciarlos sin abrirla.
>
> En una revisión de la propia v4.0.0 se detectó que esta sección **renumeraba** los axiomas
> como `PTSA-R01..R12`, colisionando con reglas ya existentes y distintas de la
> especificación (p. ej. `PTSA-R10` allí regula la aplicabilidad del Nivel 4 de IA). Era
> exactamente el defecto que la v4 nació para eliminar. Los axiomas reales son
> `PTSA-R14`..`PTSA-R21`.

| ID real | Axioma | Regla |
|:---|:--:|:---|
| `PTSA-R14` | A1 | **Evidencia sobre opinión.** Una afirmación sin respaldo es un hallazgo, nunca una conclusión. Prohibidas «probablemente», «debería», «parece». |
| `PTSA-R15` | A2 | **Producto sobre implementación.** La unidad de auditoría es el producto entregado, no el módulo. |
| `PTSA-R16` | A3 | **Trazabilidad inversa.** `Producto ← Transformación ← Servicio ← Regla ← Fuente de datos ← Acción de usuario`. |
| `PTSA-R17` | A4 | **Supremacía del dominio.** Si `D1 < 60`, `Health = min(Health, D1)`, declarado explícitamente. |
| `PTSA-R18` | A5 | **Auditoría autónoma.** Con acceso a shell, BD o logs, el auditor obtiene la evidencia él mismo. |
| `PTSA-R19` | A6 | **Inmutabilidad auditable.** Los hallazgos se cierran, nunca se borran; la evidencia se revisa, nunca se sobrescribe. |
| `PTSA-R20` | A7 | **Certificación continua.** Todo score caduca y se renueva por delta sync. |
| `PTSA-R21` | A8 | **Cobertura declarada.** Un score sin cobertura y frescura declaradas es nulo. |

Reglas operativas de PTSA que el resto de la suite necesita citar:

| ID real | Regla |
|:---|:---|
| `PTSA-R39` | Un producto llega a `CLOSED` solo con evidencia post-fix observada en la fuente real. Nunca por inferencia. |
| `PTSA-R44` | El auditor **no cierra** hallazgos de tipo `BUG` ni `DOMAIN`: los lleva a `VALIDATION_PENDING` y se detiene (`LEX-R08`). |
| `PTSA-R45` | `PHASE 6 — Traceability` es el hito central: `PHASE 7`..`PHASE 10` no arrancan hasta que esté `COMPLETE` para todos los productos. |
| `PTSA-R47` | `PHASE 4` debe crear `Products/P-NNN.md` por producto, o no puede cerrar. |
| `PTSA-R62` | Toda conclusión se materializa en un artefacto de `PTSA/` (`SUITE-R04`). |
| `PTSA-R70` | `PHASE 7` verifica el esquema **real** de la BD vía shell, nunca las migraciones. `PHASE 10` lee logs en vivo, nunca asume que el logging funciona. |
| `PTSA-R76` | **Universo auditable enumerado.** El universo se construye desde fuentes mecánicas —`inventory/` de Foundation, productos de `PHASE 4`, reglas de `PHASE 0`— no desde lo que el auditor encuentre. Lo que está en el código y no en el inventario es un hallazgo D4. |
| `PTSA-R77` | **Matriz de cobertura.** Universo × dimensiones en `PTSA/COVERAGE.md`. Toda celda lleva `PASS` · `FAIL` · `NO_APLICA` · `NO_EVALUADA`. No existe la celda en blanco: es indistinguible de una que nadie miró. |
| `PTSA-R78` | **`NO_EVALUADA` no es un aprobado.** No penaliza Health, pero degrada Confidence: `coverage = evaluadas / universo`. Un Health 95 sobre el 30 % del universo se publica como 95 con `coverage 0.30`. |
| `PTSA-R79` | **Parada por enumeración.** La auditoría cierra cuando la matriz está completa, no cuando el auditor deja de encontrar hallazgos. «No encontré más» describe dónde dejó de buscar. |
| `PTSA-R80` | **Verificación mecánica.** `tools/verify-ptsa.mjs` comprueba matriz, coverage, productos sin `DRAFT` y hallazgos `BUG`/`DOMAIN` sin cierre humano. Un score cuya matriz no cuadra no se certifica. |
| `PTSA-R73` | Condiciones de halt cerradas: (a) el entorno niega permisos de shell; (b) faltan credenciales irresolubles; (c) breakpoint manual explícito. Ninguna otra justifica detenerse. |

---

# Parte 7 — FPGE

| ID | Sev | Regla |
|:---|:---:|:---|
| `FPGE-R01` | HARD | **Priorización gobernada por evidencia.** Todo candidato cita su evidencia de origen: `H-NNN`, `QD-NNN`, entrada de `HISTORY.log`, recomendación de `HANDOFF.md` o tendencia de un historial de scores. Sin evidencia no es candidato: es una opinión. |
| `FPGE-R02` | HARD | **Reproducibilidad.** Dos corridas sobre el mismo estado producen el mismo orden. La priorización es una función determinista de la evidencia. |
| `FPGE-R03` | HARD | **FPGE es read-only sobre artefactos ajenos, sin excepción.** Escribe únicamente `ROADMAP.md` y `ROADMAP_HISTORY.log`. Cuando un ítem se rechaza, FPGE **emite una instrucción**, no una escritura: la ejecuta el componente dueño bajo su propio trigger (`SUITE-R10`). Deroga la contradicción v3, en la que FPGE escribía `CLOSED-WONTFIX` en hallazgos PTSA y `CLOSED-ACCEPTED` en defectos QA, violando su propio principio, `PTSA-R19` y `QA-R11`. |
| `FPGE-R04` | HARD | **Compuerta humana.** FPGE propone; el humano dispone. FPGE nunca inicia desarrollo ni convierte hallazgos en tareas por sí mismo. |
| `FPGE-R05` | HARD | **Freshness gate.** Si el score PTSA es `STALE`/`UNKNOWN`, FPGE lo declara en el encabezado del roadmap y recomienda `delta PTSA` antes de tomar decisiones irreversibles. |
| `FPGE-R06` | HARD | **Supremacía del dominio heredada.** Los ítems `D1` superan a `D2`/`D3`/`D4` en igualdad de prioridad, vía multiplicador 1.5. |
| `FPGE-R07` | HARD | **Bloqueo por QA-F.** Con una clasificación `QA-F` vigente, FPGE marca todo candidato de tipo `FEATURE` como `BLOCKED` hasta que se resuelvan los defectos críticos. |
| `FPGE-R08` | HARD | **Efecto de QA-STALE.** Un QA Health Score `STALE` aplica un factor `Confidence = 0.7` a los candidatos cuya única evidencia sea QA, y lo declara en el racional del ítem. Cierra el mecanismo que v3 enunciaba sin definir. |
| `FPGE-R09` | HARD | El `PT-NNN` de una promoción se obtiene de `REGISTRY.json` (`SUITE-R08`), no contando `HISTORY.log`. |
| `FPGE-R10` | HARD | Una promoción entrega el ítem a **FDGE PHASE 1 (Intake)**, no a PHASE 2. El racional y la evidencia de origen son el borrador del Intake; el humano sigue debiendo firmarlo (`INTAKE-R06`). Deroga la ruta v3 que entregaba directamente al análisis y saltaba la admisión. |

---


# Parte 8 — FIDE

| ID | Sev | Regla |
|:---|:---:|:---|
| `FIDE-R01` | HARD | **Soberanía anfitrión–huésped.** FIDE opera desde el anfitrión y nunca se instala en el proyecto generado. Inyecta la suite operativa y se retira. La carpeta `FIDE/` no se copia al huésped. |
| `FIDE-R02` | HARD | **Idempotencia.** Si el directorio ya contiene andamiaje o `00-Business-Case.md`, FIDE no destruye el progreso: retoma o aborta limpiamente. |
| `FIDE-R03` | HARD | **Autoridad consultiva, obediencia operativa.** Ante una elección que FIDE considera subóptima: advertir siempre; obedecer si el usuario insiste; registrar la decisión en `11-Conventions.md` como «Deuda Técnica Aceptada desde el Día Cero». |
| `FIDE-R04` | HARD | **Compatibilidad con Foundation.** FIDE genera `docs/enterprise-documentation/` con los nombres canónicos de `LEX-R10` §6.1, y copia también los documentos de Foundation a `docs/methodology/`. La numeración propia de v3 (`00-BUSINESS_CASE`, `01-PRD`, `02-ARCHITECTURE`, `03-CONVENTIONS`) rompía en silencio a FDGE, QA, PTSA y FPGE en todo proyecto nacido de FIDE. |
| `FIDE-R05` | HARD | Las features que FIDE vuelca al índice `ENRICHMENT.md` nacen en `DRAFT`, nunca en `READY`. Cada una pasa por FDGE PHASE 1 con firma humana antes de construirse (`FDGE-R01`). Un PRD redactado por un agente a partir de una consultoría es un punto de partida, no una intención declarada. |
| `FIDE-R06` | HARD | El `README.md` del paquete generado por FIDE declara explícitamente que documenta **arquitectura prevista, no observada**, y que no cumple todavía `FND-R01`. Sin esa declaración, todo consumidor asume —correctamente para Foundation, incorrectamente para FIDE— que cada afirmación está respaldada por el código. |

---

# Parte 9 — Matriz de propiedad de artefactos

`SUITE-R10` en forma tabular. **Solo el dueño escribe.**

| Artefacto | Dueño | Otros componentes |
|:---|:---|:---|
| `docs/enterprise-documentation/**` | Foundation | Todos leen |
| `docs/implementation/REGISTRY.json` | FDGE | Todos **solicitan** asignación a FDGE |
| `docs/implementation/HISTORY.log` · `HANDOFF.md` · `SESSION_LOG.md` · `BACKLOG.md` · `INCIDENTS.log` | FDGE | QA, PTSA, FPGE leen |
| `docs/implementation/DISCOVERY.md` · `ENRICHMENT.md` · `REFACTOR_SCOPE.md` | FDGE | FPGE lee |
| `changes/PT-XXX-slug/**` · `evidence/PT-XXX/**` | FDGE | QA y PTSA leen |
| `docs/implementation/ROADMAP.md` · `ROADMAP_HISTORY.log` | FPGE | Todos leen |
| `QA/**` · `qa/**` · `playwright.config.ts` | QA | FPGE y PTSA leen |
| `PTSA/**` | PTSA | FPGE y QA leen |
| `graphify-out/**` | Foundation (genera) · FDGE (consume y declara staleness) | QA y PTSA leen |
| `docs/_archive/**` | Foundation (`FND-R11`) | Solo lectura para todos |
| `docs/methodology/**` | **Humano** | Ningún agente lo modifica sin instrucción explícita (`SUITE-R06e`). Excepción: `CORE.md`, generado por `tools/build-core.mjs` (`SUITE-R16`) |

---

# Parte 10 — Criterios de fracaso (antipatrones nombrados)

Un fracaso es la violación observable de una regla. El nombre existe para poder señalarlo
en una revisión sin discutir.

| Antipatrón | Regla violada |
|:---|:---|
| **Request Waste** — construir sobre una solicitud sin admitir | `FDGE-R05` |
| **Solution First** — diseñar antes de comprender | `FDGE-R06` |
| **Architecture Blindness** — tocar código sin consultar arquitectura ni convenciones | `FDGE-R07` |
| **Phantom Criteria** — criterios de aceptación inventados por el agente y sellados sin leer | `INTAKE-R02`, `INTAKE-R06` |
| **Phase Collapse** — saltarse una fase (condensar sí, colapsar no) | `LEX-R02` |
| **Proposal Gate Skip** — abrir rama antes de G2 | `FDGE-R13` |
| **Tests After Code** — implementar antes de tener el test en rojo | `FDGE-R17` |
| **Scope Creep** — tocar lo que no está en `tasks.md` | `FDGE-R20` |
| **Evidence Missing** — implementar sin demostrar | `SUITE-R02`, `FDGE-R23` |
| **Self-Certification** — tratar el self-review como control suficiente | `FDGE-R25` |
| **Bug Premature Closure** — cerrar un bug sin validación humana | `FDGE-R26` |
| **Orphan Criterion** — un `AC` sin test ni evidencia | `FDGE-R15` |
| **Dirty Commit History** — commits big-bang o sin convención | `FDGE-R19` |
| **Dangling Branch** — trabajo terminado que nunca se integra ni se cierra | `FDGE-R33`, `FDGE-R35` |
| **Silent Bypass** — saltarse el framework por urgencia en vez de usar `HOTFIX` | `FDGE-R22` |
| **Memory Driven Development** — actuar desde recuerdos en lugar de artefactos | `SUITE-R01` |
| **Hidden Reasoning** — decisiones que solo existen en el chat | `SUITE-R04` |
| **Global State Collision** — estado de un PT en una ruta compartida sobrescribible | `FDGE-R39` |
| **Counter Drift** — derivar un ID contando entradas de un archivo | `SUITE-R08` |
| **Cross-Component Write** — escribir en el artefacto de otro componente | `SUITE-R10`, `FPGE-R03` |
| **Stale Trust** — priorizar sobre una auditoría vencida | `FPGE-R05` |
| **Invented Facts** — documentar lo no verificado en el código | `FND-R01` |
| **Documented Chaos** — generar documentación nueva encima de documentación vieja contradictoria, sin reconciliar | `FND-R09`, `FND-R12` |
| **Phantom Graph** — afirmar que se consultó el grafo, o dar por cumplida la regla declarando que no existe | `FDGE-R08`, `FDGE-R43` |
| **Context Bloat** — cargar la metodología completa en cada sesión en vez del núcleo | `SUITE-R15` |
| **Version Drift** — operar con una versión de suite distinta de la declarada, sin migrar | `SUITE-R17` |
| **Migration Amnesia** — obligar a rehacer trabajo en vuelo porque cambió la versión | `SUITE-R18` |
| **Prompt Drift** — la expansión legible y la directiva ejecutada se separan | `SUITE-R20` |
