# Escenarios de prueba — `PT-101`

## En la batería — nueve casos

| Caso | Qué establece |
|:---|:---|
| la cuenta vive en un sitio | `SUITE-R38` |
| `SUITE-R59` la convierte en regla | la causa, no el síntoma |
| …citada donde se escribe código | quien trabaja en `MANUAL` la ve |
| …y no juzga lo escrito antes | `RIGE_DESDE` |
| `comoPalabra` casa la palabra suelta | el normalizador funciona |
| …y **NO** casa un trozo de otra palabra | **negativo** |
| `comoLiteral` busca el texto tal cual | idem |
| `audit` caza la construcción frágil | la detección |
| …y **NO** marca la barra doble | **negativo** · sin esto es ruido |
| …ni lo que solo aparece en un comentario | **negativo** · fueron los tres primeros aciertos |
| el árbol real no tiene ninguna | el estado |

## Lo que NO se prueba

- **Que no queden construcciones frágiles de otra forma.** Se detecta una firma concreta.
- **Que el normalizador se use.** Existe y tres herramientas lo usan; que el siguiente caso lo
  use no lo garantiza nada — lo mismo que `EP-007` dejó escrito sobre los comandos.
