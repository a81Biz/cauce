# EP-015 — La continuidad de sesión

```yaml
---
id: EP-015
created: 2026-08-18
status: IN_PROGRESS
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común   `[HUMANO]`

> «Garantizar ejecución segura, reanudable y determinista de tareas independientemente de la
> duración o límite de una sesión de IA» · y, sobre el orden: «EP-014 → infraestructura ·
> EP-015 → continuidad · EP-016 → multiusuario/topología»

Que **la sesión sea el worker y no el estado**. Una tarea tiene que poder pararse, cambiar de
sesión y continuar **sin reconstruir el contexto leyendo el repositorio entero** — y, sobre todo,
sin **empezar** lo que no va a poder terminar.

`EP-014` dejó la fontanería: `CHECKPOINT.json` con `LEX-R26`, la transición en un acto y la
proyección. Este lote pone encima lo que hace que un corte de sesión **no cueste nada**.

## 2. Criterio de éxito del lote   `[HUMANO]`

El escenario de trece pasos de la especificación, **ejecutado de verdad**: una tarea que no cabe en
una sesión se detiene **antes** de empezar la unidad que no cabría, deja checkpoint y handoff, y la
sesión siguiente **valida el árbol** y continúa desde el siguiente punto pendiente sin repetir el
análisis.

Medible: reanudar una tarea a mitad **no** vuelve a abrir los documentos que la sesión anterior ya
leyó, y un árbol que **no corresponde** al checkpoint **detiene** la reanudación en vez de
continuar sobre una suposición.

## 3. Qué NO entra en el lote   `[HUMANO]`

```
OUT: los rangos de ID, la identidad multiusuario y que rama resuelve G4  → EP-016
OUT: medir el contexto restante del modelo. El marco NO PUEDE, y fabricarlo
     seria un dato falso CON FORMA DE MEDIDA (decision 4 del firmante)
OUT: los campos «decisions», «blockers» y «estimated_used» de la especificacion
     seccion 5. Ninguno se DERIVA de nada: LEX-R26 los deja fuera POR CRITERIO
OUT: publicar. Decision humana explicita, sostenida en cinco lotes
```

**La segunda y la tercera son la misma decisión, y conviene entenderla.** La especificación de la
que nace este lote pide un presupuesto con `estimated_capacity: 100` y `estimated_used: 67`, y en
su §12 prohíbe *«depender de que el modelo detecte que se está quedando sin contexto»*. Las dos
cosas juntas no se sostienen: si el modelo no lo mide y el harness no lo expone, **ese 67 lo
inventaría cauce**.

Lo que sí hay son **56 PT cerrados** con sus archivos, commits, notas y casos. El presupuesto sale
de ahí —de la historia de este repositorio— o no sale.

## 4. Firma única   `[HUMANO]`

```
Solicitado por: Alberto Martínez (delegada — «continúas con la EP», 2026-08-18; las cinco
                decisiones del 2026-08-15 siguen vigentes y gobiernan este lote)
Fecha: 2026-08-18
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ

La decisión que gobierna este lote, tomada por el firmante el 2026-08-15:
  4  presupuesto  DERIVADO de señales observables e historial. NUNCA una cifra de
                  tokens que el marco no puede medir. Y el sistema distingue
                  MEDIDO / ESTIMADO / SIN EVALUAR, sin presentar nunca una
                  estimacion como una medicion

Estado: FIRMADA · G1 PASS
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote   `[AGENTE]`

| Orden | PT | Sev | Qué resuelve | Depende de |
|:--|:--|:--|:--|:--|
| 1 | `PT-056` | S1 | **`STATE_MISMATCH`**: que el árbol **corresponda** al `sha`, no solo que exista | — |
| 2 | `PT-057` | S2 | El coste de una tarea, **derivado** del historial | — |
| 3 | `PT-058` | S1 | `MEDIDO` / `ESTIMADO` / `SIN EVALUAR`: cada cifra declara **qué es** | `PT-057` |
| 4 | `PT-059` | S1 | La compuerta `SAFE`/`MARGINAL`/`UNSAFE` y `BLOCKED_BY_CONTEXT` | `PT-058` |
| 5 | `PT-060` | S2 | `SESSION.json` y el handoff **derivado**: la sesión como worker | `PT-056` · `PT-059` |

**`PT-056` va primera y no es preferencia.** Es el único hueco que `EP-014` dejó **a medias** —el
`sha` se comprueba alcanzable, no correspondiente— y es el más peligroso: un checkpoint que
describe un árbol que ya no existe **miente sin que nada lo note**. Todo lo que viene detrás
confía en que el checkpoint diga la verdad.

**`PT-058` va antes que `PT-059`** porque una compuerta que decide sobre cifras **sin saber de qué
tipo son** es exactamente el `estimated_used: 67` que `LEX-R26` dejó fuera. Primero se sabe qué es
cada dato; después se decide con él.

## 6. Análisis de solapamiento   `[AGENTE]`

