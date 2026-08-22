# Autorrevisión — `PT-104`

## Lo que establecí

Que el cuerpo del issue dice **en qué paso está** la tarea, **qué la dejó entrar**, **qué
necesita para salir** y **a dónde va** — sin que nadie ejecute nada. Y que la lista de artefactos
**contrasta** contra el árbol en vez de repetir la teoría.

## Lo que NO establecí

- **Que publicarlo cambie la conducta del agente.** No es comprobable y no se afirma. `EP-007` y
  `EP-008` ya establecieron que un comando no puede exigir haber sido llamado, y que un artefacto
  que el agente escribe sobre sí mismo no prueba nada.
- **Que no falte más estado por publicar.** Se publican fase, transiciones, artefactos y
  bloqueos. Si hace falta más, se verá al usarlo.

## La decisión que hace útil esto

Publicar «`PHASE 4` produce seis archivos» sería **copiar `FASES`**: repetiría la teoría y nunca
podría discrepar. Publicar **cuáles de los seis existen** convierte el issue en algo que puede
**contradecir a quien lo escribe** — que es exactamente lo que se pidió.

## Por qué `SUITE-R35` no lo impide

La regla prohíbe **copiar contenido**, y con razón: dos copias del mismo texto divergen.

Publicar **estado derivado es lo contrario**: no hay segunda copia porque **no hay texto propio**.
Todo se recalcula en cada `abrir --aplicar`, así que no puede divergir — si diverge, es que el
árbol cambió, y eso es justo lo que se quiere ver.

## Lo que salió mal

**Séptima rotura de escapado de la sesión.** La primera versión del helper usaba plantillas de
texto y una transformación rompió las comillas invertidas: el módulo no compilaba. Se reescribió
**sin transformar nada** —el bloque se escribe tal cual y se inserta verbatim—, que es la forma
que `PT-101` persigue.

**Y la octava, en la misma tarea**, escribiendo estos documentos por un heredoc. Se escribieron
sin pasar por la capa del shell.

**Reventé la batería tres veces** editando archivos mientras corría.

## Lo que la inversa dio a la primera

Diez retiradas, diez con efecto. Fue la única inversa de la sesión que no necesitó una segunda
pasada — y la razón es concreta: cada medida llama al módulo **en un proceso aparte**, porque
`import` cachea y con la versión rota ya cargada habría medido siempre el código bueno.
