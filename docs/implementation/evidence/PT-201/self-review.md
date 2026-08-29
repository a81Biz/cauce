# `PT-201` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Cuatro casos ejecutables en `selftest §EP-026`.
- **Ningún veredicto cambia.** Nada pasa de verde a rojo ni al revés: lo que cambia es que el verde
  **deja de afirmar más de lo que sabe**. Ésa es la afirmación entera de la tarea.
- **El caso del árbol LIMPIO es el que sostiene el criterio.** `AC-02` lo satisface un aviso que
  aparezca siempre — y un aviso permanente no informa de nada: sería la misma avería con otra forma.
  Es el argumento de `SECRETOS-EXCEPCIONES.md`, *«una compuerta siempre roja enseña a saltársela»*.
- **La regla lo declara, no sólo la herramienta.** Una conducta que vive únicamente en el código no
  la puede consultar quien lee el marco (`LEX-R22`), así que `SUITE-R62` lleva su segundo límite por
  escrito y hay un caso que lo comprueba con `regla.mjs`.

## Una atribución equivocada, corregida y declarada

El intake decía que la regla incumplida era **`SUITE-R01`**. **No lo es.** `SUITE-R01` es *Evidence
Before Action* y está declarada **no verificable**; la que comprueba que «lo que se ejecuta en local
es lo que ejecuta CI» es **`SUITE-R62`**.

El error salió de `CLAUDE.md`, que cita `SUITE-R01` en su sección de verificación. Se corrigió en
`PHASE 2`, **antes** de escribir una línea de código, y consta en `intake.md §4b` y `discovery.md §4`
en vez de reescribirse en silencio.

Y al leer `SUITE-R62` de verdad apareció algo que mejora el resultado: **ya declara un límite** —que
se comparan **nombres de script**, no lo que cada paso hace—. El que faltaba es el **opuesto**: el
mismo paso, haciendo exactamente lo mismo, mide un objeto que en local todavía no existe. Decirlo
así es más preciso que lo que el intake proponía.

## Lo que NO promete, y es el núcleo   `SUITE-R26`

**No promete que el verde local pase a predecir la CI. No puede.** El ref durable de `SUITE-R51` no
existe hasta el `push`, y ninguna herramienta local puede inventarlo.

Promete que se sepa **cuándo no lo predice**. Es exactamente lo que `RULE-06` pide: lo que no se
sabe, se dice.

## Lo que queda sin cubrir, y consta

- **Las once comprobaciones, una por una.** El inventario de `discovery.md §3` es una **aproximación
  medida** —asocia cada uso de `git log`/`rev-parse` o del adaptador con la primera regla citada
  después—. Establece el **orden de magnitud**, no la lista definitiva. Auditarlas una a una es otro
  trabajo, y se dice en vez de presentar la cifra como exacta.
- **`SUITE-R51` sin caso propio.** Su hecho sólo existe tras el `push`; reproducirlo exigiría
  publicar. Se declara.
- **El aviso se añadió a `SUITE-R34`**, que es donde se midió el daño tres veces. Las otras diez
  comprobaciones **no** lo llevan todavía: lo que este arreglo garantiza para ellas es que la regla
  lo **declara**, no que cada una lo diga. Es una limitación real y no se disfraza.

## Convenciones

`11-Conventions.md` — sin `debug`, sin restos. `CORE.md` regenerado tras tocar `RULES.md`
(`SUITE-R15`): 267 reglas.

## Sin bloqueadores
