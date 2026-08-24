# INSTALL — instalar la suite, en conversación

> Esto es lo que Claude lee cuando alguien copia `docs/methodology/` en un proyecto y escribe
> **«instala el framework»** o **`[INSTALL SUITE]`**. No hay más requisito que copiar la carpeta.

`SUITE-R28` · **La conversación es la interfaz; el artefacto es el registro.** El agente ejecuta
las herramientas, **presenta el resultado en la conversación** y pregunta ahí lo que haya que
decidir. Escribir un `.md` y decir «léelo y vuelve» desperdicia el único medio donde el humano
ya está mirando, y convierte una decisión de treinta segundos en una tarea pendiente.

Los artefactos se siguen escribiendo —`LAYOUT.md`, `REGISTRY.json`, `CLAUDE.md`— porque son el
registro auditable y sobreviven a la sesión. Pero no son por dónde se decide.

---

## Las nueve fases

Bloque canónico en `PHASES.md`: **INSTALL · `[INSTALL SUITE]` — «instala el framework»**

### `I0` · Terreno

```bash
node docs/methodology/tools/plan-layout.mjs        # sin --write: aún no se escribe nada
```

`FND-R20` · El terreno se enumera **antes** de documentar nada: documentar y auditar una
estructura que está a punto de cambiar es trabajo que hay que rehacer.

Enumera: si la raíz es un repositorio, repositorios anidados, dónde vive el código de verdad,
manifiestos, documentos sueltos, dependencias y artefactos que faltan.

**Resume en la conversación, en diez líneas o menos**: qué encontraste, qué propones mover y por
qué importa. No pegues el informe entero: el humano no necesita leerlo, necesita decidir.

### `I0-bis` · Seguridad y accesos — compuerta propia   `FND-R29` · `FND-R30`

```bash
node docs/methodology/tools/revisar-secretos.mjs . --historial
```

**Antes de que nada se publique.** Instalar implica que el repositorio va a publicarse, y
publicar es irreversible donde importa: un secreto en la historia sigue ahí después de borrarlo
del archivo. En la primera instalación real había una contraseña de base de datos en claro en el
código de la API, y nada la miraba.

Bloquea, y **propone la corrección**. Un falso positivo se firma por escrito, con nombre y
motivo — no se silencia el escáner.

Y los accesos, en la misma parada (`FND-R30`): `gh auth status` o `az account show` si el
proyecto va a declarar plataforma. Descubrir a mitad de sesión que falta un permiso es perder la
sesión.

Y la **frontera** (`SUITE-R39`). `plan-layout` enumera qué hay al lado de esta raíz. Cauce es
por proyecto —eso ya está resuelto—, pero ninguna regla escrita impide que un proceso lea la
carpeta vecina, y en la primera máquina donde se usó eso ya ocurrió. Dos niveles, con lo que
garantiza cada uno:

- **Configuración de permisos** (`.claude/settings.json`): ataja el alcance accidental. Es una
  convención — depende de que el arnés la respete.
- **Contenedor** con solo esta raíz montada: lo impone el núcleo.

Elegir es humano, y **empezar sin ninguno de los dos es una opción legítima** que se escribe.
Cauce no genera contenedores: inventar un Dockerfile para un stack que no conoce es imponer
terreno (`FND-R25`). Si el proyecto ya se contiene, el terreno lo dice, y montar solo su raíz
convierte la frontera en algo que no depende de que nadie la respete.

Las credenciales de publicación se quedan **fuera** del contenedor si lo hay: `SUITE-R06a`
mantiene el merge y la publicación en manos humanas, y meterlas dentro haría del recinto el
sitio desde donde se publica.

### `I1` · Decisión — **G0**

**El criterio ya está escrito en la herramienta, no en tu opinión del momento.** Eso es lo que
hace que dos instalaciones del mismo proyecto den el mismo resultado:

| | Criterio |
|:---|:---|
| `FND-R25` · destino | Carpeta con `package.json`, `docker-compose.yml` o `playwright.config.ts` **es una raíz de proyecto**: su contenido sube a la raíz. Sin esas marcas, va a `src/`. |
| `FND-R26` · historia git | Más de un commit **o** un remoto publicado ⇒ conservarla. Si no ⇒ `git init` en la raíz. |
| `FND-R27` · qué se versiona | `.gitignore` que ignora todo, o repositorio con cero archivos versionados ⇒ se propone uno del stack detectado. |
| `FND-R28` · alcance del grafo | Código propio. Fuera: dependencias, compilación, pruebas, fixtures y mocks. |

Tu papel no es elegir entre opciones que el agente improvisa: es **aprobar o corregir** lo que
el criterio produjo. Presenta cada propuesta **numerada, en la conversación**, y espera respuesta. Uno a uno si son
pocos; agrupados si son muchos y del mismo tipo.

Cuando el humano responda, **escribe tú `docs/implementation/LAYOUT.md`** ya resuelto: su
decisión en cada fila, su nombre en `Revisado por:` —el que figura en `firmantes:`— y la cita
textual de lo que respondió. `FND-R22` exige que la decisión sea humana, no que la teclee el
humano: lo que no se puede sustituir es **quién decide**.

