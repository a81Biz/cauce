# PT-145 · `strategy.md` — `PHASE 3` Strategy

## 1. Objetivo

Que `verify-suite.mjs` y `comparar-marco.mjs` dejen de escribir la lista de componentes y la
deriven del contrato de `PT-144`, **sin cambiar lo que comprueban** — salvo en el sitio que hoy
está incompleto.

## 2. El orden, y por qué `MARGINAL` lo impone

`FDGE-R54` dio `MARGINAL`: no hay ningún `REFACTOR` cerrado con el que comparar el coste, así que
el veredicto **no aprueba por omisión ni prohíbe sin evidencia**. `PHASES` lo traduce a trabajo
**atómico con checkpoint entre pasos**, y aquí eso tiene una lectura concreta: los ocho sitios
**no** se tocan de una vez.

```
1  comparar-marco.mjs     UN sitio, UN archivo, y necesita la arista de import que no existe.
                          Es el paso mas pequeno y el unico con una dependencia nueva:
                          si el import no funciona, se sabe con un solo sitio tocado.
2  verify-suite.mjs :425  el otro Set(['FIDE']), el mismo hecho que el paso 1.
3  verify-suite.mjs x5    las cinco alternancias completas. Comportamiento IDENTICO.
4  verify-suite.mjs :708  la SEXTA, la incompleta. Es el UNICO paso que cambia
                          comportamiento, y va ultimo para que lo que destape no se
                          confunda con un fallo de los tres anteriores.
```

**El paso 4 va solo y va al final.** Si `FPGE` y `FIDE` entrando en esa comprobación destapan una
cita de regla en la matriz de compuertas, tiene que ser inequívoco que viene de ahí.

## 3. La construcción del patrón es el riesgo real

Cinco patrones que hoy son literales pasan a construirse. `SUITE-R59` avisa de la forma exacta del
fallo: **un escape degradado no revienta, casa de menos** — y casar de menos en un verificador de
reglas es dejar de ver reglas, es decir, **pasar en verde**.

Se construyen con el normalizador de `patrones.mjs` —`CLASE.limite`, `comoLiteral`— sin una sola
barra invertida escrita. Y `RC-02` no se da por bueno leyendo el código: hay que **ejecutar** los
cinco contra un texto que contenga cada uno de los diez prefijos.

## 4. Alternativas evaluadas

| Alternativa | Por qué se rechaza |
|:---|:---|
| **Una sola constante `RULE_RE` reutilizada en los cinco** | Tentador y **peligroso**: un regex con `/g` conserva `lastIndex` entre llamadas, y `verify-patrones.mjs:33` ya documenta que reutilizarlo da resultados que dependen del orden. Se construye una **función** que devuelve un patrón nuevo. |
| Tocar los ocho sitios de una vez | `MARGINAL` lo desaconseja, y mezclaría el único cambio de comportamiento con siete no-cambios. |
| Completar `:708` en otra tarea | Sería dejar un guardarraíl con agujeros conocidos mientras se toca el archivo. |
| Que `comparar-marco` reciba la lista por argumento | Evita el import y traslada el literal a quien lo llama. Es mover el problema. |

## 5. Riesgos

| Riesgo | Mitigación |
|:---|:---|
| Un escape se degrada al construir y el patrón casa de menos | `RC-02` ejecutado, no leído: los diez prefijos contra los cinco patrones |
| `lastIndex` compartido entre usos | función que devuelve patrón nuevo, no constante |
| `:708` destapa citas de regla en `EXECUTION-MODES.md` | **es el objetivo**; se declaran y **no se corrigen aquí** |
| `comparar-marco` gana su primera dependencia del marco | es una arista, no un acoplamiento nuevo: las otras ocho herramientas ya la tienen |

## 6. Autorrevisión

```
Contradicciones con el intake:  ninguna. El intake decia SIETE sitios; son OCHO desde que
                                PT-144 destapo :708. Esta declarado en la parada de #279.
Dependencias faltantes:         ninguna. PT-144 esta INTEGRATED y su contrato esta en trabajo.
RULE-nn violadas:               ninguna. SUITE-R59 es la que gobierna, y RC-02 la ejecuta.
AC no cubiertos:                ninguno.
Alcance que crecio:             el sitio :708 y su cambio de comportamiento. Sale del mismo
                                hecho y del mismo archivo; no estira la tarea, la completa.
```
