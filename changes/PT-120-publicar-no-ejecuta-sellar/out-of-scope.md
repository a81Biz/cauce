# Fuera de alcance — `PT-120`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| **`AC-04`** — «`sellar` deja de derivar el tag anterior del `CHANGELOG`» | **Decae**: `sellar` **ya** leía los tags reales con `--sort=-v:refname`. El criterio se escribió contra un defecto que no existe, y `R-1` lo reformuló contra otro que tampoco. Consta en `R-2` | `PT-134` |
| Que nada compruebe que una corrección alcanzada en unos documentos no siga viva en otro | **Medido**: el dato del tag se retractó en `PT-121`, `PT-122` y el intake de `EP-020`, y **sobrevivió aquí**. No lo cubre ningún `AC` de esta tarea, y meterlo mezclaría dos defectos en un arreglo | — |
| Bloquear por el grafo en `--gate` | `graphify-out/` está en `.gitignore` y en CI sale `MISSING`. Bloquear por algo **no evaluable** es convertir «no lo sé» en «no pasas», tan falso como convertirlo en verde (`RULE-06`) | — |
| Exigir los pasos 7 y 8 del sello | Son humanos (`SUITE-R06a`). Una compuerta no puede pedir lo que sólo una persona puede hacer | — |
| Que la guía de migración **sirva** | Nombrar la regla es el mínimo comprobable; que la instrucción sea útil lo lee una persona (`SUITE-R26`) | — |
| Crear los tags que faltan | Acto humano (`SUITE-R06a`) | `PT-121` |
| Republicar la `12.0.0` | No se puede, y se dice | — |

## Por qué `AC-04` no se marca cumplido

`sellar` hacía exactamente lo que `AC-04` pedía **antes de que existiera `AC-04`**. Marcarlo verde
sería cierto de hecho y falso de sentido: diría que esta tarea arregló algo que nunca estuvo roto,
y borraría de la evidencia que **el error original fue mío y sobrevivió a su propia corrección**.

Eso es lo único que hace medible la clase, y es el objeto de `EP-020`.
