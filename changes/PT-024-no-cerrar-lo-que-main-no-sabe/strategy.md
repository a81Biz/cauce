# PT-024 — Estrategia   `PHASE 3`

| Camino | Por qué |
|:---|:---|
| Que `SUITE-R35` tolere «vivo con issue cerrado» | Ciega al detector. La divergencia es real y la única que distingue un tablero al día de uno inventado |
| Que la CI de `main` no corra el espejo | Apaga la compuerta donde más importa: `main` es lo publicable |
| Apuntar `INTEGRATED` antes de mergear | Ayuda, pero por sí solo no impide repetir el error: nada comprueba el orden |
| **Que `cerrar` se niegue a adelantarse** | La herramienta que provoca el daño es la que lo impide, y dice qué hacer antes |

## Lo que se hace

`cerrablesSinAdelantarse(muertas, enPrincipal)`, pura y exportada. `cerrar()` lee el registro de
la rama por defecto con `git show origin/<rama>:docs/implementation/REGISTRY.json` —del clon
local, sin red, sin cambiar de rama— y no cierra lo que allí siga vivo.

**No saber no es permiso.** Si el registro de la principal no se puede leer —clon superficial,
`origin` ausente, rama sin traer— no se cierra nada y se dice por qué. Un fallo mudo aquí
volvería a romper la integración, que es justo lo que esta tarea existe para impedir.

## Y el mensaje del espejo

`SUITE-R35` decía dos lecturas posibles; ahora dice tres, y nombra esta. La divergencia que me
salió nueve veces no estaba entre las dos que el mensaje ofrecía: quien la lea después de un
merge tiene que reconocerla sin reconstruirla.
