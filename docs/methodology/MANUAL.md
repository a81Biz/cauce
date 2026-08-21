# MANUAL — de cero a tu primer trabajo cerrado

> **Para quién.** Alguien que acaba de llegar y quiere usar cauce, no entenderlo por dentro.
>
> Este documento se lee **de principio a fin una vez**. Después se vuelve por el índice, o mejor:
> se pregunta al tablero, que es de lo que va todo esto.
>
> El catálogo completo de casos está en [`CASOS-DE-USO.md`](CASOS-DE-USO.md). Las reglas, en
> [`RULES.md`](RULES.md) — aquí se **citan** por ID y no se repiten (`SUITE-R21`).

---

## 1 · Qué es cauce y qué no es

cauce hace dos cosas y ninguna más:

```
1 · toda decisión irreversible pasa por una persona
2 · toda afirmación tiene evidencia verificable
```

**No** es un gestor de proyectos, ni un generador de código, ni un asistente. Es el conjunto de
reglas y comprobaciones que hacen que el trabajo de un agente sea **auditable** — y, sobre todo,
que un «está hecho» se pueda contrastar.

Lo que verás todo el rato: el agente prepara, verifica y escribe evidencia; **tú resuelves las
compuertas**. Eso no es una limitación del agente, es el producto.

---

## 2 · Instalar

### En un proyecto que ya tiene código

```bash
npx @a81biz/cauce install .
```

Copia el marco y deja de hablar. **La instalación de verdad es conversacional**: abre tu agente y
dile «instala el framework». Recorrerá nueve fases —terreno, movimientos, dependencias,
documentación, Declaración de Valor— preguntándote lo que no puede decidir (`SUITE-R28`).

Si el destino ya tenía una copia y **no coincide**, se niega y te enseña qué difiere. No
sobrescribe a ciegas en ninguna dirección (`SUITE-R31`): un archivo distinto no dice por sí solo
quién tiene razón.

### Desde una idea, sin código todavía

Empieza con `[START FIDE]`. Incuba el proyecto, instala la suite y **se retira**. A partir de ahí
estás en el caso anterior.

### Desde una versión vieja de cauce

```bash
node docs/methodology/tools/migrate.mjs .        # informa. No toca nada.
```

Te dará dos listas: lo que hace solo y **lo que necesita una persona**. La segunda no es
burocracia — son las cosas que una máquina no puede saber, como qué compuerta estás esperando o
si un secreto detectado es un falso positivo.

Mientras queden pendientes, el proyecto está en **modo restringido**: solo migrar, consultar
estado y terminar lo que ya estaba en vuelo. No se abre trabajo nuevo (`SUITE-R17`).

---

## 3 · Lo que declaras una vez

En tu `CLAUDE.md`, y es lo único que se personaliza:

```yaml
suite_version: 7.4.0
execution_mode: SUPERVISED        # MANUAL | SUPERVISED | AUTONOMOUS
firmantes:
  - Tu Nombre
plataforma: github                # opcional
```

**`firmantes`** es la única defensa mecánica contra una firma inventada. No prueba que firmara una
persona —el agente escribe el archivo— pero convierte la firma en algo **contrastable**: un nombre
que no está en la lista falla, y quien aparece responde de lo que lleva su nombre (`SUITE-R27`).

**`execution_mode`** cambia **quién** resuelve las compuertas y cuándo se te pregunta. **Nunca
cambia qué se exige** (`EXEC-R08`). Y `G4` —el merge— es humana en los tres, sin excepción.

### La Declaración de Valor

Es lo único que el agente no puede redactar solo. Describirá lo que el sistema entrega; **qué lo
hace válido** lo sabe quien conoce el negocio. La firmas tú, y PTSA audita contra ella
(`FND-R24`).

---

## 4 · Un día de trabajo

### Empieza preguntando

```bash
npx @a81biz/cauce start      # en tu proyecto
npm start                    # si estás dentro del repositorio de cauce
```

> La segunda no es un capricho. Dentro de cauce, `npx` ve que el `package.json` local declara
> ese mismo nombre, da el paquete por presente y busca un binario que no existe **ni debe
> existir**: instalarlo como dependencia de sí mismo dejaría dos copias completas del marco
> (`SUITE-R41`). No es un defecto que arreglar — es lo que significa estar autoalojado.
>
> Y si un subcomando te dice que **no existe**, tu copia puede ser anterior a la que lo trae: el
> propio mensaje te da la salida (`npx @a81biz/cauce@latest …`).

