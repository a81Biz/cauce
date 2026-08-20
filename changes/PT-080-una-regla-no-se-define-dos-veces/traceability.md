# PT-080 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `verify-suite` **falla** si un ID se define dos veces | E1 | inversa: duplicada inyectada ⇒ error | `salidas/duplicadas.txt` | PENDIENTE |
| AC-02 | …y no falla con una sola | E2 | el repositorio en verde | `salidas/duplicadas.txt` | PENDIENTE |
| AC-03 | El mensaje dice **los dos sitios** | E3 | nombra ambos documentos | `salidas/duplicadas.txt` | PENDIENTE |
| AC-04 | Los tres casos reales quedan resueltos | E4 | `EXECUTION-MODES` de 17 a 14 definiciones | `salidas/duplicadas.txt` | PENDIENTE |
| AC-05 | La resolución **conserva la obligación fuerte** | E5 | «se serializan» y «`BLOCKED`» siguen en `RULES` | `salidas/duplicadas.txt` | PENDIENTE |
| AC-06 | La comprobación entra en la batería | E1..E5 | los casos de `definidasDosVeces` | `salidas/duplicadas.txt` | PENDIENTE |

## `AC-05` es el que impide arreglarlo mal

Quitar la copia es fácil. Quitarla **sin perder lo que sólo ella decía** es lo que hay que
comprobar — y aquí no había nada que rescatar: en los tres casos la copia era la **débil**, y lo
que faltaba estaba ya en `RULES.md`.

Si hubiera sido al revés, el arreglo habría sido mover la obligación antes de borrar.

## `AC-01` se comprobó en las dos direcciones

Con una duplicada inyectada en `EXECUTION-MODES`, `verify-suite` da `ERRORES (2)`. Al retirarla,
vuelve a `Sin errores de coherencia`. Sin la inversa, un detector desconectado pasaría `AC-02`.
