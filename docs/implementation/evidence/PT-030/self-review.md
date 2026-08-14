# PT-030 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`tracker siguiente [PT-NNN]` responde qué produce la fase actual, qué la cierra, qué compuerta le
toca y qué la bloquea — **derivado** del registro cruzado con el estado real del issue.

```
selftest    320 → 334 casos
cobertura   97/174 reglas
```

## Lo que NO logra, y es lo primero que hay que decir

El intake pedía que el agente **«no sepa hacer nada»** sin consultar. No lo he conseguido, y no
se puede con un comando: **un comando no puede exigir haber sido llamado**. Si mañana avanzo de
fase sin ejecutarlo, nada me lo impide.

Lo que sí cambia es más pequeño y no es nada: la respuesta **existe fuera de mi cabeza**, es
citable, y cuando me equivoque se podrá señalar dónde decía otra cosa. Antes ni eso había — mi
criterio se comparaba consigo mismo.

Lo digo en la estrategia, en el `out-of-scope` y en la trazabilidad. Fingir un candado que no
existe sería peor que no ponerlo, porque nadie volvería a mirar.

## Lo que sí es mecánico

Un comentario humano sin responder **bloquea la respuesta**, y lo hace **antes** que todo lo
demás: preguntar qué sigue sin haber leído lo anterior es el defecto en su forma más pura, y ahí
el comando sí se niega a contestar.

Y sin `phase` declarada la respuesta es `SIN EVALUAR`. No adivina.

## Lo que un revisor debería atacar

**1 · `FASES` duplica lo que `PHASES.md` dice en prosa.** Es la copia que `SUITE-R38` avisa que
diverge. Mitigado declarando que ante conflicto manda `PHASES.md`, pero **nada lo comprueba**:
si alguien cambia una fase en el documento y no en la tabla, el comando mentirá con seguridad.
Es el riesgo más serio de esta tarea y no lo he cerrado.

**2 · La tabla es de FDGE.** Un proyecto con fases propias no las verá. Consistente con el resto
del marco, pero significa que la respuesta es genérica, no del proyecto.

**3 · `siguiente` sin argumento ordena por fase descendente** — asume que lo más avanzado es lo
más urgente. Suele serlo; no siempre.

## Lo que NO he verificado

Si esto cambia mi comportamiento. Es lo único que importa y solo lo dirán las próximas sesiones.
Hoy lo honesto es decir que he construido dónde mirar, no la obligación de mirar.

SELF_REVIEW_COMPLETE
