# `PT-151` · `test-scenarios.md` — `PHASE 4`

| TS | Qué prueba | Cómo puede fallar | Mecanismo |
|:---|:---|:---|:---|
| `TS-01` | Hoy las dos listas coinciden | divergen | `FALTA:- SOBRA:-` |
| `TS-02` | Un paso de CI que **falte** en `verify` se caza | vuelve la divergencia que dejó pasar ocho errores | fixture · `FALTA:verify:fdge` |
| `TS-03` | Un paso de `verify` que **CI no corre** se dice | la comparación se hace en un solo sentido | fixture · `SOBRA:matriz:check` |
| `TS-04` | `verify-fdge` lo emite **citando su regla** | el fallo deja de decir de dónde viene | `SUITE-R62` |
| `TS-05` | `verify` corre **nueve** pasos — los que se cronometraron | se añade o quita uno y la cifra publicada deja de describir lo que se mide | `chk` · `9 pasos` |

## `TS-03` es el que no estaba previsto

El intake suponía una sola dirección. `TS-03` existe porque **medir** encontró `matriz:check`
corriendo en local y no en CI — una comprobación cuyo rojo **nadie ve en el PR**. Sin este caso, la
comparación en un sentido dejaría pasar exactamente eso.

## `TS-01` sin `TS-02` no vale nada

Que hoy coincidan es la mitad fácil: coincidirían igual con la comparación rota. `TS-02` y `TS-03`
son los que demuestran que **puede fallar**.

## `TS-05` existe porque `AC-04` no puede quedarse sin escenario

`AC-04` pedía **declarar cuánto tarda**. Se escribió sin `TS` —la medición parecía evidencia
suficiente— y `verify-fdge` lo rechazó como **Orphan Criterion** (`FDGE-R15`). Es la segunda vez
en este lote, y la lección es la misma: **un criterio sin escenario es un criterio que nadie
comprueba**.

Lo que ata la cifra a algo verificable es **de cuántos pasos** es esa cifra. Si mañana `verify`
corre ocho o diez, los `24,1 min` publicados dejan de describir lo que se mide — y eso sí es
comprobable.

## Lo que estos casos NO establecen

Que el paso **haga** lo mismo en los dos sitios. Se comparan nombres, y el límite está declarado en
la propia regla.
