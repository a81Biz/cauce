# PT-078 — Estrategia   `PHASE 3`

## Qué cuenta como «verificada»

**Que una herramienta la EMITA**: `fail`, `warn` u `ok` con el ID. No que la mencione.

`PT-067` ya midió el coste de la alternativa: contar menciones daba **24 falsos positivos**,
incluida `FDGE-R17` — declarada *no comprobable* en `TD-16` y publicada como cubierta.

Y `selftest.sh` **no cuenta**: el arnés prueba las herramientas, no lo ejecuta ninguna compuerta.

## `NO_VERIFICABLE` es una decisión, y por eso lleva firma

No es una constatación técnica: es alguien afirmando que ninguna máquina puede comprobar esa
regla. Meter aquí algo verificable **es esconder trabajo detrás de una firma**, y por eso:

- cada fila necesita **motivo** — una celda vacía no cuenta, como en el `LAYOUT` (`FND-R22`);
- las declaraciones que **sobran** se señalan, porque si una regla emitida figura como no
  verificable, o la declaración está vieja o alguien se equivocó.

## Por qué no escribir los 125 verificadores

El intake lo dice y conviene repetirlo: **no** es el trabajo de esta tarea. Escribirlos sería un
lote entero, y hacerlo sin este mecanismo dejaría el mismo agujero: la 126 podría entrar sin que
nada lo notara.

Lo que esta tarea entrega es que **la cifra exista, cuadre y se publique**.
