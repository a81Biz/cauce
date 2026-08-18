# PT-052 — Autorrevisión   `PHASE 6`

## Lo entregado

```
CHECKPOINT.json      uno, sobrescrito, TODOS los campos derivados
tracker checkpoint   PT-NNN [--ver] · corre SIN plataforma
LEX-R26              regla nueva: si no se deriva, no entra
verify-fdge          exige que el sha declarado sea ALCANZABLE
casos                563 → 579
```

## El `spec-changes` pasó de una fila a seis, y las cinco las pidió la ejecución

Declaré `LEXICON.md` y nada más. Lo que faltaba lo encontró el marco, no la lectura:

```
audit          «LEX-R26: no la cita ningun documento operativo»
audit          «CHECKPOINT.json: ningun instalador lo crea · ningun documento operativo lo usa»
verify-suite   «PHASES.md cita LEX-R26 que FDGE-Prompts.md no menciona»
```

**El tercero es la lección de `PT-023` aplicándose sola**: el texto copiable no puede decir menos
que la regla que cita. Aquel defecto tardó dos meses en verse porque nadie lo comprobaba; éste
saltó en la primera ejecución porque `verify-suite` sí lo comprueba.

`PT-023` midió que **nada comprueba** que una declaración de esta tabla se cumpla. Sigue siendo
cierto — pero el marco **sí** impide que un nombre nuevo quede huérfano, y eso cubrió el hueco
desde otro ángulo.

## Las tres decisiones, y por qué cada una

**1 · `LEX-R26` es una regla, no una descripción.** Un contrato de campos sin regla que lo sostenga
permite añadir un campo libre mañana con el documento siguiendo cierto. La regla dice lo único que
importa: **si no se deriva, no entra**.

Es la decisión 4 del firmante aplicada a un sitio donde no se había discutido. No era solo sobre el
presupuesto de sesión: es sobre cualquier campo de cualquier artefacto estructurado.

**2 · No se siembra en la instalación**, y `INSTALL.md` dice por qué: sin tarea no hay nada que
derivar, y un archivo con campos en blanco sería **una afirmación falsa con forma de dato**. Es la
misma razón por la que `SUITE-R32` no admite un `PTSA/` vacío — pero al revés: aquí lo correcto es
que **no exista** hasta que haya algo cierto que decir.

**3 · Corre sin plataforma**, como `estado`, y por una razón más fuerte. El momento en que más
falta hace un checkpoint es aquel en que puede no haber credencial: **retomar en una sesión
nueva**. Exigirle plataforma habría hecho que el estado dependiera de la red para poder escribirse
— justo cuando la red es lo que menos se puede dar por hecho.

## Dos casos míos nacieron mal, y los dos por la misma razón

```
«un sha real pasa»    el fixture NO es un repo git: sha sale null y la herramienta lo DICE
«con su fase: 4»      bloques anteriores mutan la fase de PT-004 en el fixture
```

El primero es `RULE-06` funcionando y yo esperando lo contrario. El segundo era **una aserción
sobre el orden de ejecución, no sobre el código**: pasaba o fallaba según qué bloque hubiera
corrido antes. Se resolvió llamando a `build_fixture` al entrar, como hacen los demás bloques.

## Una consecuencia de `PT-050` que su propia tarea no dijo

**`--solo` salta los casos pero no el setup entre ellos.** Una mutación que asume que el caso
anterior corrió revienta con un filtro puesto — y revienta ruidosamente, con un volcado de node.

Queda guardada (`cp_set` no hace nada si el archivo no está) y anotada en el código. Es el tipo de
límite que solo aparece cuando alguien **usa** la herramienta para algo distinto de aquello para lo
que la probó.

## Lo que NO da, y está declarado para que `EP-015` no lo herede como hecho

**`STATE_MISMATCH`.** Se comprueba que el commit **exista**, no que el árbol sea el suyo. Un
checkpoint puede declarar un SHA real y describir un árbol que ya no existe: eso es exactamente lo
que el lote siguiente tiene que resolver, y prometerlo aquí le habría dejado una casilla marcada en
vez de un punto de partida.

**Y que los campos basten para retomar.** Se comprueba que cada uno se derive de una fuente; que el
conjunto alcance para reanudar sin releer nada solo lo dirá `EP-015` intentándolo. Es un juicio, y
se declara antes de que parezca una verificación.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
