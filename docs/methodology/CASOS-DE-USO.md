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

### C5 · ¿El sistema hace lo que el negocio necesita?

| | |
|:---|:---|
| **Entrada** | `[START PTSA]` |
| **Recorrido** | Audita los productos reales contra la Declaración de Valor firmada |
| **Fin** | Matriz de auditoría **sin celdas en blanco** (`PTSA-R77`) |

### C6 · ¿Puede el usuario usarlo de verdad?

| | |
|:---|:---|
| **Entrada** | `[START QA]` |
| **Recorrido** | Navegador real, recorridos reales |
| **Fin** | Cada caso con su evidencia; un happy path fallido no es `QA-A` |

### C7 · ¿Hay secretos en el árbol o en la historia?

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

### E2 · Publicar una versión

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

---

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
| Monorepo con varios `REGISTRY.json` | No se ha probado; el marco asume uno por repositorio |
| Varios agentes trabajando a la vez | El espejo detecta divergencia pero nada coordina el reparto |
| Migración desde una suite que no sea cauce | Fuera de alcance del marco |

Un caso que aparezca y no esté aquí **entra como `PT`**, no como párrafo.
