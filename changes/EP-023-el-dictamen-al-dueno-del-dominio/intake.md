# Intake — LOTE `EP-023` · `DICTAMEN`

> **`G1` resuelta como `CHALLENGE`, aceptado por el firmante el 2026-08-24.** No es un `PASS`.
>
> El agente **desafió** esta admisión (`INTAKE-R07`): `DoR-E6` exige que cada PT del lote tenga su
> Intake completo, y este lote **no está descompuesto**. El firmante, informado de eso, ordenó
> firmarla igualmente. La plantilla contempla exactamente este caso —`VEREDICTO: CHALLENGE` con la
> línea `CHALLENGE aceptado por`— y por eso el lote avanza **sin que el hueco desaparezca del
> registro**. Ver §9.
>
> Este Intake nació para que **nada de lo decidido se pierda** —*«crea la siguiente épica que no
> quiero que se me olvide ni pase nada»*—. Sigue siendo eso: un lote **admitido y sin trabajo
> admitido dentro**.
>
> Plantilla: `INTAKE/templates/EPIC-INTAKE.md` (`INTAKE-R09`)

```yaml
---
id: EP-023
created: 2026-08-24
# G1 CHALLENGE aceptado · 2026-08-24 — el comentario va AQUI y no al final de la linea
# de «status»: tracker la lee con /^status:[ 	]*\S+[ 	]*$/m y un comentario en linea
# la hace invisible, con el mensaje «no declara status» cuando SI lo declara. Tiene tarea
# propia en EP-026; no se cita aqui su identificador porque INTAKE-R09 exigiria su carpeta.
status: DEFERRED
mode: SUPERVISED
origin: DIRECT
depende_de: EP-022
---
```

---

## 1. Objetivo común `[HUMANO]` · BORRADOR

**`DICTAMEN` es el séptimo componente de la suite**, y responde la pregunta que cauce hoy no
responde.

| Pregunta | Componente | Existe |
|:---|:---|:---:|
| ¿Hace lo que dice que hace? | PTSA | sí |
| ¿Puede alguien usarlo? | FQAGE | sí |
| ¿Qué construimos ahora? | FPGE | sí |
| **¿Vale la pena? ¿Dónde está parado respecto al mundo? ¿A dónde llega si hace qué?** | **DICTAMEN** | **no** |

**El hueco es estructural, no un olvido.** El único lugar donde cauce mira hacia afuera es
`FIDE PHASE 1 Discovery` —«búsqueda web real: 3 competidores · monetización · stack»
(`FIDE-Implementation.md:27`)—, es decir **una sola vez, antes de que el sistema exista**, y FIDE
se retira después. A partir de ahí todo el marco es autorreferencial: cada score se calcula
contra la Declaración de Valor que el propio sistema firmó. **Un sistema puede sacar `A` en PTSA
y ser irrelevante, y ninguna herramienta del marco lo notaría.**

Y no está ni siquiera **declarado** como hueco: `CASOS-DE-USO.md:7` dice que «un caso que no esté
aquí es un hueco declarado, no un silencio», y este caso no está ni en los casos ni en
`## Huecos declarados`. Es un silencio, contra el propio contrato de cobertura del catálogo.

### Lo decidido, que es lo que este archivo protege

