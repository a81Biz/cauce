# PT-094 — Autorrevisión   `PHASE 6`

## Empecé arreglándolo por fuera del marco, y me lo tuvieron que decir

Moví el archivo, medí, comprobé que verificaba limpio. Sin intake, sin `PT`, sin issue. El aviso
fue literal: *«lo estás reparando pero no veo que sigas el marco de trabajo, no hay issue abierto
ni nada»*.

**Es el fallo más serio de esta tarea y no está en el código.** Este repositorio se mantiene bajo
su propio marco desde `SUITE-R41` precisamente porque un marco que se saltara sus reglas cuando
tiene prisa sería el primer argumento en su contra. Y la prisa era mía: quería desbloquear la
publicación.

Lo deshice entero —restaurar el archivo, borrar la rama improvisada— y volví a empezar por el
intake. Queda escrito porque el siguiente que lea esto merece saber que la presión de «está en
rojo, arréglalo» es exactamente cuando el procedimiento se salta.

## Y antes de eso, declaré limpio lo que estaba en rojo

Al cerrar la calculadora dije *«`cauce` está limpio en `main`»*. Miré `git status` y los issues
abiertos. **No miré el estado de los workflows**, y `main` llevaba una hora en rojo por esto
mismo: la corrida `32445191804` falló con **cinco** errores en el push del PR #173.

Comprobar el proxy barato —el árbol de trabajo— en lugar del hecho —que CI pase—, cometido **al
informar** en vez de en el código. Es la novena instancia de la familia que `EP-018` cerró ocho
veces.

## Los dos atajos que probé y descarté, con lo que costó descartarlos

**`tracker checkpoint PT-092`** es lo que el propio mensaje de error propone. Lo probé: escrito en
`main` falla en `trabajo`, y al revés. El checkpoint anota la rama de la sesión que lo escribió, y
después de un merge esa nunca es la que CI comprueba. **No existe valor correcto para una tarea
cerrada.**

**Borrar `CHECKPOINT.json`** verifica limpio en un minuto. Y deja verde borrando el dato en vez de
corregir la lectura, así que el siguiente lote lo reproduce igual.

Los dos están en el `out-of-scope` con el motivo, porque los dos son atractivos y el segundo lo es
mucho.

## La parte incómoda del hallazgo

`PT-056` **construyó** la guarda para este caso exacto. Su comentario dice, literalmente, *«al
integrar, la rama de tarea se borra y el checkpoint pasaba a afirmar una referencia muerta — que
es exactamente lo que STATE_MISMATCH existe para impedir»*.

Y la conectó sólo a `checkpoint()`, el camino manual. `avanzar` —el que escribe el checkpoint en
cada transición de fase, o sea el que de verdad lo escribe— no la recibe. `grep ramaDeclaradaViva`
da dos aciertos: la definición y el camino equivocado.

**La guarda estaba escrita y muerta.** No es un olvido de disciplina: es que nada comprobaba que
los dos caminos que escriben el mismo artefacto aplicaran el mismo criterio.

## Por qué ningún PR pudo avisarlo

`actions/checkout` deja **detached HEAD**, y `PT-056` trata `HEAD` como «no se puede leer la rama».
Es correcto —lo encontró CI en su propio primer PR— y tiene un efecto que nadie escribió: la
comprobación es **ciega justo donde todos los PR la ejecutan**, y sólo ve en el `push` a `main`.

Es decir: sólo donde ya no hay PR que bloquear. Una comprobación que no puede fallar donde se
ejecuta siempre no protege la rama que existe para proteger. Por eso `AC-06` saca ese límite del
comentario y lo pone en el mensaje.

## Lo que decidió el arreglo

Comprobar «¿esa rama sigue existiendo?» parecía más preciso. **Depende de cómo se clonó el
repositorio**: en un clon superficial una rama viva puede no estar presente, y la comprobación
pasaría a depender del entorno.

El estado sale del registro, que es la autoridad (`SUITE-R08`) y viaja con el repositorio.
`INTEGRATED` no significa «probablemente ya no hay rama»: significa que el árbol vivo es otro por
definición.

Y `DONE` queda fuera de terminal, heredando `ESTADOS_TERMINALES` en vez de escribir una lista
nueva. Su comentario ya avisaba de que añadirlo apagaría tres comprobaciones a la vez; ahora
serían cuatro, y hay un caso para que cueste un rojo.

## Y me salté la escalera de fases, que es la misma clase de error

Puse `phase: 9` a mano en el registro. `FDGE-R52` lo cazó: **8 notas de reanclaje faltando**, una
por transición. Reescribir el número es tener el estado; caminar la escalera es tener el rastro de
cómo se llegó.

Se rehízo desde `PHASE 1` con `tracker avanzar`, ocho veces, cada una con su nota. Es más lento y
es el punto: `PT-053` midió 107 transiciones × 5 actos manuales y encontró la misma transición
saltada tres veces en un lote. El comando existe porque el acto sin consecuencia inmediata se
salta — y yo acababa de saltarlo.

## Un hueco que esto destapó y no arreglé

`LEXICON` dice `IN_REVIEW --> VALIDATION_PENDING : tipo BUG · siempre`. **`avanzar` no lo aplica**:
llegué a `PHASE 9` con `status: READY` y `verify-fdge --all` verificó limpio.

Misma familia que el defecto que este `PT` corrige: una regla escrita cuyo camino real no la
aplica. Está en el `out-of-scope` con su motivo — cambiar qué estado asigna una transición toca el
ciclo de vida entero, y eso merece su propio intake.

## Lo que NO se verifica, y está declarado

**Que `publicar.yml` publique.** Lo verificado es que la comprobación que lo detenía deja de
detenerlo. Publicar es irreversible y lo dispara una persona.

**Que no queden más guardas conectadas a un solo camino.** Encontré ésta porque falló. No he
buscado las otras, y buscarlas es trabajo con su propio intake.

**Que `main` quede verde.** Lo verificado es esta rama y `trabajo`. `main` no lo estará hasta que
alguien resuelva `G4`.

`AC-01`..`AC-06`, los seis.
