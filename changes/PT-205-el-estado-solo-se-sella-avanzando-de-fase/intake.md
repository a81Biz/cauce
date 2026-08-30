# `PT-205` — El verde local no predice CI para lo que depende de lo empujado, y cada caso cuesta un viaje

```yaml
---
id: PT-205
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-30
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

En la rama de `PT-203`, con `npm run verify` **en verde en local** antes de cada empujón:

```
$ gh run list --branch chore/…/EP-026-PT-203-…
  failure   2 min      ✗ SUITE-R51   los issues publicados sin enlace
  failure   7 min      ✗ SUITE-R51   los issues publicados sin enlace
  success   6 min
  failure   8 min      ✗ SUITE-R34   trabajo en changes/ despues del ultimo estado
  success  33 min
  ---
  total 55 min · en corridas FALLIDAS 17 min
```

**Y el coste real no son los 17 minutos**: es el viaje. Empujar, esperar siete minutos, leer el
log, arreglar, volver a esperar. Tres veces.

## 2. Por qué   `[HUMANO]`

Las tres roturas comparten una causa: **dependen de lo que está empujado, y en local eso no existe
todavía.**

| | Qué mide | Por qué el verde local no lo ve |
|:---|:---|:---|
| `SUITE-R34` | `git log` de `HANDOFF.md` vs `changes/` | Lo pendiente **no está commiteado**, así que `git log` no lo ve. `PT-201` ya añadió el aviso *«MEDIDO SOBRE LO COMMITEADO»* — **y aun así volvió a pasar**, porque el aviso aparece cuando ya decidiste commitear |
| `SUITE-R51` | Que el issue enlace un **ref durable** | En el momento de publicar, el intake **no está empujado**. La regla **no puede** cumplirse ahí |

`SUITE-R62` promete que `npm run verify` equivale a CI. **Éste es su segundo límite**, y el primero
—las comprobaciones que no pueden correr en local— ya lo declaró `PT-201`. La diferencia: aquél
declaraba lo que no se puede saber; **éste se puede saber y no se sabe**.

## 3. Y las dos secuencias sancionadas garantizan el rojo

```
asignar → escribir intake → abrir → commit → push → ✗ SUITE-R51 → abrir OTRA VEZ
                                     ↑ publica el issue sin enlace, porque aun no hay ref
```

```
avanzar → trabajo en changes/ (analisis, parada, correccion) → push → ✗ SUITE-R34
          ↑ y «avanzar» es lo UNICO que sella el estado, y solo al cambiar de fase
```

**Ninguno de los dos pasos de vuelta está escrito**: ni el «`abrir` otra vez», ni cómo sellar el
estado sin avanzar. Se descubren chocando, y hoy se han descubierto **cuatro veces** —tres de
`SUITE-R51` con `EP-027`, `PT-204` y `PT-205`; una de `SUITE-R34`—.

Es la misma forma que `PT-196` cerró para el cierre de lote: **actos necesarios que ninguna fase
posee y que se ejecutan de memoria.** Y lo que `PT-196` dejó escrito vale aquí: lo que se ejecuta
de memoria falla donde la memoria falla, que es en un sitio distinto cada vez.

## 4. Lo que lo hace defecto, y no disciplina

**Una compuerta que sólo se satisface pasando antes por su rojo enseña a leer sus rojos como
ruido.** `SUITE-R51` no puede cumplirse cuando `abrir` publica: el ref no existe. El rojo posterior
no es un incumplimiento — es la **única trayectoria posible**.

Y el código ya lo dijo de un caso anterior:

> *«FALTABA, y lo dijo la CI en rojo — la TERCERA vez que `SUITE-R34` caza este patrón en la
> sesión. El comando VIOLABA POR CONSTRUCCIÓN la regla que dice que el estado viaja con el
> trabajo.»* — `tracker.mjs:3792`

`PT-158` arregló que **`avanzar`** la violara. No arregló que fuera el **único camino**.

## 5. Qué NO entra   `OUT`

- **Quitar `SUITE-R34` ni `SUITE-R51`.** Las dos son correctas y sus rojos de hoy fueron **verdad**.
- **Un hook de `pre-commit`**: no corre en CI, se salta con `--no-verify` y hay que instalarlo.
- **Reescribir la prosa del `HANDOFF`**: es lo único del estado que no se deriva (`LEX-R26`).
- **Predecir CI para lo que de verdad no se puede saber en local** — eso es el límite que `PT-201`
  ya declaró, y sigue siendo un límite.

## 6. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | El verde local **avisa** de lo que romperá en CI por depender de lo empujado, **antes** de empujar | `TS-01` |
| `AC-02` | Existe una vía **sancionada** de sellar el estado sin cambiar de fase, y el sello sigue **derivado** | `TS-02` |
| `AC-03` | Crear una allocation **no** deja un issue sin enlace: o se dice en el momento, o se reclama después | `TS-03` |
| `AC-04` | Lo que quede como rodeo **está escrito donde se ejecuta**, con su motivo — no descubriéndose | `TS-04` |

`AC-04` no es el premio de consolación: `PT-196` demostró que **declarar el rodeo con su motivo**
es a veces la respuesta correcta, y que lo inaceptable es descubrirlo cada vez.

## Cómo termina   `FDGE-R53`

> Termina cuando: empujar deje de ser la forma de enterarse de lo que ya se podía saber.

## 7. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-30
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la del lote. `G3` sigue siendo humana para todo `BUG` (`EXEC-R05`).

## 8. Origen   `FDGE-R55`

Paradas de `EP-026`, **dos**, absorbidas en una sola tarea por compartir causa:
`paradas/PT-205.md` (`SUITE-R34`) y `paradas/PT-207.md` (`SUITE-R51`).

**Se absorben y no se hacen dos tareas** porque el arreglo de una sin la otra deja el viaje de CI
en pie: lo que cuesta tiempo no es cada regla, es que el verde local no prediga el rojo remoto.

## 9. Por qué va la SIGUIENTE, y no al final

Lo pidió el firmante con el motivo delante:

> *«necesitamos arreglar ésto. Lo ideal sería un PT para hacerlo ahora, al terminar éste, buscando
> que los siguientes no pierdan tanto tiempo»*

Quedan `PT-195`, `PT-194`, `PT-202`, `PT-187`, `PT-197`, `PT-204` y `PT-206`. **Siete tareas × un
viaje de CI evitable ≈ una hora de reloj.** Hacerla ahora la paga el propio lote.
