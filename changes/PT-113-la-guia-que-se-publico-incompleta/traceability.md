# Trazabilidad — `PT-113`

> Reanclada a la `13.0.0` (`R-1` del intake). La `12.0.1` para la que se escribió no existe.

| AC | Criterio | Escenario | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | La entrada nombra `SUITE-R59` y `LEX-R08` y dice qué hacer con cada una | `TS-01` | derivado del `CHANGELOG`, leyendo la entrada `13.0.0` | `salidas/guia.txt` |
| AC-02 | La cifra de cabecera de la `12.0.0` coincide con el registro | `TS-02` | derivado: `allocations` con `epic: EP-019` | `salidas/guia.txt` |
| AC-03 | `sellar` deja de reportar reglas nuevas no nombradas | `TS-03` | `tracker sellar` | `salidas/guia.txt` |
| AC-04 | Las 25 declaraciones de versión declaran la vigente | `TS-04` | `version.mjs` sin `--aplicar` | `salidas/version.txt` |
| AC-05 | `CORE.md` y `CORE-PTSA.md` sincronizados con sus fuentes | `TS-05` | `build-core.mjs` + `verify-suite.mjs` | `salidas/coherencia.txt` |


## `AC-06` sale de la matriz: está **caído**, no cumplido

Fue escrito para un `PATCH`. En un `MAJOR` que trae `FDGE-R55` y cuatro herramientas tocadas,
exigir *«diff vacío»* sería exigir lo contrario de lo que el lote hace. Su evidencia es la
revisión `R-1` del intake, que es **el documento donde consta la decisión** — no una salida de
herramienta, porque **no hay herramienta que pueda decir «este criterio dejó de aplicar»** — el
marco no tiene ese vocabulario, y por eso queda aplazado en `PT-134` (`DEFERRED`, con `origin`
citando esta tarea, que es lo que `SUITE-R44` pide para que aplazar no sea narrar).

Marcarlo verde habría sido más cómodo y habría dejado una afirmación que nadie puede contrastar
(`RULE-06`).

## `AC-03` se cumple, y su verde no lo sostiene

`sellar` contrasta la guía **sólo con las reglas cuya `RIGE_DESDE` iguala la versión vigente**.
Con el árbol en `13.0.0` ya no mira la entrada de la `12.0.0`, así que **este `AC` estaría verde
aunque no se hubiera hecho nada**.

Lo que lo sostiene de verdad es `AC-01`, que se deriva leyendo el documento. El hueco de la
compuerta se declara y va a `PT-120`.
