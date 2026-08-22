# PT-099 — Trazabilidad `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | Un `BUG` que entra en validación queda `VALIDATION_PENDING` | `un BUG en la fase de validacion queda VALIDATION_PENDING` · `…ni un BUG en otra fase` | `salidas/inversa.txt` | VERIFICADO |
| AC-02 | El comando dice que el siguiente paso es humano | `avanzar lo dice en su salida` | `salidas/selftest-completo.txt` | VERIFICADO |
| AC-03 | `verify-fdge` reporta el que no pasó | `verify-fdge vigila la entrada a VALIDATION_PENDING` | `salidas/selftest-completo.txt` | VERIFICADO |
| AC-04 | Con `RIGE_DESDE`: los 51 no se juzgan hacia atrás | `la comprobacion declara desde cuando rige` | `salidas/selftest-completo.txt` | VERIFICADO |
| AC-05 | Un `FEATURE` no se detiene | `…y un FEATURE no se detiene` | `salidas/inversa.txt` | VERIFICADO |
| AC-06 | La batería falla sin el arreglo | la prueba inversa | `salidas/inversa.txt` | VERIFICADO |

## Cinco de los siete casos son frenos

```
«…y un FEATURE no se detiene»                    impide «detenerse siempre», que bloquearia el marco
«…ni un BUG en otra fase»                        impide que la transicion salte en cualquier avance
«un BUG ya validado no vuelve a VALIDATION_PENDING»  impide deshacer una firma humana de G3
«la ultima fase sigue dando DONE sin merge»      protege lo que L-1 dejo
«la fase se identifica por su nombre»            impide que renombrarla apague la transicion en silencio
```

**Un solo rojo válido**, y se dice: los de `estadoDeFase` no pueden estarlo porque la función no
existe. Misma declaración que `PT-096` y `PT-097`.

## `CasoQA` — sin interfaz (`SUITE-R11`).