Te da el estado del tablero y **después** el núcleo, en ese orden. No es cortesía: leer las
reglas sin el estado es como se saltan las fases (`SUITE-R50`).

Si en algún momento no sabes qué toca:

```bash
node docs/methodology/tools/tracker.mjs siguiente
```

La salida **es** la respuesta. Si no coincide con lo que recuerdas, el que se equivoca no es el
tablero (`SUITE-R49`).

### El recorrido de una tarea

```
PHASE 1   Intake          qué se quiere, y qué lo da por terminado    → G1  firmas tú
PHASE 2   Descubrimiento  dónde está, con archivo y línea
PHASE 3   Estrategia      los caminos descartados, con su porqué
PHASE 4   Propuesta       diseño, tareas, escenarios, alcance          → G2  apruebas tú
PHASE 5   Implementación  y la comprobación inversa en rojo
PHASE 6   Evidencia       cada criterio con su prueba, o declarado no verificado
PHASE 7   Validación                                                   → G3  validas tú
PHASE 8   Persistencia    estado retomable
PHASE 9   Integración                                                  → G4  el merge, tuyo
PHASE 10  Cierre          y ENTONCES se cierra el issue
```

Nada de esto es opcional y nada se salta. Si una fase no puede completarse, el agente **se
detiene y lo dice** — no continúa con una parte hecha.

### Qué firmas tú, y por qué

| Compuerta | Qué estás diciendo |
|:---|:---|
| `G1` | «Este trabajo merece hacerse, y así sabremos que terminó» |
| `G2` | «Este es el camino» |
| `G3` | «Esto resuelve lo que pedí» |
| `G4` | «Esto entra en lo publicable» |

`G4` no se automatiza **nunca**, en ningún modo (`EXEC-R04`). Tampoco cerrar un `BUG`, migrar
datos, tocar producción, reescribir historia ni rotar credenciales (`SUITE-R06`).

Si un trabajo lo requiere, el agente prepara todo lo demás, se detiene en el punto exacto y **te
describe el comando**. No lo ejecuta.

### Cuando aparece trabajo que no cabe

Va a `out-of-scope.md`, y la columna «Dónde va» **no admite prosa**: o `—`, o la cita de un
identificador (`SUITE-R44`). Si es para después, se convierte en una tarea real con su issue
abierto.

Aplazar algo lo **pone en el tablero**, no lo saca. Esta regla encontró cinco trabajos que este
marco había perdido escribiéndolos en párrafos.

---

## 5 · Comprobar

```bash
npm run verify                                                  # todo, como en CI
node docs/methodology/tools/verify-fdge.mjs PT-NNN              # una tarea
node docs/methodology/tools/verify-fdge.mjs --gate G4 PT-NNN    # ¿se puede mergear?
node docs/methodology/tools/verify-suite.mjs docs/methodology    # coherencia del marco
node docs/methodology/tools/tracker.mjs espejo                   # registro ↔ tablero
node docs/methodology/tools/revisar-secretos.mjs                 # árbol e historia
node docs/methodology/tools/regla.mjs SUITE-R44                   # qué exige una regla
node docs/methodology/tools/regla.mjs --fallos                    # qué puede fallar, derivado
```

Y tres verificaciones que no son comandos sino sesiones:

- **`[START QA]`** — un navegador real comprobando que el usuario puede usar el sistema.
- **`[START PTSA]`** — auditoría contra tu Declaración de Valor.
- **`[START FPGE]`** — qué construir a continuación, con evidencia.

### Lo que significa un `SIN EVALUAR`

No es un aprobado ni un suspenso: es **«no lo puedo saber»**, dicho en voz alta. Aparece cuando
falta el acceso, la plataforma o un dato. Es deliberado: un verificador que convierte «no sé» en
«está bien» es peor que no tenerlo (`RULE-06`).

---

## 6 · Integrar y publicar

El orden importa y no es una convención:

```
0 · tracker sellar                 ← si toca cerrar version
1 · el estado terminal se apunta en la rama de trabajo
2 · el merge  ← G4, tuyo
3 · tracker cerrar --aplicar
4 · tracker proyectar --publicar   ← el rastro sobrevive a la rama
```

