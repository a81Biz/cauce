# PT-076 — El arnés no escribe en el repositorio real

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-076
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 5
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «se supone que ya debes seguir todas las reglas de cauce, como el cálculo de sesión»

Al ir a cumplirlo, el cálculo de sesión decía **1 commit y 248 líneas** en una sesión que lleva
decenas de commits. No era un error de lectura: **la batería de pruebas reescribe el estado de
sesión del repositorio real cada vez que corre.**

## 2. Qué pasa, medido

`selftest.sh` define dos formas de invocar `tracker`:

```bash
TR()  { node "$WORK/docs/methodology/tools/tracker.mjs"  "$@" "$WORK";      }  # el fixture
TRR() { node "$SUITE/tools/tracker.mjs"                  "$@" "$RAIZ_REAL"; }  # el repo REAL
```

`TRR` existe **con motivo**: `coste`, `viabilidad` y `personas` necesitan el historial real —una
mediana de cuatro tareas de mentira no es una mediana—. Leer el repositorio real para eso es
correcto.

El problema es que tres de esas acciones **escriben**:

| Acción con `TRR` | Casos | Qué escribe en el repositorio real |
|:---|:--:|:---|
| `sesion abrir` | 3 | `SESSION-<persona>.json` — **pisa la marca de la sesión en curso** |
| `sesion cerrar` | 6 | `SESSION_LOG.md` — apila una entrada, y es **append-only** (`SUITE-R09`) |
| `asignar` | 6 | nada: lleva `--ver`. **Correcto**, y es la prueba de que el patrón seguro ya se conocía |

**Reproducido**, un solo caso:

```
antes  : 78fbcd9
  ✓ sesion abrir escribe la marca
despues: a6913da        <- la marca real, movida
```

**Daño acumulado:** `SESSION_LOG.md` tiene **140** entradas de sesión, la mayoría del arnés — 14
aperturas sobre `258be16`, 8 sobre `37392ac`, 6 sobre otros tres SHA. Nueve más por cada pasada.

## 3. Por qué importa más de lo que parece

No es ruido cosmético en un log. Es la **base de cálculo** de tres cosas:

- `tracker sesion` — lo que la sesión lleva movido
- `tracker viabilidad` — el «mayor hecho», que decide `SAFE`/`MARGINAL`/`UNSAFE`
- `FDGE-R54`, recién creada por `PT-075`, que **registra ese veredicto en el registro**

Es decir: la batería de pruebas corrompe el dato sobre el que una compuerta acaba de empezar a
decidir. Y `SUITE-R09` impide limpiar el ledger editándolo.

Es el patrón que el `HANDOFF` ya declara —«correr un caso del arnés que lea el `REGISTRY` real
sin pasar el `ROOT` explícito»— pero en su forma grave: aquí no lee, **escribe**.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Ningún caso escribe en el repositorio real | tras una pasada completa, `SESSION-<persona>.json` y `SESSION_LOG.md` quedan **byte a byte iguales** |
| AC-02 | Los casos que necesitan historial real **siguen leyéndolo** | `coste`, `viabilidad` y `personas` siguen dando cifras derivadas de las tareas cerradas de verdad |
| AC-03 | `sesion abrir` y `sesion cerrar` se prueban donde deben | en el fixture, con `TR`, y siguen comprobando lo mismo |
| AC-04 | Algo falla si vuelve a colarse una acción que escribe por `TRR` | un caso que caiga al añadir una escritura, sin enumerar acciones a mano |
| AC-05 | Las 140 entradas ya escritas se declaran | `SUITE-R09` prohíbe borrarlas: se **dice** qué son y desde cuándo, no se limpian |

**`AC-04` es el corazón.** Arreglar los nueve casos de hoy deja el defecto abierto para el
siguiente que añada uno. Lo que hace falta es que la **forma** sea detectable, y hay una señal
mecánica: `tracker` ya sabe qué acciones escriben —las que llaman a `writeFileSync`—, así que la
lista se puede **derivar** en vez de mantenerla a mano (`SUITE-R38`).

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: una pasada completa de `selftest.sh` deja `SESSION-<persona>.json` y
> `SESSION_LOG.md` sin un solo byte de diferencia, y un caso cae si alguien vuelve a invocar por
> `TRR` una acción que escriba.

## 6. Qué NO entra   `[AGENTE]`

- OUT: borrar las 140 entradas del `SESSION_LOG`. `SUITE-R09` es append-only y el arreglo es que no crezcan más; lo escrito se **declara** (`AC-05`).
- OUT: eliminar `TRR`. Leer el repositorio real es correcto y necesario: sin él, `coste` mediría cuatro tareas de mentira.
- OUT: que `viabilidad` lea la marca correcta cuando hay varias personas — eso es `PT-068` `AC-07`.
- OUT: rehacer las cifras de viabilidad ya registradas por `PT-075`. Se vuelven a registrar cuando esto cierre, y `medido_en` deja constancia de contra qué se midió cada vez.

## 7. Firma

```
Firmado por lote: EP-017
```
