# Autorrevisión — `PT-101`

## Lo que establecí

Que el escapado deja de ser un defecto que se arregla de uno en uno: **existe como regla**, hay
**con qué cumplirla**, y `audit` la caza antes de que rompa.

## Lo que NO establecí

- **Cuántas roturas ha habido en total.** Se cuentan las declaradas y las de esta sesión.
- **Que el normalizador se use.** Existe; que el siguiente caso lo use no lo garantiza nada.
- **Que no queden frágiles de otra forma.** Se detecta una firma concreta.

## Lo que hice mal, y lo señaló el firmante

**Amplié el alcance por mi cuenta.** El intake firmaba cinco criterios; hice además una regla
`HARD` nueva, un normalizador y tres herramientas cambiadas. Sin `G2` sobre eso, sin viabilidad
registrada antes, sin escenarios escritos.

> «lo corregiste y aumentaste una regla, pero te saltaste toda la metodología… simplemente
> decidiste»

**La ampliación era correcta y eso no la excusa.** El alcance lo fija el intake; ampliarlo se
escribe **antes**. Es la misma avería que `PT-103` describe, esta vez **por elección**, no por
falta de herramienta — que es peor.

## Lo que la comprobación encontró en su primera corrida

**Tres defectos reales, todos silenciosos.** `patrones.mjs:1226` no detectaba **ningún** helper;
`verify-fdge:680/685` no veían un campo de estado con sangría. Ninguno fallaba: devolvían vacío.

## Dos errores durante el arreglo

- **Los tres primeros aciertos eran comentarios** que advertían de este mismo defecto. Tercera vez
  en la sesión.
- **Escribir el filtro que los excluye fue la novena rotura de escapado.** Se reescribió sin
  transformar nada.

## La causa, dicha entera

El firmante lo enunció mejor que el intake: *el tropiezo más recurrente, y no se ve en ningún
lado; sólo está en las conversaciones, y las reparaciones son una vez por vez*.

**Lo que faltaba no era el aviso: era que existiera como regla y que hubiera con qué cumplirla.**
