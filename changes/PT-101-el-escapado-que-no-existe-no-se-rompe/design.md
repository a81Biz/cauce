# Diseño — `PT-101`

## Las tres piezas

```
RULES.md                SUITE-R59, con RIGE_DESDE [12,0,0]
PHASES · FDGE-Prompts   la citan donde se escribe codigo
patrones.mjs            ROTURAS_DE_ESCAPADO   la cuenta, en un sitio
                        CAR · CLASE           caracteres y clases por codigo
                        comoLiteral           escapa un texto para buscarlo tal cual
                        comoPalabra           el patron de palabra suelta
audit.mjs               fragilesEn(txt)       EXPORTADA, comprobable
```

## `fragilesEn`, y las dos cosas que no marca

| No marca | Por qué |
|:---|:---|
| la barra **doble** | es correcta; marcarla convertiría el aviso en ruido |
| lo que está en un **comentario** | los tres primeros aciertos fueron comentarios **sobre este defecto** |

## Por qué `audit` se hizo importable

`fragilesEn` se **exporta**, y sin la guarda `EJECUTADO_DIRECTO` importar el módulo ejecutaba la
auditoría entera y salía con `process.exit`. Misma forma que `PT-097` aplicó a `verify-ptsa`, por
el mismo motivo: **una comprobación que solo se puede ejercer ejecutando la herramienta completa
acaba sin ejercerse.**

## Los tres defectos reales que encontró

| Dónde | Qué hacía |
|:---|:---|
| `patrones.mjs:1226` | **ningún helper se detectaba nunca** |
| `verify-fdge:680` | un campo de estado con sangría **no se detectaba** |
| `verify-fdge:685` | igual |

**Ninguno fallaba.** Devolvían vacío.
