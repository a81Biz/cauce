# `PT-151` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `npm run verify` incluye **todo** lo que corre el check `marco` | TS-01 | comparación derivada de las dos fuentes | `evidence/PT-151/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | La equivalencia **se comprueba**: un paso en un lado y no en el otro **falla** | TS-02 · TS-03 · TS-04 | `selftest` ×3 · `verify-fdge` | `evidence/PT-151/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | El `CLAUDE.md` puede decir «como en CI» **porque es cierto** | TS-01 | lectura, tras `AC-02` | `evidence/PT-151/salidas/claude-md.out` | n/a | `CUMPLIDO` |
| AC-04 | Se declara cuánto tarda la batería ahora | TS-05 | medición cronometrada · `chk` de nueve pasos | `evidence/PT-151/salidas/duracion.out` | n/a | `CUMPLIDO` |

**`AC-01` resultó ser más grande de lo que decía.** Pedía que `verify` incluyera lo de CI; medido,
hacían falta **las dos direcciones**: `matriz:check` corría en local y **no** en CI. Una
comprobación cuyo rojo **nadie ve en el PR** no es menos grave por ir al revés — es otra forma de
la misma promesa rota.

**`AC-02` es el criterio real, y siempre lo fue.** Igualar las listas hoy las deja iguales hoy; sin
contraste divergen a la primera adición, que es literalmente lo que pasó.

**`AC-04` no es cosmético.** La batería pasa a correr `verify-fdge --all`, que no es gratis:

| | |
|:---|:---|
| Batería completa, medida limpia | **1 559 325 ms · 26,0 min** |
| Antes de esta tarea (`PT-169`) | 1 415 445 ms · 23,6 min |

**Dos minutos y medio más**, y `verify` corre nueve pasos en vez de ocho. Alargarla sin decirlo
empuja a saltársela, y una batería que se salta no verifica nada.

**La cifra es de la corrida limpia, no de la primera.** Hubo dos corridas invalidadas —una leyó el
arnés a mitad de edición y otra arrancó con la anterior viva— y publicar su tiempo habría sido
publicar el de una medición que ya se descartó por otro motivo.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `SUITE-R01` sigue declarada **no verificable** | `audit` · `NO_VERIFICABLE 6` | `CUMPLIDO` |
| RC-02 | El token sigue llegando al paso que lo necesita, en **los dos** workflows | `selftest` ×2 | `CUMPLIDO` |
| RC-03 | Ninguna regla existente cambia de enunciado ni severidad | `verify-suite` | `CUMPLIDO` |
| RC-04 | Sin workflow o sin `package.json`: **SIN EVALUAR**, no fallo | `RULE-06` en el código | `CUMPLIDO` |

**`RC-01` nació de un error propio y lo cazó la batería.** La primera versión emitía `SUITE-R01` y
la sacó de `NO-VERIFICABLES.md`: la cifra bajó de **6 a 5**. Esa regla está declarada no verificable
con motivo y firma, y esta comprobación cubre **un aspecto**, no la regla — `CE-001`, el proxy en
lugar del hecho, en una herramienta que **publica cobertura**.

**`RC-02` cazó dos casos del patrón `superado`** (`SUITE-R61`): su ancla era `verify-fdge.mjs --all`
y cambió **por diseño** a `npm run verify:fdge`, que es lo que hace comparables las dos listas.
Ajustados con su motivo escrito, no en silencio.

## Lo que esta tarea destapó, y **tiene tarea**

Nada nuevo. Lo que apareció se resolvió dentro: la sobredeclaración de `SUITE-R01` → `SUITE-R62`, y
dos casos superados ajustados.
