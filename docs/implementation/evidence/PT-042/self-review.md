# PT-042 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`cauce install` **empieza** remitiendo al manual, antes de decir «abre tu agente». Y `cauce start`
lo pone primero: **1 · MANUAL · 2 · CASOS-DE-USO · 3 · CORE**.

```
selftest   402 → 410 casos
```

## Lo que no logra, y lo dije antes de empezar

**No obliga a leer.** No es comprobable —ni para una persona ni para un agente—, y cualquier
confirmación sería el agente afirmando sobre sí mismo: la prueba circular que `SUITE-R27` declara
insuficiente para las firmas y que yo mismo cité contra el merge.

Lo que se logra es más pequeño y no es nada: **no se puede arrancar sin que se ponga delante**, y
se puede consultar en cualquier momento. La regla lo dice en su propio texto, no en una nota al
pie.

## La autorreferencia ya existía repartida

No hubo que inventarla: `cauce regla <ID>` para una regla, `tracker siguiente` para la fase,
`CASOS-DE-USO.md` para el caso. **Faltaba que el arranque las nombrara.** Mismo patrón que el
manual entero: la información existía y no estaba donde se busca.

## Lo que un revisor debería atacar

**1 · Es un texto en una salida de consola.** Quien lo ignore no ve nada más. Un revisor puede
sostener que esto es documentación disfrazada de mecanismo, y no le faltaría razón: lo único
mecánico es el orden.

**2 · Relajé un aserto y hay que decirlo.** El caso del orden comprobaba la **salida real** del
binario; lo cambié a leer el **fuente** porque ejecutarlo contra el fixture arrastraba el estado
de otro proyecto y ensuciaba tres casos ajenos. La versión que quedó es más estable y **prueba
menos**.

**3 · «Se lee entero una vez» sigue siendo una afirmación sobre el lector.** Nada la comprueba.

## Lo que NO he verificado

Que alguien lea el manual por esto. Quinta vez que escribo una variante de esta frase, y sigue
siendo la única honesta.

SELF_REVIEW_COMPLETE
