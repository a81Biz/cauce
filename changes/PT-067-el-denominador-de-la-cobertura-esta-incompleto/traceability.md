# PT-067 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El denominador incluye los tres documentos propietarios | E1 · E7 | `selftest.sh`: `reglasDelMarco` sobre los tres · el universo real suma 223 | `salidas/universo.txt` | - | PENDIENTE |
| AC-02 | El mapa de propietarios no se escribe dos veces | E1 · E2 | `selftest.sh`: la derivación vive en `patrones.mjs` y `audit` la consume | `salidas/universo.txt` | - | PENDIENTE |
| AC-03 | `selftest.sh` no cuenta como verificador | E5 | `selftest.sh`: una regla citada sólo por el arnés no cuenta | `salidas/verificadores.txt` | - | PENDIENTE |
| AC-04 | La cifra publicada cambia y se dice por qué | E8 | `selftest.sh`: el desglose deriva sus dos números | `salidas/audit-antes-despues.txt` | - | PENDIENTE |
| AC-05 | Ninguna regla se pierde por el camino | E7 | `selftest.sh`: la suma de las clases es exactamente el universo | `salidas/universo.txt` | - | PENDIENTE |

## Escenarios que no cuelgan de un `AC`, y por qué se prueban igual

| TS | Qué fija | Por qué |
|:---|:---|:---|
| E3 | una fila `PTSA-R*` no entra | Excluirlas es correcto —tienen su propio bloque— pero hasta hoy no se decía. Un `OUT` sin caso es una intención, no un límite |
| E4 | una mención en comentario no cuenta | Es el defecto medido: 20 reglas, entre ellas `FDGE-R17` |
| E6 | una cita en código real sí cuenta | El complemento de `E4`. Sin él, un criterio que no contara nada también pasaría `E4` |

## Nota sobre `AC-01`

El intake decía **222** y la medición dio **223**. La cifra del intake se escribió antes de
derivar el universo; la que manda es la medida. Queda dicho en vez de corregido en silencio:
el intake es lo que el PT dijo de sí mismo al empezar, y reescribirlo borraría que se midió mal.
