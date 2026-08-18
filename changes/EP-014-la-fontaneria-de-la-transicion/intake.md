# EP-014 — La fontanería de la transición

```yaml
---
id: EP-014
created: 2026-08-15
status: CLOSED
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
| Entrada de `CHANGELOG.md` y número de versión — **`MINOR`** si ninguna tarea añade regla vinculante | HECHO |
| Regenerar `CORE.md` si `PT-052` o `PT-053` tocan `LEXICON` o `PHASES` | HECHO |
| Medir el lote **con su propia instrumentación**: operaciones por transición y fallos de CI, contra la línea base de `EP-013` | HECHO |
| Qué queda para `EP-015` y qué para `EP-016`, con lo aprendido construyendo la fontanería | HECHO |

### Cómo se resolvió cada una   `SUITE-R45`

**1 · `CHANGELOG` 8.1.0, `MINOR`.** Una regla nueva —`LEX-R26`— y un artefacto nuevo, sin romper
nada: ningún proyecto instalado tiene hoy un `CHECKPOINT.json` que pueda quedar en rojo, y
`INSTALL.md` declara que **no se siembra** precisamente para que no lo tenga. La condición que la
fila planteaba —«`MINOR` si ninguna tarea añade regla vinculante»— **no se cumplió**, y sigue
siendo `MINOR`: `SUITE-R19` reserva `MAJOR` para lo que rompe compatibilidad, no para lo que añade.

**2 · `CORE.md` regenerado tres veces**, una por cada tarea que tocó `LEXICON`: `PT-052`
(`CHECKPOINT.json` y `LEX-R26`), `PT-053` (`avanzar`) y `PT-054` (`proyectar`). 244 → **245
reglas**.

**3 · El lote, medido con su propia instrumentación:**

```
                              EP-013        EP-014
notas de reanclaje              75            48
selftest, por vuelta           541 lineas     2 con -q      (-99,6 %)
verify-fdge --all              507 lineas    30 con -q      (-94,1 %)
selftest, tiempo               209 s        138 s con --solo (-34 %)
casos                          520 → 456… 520   520 → 618   (+98)
cobertura mecanica             110/181       112/181
reglas sin verificador          62            60
transiciones con «avanzar»       0            12 de 48
```

La cifra que importa es la última. **`avanzar` existió durante las dos últimas tareas**, y en ese
tramo hizo **12 transiciones** — las **ocho** de `PT-054` incluidas, que es la primera tarea del
repositorio hecha **entera** con un solo comando por transición.

**Y la medida honesta de si funcionó no es ésa.** Está declarada en `PT-053` y se cobra en
`EP-015`: **cuántas veces `FDGE-R52` vuelve a cazar la misma transición.** En `EP-014` fueron
**tres**, todas antes de que `avanzar` existiera.

**4 · Qué queda para `EP-015` y para `EP-016`.**

| Para | Qué recibe hecho | Qué tiene que añadir |
|:---|:---|:---|
| `EP-015` | `CHECKPOINT.json` con `LEX-R26` —si no se deriva, no entra— y el `sha` **alcanzable** | El presupuesto derivado del historial, `SAFE`/`MARGINAL`/`UNSAFE`, `BLOCKED_BY_CONTEXT`, el handoff automático y **`STATE_MISMATCH`**: que el **árbol corresponda** al SHA, que aquí no se comprueba |
| `EP-016` | `proyectar` y la rama `cauce/<usuario>` derivada, con su marca | Los rangos de ID reservados, el usuario en la rama de tarea, y qué rama resuelve `G4` con varias personas |

**Y una advertencia que `EP-015` necesita antes de empezar:** la especificación de la que nace pide
en su §5 un checkpoint con `decisions`, `blockers` y `estimated_used`. **Ninguno se deriva de
nada**, y `LEX-R26` los deja fuera por criterio, no por olvido. Está en el «no hacer» del `HANDOFF`
con esas palabras.

### Lo que este lote enseñó, y no está en ninguna tarea

**Los actos de una transición no eran cinco: eran siete.** El intake contó los que se hacían a
mano; el espejo lo descubrió `npm run verify` en rojo y el sello del `HANDOFF` lo descubrió la CI,
**con el comando ya escrito y una de las dos veces ya integrado**.

Eso es, en sí, el argumento del lote: **si un humano tenía que acordarse de siete actos, se
olvidaba de dos incluso cuando su única tarea era enumerarlos.**

Y el patrón que se repitió en las seis tareas: **cada una encontró, ejecutando, algo que su propio
diseño daba por resuelto.** `PT-050` descubrió que las «dos únicas puertas» eran cuatro. `PT-051`
descubrió que la herramienta contaba emisiones dentro de comentarios. `PT-052` vio su
`spec-changes` pasar de una fila a seis. `PT-054` corrigió su propia estrategia al implementarla.

Ninguno de esos hallazgos se ve leyendo.

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.

---

## Constancia de la compuerta `G4`   `EXEC-R04` · `SUITE-R06a`

```
G4 resuelta el 2026-08-18 por Alberto Martinez:

  «haz el PR y el merge con lo que falte de G4 para las tareas y lo que sea
   bloqueante a mi nombre para que avanzar y continuas con la EP»

Pull request de «trabajo» a «main»: #102.
```

`SUITE-R42` dice que el agente no abre ni fusiona el PR de la rama por defecto, y `EXEC-R04` y
`SUITE-R06a` dejan el merge en manos humanas sin excepcion. Esto es **una persona autorizando con
registro**, que es lo que la regla de cumplimiento admite y lo que ya ocurrio en `EP-011`
(`6eb9825`), `EP-012` (`4dd9b01`) y `EP-013` (`2c20db8`).

**Sin excepciones declaradas.** A diferencia de `EP-013` —donde `--gate G4` bloqueaba por las filas
de cierre de un lote recien abierto— aqui las seis tareas y el lote llegan con todas sus
precondiciones en verde. El unico bloqueo era `SUITE-R42`, que **el propio PR resuelve**: es la
comprobacion existiendo para lo que existe, no una traba.

El defecto que aquella excepcion abrio sigue en el tablero como `PT-055` (#94), sin cerrar y sin
disimular.
