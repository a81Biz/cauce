# PT-092 — Autorrevisión   `PHASE 6`

## Uno de los dos componentes no aplica, y decirlo es el trabajo

`QA-R01` no deja margen: *«opera SOLO desde el navegador, nunca lee código»*. Y el inventario de
Foundation declara que este sistema **no tiene rutas ni API**.

Un caso de QA sin navegador **no es un QA relajado: es otra cosa con el mismo nombre.** Montarlo
habría puesto `verify-qa` en verde y dejado `CASOS-DE-USO.md` diciendo que el ciclo completo se ha
ejercitado — fabricar un verde en el componente cuyo lema es *«sin captura el paso no ocurrió»*.

Es la misma decisión que `PT-072` tomó al **no declarar plataforma** en el proyecto de prueba. Y
aquel silencio destapó `H7`, el único hueco crítico de aquella prueba.

## `TD-15` contaba dos hechos distintos como uno

```
antes   «Tres de los seis componentes no se han ejecutado nunca»
ahora   uno PENDIENTE (FIDE) · uno que NO APLICA (QA)
```

Sumados, el número bajaba por dos motivos y nadie podía saber cuál. Es la distinción de `PT-058`
—`null` no es cero— aplicada a una deuda.

## Lo que ejecutar `FPGE` encontró, y leer no habría encontrado

**`INC-001`.** `PHASE 2` lee los hallazgos vivos, y aparecieron `H-001` y `H-006` en
`VALIDATION_PENDING` cuando los había cerrado **diecisiete commits antes**.

El commit de cierre **nunca existió**. `git commit -q` calla en éxito, y yo había filtrado su
salida con `grep -v ^warning | tail -2`: un mensaje corto de error se perdió ahí.

**Tercera vez en esta sesión** que filtrar antes de mirar esconde un fallo — `PT-088` y `PT-089`
fueron las otras dos, y en las dos lo escribí en el `no hacer`.

**Y nada lo habría cazado nunca.** `verify-ptsa` comprueba la matriz, los productos y los cierres
sin firma; **no comprueba que un cierre siga estando**. Va como `R-005` del roadmap, con
`EvidenceWeight 16` — el máximo, porque su evidencia es un incidente observado y no una inferencia.

## Dos de los seis factores de la prioridad son juicio, y se dice

| Observable | Juicio |
|:---|:---|
| `EvidenceWeight` · `Urgency` · `DomainMultiplier` · `Confidence` | `ScoreImpact` · `Effort` |

**Los dos que son juicio multiplican.** Publicar ocho números con decimal sin decirlo los haría
parecer un cálculo, y por eso §7 del roadmap existe y hay un caso que la comprueba.

## Lo que el verificador me obligó a cambiar, y tenía razón

`FPGE-R01` exige evidencia **en toda línea que nombre un `R-NNN`**, incluidas las de prosa. Mi
primera versión citaba `TD-15`, `QA-R01` y `COVERAGE.md` — fuentes reales sin identificador
reconocido. Cayeron doce.

Es más rígido de lo que parece necesario y es **correcto**: una fila que dice «esto es prioritario»
sin un identificador al lado es una opinión con número, que es literalmente lo que dice su mensaje.

## Lo que no se verifica, y está declarado

**Que el orden del roadmap sea el correcto.** Dependería de acertar en dos juicios. Lo que se
comprueba es que el juicio **esté declarado como tal**.

**Que `QA` no aplique de verdad.** Es una lectura de `QA-R01` contra un inventario que declara
ausencia de interfaz. Si mañana cauce tuviera una, la fila sale del catálogo.

`AC-01`..`AC-06`, los seis.
