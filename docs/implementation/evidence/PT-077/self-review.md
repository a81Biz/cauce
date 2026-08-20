# PT-077 — Autorrevisión   `PHASE 6`
## Qué se arregló

**La transicion mira lo que la consulta bloquea.**

La guarda existia UNA sola vez, en la consulta. «tracker siguiente» bloqueaba y «tracker avanzar» hacia la transicion igual.

## La decisión que lo define

Es PT-075 con una vuelta mas: aqui el verificador EXISTIA y estaba en el sitio equivocado. Una compuerta que solo vigila el camino que nadie usa no vigila.

## Lo que aprendí escribiéndolo

Pase las dependencias como funciones cuando el contrato quiere valores: el mensaje imprimia el CODIGO de la funcion en lugar de la rama. Bloqueaba bien y explicaba mal — media compuerta.
