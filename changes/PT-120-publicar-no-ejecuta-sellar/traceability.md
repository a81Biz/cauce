# Trazabilidad — `PT-120`

| AC | Criterio | Escenario | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `publicar.yml` ejecuta `sellar` y **bloquea** si el sello no está resuelto | `TS-01` `TS-02` `TS-03` `TS-04` | `selftest.sh:…y sale con codigo distinto de cero` | `salidas/casos.txt` `salidas/gate.txt` |
| AC-02 | `verify-fdge --all` recibe `GH_TOKEN` en los **dos** workflows | `TS-05` `TS-06` | `selftest.sh:publicar.yml da GH_TOKEN a verify-fdge` | `salidas/casos.txt` |
| AC-03 | Un paso que no puede evaluar una regla no cierra con «Sin errores» sin decir cuántas quedaron `SIN EVALUAR` | `TS-07` `TS-08` | `selftest.sh:el resumen no calla lo SIN EVALUAR` | `salidas/casos.txt` |

**Tres criterios, tres con `TS`, tres con evidencia ejecutada.** `AC-04` **decae** — ver
`out-of-scope.md` y `R-2` del intake.

## La evidencia que decide, y por qué el par no es redundante

```
TS-01   «bloquea con el sello roto»          -> el TEXTO
TS-02   «…y sale con codigo distinto de cero» -> el CODIGO
```

`TS-01` **habría pasado con la versión rota**: mi implementación imprimía ese texto exacto y salía
con `0`, autorizando la publicación. Un caso que sólo mira el texto de una compuerta comprueba el
cartel, no la compuerta. **Lo que un workflow mira es el código de salida.**

## Un escenario que comprueba que algo **no** ocurre

`TS-04` — `--gate` **no** bloquea por el grafo. `graphify-out/` está en `.gitignore` y en CI sale
`MISSING`. Convertir «no lo sé» en «no pasas» es tan falso como convertirlo en verde (`RULE-06`),
con el agravante de que una compuerta que falla por motivos ajenos se acaba desactivando.

`TS-06` cubre lo mismo del otro lado: `SIN EVALUAR` **se dice** y **sigue sin bloquear**.