| # | Decisión | Quién |
|:--|:---|:---|
| 1 | **Componente nuevo**, no extensión de PTSA. `PTSA-R14` (evidencia sobre opinión) y `PTSA-R18` (evidencia de primera mano) no admiten evidencia web sin ser reescritas, y reescribirlas contamina una norma de 82 reglas que hoy funciona | firmante |
| 2 | Nombre **`DICTAMEN`** · trigger **`[START DICTAMEN]`** · reglas **`DICT-Rnn`** | firmante |
| 3 | **Genérico**: cualquier sistema, siempre que **haya código** — no una idea. Se estrena sobre cauce mismo (`SUITE-R41`) | firmante |
| 4 | En un **legado** entrega un formato legible por una persona, no solo el compendio para empezar a trabajar. Ahí **se combina con Foundation** | firmante |
| 5 | **El destinatario es el dueño del negocio, y NO es técnico.** PTSA mira hacia dentro y habla técnico; `DICTAMEN` mira hacia fuera y habla dominio | firmante |
| 6 | **La evidencia externa DEBE ser admisible**: es el punto de comparación, o uno de ellos | firmante |
| 7 | **Sin comparables directos**: los análogos más cercanos; si no hay ninguno, **el mercado de la categoría como benchmark** (la analogía del firmante: el `S&P500` y los *spiders* cuando construyes un portafolio único) | firmante |
| 8 | **Vigencia, no caducidad.** No se pone fecha de caducidad: se mide **la distancia al presente** — cuánto se está atrasado hoy respecto a competidores, mercado y mejores prácticas | firmante |
| 9 | **El índice es privado.** Por proyecto y por corrida, vive en el repositorio del proyecto —nunca en cauce— y **la siguiente corrida reevalúa todo** | firmante |
| 10 | **Buscar en web es una acción hacia afuera en modo `AUTONOMOUS`.** Si cabe en `SUITE-R06`, entra ahí; si no, se escribe una regla nueva | firmante |
| 11 | **La salida es un menú de decisiones**, no una calificación: todo · por partes (cuáles y en qué orden) · solo reparar · nada. La medición existe para **ordenar** esas opciones | firmante |
| 12 | **Dueños del dominio: uno o varios**, pueden coincidir o no con el técnico. Se preguntan, se declaran y quedan guardados con esa propiedad. A diferencia de las compuertas, que decide un solo técnico | firmante |
| 13 | **Aditivo por restricción**: se integra al resto sin romper ni cambiar lo que ya está. Si el diseño exige modificar la Declaración de Valor existente, se ha salido del alcance | firmante |
| 14 | La **aceptación del Dictamen NO es una compuerta**: es un artefacto propio. Convertirla en compuerta cambiaría la semántica de `G1`–`G4` para todos los proyectos instalados | agente, aceptado |
| 15 | Con varios dueños, **basta que uno acepte y queda escrito quién**. Si un proyecto necesita unanimidad, lo declara | agente, por defecto |

### Diseño propuesto, todavía sin cerrar

**Cinco dimensiones, cada una con `(score, confianza, vigencia)` — nunca solo score:**

```
M1  Claridad     ¿un tercero entiende qué es, para quién y por qué, sin ayuda?
M2  Sustancia    ¿hace lo que dice?   → SE IMPORTA de PTSA. No se recalcula. Se TRADUCE
M3  Posición     qué tiene, qué le falta, qué tiene que nadie más — contra los comparables
                 DECLARADOS, no contra los que el agente elija
M4  Fricción     cuánto cuesta empezar, y qué evidencia hay de que alguien lo hizo
M5  Trayectoria  distancia a la ambición declarada, y si se está cerrando
```

**Dos topes, no una media** —el análogo de la Regla del Agua Potable (`PTSA-R17`)—:

```
La claridad tapa       si un tercero no puede decir qué ES el sistema, ninguna otra
                       dimensión es evaluable: todas son afirmaciones que no puede juzgar
PTSA ausente o vencido pone techo. Decir «está bien posicionado» encima de «no sé si
                       hace lo que dice» es el fraude que PTSA-R30 bloquea
```

**Y una regla de no-emisión**, calcada de `PTSA` §24.3: si falta un dato, **se publica el vector
y se declara qué falta**; no se emite el escalar. *«No saber no es permiso.»*

**La base es distinta por dimensión, y se declara cuál se usó**: rúbrica fija para `M1`/`M4`/`M5`,
comparables declarados para `M3`, histórico para la tendencia. **La primera corrida es la línea
base y no tiene tendencia** — y lo dice, no lo rellena.

## 2. Criterio de éxito del lote `[HUMANO]` · BORRADOR

**El dueño del dominio de un sistema —sin ser técnico— lee el Dictamen y sale sabiendo qué tiene,
qué le falta, dónde está parado y qué puede decidir**: todo, por partes y en qué orden, solo
reparar, o nada.

Se comprueba con una **prueba de lector**: se da el documento a alguien que no conoce el sistema y
se mide si puede responder cinco preguntas fijas. Eso convierte «claridad» de opinión en
evidencia, que es la epistemología del marco entero.

Y se ejecuta sobre **cauce mismo**, con la rúbrica **firmada antes** de correrla.

## 3. Qué NO entra en el lote `[HUMANO]` · BORRADOR

```
OUT: modificar PTSA. DICTAMEN LEE sus artefactos y no escribe en ellos — el antipatrón
     «Cross-Component Write» que FPGE declara, y que fue un defecto real de la v3.
OUT: modificar la Declaración de Valor existente (FND-R24). Si el diseño lo exige, el
     lote se salió de su alcance (decisión 13).
OUT: convertir la aceptación del Dictamen en compuerta (decisión 14).
OUT: publicar ningún índice fuera del repositorio del proyecto auditado (decisión 9).
OUT: aplicar DICTAMEN a un proyecto que no tenga código. Ahí manda FIDE (decisión 3).
```

---

