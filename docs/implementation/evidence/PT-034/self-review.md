# PT-034 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`cauce start`: el estado del tablero y **después** el núcleo, en ese orden.

```
selftest    349 → 359 casos
cobertura   98/176 reglas
```

## Por qué hicieron falta tres intentos

```
SUITE-R48  la respuesta es consultable   → un comando no puede exigir haber sido llamado
SUITE-R49  la consulta va lo primero     → una convención se puede ignorar
SUITE-R50  arrancar ES consultar         → no existe el paso que saltarse
```

Escribí las dos primeras limitaciones **en sus propias self-reviews, antes de que nadie me las
señalara**, y aun así entregué las dos reglas. Eso dice algo que prefiero dejar escrito: ver el
hueco no es lo mismo que cerrarlo, y llamar «hecho» a lo que solo está nombrado es cómo se
acumulan tres versiones para un problema.

## Lo que sigue sin cerrarse

**Quien no ejecute `cauce start` no ve nada.** Esto no impide arrancar de otra forma; hace que la
correcta sea la que el paquete ofrece, documenta y pone primera en la ayuda. La diferencia real
con las dos anteriores es que **el orden está en el código** y no en un texto que alguien deba
respetar — pero no es un candado, y llamarlo candado sería mentir.

## Los dos casos que más me importan son los que comprueban lo que NO hace

`E8` verifica que el bloque de `start` no contenga `--aplicar` ni resuelva un gate. `E9`, que el
núcleo siga siendo lo obligatorio. Un arranque que automatizara una compuerta o sustituyera a
`CORE.md` sería **peor que no tenerlo**: convertiría el punto de entrada en un sitio donde
saltarse cosas, que es lo contrario de para lo que existe.

## Lo que un revisor debería atacar

**1 · `E8` es un `grep` sobre un rango de líneas.** Si alguien reordena el archivo, el `sed` deja
de acotar el bloque y el caso pasaría por la razón equivocada. Es la fragilidad que ya señalé en
`PT-033` y la repito porque sigue ahí.

**2 · Los códigos 2 y 3 se tratan como `SIN EVALUAR`, no como fallo.** Es deliberado —callarlos
los convertiría en «no hay nada abierto»— pero significa que `cauce start` **sale 0 sin haber
mostrado ningún estado**. Un revisor podría pedir que saliera distinto; no lo hice porque el
arranque no debe fallar por no tener plataforma.

**3 · No he probado `cauce start` desde el paquete instalado**, solo desde el repositorio. La
resolución de `SUITE_EN_DESTINO` es la misma que usa `verify`, así que debería valer — pero
«debería» no es evidencia y por eso lo escribo.

## Lo que NO he verificado

Si esto cambia mi comportamiento. Tercera vez que lo digo en tres tareas. La respuesta la dará
la próxima sesión, no yo.

SELF_REVIEW_COMPLETE
