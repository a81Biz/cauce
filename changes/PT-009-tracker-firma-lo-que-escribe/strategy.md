# PT-009 — Estrategia   `PHASE 3`

## Solución

El mensaje de cierre se compone en una **función pura exportada**, `mensajeDeCierre(alloc)`, y
lleva la marca. Pura y exportada por lo de siempre: es lo que permite que un caso lo compruebe
sin plataforma.

## Alternativa evaluada

**Pegar la marca en la llamada, sin extraer función.** Una línea menos. **Rechazada:** no habría
forma de comprobarlo sin hablar con GitHub, y el defecto existe precisamente porque nadie
comprobaba lo que la herramienta escribía.

## Regresión

| Qué | Riesgo | Mitigación |
|:---|:---|:---|
| Un comentario ajeno deja de bloquear | **Alto si ocurre** | El caso que ya existe —`humano tras el agente ⇒ pendiente`— no cambia |
| Los 241 casos | Bajo | Batería completa |

## Criterios de éxito

Los cuatro `AC`. El que manda es `AC-03`: la regla conserva su texto.
