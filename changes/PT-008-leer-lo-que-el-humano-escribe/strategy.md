# PT-008 — Estrategia   `PHASE 3`

## Objetivo

Que lo que una persona escribe en un issue no pueda quedar sin leer, y que eso lo diga una
compuerta y no la buena voluntad del agente.

## Solución

**`SUITE-R43`**, regla nueva condicionada a plataforma declarada: si el issue de un PT tiene un
comentario **sin marca de procedencia** más nuevo que el último **con marca**, el PT no avanza.

La marca es un comentario HTML invisible al renderizar, al final de lo que escribe el agente.
`tracker` gana `pendiente PT-NNN`, de solo lectura, con los códigos de siempre.

## Alternativas evaluadas

**A · Distinguir por autor.** Es lo que decía el intake. **Imposible**, medido: el agente usa la
credencial de la persona y los dos comentarios llevan el mismo login. Exigiría una cuenta de
máquina — infraestructura que el marco no debe imponer a un equipo de una persona
(`SUITE-R22`).

**B · Exigir que el agente responda a cada comentario citándolo.** **Rechazada:** obliga a
interpretar contenido, y una respuesta generada para satisfacer un contador es el falso verde
que este marco persigue.

**C · Bloquear solo en `G3`/`G4`.** **Rechazada:** un comentario escrito en `PHASE 2` que nadie
lee hasta `G3` ya perdió su ocasión. La gracia es que se lea **cuando se escribe**.

## Lo que esta compuerta no puede

Que la respuesta sea buena, ni que el agente haya entendido. Comprueba que exista una nota
posterior. Es falsificable, como una firma, y se declara en la regla igual que `SUITE-R27`
declara qué prueba una firma.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Mitigación |
|:---|:---|:---|
| Los comentarios ya escritos no llevan marca | **Alto si no se trata** | Sin ningún comentario marcado, `SIN EVALUAR`. Se cura sola al escribir el primero |
| Un proyecto sin plataforma | Ninguno | Condicionada |
| Sin acceso | Ninguno | `SIN EVALUAR`, como el resto |
| Los 234 casos | Bajo | Batería completa |
