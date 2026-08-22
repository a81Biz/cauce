# Estrategia — `PT-111`

## La decisión

**A-1 · Se compara el título derivado. El cuerpo entero no.**

Un issue lleva **comentarios y ediciones humanas legítimas**. Compararlo carácter a carácter
marcaría cada conversación como divergencia, y un informe que siempre diverge deja de mirarse.

El **título** sí es enteramente derivado: `id · slug`. Si difiere, alguien lo editó a mano o el
registro cambió — y en los dos casos hay que saberlo.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Comparar el cuerpo entero** | los comentarios son legítimos: sería ruido permanente |
| **Que el espejo lo corrija** | `abrir --aplicar` ya lo hace; consultar el estado no puede modificar el tablero |
| **Avisar solo en `G4`** | la divergencia importa **mientras** se trabaja, no al final |

## Termina cuando

El espejo reporta un título divergente, no marca el correcto, y dice con qué comando se corrige.
