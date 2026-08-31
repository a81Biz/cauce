# `PT-202` — publicar.yml viaja al proyecto destino, donde npm publish no aplica

```yaml
---
id: PT-202
type: BUG
severity: S3
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

Lo señaló el firmante:

> *«el sello de la batería… incluso, éste tiene publicar, que es para npm pero al bajarlo en otro
> proyecto también busca publicar y eso no lo hacen todos»*

`.github/workflows/publicar.yml` **viaja dentro del paquete**, igual que `tools/`. Lo que hace
—`npm publish` de `@a81biz/cauce`— **sólo tiene sentido en el repositorio fuente**.

## 2. Por qué es un defecto   `[HUMANO]`

Un proyecto que instale cauce hereda un workflow que no le sirve, que nombra un paquete que no es
suyo, y que aparece en su pestaña de *Actions* como si fuera parte de su proceso.

De dónde sale la confusión: `SUITE-R41` dice que cauce se instala **sobre sí mismo**. En este
repositorio `publicar.yml` es legítimo, y **es el mismo archivo** que llega a los demás.

**El corolario es más amplio que un archivo:** la instalación no declara qué parte del marco es para
el **destino** y qué parte es sólo para la **fuente**. `publicar.yml` es el caso que lo hizo visible.

## 3. Cómo se arregla, y cómo NO

**No** borrándolo: aquí hace falta.

Candidatos, y la tarea elige: excluirlo del paquete, hacerlo condicional al repositorio, o
declararlo plantilla que el destino adapta. **`verificacion.yml` sí tiene sentido en el destino**, así
que no se trata igual y no se toca de paso.

## 4. Lo que NO promete   `SUITE-R26`

No resuelve el reparto fuente/destino para todo el marco: sólo lo **nombra** y arregla su caso.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Una instalación limpia **no** recibe un workflow que publique un paquete ajeno | `TS-01` |
| `AC-02` | Este repositorio **sigue** pudiendo publicar | `TS-02` |
| `AC-03` | Lo que es de la fuente y lo que es del destino queda **declarado** | `TS-03` |

`AC-02` es el que impide arreglarlo rompiendo la publicación.

## Cómo termina   `FDGE-R53`

> Termina cuando: instalar cauce no trae nada que sólo sirva a quien lo produce, y esa frontera está
> escrita en vez de deducirse.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