### El paso 0 · sellar una versión

Cerrar una versión **es un acto**, no una consecuencia. `tracker sellar` enumera sus ocho pasos y
te dice cuáles faltan. Dos merecen que los leas antes de necesitarlos:

**La batería va completa.** Ni filtrada ni por secciones. Sellar es el único momento en que se
exige entera, y por eso vale.

**Y los documentos que lee quien llega se resuelven, uno a uno.** `MANUAL`, `CASOS-DE-USO`, los
dos `README`, `Suite-CLAUDE-Template` y el grafo: cada uno queda `ACTUALIZADO` o `NO PROCEDE`
**con motivo**, en `docs/implementation/SELLO.md`. Una celda vacía no pasa — es indistinguible de
una que nadie miró, exactamente como en `LAYOUT.md`.

No se te pide que los cambies: se te pide que **decidas**. Exigir que cambien produciría retoques
cosméticos para acallar la comprobación, y un manual que cambia tampoco prueba que se revisara lo
que hacía falta.

**Por qué existe esto.** Sin nada que lo obligara, una versión se declaró y no se publicó, la rama
principal acumuló **53 commits** de retraso y ocho issues no pudieron cerrarse. Y en una versión
`MAJOR` con dos reglas nuevas, **ninguno de los dos `README` se tocó**. `SUITE-R57` no prohíbe la
deuda: la hace imposible de ignorar bloqueando `G2` cuando pasa de `N`.

Al revés, la rama principal queda declarando trabajo vivo con el issue ya cerrado y su compuerta
falla **después de cada merge** (`SUITE-R46`). La herramienta se niega si te adelantas.

**El paso 4 no es opcional** (`SUITE-R56`). Al fusionar se borra la rama de la tarea —así debe
ser (`FDGE-R19`)—, y con ella moriría cualquier enlace que apuntase ahí. Dos cosas lo impiden: el
enlace del issue apunta a un **ref durable** —la rama de integración, o el commit—, y la
proyección `cauce/<usuario>` guarda **el SHA de cada tarea**, que es lo que permite reconstruir
dónde estaba cada cosa cuando las ramas ya no existen.

No es una precaución teórica: el día que se midió, **14 de los 16 enlaces del tablero daban
404**, y uno apuntaba a la rama de otra tarea. La proyección estaba diseñada desde `PT-054` y
tenía `--publicar` — nunca se había ejecutado, porque nada la exigía.

### Si el issue dice «sin enlace», no está roto: es que aún no había dónde apuntar

Cuando abres el issue en `PHASE 1`, tu `intake.md` **acaba de escribirse y no está en ningún
commit todavía**. No hay ref durable, así que el cuerpo publica la ruta en texto plano y lo dice —
inventar una URL que da 404 sería peor (`RULE-06`).

El enlace aparece en cuanto el trabajo entra en un commit y algo republica el cuerpo. Dos formas:

```bash
node docs/methodology/tools/tracker.mjs abrir --aplicar    # republica los cuerpos
node docs/methodology/tools/tracker.mjs espejo             # te dice si falta alguno
```

**Y si prefieres que nazca bien, commitea el intake antes de abrir el issue.** Las dos secuencias
son válidas; ésta se ahorra el paso.

Lo que **no** puede pasar es que nadie se entere: desde `SUITE-R51`, un cuerpo que publica su ruta
sin enlace teniendo ya un ref durable es una **divergencia**, y `tracker espejo` la reporta —
bloqueando en la rama de trabajo, que es donde se decide (`SUITE-R47`).

Se escribió porque pasó: **10 de 115 cuerpos** del tablero de `cauce` estaban así, y eran
exactamente los issues abiertos después del arreglo que dejó los enlaces muertos a cero. Se arregló
el enlace **muerto**; el **ausente** no era el mismo caso, y ninguna comprobación lo miraba.

Publicar el paquete es aparte, es manual y es tuyo.

---

## 7 · Cuando algo falla

