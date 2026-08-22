# Estrategia — `PT-109`

## La decisión

**A-1 · El aviso dice en qué se convierte. Las severidades no se tocan.**

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Igualar las severidades** | o se endurece cada revisión de paso hasta hacerla inútil, o se ablanda `G4` |
| **Correr siempre con `--gate G4`** | no es lo que la herramienta pide, y convierte cada revisión en una compuerta |
| **Arreglar «algo parecido» a los tres `INC` sin descripción** | inventar el defecto y su arreglo a la vez |

## Por qué el negativo es la mitad

Si la coletilla se pegara a **todas** las reglas, dejaría de significar nada — que es como un
aviso se vuelve ruido. Hay un caso que comprueba que una regla que **no** cambia de severidad
**no** la lleva.

## Termina cuando

Los cuatro avisos dicen su compuerta, `FPGE-R01` mira la fila, y los tres `INC` inaccesibles
quedan declarados con su motivo.
