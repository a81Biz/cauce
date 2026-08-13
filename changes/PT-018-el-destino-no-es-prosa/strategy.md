# PT-018 — Estrategia   `PHASE 3`

## La gramática

```
—                    la fila no aplaza: declara lo que simplemente no entra
`PT-NNN` / `EP-NNN`  la fila aplaza, y ese identificador lo sostiene
cualquier otra cosa  ERROR — no se adivina qué quiso decir
```

**Desaparece `RE_APLAZA`.** No hay lista de palabras porque no hay prosa que clasificar.

## La reciprocidad, que cierra el segundo agujero

Citar no basta: el citado tiene que **reconocer** de dónde viene.

| El destino cita… | Vale si… |
|:---|:---|
| un hermano del mismo lote, no terminal | se está haciendo ahora: no está aplazado |
| una allocation `DEFERRED` | su `origin` menciona el PT de origen |
| cualquier otra cosa | **no vale** |

Así, `PT-012` citando `PT-013` habría fallado: `PT-013` no era `DEFERRED` y su `origin` no
mencionaba a `PT-012`.

## Lo que cuesta, y no lo escondo

Las filas existentes que dicen «Deuda declarada» o «Cierre de `EP-001`» **pasan a fallar**. Son
pocas y son reales: o aplazan algo y hay que asignarlo, o no aplazan y su destino es `—`.
Arreglarlas entra en esta tarea.

Y para proyectos destino ya instalados es un cambio de formato: se declara en el `CHANGELOG`
con qué hacer.

## Alternativa evaluada

**Ampliar la lista de palabras.** Es lo que haría un parche. **Rechazada:** cada redacción nueva
volvería a escaparse, y la lista crecería sin llegar nunca a cerrar. Es cambiar un detector malo
por uno menos malo, cuando el problema es que exista un detector.
