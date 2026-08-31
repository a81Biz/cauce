# `PT-187` · self-review

## Las cifras del intake estaban **las tres** mal

| El intake decía | Medido |
|:---|:---|
| tres tags sin publicar | **siete** — `1.0.0` · `5.2.0` · `9.0.0` · `10.0.0` · `13.2.0` · `13.3.0` · `13.4.0` |
| tres publicadas sin `CHANGELOG` | **ninguna** |
| *(no lo veía)* | **28 de 47** entradas del `CHANGELOG` sin tag |

Venían del `HANDOFF` de una medición anterior: `CE-010`, la cifra transcrita que caduca. Por eso el
comando las **deriva** en cada corrida y hay un caso que lo fija.

## Nadie contrastaba, y eso estaba medido

```
$ grep -rn "npm view|registry.npmjs" docs/methodology/tools/*.mjs bin/cauce.mjs
(sin coincidencias)
```

`version.mjs` alinea los 21 documentos **entre sí** y `verify-suite` comprueba que las versiones
internas no diverjan. **El registro externo no lo miraba nadie.**

## `AC-02` no era teórico: lo reproduje midiendo

Mi primer intento dejó el conjunto vacío en un `catch` y salieron **veinte divergencias
inventadas** con aspecto de hallazgo. **El fallo va en las dos direcciones** —dar por cuadrado, o
inventar— y la segunda es peor **porque parece trabajo**.

Y volvió a pasar **al implementarlo**, dos veces seguidas y por motivos distintos:

1. **`npm` no se encuentra**: en Windows el ejecutable es `npm.cmd`.
2. **`EINVAL`**: desde Node 18.20, `spawnSync` se niega a ejecutar un `.cmd` sin `shell`.

Las dos veces la herramienta **acertó en la conducta** —dijo `SIN EVALUAR`, no inventó nada, y
siguió dando la comparación que no depende de la red— **y mentía en el motivo**: decía «sin red, o
sin acceso» cuando el problema era la invocación. Es `CE-001` en pequeño, y por eso ahora **se pasa
el error tal cual** y hay un caso que lo exige.

## Las cuatro divergencias no valen lo mismo, y el comando lo dice

| | ¿Es defecto? |
|:---|:---|
| **tag sin publicar** | **No necesariamente**: `SUITE-R06a` reserva publicar al firmante |
| **publicada sin `CHANGELOG`** | **Sí** — `SUITE-R19` |
| **publicada sin tag** | **Sí** |
| **`CHANGELOG` sin tag** | **Depende**, y por eso se cuenta y no se juzga |

**Presentarlas todas como «divergencias» sería el defecto contrario**: convertir una diferencia
legítima en alarma. Y una alarma que suena por lo correcto enseña a ignorarla — que es la única
forma de romper esto sin que nadie lo note. Tiene su caso, en negativo.

## Un error mío, y es el segundo del lote

`[ "$1" != "sintags" ]` con `set -u` revienta si no hay `$1`. **Misma forma que en `PT-195`**, en
la misma jornada. Corregido con `${1:-}`.

## Lo que NO se hace, y consta   `SUITE-R26`

- **No se publica, no se etiqueta y no se retrofecha nada** (`SUITE-R06a`, `SUITE-R06g`). `npm
  publish` sigue reservado al firmante por su nombre.
- **No se promete que las cuatro coincidan**: sólo que la diferencia sea **visible y contable**.
- **Las 28 del `CHANGELOG` sin tag no se juzgan**: son de la historia temprana (`CE-014`).
- **No entra en `npm run verify`**: consultar la red en cada corrida cambia el coste de algo que
  hoy no lo tiene, y `SUITE-R22` declara soportado el proyecto sin ella. **Dónde se invoca se
  decide con el dato delante**, no antes — y ahora el dato existe.

## Sin bloqueadores
