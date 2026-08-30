# `PT-204` · `strategy.md`

## La decisión, que es el entregable

**Sí hace falta un lote, y no es el que parecía.** No «verificar las 91», sino **`EP-029` sobre las
`FDGE` + `EXEC` + `INTAKE` = 38**, que son las que un trabajo real pisa todos los días.

Y **antes de eso, aquí y ahora**: que la cobertura **no pueda bajar en silencio**.

## Por qué ése es el corte, y no otro

| Corte | Cuántas | Por qué no / por qué sí |
|:---|---:|:---|
| Las 91 | 91 | La regresión que el firmante descartó, y 124 rojos sin salida |
| Sólo las `HARD` | 63 | Mejor, pero mezcla `QA`/`FIDE`/`FPGE`, que aquí no se ejecutan |
| **`FDGE` + `EXEC` + `INTAKE`** | **38** | **Las que gobiernan cada sesión, y cuyo incumplimiento se paga aquí mismo** |

**El criterio no es la severidad: es la frecuencia con la que un trabajo real pasa por delante.**
Una regla `HARD` de `FIDE` —que se ejecuta al incubar un proyecto, una vez— no cuesta lo mismo que
una `HARD` de `FDGE`, que gobierna cada tarea de cada lote.

Y hay evidencia de esta misma épica: **cinco lecciones nuevas en el `HANDOFF`** —`-30` a `-34`— y
las cinco son de reglas `FDGE`/`SUITE` que existían y que incumplí porque nada las ejecutaba.

## Lo que se hace **en esta tarea**, y es poco a propósito

**`AC-03`: la cobertura no baja en silencio.** `audit` publica la cifra; lo que falta es que
**comparar con la anterior no dependa de que alguien se acuerde**. Se registra el último valor
conocido y **una bajada se dice**.

No es una compuerta: **es un aviso con dirección**. Bloquear obligaría a verificar antes de poder
añadir una regla, y eso es exactamente la regresión descartada.

## Lo que NO se hace, y es la mayor parte

- **No se escribe ningún verificador.** Eso es `EP-029`, si el firmante lo admite.
- **No se declara `NO_VERIFICABLE` ninguna regla.** Son **6 de 244** hoy, y cada declaración lleva
  motivo y firma (`SUITE-R26`): decidir por 118 sería inventar 118 juicios.
- **No se retira `SUITE-R26` ni su «aspira, no exige»**. Puede que siga siendo la correcta: lo que
  esta tarea dice es que **su puerta se ve** y cuánto pasa por ella.
- **No se juzga hacia atrás** ninguna regla anterior a su comprobación (`CE-014`).

## El riesgo, y cómo se acota

El riesgo es **producir un documento y nada más** — que es exactamente el defecto que la tarea
denuncia: decirlo en una épica más y que no le toque a nadie. Por eso `AC-03` es el único que
cambia comportamiento, y por eso su caso es obligatorio: **sin él, `PT-204` sería una `INVESTIGATION`
que documenta que nadie hace nada, sin hacer nada.**