| Síntoma | Qué significa |
|:---|:---|
| `verify-fdge` pide un artefacto de una fase futura | No pasa: se exige **desde** la fase que lo produce |
| «modo restringido» | Hay una migración a medias. Termínala antes de abrir trabajo |
| El espejo dice que un issue está huérfano | Se está trabajando en algo que el registro no conoce |
| El espejo dice «cierre pendiente» | Normal entre el merge y el cierre. No bloquea |
| `SIN EVALUAR` en el tablero | Sin plataforma o sin credencial. No es «no hay nada» |
| Una compuerta bloquea y crees que no debería | Léelo entero antes de forzar: cuatro veces en la historia de este marco la compuerta tenía razón y quien la leyó, no |

### Lo que tropieza a quien llega, medido instalando de verdad

`PT-072` instaló el marco en un proyecto nuevo y anotó cada fricción. **Éstas son las que costaron
tiempo**, y todas siguen ahí salvo las dos que se arreglaron:

| Te vas a encontrar | Qué hacer |
|:---|:---|
| `git add -A` se lleva `node_modules` | La instalación **no deja `.gitignore`**. Escríbelo antes del primer commit |
| `FND-R23` dice que `LAYOUT.md` «no está firmado» | Busca la línea **«refleja la estructura que quiero: SÍ»** y edítala **en su sitio**. Añadir una firma al final deja dos veredictos y falla por otro motivo |
| `SUITE-R30` rechaza tu `INSTALL.log` | El formato es `I<n> ACCIÓN … OK`, con **dos espacios** antes de `OK` y `I` de un solo dígito |
| `tracker asignar` y luego `avanzar` dice «PHASE NaN» | La allocation nace sin `phase`. Decláralo en el registro |
| `INTAKE-R06` dice que la firma está «sin rellenar» | Un intake suelto espera **`Reportado por:`**, no «Firmado por:». Y **copia la plantilla**: escribirlo a mano cuesta cuatro comprobaciones |

**Y dos que ya no verás**, porque las encontró esa misma prueba y se arreglaron en el lote:

- La plantilla del paquete fallaba `FDGE-R04` por su propio comentario en línea (`PT-083`).
- Sin declarar plataforma no se podía avanzar **ni una fase** (`PT-084`). Ahora la nota va a
  `TRANSICIONES.log` y el trabajo sigue.

### Y no tienes que deducir nada

Todo mensaje de fallo lleva su regla. **Pregúntale a la regla**:

```bash
npx @a81biz/cauce regla SUITE-R44      # qué exige, dónde vive, quién la comprueba
npx @a81biz/cauce regla --fallos       # TODO lo que puede fallar, derivado del código
```

La lista de `--fallos` **no está escrita en ningún sitio**: sale de los `fail()` y `warn()` de las
herramientas. Si alguien añade una comprobación, aparece sola — y si esta tabla se queda corta,
esa lista no.

Hoy son **90 reglas** las que pueden fallar con su nombre. Las demás se comprueban sin citarlo, y
`regla --sin-comprobar` te dice cuáles: no es que no se cumplan, es que si fallan no lo dirán con
su ID.

---

## 8 · Las diez ideas que explican el resto

1. **El registro asigna, la plataforma espeja.** Dos fuentes de identificadores divergen siempre.
2. **Lo cerrado es evidencia, no estado.**
3. **Un fallo tiene que distinguirse de un éxito.** Un verificador que no puede fallar no verifica.
4. **Lo que no está escrito no es detectable** — y decirlo es mejor que fingir que sí.
5. **Deriva, no copies.** Dos copias del mismo hecho divergen; este marco tiene cicatrices de eso.
6. **Aplazar algo lo pone a la vista.**
7. **Una advertencia no arregla un defecto**: lo convierte en característica documentada.
8. **Un arreglo inalcanzable es peor que ninguno**: se lee como protección.
9. **Qué sigue lo dice el tablero**, no la memoria de nadie.
10. **Lo irreversible es humano.** Siempre, en todos los modos.

---

## 9 · Dónde seguir

| Quiero… | Ve a |
|:---|:---|
| El caso exacto que tengo delante | [`CASOS-DE-USO.md`](CASOS-DE-USO.md) |
| Una regla concreta | [`RULES.md`](RULES.md), por ID |
| Cómo se llama algo | [`LEXICON.md`](LEXICON.md) |
| El procedimiento denso | [`PHASES.md`](PHASES.md) |
| Instalar paso a paso | [`INSTALL.md`](INSTALL.md) |
| Qué cambió entre versiones | [`CHANGELOG.md`](CHANGELOG.md) |

Y si no sabes cuál de estos: `cauce start`.
