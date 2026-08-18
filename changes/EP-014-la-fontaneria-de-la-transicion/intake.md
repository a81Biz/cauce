# EP-014 — La fontanería de la transición

```yaml
---
id: EP-014
created: 2026-08-15
status: IN_PROGRESS
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común   `[HUMANO]`

> «ataquemos todo con el mismo protocolo en una nueva épica» · y, sobre las cinco decisiones:
> «EP-014 → infraestructura · EP-015 → continuidad · EP-016 → multiusuario/topología»

Que **una transición de fase sea un solo acto**, y que **iterar un caso deje de costar la batería
entera**. Nada de esto añade una regla: hace ejecutable el procedimiento que `PHASES.md` ya
describe y que hoy depende de que alguien se acuerde de los cinco pasos.

Sale de una medida, no de una impresión. En `EP-013`:

```
65 transiciones de fase x 5 actos manuales   ≈ 325 operaciones en UNA sesion
8 fallos de CI                               los ocho, por hacer 4 de los 5 actos
541 + 454 lineas por vuelta de verificacion  de las que ~99 % dicen OK
>15 vueltas completas de la bateria          para estrenar seis casos
```

Y una observación que no es de disciplina: `FDGE-R52` cazó **la misma transición** —`PHASE 3 → 4`—
**tres veces**. Siempre la misma, siempre por lo mismo: esa fase produce seis archivos, se empieza
a escribirlos y la transición se da por hecha. **Una disciplina que falla tres veces en el mismo
punto no se arregla con más disciplina.**

## 2. Criterio de éxito del lote   `[HUMANO]`

Una transición de fase se ejecuta con **un comando**, que **se niega a avanzar sin la nota de
reanclaje**, y deja el `CHECKPOINT.json` y la proyección escritos. Y la vuelta de iteración de un
caso nuevo baja de la batería completa a su bloque.

Medible: repetir la instrumentación de `EP-013` sobre este lote debe dar **una** operación por
transición en vez de cinco, y **cero** fallos de CI por desincronización de estado.

## 3. Qué NO entra en el lote   `[HUMANO]`

```
OUT: el presupuesto de sesion, SAFE/MARGINAL/UNSAFE, BLOCKED_BY_CONTEXT,
     el handoff automatico y STATE_MISMATCH             → EP-015
OUT: los rangos de ID reservados, la identidad multiusuario, que rama
     resuelve G4 y la convivencia de dos personas       → EP-016
OUT: publicar. Decision humana explicita, sostenida en cuatro lotes
OUT: bajar las 62 reglas sin verificador de TD-08. Sigue siendo deuda MEDIDA
```

**La frontera entre este lote y `EP-016` es deliberada y conviene entenderla.** `PT-054` construye
la proyección a `cauce/<usuario>` **para el usuario de git actual**, en singular. `EP-016` añade
los rangos de ID y la convivencia de dos personas. No es construirlo dos veces: es construirlo una
vez y extenderlo — la alternativa era dejar la visibilidad esperando al lote que rompe
compatibilidad.

## 4. Firma única   `[HUMANO]`

```
Solicitado por: Alberto Martínez (delegada — cinco decisiones tomadas y escritas el 2026-08-15;
                delegación de G1, G2 y G3 vigente desde 2026-08-14)
Fecha: 2026-08-15
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ

Las cinco decisiones que este lote y los dos siguientes ejecutan, tomadas por el firmante:
  1  cauce/<usuario>   DERIVADA, no autorada. No se crea una segunda fuente de verdad
  2  IDs multiusuario  RANGOS RESERVADOS. No se modifica SUITE-R08 ni se namespacea el ID
  3  usuario en git    EN LA RAMA DE TAREA. «trabajo» sigue siendo unica
  4  presupuesto       DERIVADO de señales observables e historial. Nunca presentar una
                       estimacion como una medicion: MEDIDO / ESTIMADO / SIN EVALUAR
  5  implementacion    TRES EP, en este orden: EP-014 → EP-015 → EP-016

Estado: FIRMADA · G1 PASS
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote   `[AGENTE]`

| Orden | PT | Tipo | Sev | Qué resuelve | Depende de |
|:--|:--|:--|:--|:--|:--|
| 1 | `PT-049` | CHORE | S3 | El verde se **cuenta**, no se enumera: `-q` con el recuento intacto | — |
| 2 | `PT-050` | CHORE | S3 | `selftest --solo <patrón>`: iterar sin pagar la batería entera | `PT-049` |
| 3 | `PT-051` | CHORE | S4 | `regla <ID> --donde`: archivo y línea del `fail()` que la ejecuta | — |
| 4 | `PT-052` | CHORE | S2 | `CHECKPOINT.json`: el estado en curso, estructurado y atado al SHA | `PT-051` |
| 5 | `PT-053` | CHORE | S1 | `tracker avanzar`: los cinco actos, atómicos, con la nota obligatoria | `PT-052` |
| 6 | `PT-054` | CHORE | S2 | `cauce/<usuario>`: la proyección derivada | `PT-053` |

