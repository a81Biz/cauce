# PT-010 — Estrategia   `PHASE 3`

## La decisión de rama, que era lo que quedaba abierto

**El enlace apunta a la rama por defecto**, derivada del remoto.

| Opción | A favor | En contra |
|:---|:---|:---|
| Rama de trabajo | El contenido está ahí **ya** | La rama muere tras el merge en casi todos los proyectos, y el issue queda con un enlace muerto para siempre |
| **Rama por defecto** | El issue sobrevive al ciclo entero | Hasta que el merge ocurre, el enlace da 404 |

Gana la segunda: un issue es un artefacto **largo**, y una rama es corta. Un enlace que
funciona hoy y muere en una semana es peor que uno que empieza a funcionar en una semana y no
muere nunca — sobre todo cuando lo que se consulta suele consultarse después.

El cuerpo lo dice, para que un 404 antes del merge no parezca un error.

## El resto

`cuerpoDeIssue(alloc, opciones)` pura y exportada. Distingue lote de tarea; un `EP` enumera sus
tareas con enlace a su issue, que es lo que responde «de qué va esto» sin salir de GitHub.

Y `abrir --aplicar` sincroniza también **el cuerpo** de los issues abiertos, no solo las
etiquetas. Sin eso el arreglo no alcanzaría a los que ya existen — incluidos los de este mismo
lote, que nacieron con el cuerpo defectuoso.

## Si no se puede derivar la URL

`RULE-06`: se escribe la ruta **sin enlace** y se dice por qué. No se inventa una URL.

## Alternativas evaluadas

**A · Copiar el intake al cuerpo.** **Rechazada:** `SUITE-R35` lo prohíbe y el diagnóstico se
aceptó el 2026-08-13. Dos copias divergen.

**B · Enlace a un commit fijo.** Sobrevive a todo. **Rechazada:** apunta a una versión
congelada del intake, y el intake se revisa —`SUITE-R09`, append-only—. El lector querría la
última.

**C · Dejar el enlace relativo y explicar la ruta.** **Rechazada:** es lo que hay hoy, y lo que
provocó «no hay nada de la EP-002».

## Regresión

| Qué | Riesgo | Mitigación |
|:---|:---|:---|
| Sobrescribir el cuerpo de un issue con trabajo dentro | Medio | El cuerpo nunca llevó nada escrito a mano: lo genera `abrir`. Se sincroniza solo lo que está abierto |
| Proyectos sin plataforma | Ninguno | Todo detrás de `tracker.plataforma` |
| Los 244 casos | Bajo | Batería completa |
