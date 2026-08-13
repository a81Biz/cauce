# PT-008 — Discovery   `PHASE 2` · análisis `2-E`

## El hueco

Durante toda esta sesión el agente escribió en los issues y **no releyó ninguno**.
`gh issue view --json comments` existía —lo usa `FDGE-R52` para contar reanclajes— y nunca se
usó para leer. Un comentario humano podía quedar sin leer indefinidamente y nada lo señalaba.

## Lo que el análisis tumbó

`AC-03` del intake decía: «se distingue por **autor**, no por contenido». **No se puede.**

```
gh issue view 11 --json comments --jq '.comments[-1].author.login'   →  a81Biz
gh api user --jq .login                                              →  a81Biz
```

El agente comenta con la credencial de `gh` de la persona, así que **los dos comentarios son
del mismo autor**. No es una peculiaridad de este repositorio: es el caso normal — `tracker`
habla CLI precisamente para funcionar con un token, y ese token es de alguien.

Distinguir por autor solo funcionaría con una cuenta de máquina separada, que es infraestructura
que el marco no exige ni debería exigir.

## La alternativa, y lo que cuesta

**Una marca de procedencia** en los comentarios que escribe el agente: un comentario HTML
invisible al renderizar. «Comentario humano sin responder» pasa a ser *existe un comentario sin
marca más nuevo que el último con marca*.

Lo que cuesta, dicho claro: **es falsificable**. Cualquiera puede pegar la marca a mano. Es la
misma limitación que `SUITE-R27` reconoce en las firmas — lo mecanizable es que la afirmación
sea contrastable, no que sea sincera.

Y lo que **no** cuesta: no depende de que existan dos cuentas, funciona en cualquier proyecto y
se ve en el propio issue si alguien va a mirar.

## Qué pasa con los comentarios ya escritos

Ninguno lleva marca. Si «sin marca» significara «humano», los nueve issues de esta sesión
dirían que hay comentarios sin responder — un rojo de nacimiento.

**Se declara `SIN EVALUAR`**: si no existe ningún comentario con marca, la comprobación no
puede distinguir y lo dice (`RULE-06`). Se cura sola en cuanto el agente escribe el primer
reanclaje marcado, sin migración y sin tocar la historia.

## Conclusión

Hueco real, con evidencia de esta misma sesión. La detección por autor es inviable y se
sustituye por marca de procedencia, con su limitación declarada. `AC-03` se reformula.

Confianzas: RootCause 95 % · Architecture 85 % · Solution 80 %.
