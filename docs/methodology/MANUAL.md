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
npx @a81biz/cauce start
```

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
1 · el estado terminal se apunta en la rama de trabajo
2 · el merge  ← G4, tuyo
3 · tracker cerrar --aplicar
```

Al revés, la rama principal queda declarando trabajo vivo con el issue ya cerrado y su compuerta
falla **después de cada merge** (`SUITE-R46`). La herramienta se niega si te adelantas.

Publicar es aparte, es manual y es tuyo.

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
