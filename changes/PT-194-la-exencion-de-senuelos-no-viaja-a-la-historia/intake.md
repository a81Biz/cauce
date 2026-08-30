# `PT-194` — La declaracion cauce:senuelos exime el arbol y no el escaneo de historia

```yaml
---
id: PT-194
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: READY
phase: 5
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`PT-190` introdujo `cauce:senuelos` para declarar un archivo como fixture **valga donde valga**,
porque la heurística anterior dependía de que la palabra cayera en los primeros 4000 caracteres.

Al **commitear** `fb10d3de`, la contraseña sintética del fixture entró en la historia y
`verify:secretos --historial` la cazó: `FND-R29`, huella `397f02076a3e`. `npm run verify` bloqueó.

**La declaración exime el archivo en el árbol. El escaneo de historia mira los hunks añadidos, y ahí
no llega.**

## 2. Por qué es un defecto, y por qué su riesgo va al revés   `[HUMANO]`

`PT-190` escribió que la declaración debía valer «esté donde esté». Vale donde esté **dentro del
archivo** — no vale en el camino por el que el escáner mira la historia. La promesa y el alcance no
coinciden.

Y aquí el riesgo **no** es el falso positivo que lo motivó: es el contrario. **Ampliar mal una
exención de seguridad hace que un secreto real deje de bloquear.** Por eso esta tarea no se hizo de
paso al cerrar `EP-025`, aunque el síntoma apareciera allí.

## 3. Cómo se arregla, y cómo NO

**No** aplicando la exención del árbol a la historia sin más: un archivo que hoy se declara señuelo
eximiría todo lo que ese archivo tuvo **alguna vez**, incluida una credencial real borrada después.

**Y puede que la respuesta sea que NO debe valer.** La historia es inmutable y el mecanismo previsto
es firmar la huella (`SECRETOS-EXCEPCIONES.md`), que además **sigue mostrándola**. Si es así, lo que
falta no es una exención: es un **mensaje** que lo explique, en vez de un rojo que habla de
contraseñas cuando el hecho es otro. Decidirlo es el trabajo (`RULE-06`).

## 4. Lo que NO promete   `SUITE-R26`

No promete que ningún fixture vuelva a aparecer en la historia. `PT-193` ya cerró la causa de este
caso ensamblando los literales; esto es sobre **qué debe hacer el escáner** cuando ocurra.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | El comportamiento en historia queda **declarado**, valga o no la exención | `TS-01` |
| `AC-02` | Un secreto **real** en la historia sigue bloqueando, haya declaración o no | `TS-02` |
| `AC-03` | El mensaje dice **qué ocurre de verdad**, no «hay una contraseña» a secas | `TS-03` |

`AC-02` es el que impide arreglarlo en la dirección peligrosa.

## Cómo termina   `FDGE-R53`

> Termina cuando: el alcance de `cauce:senuelos` está escrito, y lo que el escáner hace con la
> historia es una decisión declarada y no un efecto de por dónde mira.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
