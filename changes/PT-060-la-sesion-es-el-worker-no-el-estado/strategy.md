# PT-060 — Estrategia   `PHASE 3`

## Lo que se construye

```
tracker sesion abrir       marca el «desde» · escribe SESSION.json · apila en SESSION_LOG
tracker sesion             lo que lleva la sesión, todo derivado
tracker sesion cerrar      el handoff DERIVADO para la sesión siguiente
```

Y `SESSION.json`, **sobrescribible**, con un solo campo capturado y el resto derivado.

## La distinción que lo sostiene

`LEX-R26` prohíbe un campo que **solo pueda rellenar la memoria** del agente. `desde` no lo es:

| | Qué es | Por qué vale |
|:---|:---|:---|
| **Marca** | `desde: <sha de HEAD al arrancar>` | Verificable **en el momento en que se pone** |
| **Memoria** | «llevo unas tres horas» · «he gastado la mitad» | Afirmación sobre el pasado, sin nada que la respalde |

Es exactamente el mismo criterio que hace legítimo el `sha` de `CHECKPOINT.json`. Y si nadie abrió
la sesión, `desde` es `SIN EVALUAR` y se dice — no se inventa cayendo al día en silencio.

## Los tres subcomandos

**`sesion abrir`** — captura `HEAD`, escribe `SESSION.json`, apila una línea en `SESSION_LOG.md`.
Es lo único que marca; todo lo demás lee.

**`sesion`** — sin argumentos, muestra lo derivado: commits, archivos, líneas, tareas tocadas, la
tarea en curso y su fase. Cada cifra con su naturaleza (`PT-058`).

**`sesion cerrar`** — produce el **handoff de cambio de sesión**, derivado de `CHECKPOINT.json` y
de la sesión: qué tarea, en qué fase, sobre qué commit, y **qué sigue** — que `tracker siguiente`
ya sabe derivar. Apila el cierre en `SESSION_LOG.md`.

## Lo que NO toca

**`HANDOFF.md` no se reescribe.** `AC-05` es explícito y hay una razón: su prosa —`decisiones`,
`no hacer`— es lo único del estado que **no** se puede derivar, y es lo más valioso que tiene. Se
le pone el sello (que ya hace `avanzar`) y nada más.

**Los estados de sesión no entran en `REGISTRY.json`.** `AC-02`, y es la corrección a la
especificación: durante un handoff la tarea sigue `IN_PROGRESS`. Meterlos ahí los haría permanentes
bajo `SUITE-R09`.

**No se crea un ledger nuevo.** `SESSION_LOG.md` ya es el ledger de sesiones; otro sería el mismo
hecho en dos sitios (`SUITE-R38`).

## `PT-059` se beneficia, y con una condición

Con `SESSION.json`, el precedente de `PT-059` puede salir de `desde..HEAD` en vez de «los commits
de hoy». **Pero solo si la sesión se abrió**, y si no, hay que decirlo — no caer al día fingiendo
que es lo mismo.

Se hace aquí porque es el hueco que `PT-059` declaró como no verificado, y arreglarlo desde el otro
lado es lo que esta tarea existe para poder hacer. **No cambia la lógica de `viabilidadDe`**: solo
de dónde sale una de sus entradas, y con qué naturaleza llega.

## `AC-06`: el criterio del lote, y cómo se demuestra

> «Una tarea puede recorrer dos sesiones sin repetir el análisis.»

No se comprueba con un caso: **se ejecuta y se captura**. El guion, sobre esta misma tarea:

1. `tracker sesion abrir` — se marca el inicio.
2. Se trabaja: `PT-060` avanza de fase.
3. `tracker sesion cerrar` — sale el handoff derivado.
4. Se **simula** la sesión siguiente: se lee **solo** ese handoff y `tracker siguiente`.
5. Se comprueba que lo que dicen **basta para continuar**: la tarea, la fase, el commit y qué toca.

Lo que quedará capturado es la salida real de los cinco pasos, y lo que **no** puede demostrar es
que un agente distinto no vuelva a abrir los documentos igualmente. Eso se declara.

## El riesgo

Que `SESSION.json` se convierta en un tercer sitio donde mirar. La defensa es que **no contiene
nada que no esté derivado de otro sitio** salvo `desde`: si se borrara, lo único que se pierde es
saber dónde empezó la sesión — y eso se diría, no se adivinaría.
