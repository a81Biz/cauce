# PT-077 — Estrategia   `PHASE 3`

## La misma guarda, no una parecida

Se reusa `estadoDelArbol` con el **mismo contrato** que usa `siguiente`. Escribirla de nuevo aquí
habría producido dos criterios que divergen — que es lo que `SUITE-R38` prohíbe y lo que
`PT-066` y `PT-067` encontraron en `regla` y en `audit`.

**Y me pasó al escribirla.** Pasé la dependencia como funciones —`existe`, `rama`, `antecesor`—
cuando el contrato es `{sha, rama, descendiente}` con **valores**. Bloqueaba bien y el mensaje
imprimía el **código de la función** en lugar de la rama real:

```
rama   declarado rama-que-no-existe   real () => gitDe(['rev-parse', '--abbrev-ref', 'HEAD'])
```

Media compuerta: paraba, y no decía la verdad sobre por qué. Se copió la llamada que ya funciona.

## Dónde va, y por qué ahí

**Antes de escribir nada** y después de validar la fase destino. `avanzar` promete cinco actos o
ninguno; una guarda posterior al primer escrito rompería esa promesa.

## Sin checkpoint no se bloquea

`corresponde: null` —no hay foto— **no** es un `STATE_MISMATCH`. No tener foto no es tener una
mala, y bloquear ahí impediría la primera transición de cualquier tarea nueva.
