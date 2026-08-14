# PT-041 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`cauce regla SUITE-R44` responde qué exige, en qué documento vive y qué herramientas la
comprueban. **Deducir deja de ser el camino.**

## La frase que esto corrige era mía

El manual decía que de las diez ideas «se deduce la regla que no has leído». Lo escribí yo el
mismo día, y tú señalaste que era una excusa. Lo era: **un marco no escala pidiendo que se
infiera lo que no se ha leído**, y menos con 179 reglas.

Las diez ideas siguen ahí y ahora son lo que deben ser —contexto— en vez de una muleta.

## El defecto que apareció al enchufarlo

`cauce regla SUITE-R46` falló: `DESTINO` tomaba `SUITE-R46` como ruta del proyecto. **Es el mismo
defecto que apareció horas antes en `tracker` con `siguiente EP-011`** — un argumento con forma
de identificador colándose como ruta, en dos binarios distintos.

Dos sitios, misma causa, el mismo día. Está anotado en el código para que el tercero se vea
antes de que ocurra.

## Lo que un revisor debería atacar

**1 · `AC-02` es más débil de lo que suena.** El mensaje de fallo sigue diciendo solo el ID; lo
que cambia es que ese ID **se puede consultar**. «Llevar a la regla» y «poder preguntarla» no son
lo mismo, y quien exija lo primero tiene razón en que esto es el mínimo.

**2 · Lee la fila de la tabla y la desenvuelve.** Si alguien reformatea `RULES.md`, la salida se
degrada — probablemente a texto raro, no a silencio, que es el lado bueno.

**3 · El mapa de documento propietario está duplicado** con el de `verify-suite`. Lo escribí para
no importar el verificador entero, y es exactamente la copia que `SUITE-R38` avisa. Si divergen,
`regla` buscará donde no es. No lo he cerrado.

SELF_REVIEW_COMPLETE
