# cauce

> ## ¿Empiezas aquí?
>
> **[MANUAL.md](docs/methodology/MANUAL.md)** — de cero a tu primer trabajo cerrado. Se lee
> entero una vez.
> **[CASOS-DE-USO.md](docs/methodology/CASOS-DE-USO.md)** — el caso exacto que tengas delante,
> con su ruta y con los huecos declarados.
>
> Y si ya está instalado: `npx @a81biz/cauce start`.

**Marco de gobernanza para desarrollo asistido por IA.** Trazabilidad, evidencia y control
humano sobre toda decisión irreversible.

### Qué está demostrado, y qué no

No es una promesa: `EP-017` lo ejecutó y anotó lo que salió mal.

| | Se hizo | Resultado |
|:---|:---|:---|
| **Proyecto nuevo** | instalado desde el paquete, Foundation, un `PT` completo con tests en rojo primero | `cauce verify` en **cero errores**, y **siete huecos** encontrados, dos de ellos `S1` |
| **Legado real** | cauce `4.12.0`, 127 tareas, cinco *majors* atrás | `migrate` separa **1 acción automática de 6 decisiones humanas** y dice por qué cada una lo es |

**Lo que no está demostrado**: ejecutar la migración de extremo a extremo. Se validó que el
informe es correcto y accionable, no que aplicarlo funcione — y entre las dos cosas hay un paso.
Los huecos abiertos están en [`CASOS-DE-USO.md`](docs/methodology/CASOS-DE-USO.md), dichos en vez
de callados.

```bash
npm i -D @a81biz/cauce
npx cauce install
```

Y después, en Claude Code dentro del proyecto: **«instala el framework»**.

Un cauce no empuja el agua: decide por dónde puede ir. Ninguna regla escrita en un documento
obliga a un modelo a obedecerla — lo que este marco consigue es que lo correcto salga barato y
lo incorrecto quede visible.

```
FIDE → Foundation → FDGE (construir) → QA (verificar UX) → PTSA (auditar producto)
                                     → FPGE (priorizar) → FDGE PHASE 1 (Intake) → …
```

Manual completo: [`docs/methodology/README.md`](docs/methodology/README.md) ·
Cambios y migración desde v3: [`docs/methodology/CHANGELOG.md`](docs/methodology/CHANGELOG.md)

> **Este archivo es la portada, no la autoridad** (`FND-R12`). Lo que diga aquí sobre la
> arquitectura de este repositorio se subordina a
> [`docs/enterprise-documentation/01-Platform-Overview.md`](docs/enterprise-documentation/01-Platform-Overview.md);
> sobre sus convenciones, a
> [`11-Conventions.md`](docs/enterprise-documentation/11-Conventions.md); y sobre el
> procedimiento de instalación, a
> [`docs/methodology/INSTALL.md`](docs/methodology/INSTALL.md). Ante discrepancia manda el
> documento subordinante — esta página se corrige.

---

## Los tres documentos que gobiernan todo

| Documento | Gobierna |
|:---|:---|
| [`LEXICON.md`](docs/methodology/LEXICON.md) | **Nombres**: fases, identificadores, estados, archivos, triggers |
| [`RULES.md`](docs/methodology/RULES.md) | **Reglas**, todas, con ID estable y severidad |
| [`EXECUTION-MODES.md`](docs/methodology/EXECUTION-MODES.md) | **Compuertas**, autonomía y lotes |

Todo lo demás los cita. Ningún otro documento legisla.

---

## Cómo Claude Code obtiene contexto

Al abrir una sesión aquí, Claude Code carga `CLAUDE.md` (repo) y `~/.claude/CLAUDE.md`
(global), y sabe que este repositorio es la fuente del framework.

**En un proyecto destino**, el contexto lo da su propio `CLAUDE.md`, que contiene las reglas
vinculantes. Se cargan en cada sesión (PHASE 0 de FDGE):

| Fuente | Qué aporta |
|:---|:---|
| `CLAUDE.md` del proyecto | Modo de ejecución, Declaración de Valor, punteros a la autoridad |
| `docs/implementation/REGISTRY.json` | Versión de suite, modo, contadores de IDs, PTs vivos |
| `docs/enterprise-documentation/` | Arquitectura, PRD, TRD, Conventions |
| `docs/implementation/BACKLOG.md` | PTs vivos y su fase actual |
| `docs/implementation/HANDOFF.md` | Bloque `ESTADO`: qué está abierto y cuál es la siguiente acción (`SUITE-R33`) |
| `docs/implementation/HISTORY.log` | Todo el trabajo previo, trazado por `PT-NNN` |
| `docs/implementation/INCIDENTS.log` | Incidentes abiertos |
| `PTSA/RESUMEN.md` | Health Score y hallazgos abiertos |
| `QA/qa-score-history.json` | Historial de scores QA y defectos por ciclo |
| `docs/implementation/ROADMAP.md` | Roadmap priorizado vigente |

---

## Instalar

```bash
npm i -D @a81biz/cauce      # el paquete lleva ámbito; el comando se llama cauce
npx cauce install           # deja el marco en docs/methodology/ y genera su núcleo
```

Y después, en Claude Code, dentro del proyecto:

```
instala el framework
```

El ámbito `@a81biz` es de propiedad, no de uso: npm rechaza `cauce` a secas por parecerse a
paquetes que ya existen. El binario sigue llamándose `cauce`.

`npx cauce install` **se niega** a sobrescribir una copia del marco que difiera de la del
paquete, y dice qué difiere. Una copia distinta puede llevar correcciones que ese proyecto hizo
bajo sus propios PT — pasó, con un verde falso sobre la regla que sostiene la auditoría — así
que sincronizar a ciegas está prohibido en las dos direcciones (`SUITE-R31`).

