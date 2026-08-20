# PT-081 — Autorrevisión   `PHASE 6`

## Lo que el firmante vio antes que yo

«Dudo mucho que sea la `9.0.0`.» Lo era en `package.json` y en el `CHANGELOG`, y no debía serlo.
Medido, no discutido:

| Regla | Introducida | `DESDE = [5,1,0]` la trataba como | |
|:---|:---|:---|:---|
| `FDGE-R52` | `5.0.0` | `5.1.0` | menor, y **por defecto**: dejaba fuera |
| `FDGE-R53` | `5.1.0` | `5.1.0` | correcto |
| `FDGE-R54` | **no estaba en el `CHANGELOG`** | `5.1.0` | **regía sobre el 12 de agosto** |

Y la entrada `9.0.0` no mencionaba `FDGE-R54` ni `SUITE-R56`: **cero veces**. Dos reglas `HARD`
nuevas, con verificadores que fallan, ausentes del registro de versiones — mientras su guía de
migración decía «ningún proyecto instalado tiene que hacer nada».

## El error que la inversa desmontó

**Elegí `origin/main` como línea base del detector, y era exactamente la equivocada.**

Comparar contra una rama significa «nuevo desde la última integración». En cuanto ejecutamos la
`G4`, `FDGE-R54` pasó a estar en `main` y el detector **se calló — justo cuando la regla acababa
de entrar**. Un detector de reglas nuevas cuya línea base se mueve con cada merge deja de detectar
precisamente lo que integras.

No lo vi leyendo el código. Lo vio **ejecutar la inversa después de la `G4`**: con la fila quitada,
el aviso no saltó. Sin ese orden accidental habría entregado un verificador que pasa siempre — el
falso verde que este lote entero persigue.

La línea base es ahora el **tag de la versión anterior**. Un tag no se mueve; una rama sí.

## Una decisión de criterio que cambió el resultado

«Nueva» tuvo dos definiciones antes de la buena:

| Criterio | Devolvía | Por qué no sirve |
|:---|---:|:---|
| No aparece en el `CHANGELOG` | **69** | casi todas fundacionales, anteriores al propio archivo |
| `RULES.md` de antes contra los tres de ahora | **42** | comparaba mitades distintas: todas las `LEX-*` y `EXEC-*` salían nuevas |
| **Los tres documentos contra los tres, en el tag anterior** | **2** | `SUITE-R56` y `FDGE-R54`. Exacto |

Una lista con 69 falsos positivos es una lista que nadie mira. El valor del detector estaba entero
en acertar el criterio, no en escribirlo.

## Lo que no se tocó, y es lo importante

**La entrada `9.0.0` conserva su texto.** `git diff v9.0.0 -- CHANGELOG.md` da **cero líneas
eliminadas**: la `10.0.0` se añadió encima. Reescribirla para que significara dos lotes habría
borrado qué lote trajo qué — la enfermedad que `EP-017` combate, cometida al documentarla.

Y las tareas **cerradas** conservan su `suite_version`. Sólo las vivas pasan a `10.0.0`: el campo
dice bajo qué versión se escribió una tarea (`SUITE-R18`), no bajo cuál se publicó.

## Siete veces con el mismo escalón

Escribir un literal `/\r?\n/` a través de un script lo convirtió en un salto de línea real y dejó
`verify-suite` sin cargar. Van **siete** en este lote. Esta vez la salida no fue insistir con el
escapado sino **quitar el problema**: `split(/\s+/)`, que no necesita ningún escape y hace lo
mismo, porque un tag no lleva espacios.

## Lo que no se verifica, y está declarado

**Que una guía de migración siga siendo verdad.** Comprobar mecánicamente que una prosa describe
un conjunto de cambios no sé hacerlo. Lo que `AC-08` consigue es que **redactarla sea enumerar en
vez de recordar** — y eso no es lo mismo, así que se dice.

`AC-01`..`AC-08`, los ocho. `selftest` 1060 → **1073**, cero fallos.
