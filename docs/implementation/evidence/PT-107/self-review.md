# Autorrevisión — `PT-107`

## Lo que establecí

Que dos comandos que escriben el registro a la vez **no pueden perder una allocation en
silencio**: o entran las dos, o una se detiene diciendo qué pasó y qué hacer.

## Lo que NO establecí

- **Que la carrera no ocurra.** No se arregla la carrera: se arregla el **silencio**.
- **Si `CHECKPOINT.json` y `SESSION.json` tienen el mismo patrón.** Se escriben igual. Declarados
  y sin medir.
- **Cuántas veces pasó antes.** Una pérdida silenciosa no deja rastro. Contra `HEAD` no hay
  ninguna, pero eso solo cubre esta sesión.

## Lo que pasó, sin adornos

**Perdí una allocation entera.** `PT-106` estaba asignada, trabajada y documentada, y desapareció
del registro porque lancé `asignar` mientras `abrir --aplicar` corría en segundo plano.

**La culpa de lanzarlos a la vez es mía.** El defecto no: una herramienta que pierde un dato en
silencio cuando se la usa de una forma que nada prohíbe tiene un defecto.

**Y lo hizo visible la casualidad.** El contador retrocedido lo vi al leer el estado por otro
motivo. Si no llego a mirar, `PT-106` habría seguido con sus archivos en `changes/` y **sin
allocation**, y `verify-fdge` habría fallado mucho después con un mensaje que no apunta a la
causa.

## Lo que el caso me enseñó, y es lo importante

**Mi primer arreglo era insuficiente.** Comparar el archivo con lo leído **estrecha la ventana
pero no la cierra**: leer-comparar-escribir no es atómico, así que si los dos procesos releen
antes de que ninguno haya escrito, los dos pasan y el último pisa.

**El caso salía bien a mano y fallaba en la batería.** Lo primero que hice fue sospechar del caso
—creyendo que descartaba `stdout`, que era cierto y **no era la causa**—. Medirlo diez veces
seguidas fue lo que enseñó que el código era el que estaba mal.

**Un caso intermitente no es ruido: es la única prueba de que un arreglo tapa el síntoma.**

Y hay un segundo error mío ahí: la primera versión del caso aceptaba «entran las dos **o** una
falla diciéndolo» para no depender del reloj. Eso **tapaba el defecto** — con solo la comparación,
«entran las dos» también ocurría **por la carrera que se quería cazar**. Con el cerrojo el
desenlace es uno solo y el caso lo exige.

## Por qué es la única `S0` del lote

Las demás tareas producen un **verde falso**: una comprobación que no ve algo. Esta **borra un
dato**, y además recicla el identificador — rompiendo `LEX-R04`, que exige que nunca se reutilice.

## Lo que salió mal al arreglarlo

**La función llevaba `export` y quedó dentro del bloque que solo corre como comando**, donde
`export` no es válido. El sitio era el correcto —quien importa el módulo no escribe el registro—;
el error fue la palabra.