`NO` inventes la decisión ni la des por supuesta. Si el humano no ha respondido, no hay firma.

### `I2` · Ejecutar lo aceptado

Solo lo que quedó `ACEPTADO`. Mover código rompe importaciones, historias de git y rutas de
despliegue: enseña el comando exacto antes de ejecutarlo y confirma.

Si hay que fusionar un repositorio anidado, ofrece las dos vías y explica qué se pierde con cada
una — conservar la historia con `git subtree`/`filter-repo` reescribe rutas; `git init` en la
raíz es simple y pierde el pasado. **Es decisión del humano**, no la tuya.

### `I2-bis` · Registrar lo ejecutado — `SUITE-R30`

`LAYOUT.md` guarda las **decisiones**. `docs/implementation/INSTALL.log` guarda los **hechos**.
Append-only, una entrada por acción:

```
## AAAA-MM-DD · [INSTALL SUITE] · <suite_version>
Ejecutado por: <el firmante que resolvió G0>
Plan: docs/implementation/LAYOUT.md (firmado AAAA-MM-DD)

I2  MOVER      [L3] <qué>  ·  <origen> → <destino>                 OK|FALLÓ
I2  SUSTITUIR  [L1] <archivo>  ·  respaldo: <ruta>                 OK|FALLÓ
I2  GIT        [L2] <operación>  ·  <commit>  ·  <n> archivos      OK|FALLÓ
I3  CREAR      <directorios y ledgers>                             OK|FALLÓ
I4  DEPS       <dependencia> <versión>  ·  <cómo se instaló>       OK|FALLÓ
I5  GRAFO      /graphify <alcance>  ·  <n> nodos                   OK|FALLÓ
```

`[L<n>]` es el número de la propuesta de `LAYOUT.md` que esa acción ejecuta. La correspondencia
se **declara**, no se deduce: `verify-fdge` exige que toda propuesta `ACEPTADA` o `MODIFICADA`
tenga su etiqueta, y que ninguna etiqueta apunte a algo que nadie aprobó.

Lo que falla también se escribe. Un registro que solo cuenta lo que salió bien no sirve para
revertir, que es para lo que existe.

### `I3` · Estructura

Crea lo que falte: `docs/enterprise-documentation/` · `docs/implementation/` · `changes/` ·
`evidence/` · `QA/` · `qa/` · `PTSA/` · `graphify-out/`.

**Cada espacio nace con un archivo dentro** (`SUITE-R32`): git no versiona directorios vacíos,
así que un `PTSA/` creado y nunca escrito desaparece en el primer clon — y `verify-ptsa` lo
reporta como «nada que auditar», que es lo mismo que diría si la auditoría no aplicara. Y los ledgers vacíos con su cabecera
(`REGISTRY.json`, `HISTORY.log`, `INCIDENTS.log`, `SESSION_LOG.md`, `MIGRATION.log`).

`CHECKPOINT.json` **no se siembra vacío**, y es deliberado: todos sus campos se derivan de
una tarea (`LEX-R26`), así que sin tarea no hay nada que derivar y un archivo con campos en
blanco sería una afirmación falsa con forma de dato. Aparece con la primera —
`tracker checkpoint PT-NNN`— y desde ahí se sobrescribe.

`EVENTOS.jsonl` y `MATRIZ.md` **tampoco se siembran**, y es la misma razón llevada al extremo:
los dos se **derivan** del ledger. Un `EVENTOS.jsonl` vacío diría «ningún evento» en una
instalación donde lo cierto es «todavía no hay ledger que clasificar», y una `MATRIZ.md` de ceros
diría que ninguna clase se repite. Aparecen cuando hay algo que leer, con `npm run eventos` y
`npm run matriz`, y desde ahí `npm run verify` comprueba que la matriz siga al día.

`SESSION.json` **tampoco**, y por la misma razón con un matiz: su único campo capturado es
`desde`, el commit donde empezó la sesión, y una sesión que no ha empezado no tiene inicio que
marcar. Aparece con `tracker sesion abrir` y desde ahí se sobrescribe — una sesión a la vez.
Sin él, lo que lleva la sesión es `SIN EVALUAR`, y eso es correcto: **el día no es la sesión**.

**Qué se versiona** (`SUITE-R37`), decidido de una vez para no volver sobre ello:

| | |
|:---|:---|
| **Sí** | evidencia · ledgers · `docs/methodology/` — auditar un commit antiguo exige saber qué reglas lo gobernaban, y sin la carpeta eso depende de que el paquete siga publicado |
| **No** | `graphify-out/` — regenerable, y su frescura vive en `REGISTRY.graph` |
| **Nunca bajo `*.log`** | los ledgers append-only de la suite. Una regla `*.log` se los traga en silencio, y sin ellos `G4` no tiene qué verificar ni `PHASE 10` a qué volver |

