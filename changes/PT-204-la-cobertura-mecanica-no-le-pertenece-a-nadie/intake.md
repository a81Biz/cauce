# `PT-204` — 124 de 244 reglas no las ejecuta nada, y `audit` lo dice en cada corrida

```yaml
---
id: PT-204
type: INVESTIGATION
severity: S2
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-30
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

```
$ node docs/methodology/tools/audit.mjs docs/methodology

  universo                        244     (RULES.md 191 · LEXICON.md 37 · EXECUTION-MODES.md 16)
  ejecutadas por una compuerta    142 / 244        · HARD 115 / 208
  citadas sin compuerta que las corra  11
  sin verificador                  91              (HARD 82)

  VERIFICADA  114     NO_VERIFICABLE  6     PENDIENTE  124
```

**Más de la mitad del marco no lo ejecuta nada.** Entre las 91 sin verificador:

```
EXEC-R05    «G3 es humana para todo BUG»   ← resuelta nueve veces en esta sesión
FDGE-R38    cada PT conserva su intake completo
SUITE-R41   cauce se instala sobre sí mismo
INTAKE-R01 · R02 · R03 · R05 · R07        la familia del intake, entera
EXEC-R01 · R06 · R09 · R10 · R11 · R12 · R13 · R14
```

**Y `audit` corre en cada `npm run verify`.** El dato existe, es correcto, y se publica en todas
las corridas desde hace lotes.

## 2. Por qué es defecto y no una cifra de progreso   `[HUMANO]`

`SUITE-R26` dice de esta cobertura que **«aspira, no exige»**. La cláusula es honesta —no toda
regla es mecanizable— **y es también la puerta**: convierte 124 incumplimientos potenciales en un
número que se publica y **no se cobra**.

Es `CE-007` a escala del marco entero: existe la herramienta, dice el número, y **el número no le
pertenece a nadie**. Ninguna regla obliga a que suba, ninguna compuerta la mira, y hoy **puede
bajar sin que nadie se entere**: añadir una regla `HARD` sin verificador no lo impide nada.

Lo dijo el firmante con la consecuencia delante:

> *«Ya se ha dicho en muchas épicas, no hay nada que te obligue a seguir el marco y aquí está la
> consecuencia»*

## 3. Lo que esta tarea NO es

**No es auditar las 244.** Descartado por el firmante y con motivo:

> *«no quiero revisar que todo tenga caso de uso e implementación en el instalador […] Llevamos ya
> muy adelantado el marco y regresar a revisar que esté es una regresión demasiado grande»*

Revisar hacia atrás sería `CE-014` a escala industrial, y su resultado —124 rojos sin salida— es la
compuerta siempre roja que enseña a saltársela.

**Y no es «subir la cifra».** Eso sería fijar el número de lo correcto (`HANDOFF -18`).

## 4. Qué NO entra   `OUT`

- Escribir verificadores para las 91. Eso sería el lote que esta tarea decide **si** hace falta.
- Retirar `SUITE-R26` ni su cláusula «aspira, no exige»: puede que siga siendo la correcta.
- Juzgar hacia atrás ninguna regla anterior a la comprobación (`CE-014`).

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | De las 91 sin verificador, cuántas son **mecanizables** y cuántas `NO_VERIFICABLE` de verdad, queda **medido y declarado** | `TS-01` |
| `AC-02` | Las reglas quedan **rankeadas por consecuencia**, no por número, con el criterio escrito | `TS-02` |
| `AC-03` | La cobertura **no puede bajar en silencio**: añadir una regla sin verificador se dice | `TS-03` |
| `AC-04` | Queda decidido **si hace falta un lote propio**, y con qué criterio de éxito | `TS-04` |

`AC-03` es el único que cambia comportamiento, y es el que impide que esta tarea sea un documento:
sin él, la cifra sigue sin dueño el día después.

## Cómo termina   `FDGE-R53`

> Termina cuando: la deuda de cobertura tiene tamaño, orden y dueño — o consta, firmado, que no
> merece uno.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-30
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la del lote. `G1` se pedirá al empezarla, con la cifra delante.

## 7. Origen   `FDGE-R55`

Parada de `EP-026` · motivo `hallazgo` · `changes/EP-026-lo-que-da-verde-sin-mirar/paradas/PT-204.md`
