# Context — `PT-096`

> `PHASE 2`. Qué se leyó, qué dice, y con cuánta confianza se afirma. No contradice el intake.

## 1. Qué se leyó

| Fuente | Para qué | Estado |
|:---|:---|:---|
| `intake.md` + Revisiones 1 y 2 | el hecho declarado y sus dos ampliaciones | vigente |
| `RULES.md` `SUITE-R35` · `R51` · `R56` | qué obliga el marco sobre el cuerpo de un issue | vigente |
| `LEXICON.md` §8.1 | valores canónicos de `type` | **hueco declarado** — §4 |
| `tools/tracker.mjs` | las tres guardas y `cuerpoDeIssue` | leído entero |
| `tools/verify-*.mjs` (4) | si alguno lee el cuerpo de un issue | **ninguno lo hace** |
| `HISTORY.log` `PT-010` `PT-035` `PT-036` `PT-048` `PT-079` | los cinco precedentes | leídos |
| `11-Conventions.md` | dónde vive el código y cómo se escribe | vigente |
| tablero completo · 190 issues vía `gh api` | la medición | 2026-08-21 |

**`06-Backend-Architecture.md` y `02-PRD` no aplican**: este repositorio no tiene backend ni
producto de negocio; su arquitectura es la de `01-Platform-Overview` y `11-Conventions`, y la
declaración de valor vive en `CLAUDE.md`. Se dice en vez de citarlos por cumplir.

## 2. El grafo está `SUSPECT` — `FDGE-R08`

```
FDGE-R43   6 de 17 archivos que describe han cambiado desde 2026-08-20:
           build-core.mjs · patrones.mjs · selftest.sh · tracker.mjs
           verify-fdge.mjs · verify-suite.mjs
```

`tracker.mjs` —el archivo central de esta tarea— **es uno de los seis**. `FDGE-R08` obliga a
declararlo y a **bajar la confianza**, y así se hace en §5. En la práctica el efecto es menor de
lo que suena: el análisis de abajo **no se apoya en el grafo** sino en lectura directa del archivo
y en medición sobre el tablero, que es la fuente de mayor autoridad disponible. El grafo se usó
solo para confirmar que ningún otro consumidor importa `cuerpoDeIssue`.

## 3. Dónde vive lo que se toca

```
docs/methodology/tools/tracker.mjs      cuerpoDeIssue · compararEspejo · repararEnlacesMuertos
                                        sincronizarCuerpos · cerrarPasada · refDurableDe
docs/methodology/tools/selftest.sh      la bateria · 1229 casos
docs/methodology/LEXICON.md             §8.1 · el hueco del «type» de un lote
docs/methodology/RULES.md               SUITE-R51 · si el arreglo necesita apoyarse en ella
docs/methodology/CASOS-DE-USO.md        el caso de uso del seguimiento desde el tablero
docs/methodology/MANUAL.md              lo mismo, para quien USA cauce
README.md · CLAUDE.md                   AC-07 · a decidir si procede, ver §6
```

`SUITE-R06(e)` cubre todo `docs/methodology/`, que en este repositorio **es el producto**
(`SUITE-R41`). La excepción está declarada en `SESSION_LOG.md`.

## 4. El hueco de vocabulario, que condiciona el arreglo

`LEXICON` §8.1 enumera el `type` de una **tarea**:

```
BUG · FEATURE · REFACTOR · INVESTIGATION · CHORE
```

y **no declara ninguno para un lote**. La tabla de identificadores declara `EP-NNN` como **ID**,
no como tipo. El registro guarda tres respuestas distintas —`EP` (16), ausente (2), `EPIC` (1)—
y `tracker.mjs:367` codifica una cuarta suposición: `a?.type === 'EP'`.

`LEX-R21` y `LEX-R22` dicen dónde se resuelve esto: en `LEXICON`, no aquí y no en el código.
`PHASE 3` decide si `PT-096` lo declara o lo cede a `L-3`.

## 5. Confianzas — `FDGE-R09`

```
RootCause     95%   las tres guardas se leyeron en el archivo, se citan por linea, y la
                    ventana de regresion cuadra al dia: 11 de 11 issues posteriores a
                    PT-079 rotos, 92 anteriores sanos. No es inferencia.
                    -5 por el grafo SUSPECT (FDGE-R08), no porque el analisis dependa de el.

Architecture  90%   un solo archivo, sin modelo de datos ni migracion, y ningun otro
                    consumidor de cuerpoDeIssue. -10 por §4: el arreglo de la cabecera de
                    lote depende de una decision de vocabulario que no esta tomada.

Solution      80%   la direccion es clara para los tres puntos y para la lista en prosa.
                    -20 porque el punto de SECUENCIA —que el enlace exista al abrir— admite
                    al menos dos soluciones con consecuencias distintas, y elegir es PHASE 3:
                      (a) reintentar la resolucion mas tarde, desde el espejo
                      (b) exigir el commit antes de abrir, en la fase
                    (a) sola deja una ventana en la que el issue esta publicado y mudo;
                    (b) sola vuelve a confiar en el orden que use quien trabaje.
```

Los tres por encima de `70%`: **no procede convertirla en `INVESTIGATION`** (`FDGE-R09`).

## 6. Lo que este contexto NO establece

- **Que `AC-07` deba tocar los cuatro documentos.** `CLAUDE.md` *parametriza y no legisla*
  (`SUITE-R00`), así que puede que su sitio correcto sea no decir nada; y `README.md` es la
  puerta de entrada al repositorio, no el manual de operación. `PHASE 3` lo decide **con motivo
  escrito**, no por omisión — que es la trampa que `PT-079` documentó con los `CINCO SITIOS`.

- **Que el arreglo de `esLote` entre en esta tarea.** Depende de §4.

- **Cuántos de los 10 cuerpos rotos son reparables.** Todos tienen su directorio en `main` o en
  `trabajo`, así que en principio sí; se mide en `PHASE 6` sobre el tablero real y se publica con
  su denominador, no antes.
