# `PT-133` — Autorrevisión   `PHASE 6`

## Qué estaba mal

`tracker parada` no estaba en `SIN_PLATAFORMA`, así que la herramienta salía **antes de llegar a
su propio código**. La rama que escribe en `TRANSICIONES.log` está escrita —es el `else` de la
publicación— pero era **inalcanzable**: código correcto detrás de una puerta cerrada.

`PT-116` lo declaró cumplido con `verified: true`.

## Por qué se escapó, que es lo que importa

La evidencia de aquel `AC-03` fue *«la rama sin `adaptador.comentar`»*. Se comprobó que la rama
**existe**, no que se **ejecuta**. Es la clase que `PT-124` nombró —*buscar el texto en el fuente
no comprueba el hecho*— y la **tercera instancia en dos tareas seguidas**: `PT-116` ya había
tenido que rehacer su propio caso de `ROOT` por lo mismo, a mitad de tarea.

## La parte que no es un descuido

`PT-084` midió **este defecto exacto** en `avanzar`: exigía plataforma, y un proyecto sin ella no
podía avanzar ni una fase. **`PT-116` citó ese precedente en su propio `AC-03`** —está escrito en
su `manifest.json`— y volvió a cometerlo en el archivo de al lado, **en la misma sesión**.

Con `SUITE-R22` declarando soportado el equipo de una sola persona, ese proyecto no podía
registrar **ni una parada** — que es justo lo que `EP-020` construye.

## Cómo se cazó

Un caso de `PT-117` que **no buscaba esto**: invocaba `parada` sobre el fixture, que no declara
plataforma. No lo encontró una revisión ni una relectura: lo encontró **ejecutar la ruta**.

## Lo que no se hizo, y consta

No se revisaron las demás acciones de `SIN_PLATAFORMA`. Si hay más en la misma situación es un
hallazgo aparte y se abre aparte: mezclarlos haría imposible saber cuál rompió qué.

Y el `manifest.json` de `PT-116` **no se reescribe**. `SUITE-R09` es append-only y `FDGE-R29`
prefiere la entrada `CORRIGE`: borrar la afirmación equivocada borraría la prueba de que se hizo.
