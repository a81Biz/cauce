# PT-082 — Autorrevisión   `PHASE 6`

## Lo que pasó, sin adornos

Ejecuté la `G4` autorizada y CI dio rojo. Al mirarlo apareció que **ya había fusionado dos PR con
ese mismo rojo** —`#148` y `#149`— sin ejecutar `gh pr checks`. `FDGE-R34` hace de la
verificación precondición de `G4` exactamente para eso.

## Y mi primer diagnóstico fue falso

Dije que CI llevaba en rojo «sin que nadie lo supiera, porque ningún PR había corrido contra
`main` desde el 18 de agosto». **No es cierto.** `verificacion.yml` corre en *todos* los
`pull_request`: el rojo estaba a la vista, en rojo, en los dos PR que fusioné.

Lo corrigió el firmante preguntando qué evitaríamos forzando PRs a `main`. La respuesta honesta
era **nada**: la verificación ya se ejecutaba en la rama donde trabajamos y ya fallaba. El
problema nunca fue dónde corre el control, sino que en `trabajo` era consultivo.

## Los dos defectos, y por qué se tapaban el uno al otro

| | Qué | Efecto |
|:---|:---|:---|
| `A` | El caso depende de `git config user.name` | produce el rojo |
| `B` | `trabajo` sin protección de rama | hace que el rojo **no importe** |

Arreglar sólo `A` deja `B` esperando al siguiente error. Arreglar sólo `B` deja CI rojo
bloqueándolo todo. Y el orden no es arbitrario: **primero `A`**, porque con la protección puesta
y CI en rojo ni el PR que arregla la protección se podría fusionar. El candado con la llave dentro.

## El código no estaba mal

`marcaDe` devuelve `null` con una identidad ajena porque `PT-068` le puso esa guarda para no
atribuir la sesión de otra persona. **Está haciendo su trabajo.** Lo que afirmaba un resultado
dependiente de la máquina era el caso.

Novena vez del patrón «probar donde trabajo, no donde se decide», que el `HANDOFF` ya lista en su
`no hacer`. La primera que llega a `main`.

## La rama que nadie miraba

El `if` tenía dos salidas y **una sola tenía caso**. La otra —la que dice «no hay sesión abierta»—
era precisamente la que CI ejecutaba. Un `if` con una rama sin caso no está medio probado: la
mitad sin probar es la que se rompe donde no miras.

Por eso el arreglo son **cuatro** casos y no dos. Sin los de `OTRO`, alguien podría «arreglar»
esto haciendo que `marcaDe` devuelva la marca huérfana —deshaciendo `PT-068`— y los dos primeros
seguirían verdes.

## Por qué protección de rama y no una comprobación en `verify-fdge`

Lo evalué. Se descarta porque sería **evitable no ejecutándolo** —que es literalmente lo que
`PT-075` documentó— y porque depende de tener `gh` autenticado: en un clon sin credencial daría
`SIN EVALUAR`, y un control que se apaga solo no controla.

`enforce_admins: true` a propósito. Una protección que el administrador salta con un clic
convierte la excepción declarada en un gesto sin rastro, y este lote existe en buena parte por eso.

## Lo que esto me impide, y está bien

Los commits directos a `trabajo` dejan de ser posibles. Yo estaba haciéndolos para mantenimiento,
contra lo que `FDGE-R19` ya decía. Es un efecto buscado.

## Lo que no se verifica

Que no haya una **décima** aparición del patrón —detectarlo exige ejecutar con dos entornos y
comparar, no una expresión regular— y que la protección **siga puesta mañana**: es configuración
de GitHub, ninguna herramienta del marco la lee, y la evidencia es una foto con fecha.

`AC-01`..`AC-06`, los seis. `selftest` 1058 → **1060**, cero fallos.
