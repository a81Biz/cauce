# LAYOUT — plan de terreno de la raíz

Generado por `tools/plan-layout.mjs` el 2026-08-13. **Propuesta, no ejecución** (`FND-R21`).

Raíz: `C:\DevOps\Desarrollos\cauce`
Repositorio git en la raíz: **sí** · 60 archivo(s) versionado(s)

> La carpeta que recibe la suite **manda**: es la raíz, sin excepción. Los criterios de cada
> propuesta están escritos —`FND-R25` destino · `FND-R26` historia git · `FND-R27` qué se
> versiona · `FND-R28` alcance del grafo— para que dos instalaciones del mismo proyecto den el
> mismo resultado, lo opine quien lo opine.

### Observaciones del terreno

- `alcance: bin` — *grafo*: 1 archivo(s) de código propio. Fuera: dependencias de terceros, salida de compilación, pruebas y fixtures — el grafo describe el sistema, no cómo se comprueba ni de qué depende. (`FND-R28`)
- `92 proyecto(s) hermano(s) en ..` — *vecindad*: Alcanzables desde esta raíz: Alberto.CV, Alberto_CV, AMSharedData, AngularTest, api-manager, AutoPodClipper…. Cauce es por proyecto y eso ya está resuelto; lo que no cerca ninguna regla escrita es el agente. Dos niveles, con lo que garantiza cada uno: **configuración de permisos** (`.claude/settings.json`) ataja el alcance accidental y depende de que el arnés la respete; **contenedor** con solo este proyecto montado lo impone el núcleo. Cauce no genera contenedores: detecta si los hay y lo dice.
- `sin contenedores` — *vecindad*: La frontera del proyecto es hoy una convención. Si necesitas que la imponga el núcleo, el contenedor es trabajo propio del proyecto — no algo que cauce deba generar.

### Dependencias

- `node` — disponible · los verificadores de la suite
- `git` — disponible · G4 (merge), PHASE 10 (rollback) y anclar la evidencia a commits
- `python` — disponible · graphify
- `graphifyy` — disponible · el grafo que FDGE-R43 exige en los PT MAJOR

### Artefactos de la suite por crear

- `docs/enterprise-documentation/`
- `changes/`
- `evidence/`
- `graphify-out/`

### Alcance del grafo · `FND-R28`

```
/graphify bin
```

1 archivo(s) de código propio. Fuera: dependencias, compilación, pruebas y fixtures.

---

## Decisión — la toma una persona (compuerta **G0**, `FND-R22`)

Ningún modo de ejecución automatiza esto. Para cada propuesta: **ACEPTADO**, **RECHAZADO** (con
motivo) o **MODIFICADO** (con el destino real).

`plan-layout` no propuso ningún movimiento: la raíz ya es el repositorio, no hay repositorios
anidados ni código suelto que reubicar. Lo que sí quedaba por decidir es lo que la herramienta
**observa** y no puede resolver sola — la frontera, el alcance del grafo y qué se versiona.

| # | Propuesta | Decisión | Motivo / destino real |
|:--|:---|:---|:---|
| 1 | Frontera del proyecto (`SUITE-R39`): acotar el alcance del agente con `.claude/settings.json`, versionado. 92 proyectos hermanos alcanzables desde `..`, sin contenedores. | ACEPTADO | Respuesta literal: «Permisos .claude/settings.json». Es una convención y depende de que el arnés la respete; se declara así, no como garantía del núcleo. El contenedor queda descartado hoy: cauce no los genera (`FND-R25`). |
| 2 | Alcance del grafo (`FND-R28`): `/graphify bin` — 1 archivo de código propio. | ACEPTADO | Respuesta literal: «bin/ · lo que calculó la herramienta». Se propuso extenderlo a `docs/methodology/tools/` (15 `.mjs`) y se rechazó: el criterio escrito manda sobre el juicio del momento. Consecuencia declarada: el grafo cubre 1 archivo, así que `FDGE-R43` se satisface formalmente y no describe el sistema. |
| 3 | Qué se versiona (`FND-R27`, `SUITE-R37`): `.gitignore` línea 2 `*.log` se traga los ledgers append-only — `git check-ignore` lo confirma sobre `HISTORY.log` e `INSTALL.log`. | ACEPTADO | Respuesta literal: «Negación acotada». Se conserva `*.log` y se añade `!docs/implementation/*.log`; más `graphify-out/`, que `SUITE-R37` manda no versionar. No se sustituye el `.gitignore` entero. |

```
Revisado por: Alberto Martínez
Fecha: 2026-08-13
El plan de terreno refleja la estructura que quiero: SÍ
```

Mientras este bloque esté sin firmar, `verify-fdge` bloquea la apertura de PTs nuevos
(`FND-R23`): documentar y auditar una estructura que está a punto de cambiar es trabajo que
hay que rehacer.
