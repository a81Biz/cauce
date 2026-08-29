# `PT-200` · self-review

## Lo que se sostiene

- **`AC` verificados: 4, ninguno huérfano.** Seis casos ejecutables.
- **La medida es el resultado:**

  ```
  verify-fdge --all  SIN sellos   536.8 s  ·  197 PT
  verify-fdge --all  CON sellos    50.4 s  ·   14 PT  ·  189 saltados
  ```

  **−91 % en tiempo, −93 % en tareas recorridas.**
- **`AC-02` sostiene a `AC-01`.** Saltar lo terminal lo cumple un `verify-fdge` que ignore todo lo
  `INTEGRATED` sin mirar nada — y eso dejaría la compuerta **ciega para el 93 % del repositorio**.
  Sólo `AC-02` distingue «sellado» de «ignorado».
- **`AC-04` sostiene a los tres.** Sin sellos se verifican **todos**. Es la lección de
  `bloques-sellados`: su silencio significa «no acotes», nunca «no hay nada que correr».
- **El mecanismo no se inventa.** Es el de `PT-175` y `PT-191`: sello con veredicto, huella que
  incluye **las herramientas**, y sellar como **decisión** (`--sellar`), no como efecto de ejecutar
  el comando.

## La pieza más fácil de olvidar, y tiene su caso

La huella incluye **`verify-fdge.mjs` y `patrones.mjs`**. Sin ellas, el sello certificaría contra
una versión de las reglas que ya no existe: cambiar una regla cambia el veredicto **sin tocar el
artefacto**.

`PT-191` lo había dejado escrito para la batería —*«el sello incluye las herramientas, así que un
destino que las modifique deja de casar»*— y aquí vale igual. Tiene caso propio: `…y si cambia el
VERIFICADOR, también`.

## Un hallazgo lateral, arreglado y declarado

`verify-fdge` **importa** `tracker.mjs` (`estadoContrastado`, `FASES`, `estadoDelArbol`), y un
`import` ejecuta el cuerpo del módulo. Así que la validación de banderas de `tracker` —que `PT-183`
introdujo para que un flag desconocido no se ignore en silencio— miraba **los argv de
`verify-fdge`** y rechazaba `--sellar`, nombrando banderas de `tracker` que no venían al caso.

**La guarda ya existía**: `EJECUTADO_DIRECTO`, en `tracker.mjs:1486` — pero se calculaba **500 líneas
después** del bloque que la necesitaba. Se adelanta.

Un módulo importado no valida los argv de quien lo importa. Y `tracker` sigue rechazando sus propias
banderas malas: se comprobó en las dos direcciones.

## Un defecto cazado antes de que llegara a CI

La huella incluía la **ruta** de cada archivo, y la ruta lleva `\` en Windows y `/` en Linux. Un
sello escrito aquí **no habría casado nunca en CI** — y CI es justo donde el ahorro importa, porque
es donde corre en cada push.

Se normaliza el separador, igual que `selloDe` normaliza `CRLF`/`LF` por la misma razón
(`patrones.mjs:33`, con su comentario: *«un sello sobre bytes hacía que el CI acusara de
desincronizado un núcleo intacto»*). El mismo error, doce versiones después.

Lo destapó preguntarse si el sello debía versionarse — no una corrida.

## Lo que costó llegar al fixture, y por qué se dice

El caso necesita un proyecto sintético **en verde** —el recuento `PTs verificados` sólo se imprime
si no hay errores— y llegar ahí exigió nueve iteraciones: `traceability.md`, la evidencia que el
manifest cita, el índice, `docs/enterprise-documentation/` con sus tres `RULE-nn`, `suite_version`
en el registro, y una **bitácora con el formato exacto** `AAAA-MM-DD · PHASE n` que `FDGE-R52` pide.

No es una queja: es la razón por la que el fixture está en una función propia y comentada. El
siguiente que necesite un proyecto verde no vuelve a pagarlo.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **Un cambio en `RULES.md` que no toque `verify-fdge.mjs` no invalida el sello.** Igual que en la
  batería. Se declara.
- **No se fija ninguna cifra de minutos** como criterio: sería fijar el número de lo correcto
  (`HANDOFF -18`). Lo que se mide es que lo terminal y sin cambios no se recorre.

## Sin bloqueadores