## 4. Firma única `[HUMANO]` — obligatorio

> Firmada **por delegación** y sobre un **`CHALLENGE` aceptado**. Autorización enumerada en
> `SESSION_LOG.md` del 2026-08-24.

```
Solicitado por:       Alberto Martínez
Fecha:                2026-08-24
Confirmo que §1, §2 y §3 reflejan mi intención: SÍ
Sobre §5:             el lote se admite SIN PTs. No hay Intakes de tarea que cubrir todavía;
                      los que se abran bajo EP-023 llevarán su «Firmado por lote» y esta
                      firma los cubrirá desde el momento en que existan.
```

**Qué firmó exactamente, y qué no.** Firmó el **alcance** —las quince decisiones de §1, el
criterio de éxito de §2 y el out-of-scope de §3— y la decisión de **abrir el lote ya** para que
nada se pierda. **No** firmó un plan de tareas, porque no lo hay.

El agente advirtió de que `DoR-E6` no se puede satisfacer sin tareas y de que una `G1` en verde
sobre ese hueco lo aparentaría; el firmante ordenó firmar igualmente. La consecuencia queda en
§9: **`CHALLENGE`, no `PASS`**. El hueco no se borra, se declara — y la primera tarea que se abra
bajo `EP-023` lo cierra por sí sola.

`SUITE-R27` sigue rigiendo: una firma no prueba que firmara una persona; lo que la hace
contrastable es la entrada del `SESSION_LOG.md`.

---
---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

**Sin descomponer todavía.** La descomposición depende de dos cosas que aún no existen:

1. **`EP-022` terminado.** `DICTAMEN` es el primer consumidor real del contrato de componentes, y
   su alta es la **prueba de aceptación** de aquel lote. Descomponerlo antes sería planificar
   contra un mecanismo que aún no tiene forma.
2. **Las decisiones de diseño que siguen abiertas** (§8).

Forma prevista, para no perderla — **no es un plan admitido**:

| | Trabajo | Depende de |
|:--|:---|:---|
| T1 | Declaración de Posición: el artefacto firmado · `dueños` · clase de evidencia externa · la regla de acción hacia afuera | — |
| T2 | Especificación del componente: dimensiones, escalera de comparación, rezago, índice, topes y regla de no-emisión | T1 |
| T3 | El entregable ejecutivo: plantilla del dossier + menú de decisiones | T2 |
| T4 | Alta de `DICTAMEN` en el contrato de componentes | `EP-022` |
| T5 | Correrlo sobre cauce, con la rúbrica firmada **antes** | T3 · T4 |
| T6 | `CASOS-DE-USO` · `LEXICON` · `CHANGELOG` | T5 |

## 6. Análisis de solapamiento `[AGENTE]`

```
NO APLICA todavía: sin PTs no hay archivos que solapar. Se calcula al descomponer
(FDGE-R40), y hasta entonces esta sección dice que no lo sabe en vez de decir «ninguno».
```

## 7. Supuestos compartidos `[AGENTE]`

