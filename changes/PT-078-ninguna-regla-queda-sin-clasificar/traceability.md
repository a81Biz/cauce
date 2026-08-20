# PT-078 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Las tres casillas son exhaustivas | E1 | la suma es exactamente el universo | `salidas/clasificacion.txt` | PENDIENTE |
| AC-02 | «Verificada» es **emitir**, no mencionar | E2 | un ID en un comentario no cuenta | `salidas/clasificacion.txt` | PENDIENTE |
| AC-03 | El arnés no cuenta como verificador | E3 | `selftest.sh` excluido | `salidas/clasificacion.txt` | PENDIENTE |
| AC-04 | `NO_VERIFICABLE` exige motivo | E4 | una fila sin motivo no resuelve | `salidas/clasificacion.txt` | PENDIENTE |
| AC-05 | Las declaraciones que sobran se señalan | E5 | una regla emitida y declarada aparece en `sobran` | `salidas/clasificacion.txt` | PENDIENTE |
| AC-06 | La cifra se publica en `audit` | E1 | las tres casillas y su suma | `salidas/clasificacion.txt` | PENDIENTE |

## `AC-05` se validó solo, contra mí

En su primera ejecución señaló **cuatro** de mis nueve declaraciones. Tenía razón contra mi propio
texto: yo había escrito que la parte comprobable de `SUITE-R27` «ya se comprueba» y aun así la
declaré no verificable.

Sin `AC-05`, `NO-VERIFICABLES.md` sería el sitio donde la deuda se aparca detrás de una firma.

## `AC-01` es el criterio, no la cifra

Que sean 94, 5 y 125 hoy da igual: mañana serán otras. Lo que no puede cambiar es que **sumen el
universo**. Una cuarta casilla silenciosa es el defecto; el reparto es una foto.
