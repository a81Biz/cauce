# `PT-190` · `strategy.md` — `PHASE 3`

## La decisión, y la que se descartó

| Decisión | Alternativa descartada | Por qué |
|:---|:---|:---|
| Declaración **explícita** `cauce:senuelos`, válida en cualquier posición | ampliar la ventana a 8000 | Cualquier número es igual de arbitrario: sólo mueve el día en que vuelve a pasar |
| | buscar la palabra en **todo** el archivo | Eximiría a cualquiera que mencione «fixture» de pasada. Falla en la dirección **peligrosa** |
| **Mantener** la heurística de los 4000 | retirarla y exigir la declaración | Los destinos ya instalados dependen de ella: retirarla los deja en rojo sin haber tocado nada (`CE-014`) |
| Fijar el defecto con un caso que lo **ejecuta** | anotarlo en un comentario | Un límite escrito en prosa no falla cuando alguien lo cruza |

## Por qué esto es universal y no local

El arreglo viaja dentro del paquete. Un destino que actualice hereda la declaración explícita sin
declarar nada, y **sigue funcionando igual** si nunca la usa. No hay migración que escribir porque
no hay obligación nueva: es capacidad.