---

## Aplicar el framework a un proyecto

### Escenario A — Proyecto nuevo desde cero (FIDE)

1. Crea una carpeta vacía y ábrela en tu editor.
2. Copia [`docs/methodology/FIDE/FIDE-CLAUDE-Launcher.md`](docs/methodology/FIDE/FIDE-CLAUDE-Launcher.md)
   dentro de un `CLAUDE.md` en su raíz.
3. Ejecuta: `[START FIDE] prompt: "Quiero construir..."`

FIDE investiga el nicho, consensúa contigo la arquitectura, genera la documentación con los
**nombres canónicos**, monta el andamiaje, instala la suite completa y se retira.

### Escenario B — Proyecto existente

```bash
npm i -D @a81biz/cauce
npx cauce install
```

Y después, en Claude Code dentro del proyecto:

```
instala el framework
```

Claude lee [`docs/methodology/INSTALL.md`](docs/methodology/INSTALL.md) y conduce las nueve
fases **en la conversación** (`SUITE-R28`): enumera el terreno, revisa secretos y accesos, te
presenta lo que propone y **espera tu decisión ahí mismo**, ejecuta lo que aceptes, crea la
estructura, instala las dependencias que falten pidiéndote permiso una por una, genera el grafo
con `/graphify`, verifica y encadena con `[START FOUNDATION]`.

Los artefactos —`LAYOUT.md`, `REGISTRY.json`, `CLAUDE.md`— se escriben igual: son el registro
auditable. Pero no son por dónde se decide. Escribir un `.md` y decir «léelo y vuelve»
desperdicia el único medio donde ya estás mirando.

Lo que **no** hace sola: mover código sin tu firma (`FND-R22`), inventarse qué hace válido un
producto (`FND-R24`), instalar nada en silencio (`SUITE-R29`) ni tocar la rama principal
(`SUITE-R06`).

> **El procedimiento paso a paso no se copia aquí.** Lo estuvo, y las dos copias divergieron:
> esta apuntaba a una carpeta que ya no existe y ordenaba **borrar** documentación antigua,
> cuando `FND-R11` es explícita en que nada se borra —se archiva—. Un procedimiento con dos
> copias es un procedimiento del que nadie sabe cuál manda, que es la avería que este marco
> existe para eliminar. La única fuente es `INSTALL.md`.

---

## Flujo tras la instalación

Trabaja **desde el proyecto destino**.

```
[START FOUNDATION]              documenta el codebase existente
[FOUNDATION VALIDATED]          ACK humano — habilita el resto de la suite

# Desarrollo. PHASE 0 al inicio de cada sesión.
[START PT] BUG: <título>        abre trabajo → PHASE 1 (Intake) → G1
[START EP] <título>             abre un lote
resume PT-XXX                   retoma un PT en su fase actual
status FDGE                     PTs vivos, ramas, incidentes, hotfixes vencidos

[START QA]                      verifica flujos de usuario en navegador real
delta QA PT-XXX                 re-ejecuta solo los casos afectados por un PT
status QA

[START PTSA]                    audita los productos generados
resume PTSA                     reanuda una auditoría inconclusa
delta PTSA                      re-audita lo afectado sobre una auditoría completa
status PTSA

[START FPGE]                    roadmap priorizado por evidencia
promote FPGE R-NNN              → FDGE PHASE 1 (Intake), con firma humana pendiente
status FPGE
```

Prompts operativos: `docs/methodology/*-Prompts.md`, uno por componente.

---

## Qué cambia respecto a la v3

Si vienes de la 3.0.0, lee la guía de migración del
[CHANGELOG](docs/methodology/CHANGELOG.md). Los cinco cambios que más notarás:

1. **Todo trabajo entra por un Intake firmado.** El humano declara el comportamiento
   esperado y los criterios de aceptación; el agente los formaliza. Antes los inventaba el
   agente y el humano los sellaba con un ACK.
2. **`PHASE` sustituye a `Estado n` / `STATE n` / `FASE n` / `F-n`.** `Estado 4` significaba
   *diseñar* y `STATE 4` significaba *implementar*: un agente que leía ambos documentos
   recibía órdenes contradictorias.
3. **Modos de ejecución.** Cuatro compuertas en lugar de once ACKs, y una lista cerrada de
   acciones que ningún modo automatiza. Más lotes `EP-NNN`.
4. **El ciclo se completa.** `PHASE 9 — Integration` (PR, CI, merge, cierre de rama) y
   `PHASE 10 — Rollback` (incidentes, revert, seguimiento). Antes el workflow de git
   terminaba en el último commit y la rama quedaba abierta indefinidamente.
5. **Verificación mecánica.** `verify-suite.mjs` y `verify-fdge.mjs`. Un checklist que el
   agente rellena sobre sí mismo no es un control; un check que puede fallar sí lo es.

---

## Cuándo volver a este repositorio

- Para evolucionar la metodología (ver las reglas en [`CLAUDE.md`](CLAUDE.md)).
- Para sincronizar mejoras a proyectos destino ya instalados.
- Como referencia normativa ante cualquier duda.

**Cada proyecto destino tiene su propia copia del framework y sus propios artefactos**, y ahí
es donde se trabaja: no edites este repositorio para resolver algo de otro proyecto.

Lo que sí ocurre aquí es el trabajo **sobre el marco**, y ocurre bajo el marco. Desde
`SUITE-R41`, cauce se instala sobre sí mismo: tiene su `REGISTRY.json`, su `LAYOUT.md` firmado,
su paquete de Foundation en [`docs/enterprise-documentation/`](docs/enterprise-documentation/)
y sus compuertas — el merge a `main` **es** `G4`. Un marco de gobernanza que se mantuviera al
margen de sus propias reglas sería el primer argumento en su contra.
