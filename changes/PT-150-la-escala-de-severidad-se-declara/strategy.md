# PT-150 · `strategy.md` — `PHASE 3` Strategy

## 1. Objetivo

Que la escala de severidad tenga **una sola definición, con contrato**, y que las tres
herramientas y las tres plantillas la deriven de ahí en vez de escribirla.

## 2. Solución — el mecanismo que `PT-144` acaba de dejar

`PT-144` construyó el patrón: una constante canónica en `patrones.mjs`, con su comentario de
contrato que **cita** su fuente sin parsearla, y sus aserciones en `verify-patrones.mjs` que
**fallan** al romperla.

`PT-150` es su primer uso sobre un hecho hermano, y por eso va la segunda del lote:

```
SEVERIDADES        en patrones.mjs — S1 S2 S3 S4, citando LEXICON §8.3
severidadValida()  la proyeccion que consumen tracker y verify-fdge
```

**Y esta tarea prueba el mecanismo antes que las cuatro herramientas.** Si el contrato de
`PT-144` no sirve para un caso pequeño y aislado, se sabe aquí y no en la quinta tarea. Es su
motivo de orden, escrito en `EP-022` §6.

## 3. Los cuatro consumidores, y qué le pasa a cada uno

| Consumidor | Hoy | Después |
|:---|:---|:---|
| `tracker.mjs:2556` | `['S0','S1','S2','S3']` a mano | deriva de `SEVERIDADES` |
| `tracker.mjs:2595` | mensaje que **atribuye la lista a `LEXICON`** | enumera lo que `LEXICON` declara de verdad |
| `verify-fdge.mjs:166` | `/(S[1-4])/` — correcto, pero **escrito a mano** | se construye desde `SEVERIDADES`, sin barras invertidas escritas (`SUITE-R59`) |
| `INTAKE/templates/` ×3 | `S1 \| S2 \| S3 \| S4` en un comentario | **no cambian**: ver §4 |

## 4. La plantilla: qué cambia y qué no

El hallazgo de `PHASE 2` es que `CHANGE-REQUEST.md` trae `severity: S4` por defecto y el comando
lo rechaza. **La corrección no es tocar la plantilla: es arreglar el comando.**

`S4` es el valor **correcto** para un `CHANGE-REQUEST` —`LEXICON` lo define como «deuda sin
impacto observable, se agrupa en lotes», que es literalmente lo que un `CHORE` de lote es— y la
plantilla ya enumera `S1 | S2 | S3 | S4` en su comentario, que también es correcto.

**La plantilla no está mal. El comando sí.** Cambiarla para que proponga `S3` sería acomodar el
documento al defecto, que es la dirección inversa a `LEX-R21`.

Lo que sí se añade es **la prueba de que ese caso funciona**: un `TS` que copia el valor por
defecto de la plantilla y lo pasa a `asignar`. Sin esa prueba, el mismo desajuste puede volver
sin que nada avise.

## 5. Alternativas evaluadas

| Alternativa | Por qué se rechaza |
|:---|:---|
| **Dejar `S0` y añadirlo a `LEXICON`** | Es la opción `B` de `discovery.md` §7 y **es legítima** — pero no es de esta tarea: cambiar la escala de severidad de la suite es metodología, y hacerlo desde una herramienta es la dirección que `LEX-R21` prohíbe. Queda declarada. |
| **Corregir las cinco allocations históricas** | `AC-06` lo prohíbe explícitamente. Están `INTEGRATED`; son **la evidencia de que el defecto existió**, y borrarla para que cuadre una cifra es perder el rastro. |
| **Cambiar la plantilla a `S3`** | Acomoda el documento al defecto. Ver §4. |
| **Solo arreglar `tracker` y no tocar `verify-fdge`** | Dejaría el `S[1-4]` escrito a mano: correcto hoy, y la siguiente copia que diverja. Es el mismo defecto un archivo más allá. |
| **Parsear `LEXICON.md` en runtime** | `RULE-02`, y ya se rechazó en `PT-144` por el mismo motivo. |

## 6. Riesgos

| Riesgo | Mitigación |
|:---|:---|
| **`verify-fdge` empieza a cazar `S0` en trabajo vivo** | No hay: la única allocation con `S0` está `INTEGRATED`, y lo terminal no se rejuzga. Medido en `discovery.md` §3 |
| El regex de `verify-fdge` se degrada al construirse | `SUITE-R59` — se construye con el normalizador de `patrones.mjs`, sin barras invertidas escritas, y `RULE-02` exige el caso que lo tumbe |
| `AC-07` promete más de lo que puede dar | Ver §7. Se declara en vez de fingirlo |

## 7. `AC-07` no se puede cumplir como está escrito, y se dice

`AC-07` pide que *«un valor de severidad fuera de la escala no pueda entrar al registro por
ningún camino»*. **No es alcanzable**: `REGISTRY.json` es un archivo y se puede escribir a mano —
así entraron los cuatro `S4`, y el `HANDOFF` lo tiene en su lista de `no hacer` precisamente
porque se puede.

Lo alcanzable, y lo que se ejecuta:

```
por comando     asignar rechaza lo que no esta en la escala
por verificador verify-fdge CAZA una severidad fuera de escala en trabajo VIVO
a mano          sigue siendo posible, y lo caza el verificador en la siguiente corrida
```

Prometer «por ningún camino» sería `SUITE-R26`: afirmar una garantía que el mecanismo no da. El
`AC` se cumple **por la vía del verificador**, y así se registra en `traceability.md`.

## 8. Autorrevisión

```
Contradicciones con el intake:   NINGUNA de fondo. AC-07 se PRECISA en 7 —de «ningun
                                 camino» a «comando + verificador»— porque el original
                                 prometia una garantia que el mecanismo no da (SUITE-R26).
Dependencias faltantes:          ninguna. PT-144 esta DONE y su contrato existe.
RULE-nn violadas:                ninguna.
AC no cubiertos:                 ninguno.
Alcance que crecio:              verify-fdge.mjs y un TS sobre el valor por defecto de la
                                 plantilla. Los dos salen del mismo hecho —la escala— y
                                 caben en «tracker.mjs consume la escala» sin estirarlo.
```