**`PT-049` y `PT-050` van primeras y no es preferencia:** cambian **cómo se ejecutan las otras
cuatro**. Es la misma lógica por la que `PT-047` fue primera en `EP-013` — si el modo silencioso
entra al final, las cuatro tareas grandes se habrán hecho pagando 995 líneas por vuelta.

**`PT-053` va después de `PT-052`** porque `avanzar` **escribe** el checkpoint: definir el
artefacto antes que quien lo produce evita que el formato lo decida la implementación.

**`PT-054` va última** porque proyecta lo que `avanzar` deja escrito. Sin `PT-053` no hay qué
proyectar, y construirla antes obligaría a inventar el disparador.

## 6. Análisis de solapamiento   `[AGENTE]`

```
tools/selftest.sh      PT-049 · PT-050 · y los casos de las otras cuatro   → SERIALIZADO
tools/verify-fdge.mjs  PT-049 · PT-052 (lee el checkpoint)                 → SERIALIZADO
tools/tracker.mjs      PT-052 · PT-053 · PT-054                            → SERIALIZADO
tools/regla.mjs        PT-051                                              → solo
tools/patrones.mjs     PT-052 (el contrato del checkpoint)                 → solo
LEXICON · PHASES       PT-052 · PT-053 (artefacto y procedimiento nuevos)  → SERIALIZADO

Ejecucion SECUENCIAL, en el orden de §5. Ningun par corre en paralelo.
```

`tools/tracker.mjs` lo tocan **tres** tareas seguidas. Es el solapamiento más denso del lote y por
eso van consecutivas: `PT-052` escribe el artefacto, `PT-053` lo produce, `PT-054` lo proyecta.

## 7. Supuestos compartidos   `[AGENTE]`

```
- Nada de este lote añade una REGLA nueva de comportamiento: hace ejecutable lo que
  PHASES.md ya describe. Si alguna tarea necesita una regla, se declara en su
  spec-changes y el lote deja de ser MINOR.
- El modo silencioso NO puede callar el recuento. Un «sin errores» sin denominador es
  literalmente lo que PT-002 corrigio, y PT-023 lo volvio a encontrar en otra forma.
- CHECKPOINT.json es TRANSITORIO y se sobrescribe, como HANDOFF.md. Las transiciones
  se apilan en SESSION_LOG.md, como HISTORY.log. NO se crea un ledger nuevo: SUITE-R09
  haria permanente lo que es mecanica de sesion.
- cauce/<usuario> solo recibe commits de MAQUINA. Si alguien escribe ahi a mano, deja
  de ser derivada y vuelve a ser una segunda fuente — que es lo que la decision 1
  existe para impedir.
- El usuario se toma de la configuracion de git. La identidad multiusuario, con sus
  rangos, es de EP-016.
```

## 8. Observaciones del agente   `[AGENTE]`   `INTAKE-R07`

```
- SEIS tareas y dos de ellas (PT-053, PT-054) son mayores que cualquiera de EP-013. El
  intake de EP-013 escribio «lote demasiado grande para una sola firma: ES EL RIESGO
  REAL» con ocho tareas pequeñas. Aqui son menos y mas grandes, y FDGE-R41 sigue
  aplicando: el primer BLOCKED detiene el lote entero.
- ESTE LOTE SE ABRE CON EP-013 EN «DONE», ESPERANDO G4. FDGE-R48 lo permite —cuenta
  VIVOS = DRAFT/READY/REOPENED/IN_PROGRESS/BLOCKED, y DONE no esta— y SUITE-R46 habla
  de CERRAR, no de abrir. Pero el precedente es el contrario: EP-013 nacio DESPUES de
  que EP-012 fuera CLOSED. Hasta que el firmante resuelva G4, «main» queda DOS lotes
  por detras del tablero. No rompe ninguna regla y conviene que se vea.
- PT-053 toca la mecanica que el propio agente usa para trabajar. Cambiarla a mitad
  del lote significa que las tareas posteriores se ejecutan con la version nueva y las
  anteriores no: la comprobacion inversa de PT-053 tiene que correr sobre un fixture,
  no sobre el repositorio vivo.
- LA PARADOJA DE ARRANQUE, dicha en voz alta: la capa de continuidad de EP-015 es
  justo lo que haria seguro construir EP-015. Este lote existe para que EP-015 y
  EP-016 no se construyan a mano con ~325 operaciones por sesion.
- PT-052 y PT-053 introducen vocabulario nuevo (CHECKPOINT.json, la accion «avanzar»).
  LEX-R21 manda que los nombres vivan en LEXICON: si no se hace, el nombre nace fuera
  y es un defecto, no un descuido.
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
| Entrada de `CHANGELOG.md` y número de versión — **`MINOR`** si ninguna tarea añade regla vinculante | pendiente |
| Regenerar `CORE.md` si `PT-052` o `PT-053` tocan `LEXICON` o `PHASES` | pendiente |
| Medir el lote **con su propia instrumentación**: operaciones por transición y fallos de CI, contra la línea base de `EP-013` | pendiente |
| Qué queda para `EP-015` y qué para `EP-016`, con lo aprendido construyendo la fontanería | pendiente |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
