# PT-019 — Descubrimiento   `PHASE 2`

**Ejecutado sobre el proyecto real, sin tocarlo.** `Inteligencia de Mercados Energéticos
Mexicanos`, en `C:/DevOps/Desarrollos/`. Todo en lectura y sin `--apply`; al terminar,
`git status` del original: **0 cambios**.

## Lo que el legado es, medido

| | |
|:---|:---|
| Versión de cauce instalada | **`4.12.0`** — cinco `MAJOR` por detrás de la `10.0.0` |
| Trabajo hecho bajo el marco | **114 tareas cerradas**, seis lotes (`EP-001`..`EP-006`) |
| Estado del repositorio | limpio, en `master`, último commit «PT-114 · G3 y G4 Alberto Martínez» |
| Tamaño sin `node_modules` | 40 MB |
| Stack | monorepo con `apps/` (admin, api, base, rb), `packages/`, `e2e/` con Playwright |

**No es un legado sintético ni un proyecto de juguete**: es un sistema real, con cuatro
aplicaciones, pruebas end-to-end y 114 tareas de historia bajo el propio marco. Es el mejor caso
de prueba que había, y `AC-05` del intake preveía tener que renunciar a él.

## `comparar-marco` · cuánto se ha separado

```
local (cauce)                52 archivos
instalado en el legado       39 archivos

SOLO en cauce (13)   CASOS-DE-USO.md · MANUAL.md · FIDE/ (3) · INTAKE/templates/TAREA.md
                     tools/: comparar-marco · patrones · regla · revisar-secretos · tracker
                             verify-patrones · version
DIFIEREN (36 de 39)
IDÉNTICOS (3)
```

**Tres archivos de treinta y nueve son iguales.** Un proyecto en `4.12.0` no es cauce con menos
funciones: es, en la práctica, **otro marco**. Y le faltan **7 de las 16 herramientas**, incluido
`tracker`, que es el que sostiene el tablero.

También faltan tres artefactos: `CHECKPOINT.json`, `SESSION.json` y `SECRETOS-EXCEPCIONES.md`.

### Un hueco de la herramienta   `HL-1`

`comparar-marco` llama **«canónica» al argumento**. Ejecutada desde cauce contra un proyecto
—que es el sentido natural cuando quien mantiene el marco quiere saber cuánto se ha separado un
destino— **invierte las etiquetas**: dice «solo en la copia local» de lo que en realidad son las
novedades del marco. El contenido es correcto; el rótulo miente.

Está pensada para ejecutarse **desde el proyecto**, y eso no está escrito en ningún sitio.

## `migrate` sin `--apply` · el informe

Y aquí la buena noticia, que es la que importa:

```
migrate — Methodology Suite → 10.0.0
Versión detectada: 4.12.0
Modo: informe (añade --apply para ejecutar)

SE HARÍA AUTOMÁTICAMENTE
  · REGISTRY.suite_version: 4.12.0 → 10.0.0

REQUIERE UNA PERSONA
  6 decisiones
```

**Una acción automática y seis decisiones humanas**, cada una con su motivo escrito. Y la sección
final —«qué te toca decidir, y por qué es tuyo»— explica una por una por qué una máquina no puede
resolverlas sin inventarse el dato:

| # | Decisión | Por qué es humana |
|:---|:---|:---|
| 1 | El bloque `ESTADO` de `HANDOFF.md` | Qué compuerta esperas y a quién. Rellenarlo con plantilla produce un estado que miente |
| 2 | `phase` en 2 allocations vivas (`EP-009`, `EP-014`) | La máquina ve archivos, no intención |
| 3 | Declarar plataforma | Sacar el estado a un tablero es decisión de equipo |
| 4 | Las 7 herramientas nuevas | Mirarlas antes de que aparezcan en una compuerta |
| 5 | Firmar falsos positivos de secretos | Lo sabe quien conoce el dato |
| 6 | `suite_version` en el `CLAUDE.md` del proyecto | — |

**Esto es lo que la épica quería comprobar**: que un legado real, cinco majors atrás, puede
migrar, y que la herramienta distingue lo que puede hacer sola de lo que no.

### Un hueco declarado   `HL-2`

La decisión 3 dice **«OPCIONAL — declarar plataforma de trabajo… Sin ella no cambia nada»**.
`PT-072` midió que eso es **falso**: sin plataforma, `tracker avanzar` es imposible y no se avanza
ni una fase. Un legado que migre siguiendo este informe y decida no declararla se quedará sin
poder mover una tarea. → **`PT-084`**.

## Lo que NO se pudo comprobar, y consta

**No se ejecutó `migrate --apply`.** El intake lo declara `OUT`: el proyecto es un **caso de
prueba**, no un destino, y su migración se cierra cuando el firmante vaya a trabajar allí. Así que
lo verificado es que **el informe es correcto y accionable**, no que la migración funcione de
extremo a extremo.

La diferencia importa y no se disimula: entre «migrate dice bien lo que hay que hacer» y «migrate
lo hace bien» queda un paso que esta tarea no da.

## El sintético

`AC-01` pedía además un legado **sintético** que provocara los casos que Foundation debe detectar.
No se construyó, y el motivo es que **el real los provoca mejor**: documentación que contradice al
código, herramientas ausentes, artefactos que no existen y dos allocations vivas sin `phase` son
divergencias auténticas, no fabricadas. Un sintético habría medido mi capacidad de inventar
defectos, no la de Foundation para encontrarlos.

Se declara como alcance reducido con su motivo, en vez de darlo por hecho.

## Conclusión

**Un legado real de cinco majors atrás puede migrarse, y la herramienta lo dice bien.** La prueba
fue no destructiva de principio a fin: `0` cambios en el original.

Dos huecos, ninguno bloqueante para la migración en sí:

| | Destino |
|:---|:---|
| `HL-1` `comparar-marco` invierte las etiquetas según desde dónde se ejecute | `PT-073` |
| `HL-2` `migrate` promete que la plataforma no cambia nada, y sí cambia | `PT-084` |

Y una limitación declarada: **no se ejecutó la migración**, sólo se validó su informe.