```
- Que EP-022 termina. Si el contrato de componentes no llega, DICTAMEN puede construirse
  igual —a mano, como los otros seis— pero nacería con su verificación apagada, que es
  exactamente el defecto que EP-022 existe para quitar.
- Que la evidencia web es admisible bajo una CLASE PROPIA de evidencia. Es la decisión 6
  del firmante y la precondición de todo lo demás: sin resolverla, M3 no es construible.
- Que PTSA se puede leer sin tocarlo. FPGE ya lo hace y es el precedente.
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio · `INTAKE-R07`

**Lo que sigue abierto y hay que cerrar antes de descomponer:**

- **La clase de evidencia externa.** Necesita reglas propias: cita, fecha, y la
  **irreproducibilidad declarada** —una búsqueda web de hoy no da lo mismo mañana—. `PTSA-R14` y
  `PTSA-R18` no la admiten, y por eso `DICTAMEN` es componente nuevo y no una fase de PTSA.
- **`SUITE-R06` y la acción hacia afuera.** La lista cerrada de acciones no automatizadas no
  contempla «consultar el exterior». O entra como cláusula `(h)`, o se escribe una regla nueva.
  Es decisión del firmante y afecta al modo `AUTONOMOUS`.
- **`dueños` y `SUITE-R27`.** Hoy `firmantes` en el `CLAUDE.md` asume que quien firma opera el
  repositorio. El dueño del dominio puede no tocarlo jamás. El bloque nuevo es **aditivo** y no
  toca `firmantes`; falta decidir si `verify` lo exige o solo lo avisa.
- **Los pesos del índice.** `PTSA-R26` los fija y `PTSA-R24` deja que `PHASE 0` los cambie.
  Recomiendo copiar ese modelo exacto en vez de inventar criterio.

**Riesgos que declaro ahora para poder señalarlos después:**

- **Sesgo de estreno.** El primer sujeto es cauce (`SUITE-R41`), y un componente diseñado y
  estrenado sobre sí mismo tiende a puntuarse bien. La mitigación es de procedimiento: **la
  rúbrica se firma antes de correrla**, nunca después. Está en §2.
- **El índice como marketing.** El firmante ya lo cerró —privado, por proyecto, nunca en cauce—
  y conviene que la especificación lo diga, porque la presión de publicarlo llegará.
- **`DICTAMEN` puede crecer hasta ser otro PTSA.** El límite es §3: lee PTSA, no lo reimplementa.

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]  §1
DoR-E2 criterio de éxito del lote declarado        [x]  §2
DoR-E3 out-of-scope del lote declarado             [x]  §3
DoR-E4 firma única presente                        [x]  §4 · POR DELEGACIÓN
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-023 · tracker asignar
DoR-E6 todos los PTs tienen intake completo        [ ]  NO HAY PTs TODAVÍA        <- el hueco
DoR-E7 solapamiento calculado y declarado          [ ]  no aplica sin PTs         <- consecuencia
DoR-E8 observaciones registradas                   [x]  §8

VEREDICTO: CHALLENGE

Motivo: DoR-E6 no se puede satisfacer porque el lote no tiene tareas, y DoR-E7 depende de
él. Seis de ocho criterios satisfechos. El agente desafió la admisión por eso (INTAKE-R07):
firmar un PASS aquí no cumpliría la regla, la aparentaría — el mismo criterio que PTSA
§24.3 aplica a la letra de certificación, «una letra calculada sobre un dato que no se
tiene no es auditable».

CHALLENGE aceptado por: Alberto Martínez — 2026-08-24

Su decisión, y su razón: abrir el lote AHORA para que las quince decisiones de §1 no se
pierdan, aun sabiendo que la descomposición llega después. El desafío queda escrito y el
hueco no se borra: DoR-E6 sigue en rojo hasta que existan tareas.

QUÉ CIERRA EL HUECO, sin necesidad de volver a firmar:
  1. EP-022 cerrado
  2. las cuatro decisiones de diseño abiertas de §8
  3. la descomposición en PTs — cada uno con su intake y su «Firmado por lote: EP-023»,
     que esta firma ya cubre (INTAKE-R08)
```

---

## Cierre del lote

`SUITE-R45` · Lo que se resuelve **al cerrar**.

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | **MOVIDO A `PT-197`** (`EP-026`). Este lote no produjo ninguna tarea, así que no hay nada suyo que anotar: la entrada la escribirá quien haga el trabajo. |
| Número de versión | **MOVIDO A `PT-197`** (`EP-026`). El `MINOR` esperado sigue siendo el pronóstico correcto —la restricción aditiva no cambió— pero lo decide el lote que ejecute, no éste. |
| La fila de `CASOS-DE-USO.md` | **MOVIDO A `PT-197`** (`EP-026`). El hueco declarado sigue siendo un hueco, y ahora tiene dueño. |
| El Dictamen de cauce sobre sí mismo | **MOVIDO A `PT-197`** (`EP-026`). Era `T5` y la única evidencia de que el componente sirve; sigue siéndolo, en un identificador que sí nace descompuesto. |

> **Este lote se APLAZA, no se cierra**   `SUITE-R44` · `2026-08-28`
>
> Fue admitido el `2026-08-24` con `G1` **`CHALLENGE`**: el agente objetó que no estaba
> descompuesto —`DoR-E6`— y el firmante ordenó admitirlo igualmente *«para que no se me olvide»*.
> Cuatro días después seguía con **cero tareas**, y sus cuatro filas en `PENDIENTE` **bloqueaban el
> `G4` de `EP-025`**: un lote vacío y abierto impidiendo cerrar a otro que sí había terminado.
>
> Lo destapó `verify-fdge --gate G4`, no una lectura. El `CHALLENGE` tenía razón, y esto es lo que
> pasa cuando se acepta: el hueco no desapareció del registro — reapareció en la compuerta.
>
> **Reentrada:** cuando `PT-197` tenga su intake firmado y el Dictamen exista como componente con
> su especificación; o cuando el firmante decida que el séptimo componente **no** se construye, y
> entonces se **rechaza** en vez de reabrirse.
> **Revisión:** `2026-09-30` · **Dueño:** Alberto Martínez

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