```
tools/verify-fdge.mjs   PT-056 (STATE_MISMATCH) · PT-059 (la compuerta)  → SERIALIZADOS
tools/tracker.mjs       PT-057 · PT-058 · PT-059 · PT-060               → SERIALIZADOS
tools/patrones.mjs      PT-058 (el contrato de las tres naturalezas)     → solo
LEXICON                 PT-058 · PT-059 (BLOCKED_BY_CONTEXT) · PT-060    → SERIALIZADOS
RULES                   PT-056 · PT-059 si alguna necesita regla nueva   → SERIALIZADOS

Ejecucion SECUENCIAL, en el orden de §5. Ningun par corre en paralelo.
```

## 7. Supuestos compartidos   `[AGENTE]`

```
- LEX-R26 rige TODO lo que se escriba: si un campo no se deriva, NO ENTRA. Vale para
  CHECKPOINT.json y valdra para SESSION.json.
- BLOCKED_BY_CONTEXT es estado de TAREA y va a LEXICON. Los estados de SESION
  —CHECKPOINTING, HANDOFF_REQUIRED, WAITING_NEW_SESSION— NO van al registro:
  SUITE-R09 haria permanente lo que es mecanica transitoria.
- El handoff automatico NO sustituye a HANDOFF.md ni lo reescribe entero: se DERIVA
  del checkpoint, y HANDOFF.md sigue siendo prosa humana con su sello.
- La medida de si EP-014 funciono se cobra AQUI: cuantas veces FDGE-R52 vuelve a
  cazar la misma transicion. En EP-014 fueron TRES, todas antes de que avanzar
  existiera. Se cuenta al cerrar el lote.
```

## 8. Observaciones del agente   `[AGENTE]`   `INTAKE-R07`

```
- LA PARADOJA DE ARRANQUE, otra vez y ahora de verdad: este lote construye lo que
  haria seguro construirlo. EP-014 existio para que este no se hiciera a mano, y
  aun asi PT-059 no podra usarse a si mismo hasta estar terminado.
- CINCO tareas y TRES son S1. Es el lote con mas severidad alta de la serie, y
  FDGE-R41 sigue aplicando: el primer BLOCKED lo detiene entero.
- LA TENTACION DE ESTE LOTE TIENE NOMBRE: inventar una cifra de contexto restante
  porque hace la compuerta mas util. La decision 4 lo prohibe y LEX-R26 ya lo dejo
  fuera de CHECKPOINT.json. Si en PHASE 2 la medida dice que el presupuesto derivado
  no basta para decidir, SE DICE — no se rellena.
- PT-056 puede descubrir que «corresponder» es mas dificil de lo que suena: un arbol
  sucio corresponde a su sha con cambios encima, y eso es NORMAL mientras se trabaja.
  Distinguir «cambios esperados» de «arbol equivocado» es el trabajo real.
```

## 9. Resultado de la compuerta `G1`   `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]
DoR-E5 EP asignado desde REGISTRY.json             [x]
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado          [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | **8.2.0** · `MINOR`: ninguna regla nueva ni modificada, y nada que rompa |
| Regenerar `CORE.md` si alguna tarea toca `LEXICON`, `RULES` o `PHASES` | **hecho** · las cinco tocaron `LEXICON`; `PT-060` además `PHASES` e `INSTALL`. 245 reglas |
| **El criterio de éxito, ejecutado**: el escenario de la especificación, de verdad y con su evidencia | **hecho** · `evidence/EP-015/criterio-de-exito-ejecutado.txt`, con **dos intentos fallidos declarados** y lo que **no** demuestra |
| **Cobrar la medida de `EP-014`**: cuántas veces volvió a cazar `FDGE-R52` la misma transición | **cero, sobre 40 transiciones** · en `EP-014` fueron tres. `tracker avanzar` hace la nota uno de sus siete actos y se niega sin `--nota`: el olvido dejó de ser **posible** |
| Qué queda para `EP-016`, con lo aprendido | **declarado abajo** |

## Qué queda para `EP-016`, con lo aprendido

`EP-016` es la topología multiusuario, y este lote le deja tres cosas dichas:

**Lo que ya no hace falta discutir.** `SESSION.json` es de **una** sesión: al abrir se sobrescribe.
Con dos personas trabajando eso no basta, y el sitio donde se decide qué hacer con ello es
`EP-016` — con la decisión 2 del firmante ya tomada (rangos reservados por persona, sin
namespacear el identificador).

**Un hueco que este lote midió y no cerró.** «Un día» sigue siendo la aproximación a «una sesión»
cuando nadie abrió una. Con varias personas empeora: el día de dos personas son dos sesiones que
`porSesion()` cuenta como una, y el techo histórico —del que depende `AC-06` de `PT-059`— sale
inflado. No se arregla aquí porque arreglarlo bien es saber **de quién** es cada commit, que es
exactamente lo que `EP-016` va a construir.

**Y una advertencia de método, no de código.** Tres tareas de este lote encontraron que su
enunciado era imposible o su señal estaba contaminada, y las tres lo descubrieron **midiendo en
`PHASE 2`**, no leyendo. `EP-016` toca ramas y permisos, donde una suposición equivocada no se
nota hasta que alguien pierde trabajo.

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