`REGISTRY.json` arranca con los contadores a cero y `suite_version` igual a la del `CHANGELOG`.

### `I4` · Dependencias — `SUITE-R29`

`plan-layout` ya dijo cuáles faltan. **Instálalas con permiso explícito**, una por una, diciendo
para qué sirve cada una:

| | Para qué | Instalación |
|:---|:---|:---|
| `node` | los verificadores de la suite | prerrequisito, no se instala solo |
| `git` | `G4` es un merge real, `PHASE 10` un rollback real | prerrequisito |
| `python` | graphify | prerrequisito |
| `graphifyy` | el grafo que `FDGE-R43` exige en los PT `MAJOR` | `uv tool install --upgrade graphifyy` o `pip install graphifyy` |
| `playwright` | QA ejecuta en un navegador real | `npm i -D @playwright/test && npx playwright install` — solo cuando se vaya a usar QA |

Sin `graphifyy` el grafo queda `MISSING` y eso **bloquea G2 en los PT MAJOR**. No es opcional si
el proyecto va a tener refactors grandes.

### `I5` · Grafo

Ejecuta `/graphify` con **el alcance que calculó `plan-layout`** (`FND-R28`): código propio, sin
dependencias, sin salida de compilación, sin pruebas ni fixtures. El grafo describe el sistema;
las pruebas describen cómo se comprueba, y las dependencias no son del sistema. Comprueba que
existe `graphify-out/graph.json`. Anota en `REGISTRY.graph` la fecha, el alcance y el `pt_at_generation`.

### `I6` · `CLAUDE.md` y Declaración de Valor — `FND-R24`

Copia `Suite-CLAUDE-Template.md` al `CLAUDE.md` del proyecto, después de lo que ya hubiera.
Parametriza `suite_version`, `execution_mode` y `firmantes`.

**La Declaración de Valor NO se pide aquí** (`FND-R24`). Instalar es poner el terreno en orden;
describir qué entrega el sistema exige haber leído el código, y eso es `PHASE 0` de Foundation.
Deja el marcador en su sitio y sigue.

Ahí el agente la **redacta** leyendo `README`, manifiestos, rutas, entry points y
`docs/business/`; el humano la corrige y la firma; y la primera auditoría PTSA la contrasta
contra los productos reales. Pedirla al instalar es pedirla antes de saber, y antes de saber se
responde con generalidades.

### `I6-bis` · La divergencia se mide — `SUITE-R31`

```bash
node docs/methodology/tools/comparar-marco.mjs <referencia>
```

Una copia que puede divergir es una copia que diverge. Cuando un proyecto corrige un defecto
del marco bajo su propio PT, esa corrección se queda ahí y todos los demás proyectos siguen con
el defecto — pasó, con un verde falso sobre `FND-R24`, y se descubrió por accidente.

El comparador dice **qué difiere y en qué dirección**. No sincroniza: si la corrección se hizo
en el proyecto, falta propagarla; si la referencia avanzó, falta migrar. **Nunca a ciegas en
ninguna dirección** — sobrescribir la copia del proyecto puede revertir correcciones suyas.

### `I6-ter` · Adoptar la plataforma en un proyecto con historia   `SUITE-R36`

```bash
node docs/methodology/tools/tracker.mjs abrir --aplicar
```

**Solo migra lo vivo.** Un proyecto en marcha lleva una implementación abierta y unas pocas
tareas. Lo cerrado no es estado, es evidencia: se queda en el repositorio junto al código que lo
produjo. Crear un issue por cada trabajo terminado llenaría la plataforma de cadáveres que el
espejo tendría que reconciliar para siempre.

Medido en un proyecto real: 127 asignaciones, de las que **dos** estaban vivas. Migrar dos
frente a migrar 127 no es una diferencia de esfuerzo, es la diferencia entre un tablero que se
lee y uno que no.

Y el issue **referencia** el intake: no lo copia (`SUITE-R35`).

### `I7` · Verificar

```bash
node docs/methodology/tools/build-core.mjs docs/methodology
node docs/methodology/tools/verify-suite.mjs docs/methodology
node docs/methodology/tools/verify-fdge.mjs --all
```

Presenta el resultado **en la conversación**, resumido. Si algo falla, arréglalo aquí: entregar
una instalación con errores es entregar deuda el primer día.

### `I8` · Arrancar

Encadena con `[START FOUNDATION]` sin pedir permiso para empezar —ya lo pidió al instalar— pero
**parando en las compuertas de Foundation** como en cualquier sesión.

Si el proyecto no tiene código todavía, encadena con `[START FIDE]`.

---

## Qué NO hace la instalación

- **No mueve nada sin firma.** `I1` es una compuerta real (`FND-R22`).
- **No inventa la Declaración de Valor.** La propone y la somete a corrección (`FND-R24`).
- **No instala dependencias en silencio.** Cada una con permiso y con su motivo (`SUITE-R29`).
- **No toca la rama principal.** `SUITE-R06` rige desde el minuto cero.
