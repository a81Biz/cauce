# PT-043 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`migrate` deja de imprimir una lista y **conduce**: cada decisión pendiente va numerada, con qué
se decide y por qué no puede decidirlo una máquina, y el modo restringido se explica al entrar en
él. `SUITE-R55` lo escribe como obligación, no como estilo de salida.

```
legado real (4.12.0)   7 decisiones → 6, todas con motivo, ninguna partida
selftest               410 → 429 casos
```

## Lo que solo se vio ejecutando

Tres cosas, y ninguna aparece leyendo el código.

**1 · Una de las siete no era una decisión.** El `need()` de *«escribirlo AL CERRAR CADA FASE»*
era una advertencia **sobre** el bloque `ESTADO`, no algo que decidir. Lo delató el propio
conductor, que no supo darle motivo y lo dijo (`RULE-06`). La corrección no fue enseñarle ese
texto al reconocedor —eso habría borrado el síntoma dejando la fila que sobra—: fue fundirla en la
decisión de la que colgaba.

**2 · El resumen seguía cortando a media palabra.** La sesión anterior corrigió este mismo
`resumen()` porque partía `7.5.0`, y dejó detrás un `slice(0, 96)` que partía tres de cada nueve
titulares: `(árbol e his`, `SECRETOS-`, `(SUITE-R`. **El caso que se probó fue el del punto; el
que ocurre siempre era el de la longitud.** Es el mismo defecto que la sesión anterior cometió dos
veces el mismo día en dos binarios distintos: arreglar lo que se miró y no lo que pasa.

**3 · El conductor cubría 6 de las ~20 acciones que `migrate` emite.** Sobre el legado real
—`4.12.0`— se veían seis y todo parecía completo. Los tramos `3.x` y `4.0.x` emiten otras nueve, y
salían **enteras** sin motivo; con plataforma declarada, otras tres más. Medir en un solo fixture
daba verde a la mitad del trabajo. Ahora las cuatro rutas se miden.

## Lo que un revisor debería atacar

**1 · Sigue siendo texto en una salida de consola.** Quien la ignore no ve nada. Lo único
mecánico es que las decisiones existan, estén numeradas y ninguna se quede sin motivo — que no es
poco, pero tampoco es una compuerta.

**2 · `SUITE-R55` no la emite ningún verificador con su nombre.** `regla SUITE-R55` lo dice
literalmente: «ningún verificador la emite con su nombre». Los 19 casos la ejercitan pero no citan
su ID, y `migrate` no tiene `fail()` que citarla. Es una de las 65 sin verificador declarado. No
lo he tapado escribiendo un `fail()` decorativo.

**3 · La rama `RULE-06` del reconocedor ya no la dispara ninguna acción emitida.** Todas se
reconocen hoy, así que esa rama solo tiene un caso *de código fuente*, no de ejecución. Es la
única del conductor sin caso ejecutable, y lo digo aquí en vez de dejarlo entender. La
comprobación inversa (`salidas/inversa.txt`) muestra que **sí** dispara cuando falta un
reconocedor: es la prueba de que la rama vive.

**4 · El orden de los reconocedores es frágil por construcción.** `llega nuevo` tiene que ir
antes que `secreto` porque nombra `revisar-secretos`, y `plataforma de trabajo` antes que
`pull request` porque nombra `SUITE-R42` dentro de su explicación. Está comentado en el código.
Un `need()` nuevo mal colocado se lleva la fila de otro, y **ningún caso lo detectaría** salvo el
de «ninguna sin motivo», que solo ve las ausencias, no los cruces.

## Desviaciones declaradas

**El cuerpo del conductor se implementó antes de que existiera su `PHASE 4`.** `FDGE-R13` pide
0 líneas y 0 ramas antes de `G2`; en `4ffd457` no fue así. Se dice en vez de fechar los artefactos
hacia atrás. Lo escrito en esta sesión —las tres correcciones, la regla, las citas y los 19
casos— sí siguió el orden: casos en rojo primero.

**Se trabajó sobre `trabajo`, sin rama `feature/PT-043-…`**, igual que las otras cuatro tareas del
lote.

## Lo que aparece en el tablero y no se arregla aquí

Dos defectos encontrados ejecutando, con su `allocation` `DEFERRED` y su issue abierto
(`SUITE-R44`), porque ninguno cabe en esta tarea:

- **`PT-044`** (#65) · el YAML de `PT-039`…`PT-042` declara `phase: 1` y `status: DRAFT` mientras
  el registro dice `phase: 8` y `VALIDATION_PENDING`. El YAML manda sobre el registro en
  `verify-fdge`, así que `FDGE-R52` **nunca se evaluó** en esos cuatro. Sincronizarlo es una línea
  por archivo, pero entonces la regla exige siete notas de reanclaje por tarea que nadie escribió
  — y fabricarlas es lo que el `HANDOFF` prohíbe.
- **`PT-045`** (#66) · `npx @a81biz/cauce start`, el arranque que `MANUAL.md` y `CASOS-DE-USO.md`
  documentan, **no arranca**.

## Lo que NO he verificado

Que alguien tome las seis decisiones. `SUITE-R55` lo dice de sí misma, igual que `SUITE-R54`. Y
que `migrate --apply` deje bien un proyecto legado **real**: se ejecutó sobre él **sin `--apply`**
—no toca un archivo— y con `--apply` solo sobre fixtures. Aplicar una migración sobre el proyecto
de otro no es mío.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado (arriba, «lo que solo se vio ejecutando»)
- [x] Sin regresiones: `selftest` 429/429 · `verify-suite` sin errores · `build-core --check` sincronizado
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-043` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto: nada de lo aplazado se implementó
- [x] Sin problemas de seguridad evidentes · evidencia sin credenciales (`FDGE-R45`)
- [x] Contrato público de `migrate` sin cambios: misma interfaz y mismos tres códigos de salida

SELF_REVIEW_COMPLETE
