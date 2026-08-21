# Intake — BUG · `PT-096` · un enlace que falta no es un enlace roto

```yaml
---
id: PT-096
type: BUG
severity: S1
complexity:
track: STANDARD
status: DRAFT
phase: 2
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: ningún issue del tablero publica su ruta **sin enlace** teniendo su directorio
> en un ref durable, y la batería lo caza **sin** el arreglo.

---

## 1. Qué está pasando `[HUMANO]`

Transcripción literal de lo declarado por el firmante el 2026-08-21 (`FDGE-R02`, `INTAKE-R01`):

> «También estoy viendo que en `github.com/a81Biz/cauce/issues/189` el
> `changes/EP-019-lo-que-tres-proyectos-encontraron/` no tiene enlace y los `.md` no están
> publicados en github y se supone que eso es lo primero que se debe hacer para poder dar
> seguimiento a las tareas y en algún punto se cambió y ya no se sube, eso debe ser corregido y
> agregado como tarea y comenzar por ahí. Todo debe estar documentado y si es necesario arreglar
> la parte de los casos de uso, manuales, `claude.md` y `readme` necesarios.»

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Desde el issue se llega al intake.** El issue es el único sitio por el que se sigue una tarea
sin abrir el repositorio, y lo primero que tiene que ofrecer es el camino a `changes/<ID>-<slug>/`.
Si por cualquier motivo ese camino no puede darse, el issue debe decir **por qué** en términos que
una persona pueda accionar — nunca dejar un hueco ni un valor interno de la herramienta.

Y no debe depender de que alguien se acuerde de reejecutar nada: el marco ya declara en
`SUITE-R51` que *«el cuerpo del issue enlaza donde el contenido está»*, así que mantenerlo es
obligación de la herramienta, no del operador.

---

## 3. Comportamiento observado `[HUMANO]`

El cuerpo publicado de `#189` dice, literalmente:

```
Intake, criterios de aceptación y evidencia:
`changes/EP-019-lo-que-tres-proyectos-encontraron/` — en el repositorio, sin enlace:
no hay ref durable que lo contenga

> El enlace apunta a `null`, que es donde el contenido existe ahora. Al
> integrarse pasará a `main` y este cuerpo se actualizará solo.
```

Dos frases consecutivas que se contradicen: la primera dice que **no hay** enlace, la segunda
explica **a dónde apunta** el enlace que no hay, y lo nombra `null`.

---

## 4. Reproducción `[HUMANO]`

```
1. Abrir https://github.com/a81Biz/cauce/issues/189
2. Buscar la linea «Intake, criterios de aceptacion y evidencia:»
3. La ruta va en texto plano, sin enlace, y debajo aparece «apunta a `null`»
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente — ocurre aproximadamente ___ de cada 10 intentos
- [ ] Ocurrió una vez y no he podido reproducirlo

Reproducible además **por construcción**: le ocurre a todo issue abierto desde el 2026-08-19.
Ver §16.

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | tablero de producción · `github.com/a81Biz/cauce` |
| URL o host | `https://github.com/a81Biz/cauce/issues/189` |
| Build o commit | `134786a` · rama `trabajo` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Navegador / cliente | navegador · y `gh api` para la medición |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todos los que sigan el trabajo desde el tablero |
| Volumen estimado | **11 de 114** cuerpos publicados · **11 de 11** de los abiertos desde el 2026-08-19 |
| ¿Hay pérdida de datos? | **no** — ver §14, la premisa «no están publicados» se corrigió midiendo |
| ¿Existe workaround? | sí, y es el problema: abrir el repositorio a mano y navegar a `changes/` |
| Impacto de negocio | el tablero deja de servir para lo único que existe: dar seguimiento sin abrir el repo |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

Medición sobre los 190 issues del tablero, hecha en la sesión que abre este intake:

```
cuerpos con la linea «Intake, criterios…»    114
cuerpos SIN enlace                            12   (11 issues + 1 cuerpo de PR, #148)
cuerpos que imprimen «apunta a `null`»        11
cuerpos con enlace /tree/                     92

los 11:  #160 #162 #163 #164 #165 #166 #167 #168 #169 #181 #189
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: rehacer el mecanismo de ref durable de PT-079    -> es CORRECTO. El defecto no es que
     elija mal el ref: es que el caso «todavia no hay ref» no tiene continuacion

OUT: enlazar a la rama efimera                        -> FDGE-R19 la borra al fusionar y es
     exactamente lo que SUITE-R56 nacio para impedir. Volver ahi seria deshacer PT-079

OUT: reescribir el cuerpo de un issue para cambiar su ESTADO -> aqui solo se arregla el
     enlace, que es dato derivado del registro (SUITE-R35). Ningun issue se abre ni se cierra

OUT: subir la cobertura mecanica por si misma         -> heredado del OUT de EP-019

OUT: las ocho tareas L-1..L-8 de EP-019               -> esta las precede, no las sustituye
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que desde el issue se pueda llegar al intake
- que los once que hoy estan rotos queden bien, no solo los nuevos
- que si vuelve a pasar, algo lo diga antes de que lo vea yo
- que en ningun cuerpo aparezca «null»
- que este documentado donde toca: casos de uso, manual, CLAUDE.md y README
```

---

## 10. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base de esta firma**, escrita por el agente porque `INTAKE-R06` no le permite firmar:
> el texto transcrito en §1, y en particular *«eso debe ser corregido y agregado como tarea y
> comenzar por ahí»*. `SUITE-R27` declara qué vale esto: una afirmación **contrastable**, no una
> prueba de que firmara una persona.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: el cuerpo publicado de una allocation cuyo directorio changes/ existe en algun ref
       durable contiene un enlace RESOLUBLE a ese directorio.

AC-02: cuando no hay ref durable, el cuerpo dice la razon en terminos accionables y NO
       contiene la cadena «null» ni ninguna otra representacion de un valor interno.
       La nota que explica el enlace no se emite si no hay enlace.

AC-03: «tracker espejo» reporta como divergencia el issue VIVO cuyo cuerpo no enlaza
       existiendo el directorio en un ref durable. Hoy solo reporta el enlace MUERTO.

AC-04: la reparacion alcanza al cuerpo SIN enlace, no solo al de enlace muerto, y alcanza
       a las allocations TERMINALES, que son 9 de los 11 casos.

AC-05: medido sobre el tablero completo tras aplicar: 0 cuerpos sin enlace teniendo ref
       durable, y 0 cuerpos con «null». La cifra se publica con su denominador.

AC-06: la bateria falla SIN el arreglo, con un caso por cada uno de los tres puntos:
       el cuerpo que imprime «null», el que no se repara y el que no se reporta.

AC-07: queda escrito donde una persona lo busca — CASOS-DE-USO, MANUAL, README y
       CLAUDE.md — cuando aparece el enlace, por que puede faltar y que hacer entonces.
       Si alguno de los cuatro no procede, se declara con motivo (patron de los CINCO
       SITIOS de PT-079: si falta uno, el arreglo caduca).
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: tres puntos de un mismo archivo (tracker.mjs) con su guarda de bateria y su
documentacion. No toca el modelo de datos ni el registro, y no cambia ninguna regla — hace
cumplir SUITE-R51, que ya existe. Se propone en PHASE 2 en firme.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí — sin entrada sobre el enlace del cuerpo
PTs vivos relacionados:       ninguno. Vivas hoy: PT-025 (DEFERRED) y EP-019 (DRAFT)
HISTORY.log — PTs similares:  PT-010 · PT-036 · PT-048 · PT-079 — los cuatro en esta
                              superficie, los cuatro CERRADOS, ninguno cubre este caso
Roadmap — R-NNN relacionado:  ninguno
```

**Qué arregló cada uno y por qué este no es su repetición:**

| | Arregló | Por qué no cubre esto |
|:---|:---|:---|
| `PT-010` | que el enlace sea absoluto y el cuerpo se lea | el enlace existía; aquí no llega a existir |
| `PT-036` | el 404 **al empezar**: apuntar a donde el contenido está | resuelve a dónde apuntar, no qué hacer si aún no hay dónde |
| `PT-048` | la nota que explica el enlace sobra cuando no hay enlace | **lo arregló solo para la rama `hayDirectorio === false`** |
| `PT-079` | el 404 **al terminar**: ref durable, y reparar lo muerto | `repararEnlacesMuertos` salta el cuerpo sin enlace |

`PT-048` es el que más importa: **este defecto es su segunda instancia**, en la rama hermana. Es
la forma `C-2` que `EP-017` ya pagó dos veces — arreglar la instancia y no la causa.

## 14. Observaciones del agente `[AGENTE]` — obligatorio

`INTAKE-R07`. Desafíos al Intake:

- **La premisa «los `.md` no están publicados en github» es FALSA, y se midió antes de aceptarla.**
  `changes/EP-019-lo-que-tres-proyectos-encontraron/intake.md` **sí** está en `origin/trabajo`; y
  de los otros tres directorios contrastados, tres están además en `main`. No se ha perdido ni
  dejado de subir nada. Lo que falta es el **enlace en el issue**, que es el único camino que una
  persona recorre — así que la consecuencia observada por el firmante es exacta aunque la causa
  que supuso no lo sea. Se registra aquí en vez de corregir §1, porque `INTAKE-R01` prohíbe que
  el agente reescriba lo que declaró el humano.

- **«en algún punto se cambió y ya no se sube» es correcta como observación de regresión, y está
  medida:** los 11 cuerpos rotos son los 11 issues abiertos **desde el 2026-08-19**, que es la
  fecha en que `PT-079` cerró midiendo «0 de 85 rotos». Ver §16.

- **Severidad `S1` no la declaró el firmante literalmente**; se deriva de *«comenzar por ahí»*,
  que lo antepone incluso a `L-6`, y del hecho de que `SUITE-R51` es `HARD`. Un `S2` sería
  defendible por precedente (`PT-010` fue `S2`). **Queda para confirmar en `G1`.**

- **Pertenencia a `EP-019`:** se propone como miembro del lote (`L-0`), no como tarea suelta.
  Encaja en su criterio de éxito —*«que un proyecto destino no pueda estar en verde mientras
  esconde trabajo sin registrar»*—: aquí el tablero está en verde mientras el rastro es
  inalcanzable. Exige **Revisión 1** del intake de `EP-019`, que se escribe en el mismo acto.

- **`AC-07` puede reducirse en `PHASE 2`.** Cuatro documentos es lo que `PT-079` estableció como
  criterio único, pero `CLAUDE.md` *parametriza y no legisla* (`SUITE-R00`), así que puede que su
  sitio correcto sea no decir nada. Se decide con motivo escrito, no por omisión.

- **Lo que este intake NO establece:** que el enlace deba existir *en el instante de abrir el
  issue*. Puede que la respuesta correcta sea enlazar al commit en cuanto lo haya, y no antes.
  `PHASE 2` lo decide; aquí solo se establece que el estado actual —ninguno de los dos, para
  siempre, y `null` impreso— es incorrecto.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [~]  derivada, ver §14 — a confirmar por el firmante
DoR-03 firma humana presente             [x]  §10, con su base declarada
DoR-04 out-of-scope declarado            [x]  cinco entradas con motivo
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-096 · «tracker asignar» · contador global
DoR-06 no duplica trabajo vivo           [x]  §13 · cuatro precedentes, los cuatro cerrados
DoR-07 observaciones registradas         [x]  §14 · seis, una de ellas corrige la premisa
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · cuerpo publicado, citado literal
DoR-B3 reproducción o «no reproducible»  [x]  §4 · siempre, y por construcción
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre · 11 de 11 desde el 2026-08-19
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: CHALLENGE
Motivo: DoR-02. La severidad es un campo [HUMANO] y el firmante no la declaró; el agente la
derivó de «comenzar por ahí». INTAKE-R02 prohíbe inventar criterios, y una severidad inventada
decide track y prioridad. G1 es humana en los tres modos (EXEC-R03): basta con que el firmante
confirme S1 o la corrija.

CHALLENGE aceptado por:
```

---

## 16. Medición de la regresión `[AGENTE]`

No forma parte de la plantilla; se adjunta porque `DoR-06` y §14 se apoyan en ella y `SUITE-R38`
exige que una afirmación sea distinguible de una suposición.

### Los tres puntos, localizados

```
docs/methodology/tools/tracker.mjs

:472-475   cuerpoDeIssue   emite «El enlace apunta a `${ramaDelEnlace}`» en la rama «else»,
                           sin comprobar que ramaDelEnlace exista. Con null, imprime «null»
                           justo debajo de la linea que acaba de decir «sin enlace».
                           PT-048 arreglo esta MISMA contradiccion en la rama hermana
                           (hayDirectorio === false) y no en esta.

:1194      repararEnlacesMuertos   «if (!ref || refExiste(ref)) continue;»
                           un cuerpo SIN enlace tiene ref === null y se SALTA. La pasada de
                           SUITE-R56 pasa de largo justo por los que nunca tuvieron enlace.

:208       compararEspejo  «if (ref && refExiste && refExiste(ref) === false)»
                           misma guarda: sin ref, no hay divergencia. El espejo declara
                           «cuadra» con 11 cuerpos rotos publicados.
```

Un mismo supuesto en tres sitios: **que el fallo del enlace es que apunte mal.** El fallo de
estos once es que **no apunta**, y para ese caso las tres ramas terminan en `continue`.

### Por qué el ref es `null` justo al abrir

`refDurableDe` pregunta a git por el directorio: primero en la rama de integración, y si no está,
por el commit que lo contiene. En `PHASE 1` el intake **acaba de escribirse y no se ha
commiteado**, así que las dos preguntas devuelven vacío. El ref durable no es `null` por un fallo:
lo es porque en ese instante **todavía no existe**, y nada vuelve a preguntar después.

### La ventana, medida

```
2026-08-19   PT-079 cierra midiendo «ENLACES DEL TABLERO: ANTES 20 de 40 rotos · DESPUES 0 de 85»
             desde aqui, el ref sale de refDurableDe: durable o ninguno

2026-08-20   #160 #162..#169   abiertos sin enlace
2026-08-21   #181 #189         abiertos sin enlace

11 de 11 issues abiertos tras PT-079 nacen sin enlace.  92 anteriores lo tienen.
```

`PT-079` no introdujo un fallo: sustituyó *«siempre un ref, a veces el equivocado»* por *«un ref
durable, o ninguno»*, que es lo correcto. Lo que faltó fue **la continuación del «o ninguno»**.

### Por qué no basta con reejecutar la herramienta

```
$ node docs/methodology/tools/tracker.mjs espejo
  · 2 allocation(s) viva(s) y 2 issue(s) abierto(s): el espejo cuadra.
  Sin divergencias.

$ node docs/methodology/tools/tracker.mjs abrir
  · PT-025 #35: se regeneraria el cuerpo
  · EP-019 #189: se regeneraria el cuerpo
```

`espejo` no mira el cuerpo: compara qué está abierto contra qué está vivo. Y `abrir` solo
regenera las **vivas** — 2 de las 11. Las otras 9 pertenecen a allocations terminales y
`repararEnlacesMuertos`, que existe justo para ellas, las salta por la guarda de `:1194`.

Ningún verificador mira el cuerpo de un issue: `verify-fdge`, `verify-suite`, `verify-qa` y
`verify-ptsa` no contienen ninguna llamada que lo lea.

---

## Revisiones

> El `intake.md` es append-only una vez firmado. Toda corrección se añade aquí con su propia
> firma, nunca editando lo anterior (`SUITE-R09`).

### Revisión 1 — 2026-08-21 · lo que apareció al medir

**Qué cambia:** se añade un cuarto defecto al alcance, y se corrige a la baja la cifra de §7.
No se modifica nada de lo firmado: `SUITE-R09`.

**Motivo:** ejecutar la medición cambió el estado medido, y eso es información.

---

#### a) La cifra de §7 bajó a 10, y **no** porque se arreglara nada

Al escribir este intake se ejecutó `tracker indices --aplicar` —que es el modo derivado de
escribir la línea de índice (`LEX-R12`)—. Esa acción termina en `cerrarPasada()`, que
resincroniza el cuerpo de las allocations **vivas**. `#189` ya tenía su directorio en `trabajo`,
así que su ref durable ya existía y el cuerpo se regeneró **con enlace**:

```
ANTES   `changes/EP-019-…/` — en el repositorio, sin enlace: no hay ref durable que lo contenga
        > El enlace apunta a `null`, …
DESPUES [`changes/EP-019-…/`](https://github.com/a81Biz/cauce/tree/trabajo/changes/EP-019-…)
        > El enlace apunta a `trabajo`, que es donde el contenido existe ahora.
```

```
tablero, remedido    cuerpos sin enlace  11 -> 10  (+ #148, que es cuerpo de PR, no de issue)
                     cuerpos con «null»  11 -> 10
                     los 10:  #160 #162 #163 #164 #165 #166 #167 #168 #169 #181
```

**Esto agrava el defecto en vez de reducirlo, y conviene decirlo antes de que parezca un avance.**
El cuerpo sanó por **casualidad**: porque `#189` está viva y porque una acción que existe para
escribir índices arrastra una resincronización. Nada en el marco garantiza que eso ocurra, ninguna
fase lo abre y ningún verificador lo echa en falta — que es literalmente el diagnóstico de la
`FAMILIA C` de `PT-079`. Las 10 restantes pertenecen a allocations **terminales** y ninguna
acción las alcanza.

`AC-05` se mide, por tanto, sobre las **10** y con su denominador, no sobre 11.

---

#### b) Cuarto defecto · `esLote` nunca es cierto para un lote

Se vio mirando el cuerpo ya sanado de `#189`, que sigue diciendo:

```
**EPIC** · severidad S1 · sin implementación asignada
```

Debería decir `**Implementación abierta** · <título>` y, debajo, la lista `Tareas de este lote`.
No lo dice porque:

```
tracker.mjs:367   const esLote = a?.type === 'EP';
```

y el registro guarda **tres valores distintos para el mismo hecho**:

```
EP          16   EP-001 … EP-016
undefined    2   EP-017 · EP-018
EPIC         1   EP-019
```

Los **tres últimos lotes** fallan la comparación. `#162` (EP-018) se publicó como
`**PT** · severidad —`, y `#189` como `**EPIC** · severidad S1 · sin implementación asignada`.

**Consecuencia directa sobre lo que motivó esta tarea:** el issue de un lote **nunca lista sus
tareas**. La línea que existe para dar seguimiento —`Tareas de este lote:`— está detrás de
`if (esLote && …)` y no se ha emitido nunca para `EP-017`, `EP-018` ni `EP-019`.

**Y el nombre canónico no existe.** `LEXICON` §8.1 enumera el `type` de una tarea —`BUG` ·
`FEATURE` · `REFACTOR` · `INVESTIGATION` · `CHORE`— y **no incluye ninguno para un lote**;
§ del identificador declara `EP-NNN` como ID, no como tipo. Así que `EP`, `EPIC` y la ausencia no
son un descuido de tres agentes: son tres respuestas razonables a una pregunta que `LEXICON` no
contesta.

Es la causa `C-2` del intake de `EP-019` —*un hecho, varios nombres*— dentro de la herramienta,
y **no se resuelve aquí eligiendo una**: elegir es exactamente inventar vocabulario. `PHASE 2`
lleva la pregunta a `LEXICON` (`LEX-R21`, `LEX-R22`), y hasta que esté declarada, este intake
**no establece** cuál de los tres es el bueno.

Se añade:

```
AC-08: el cuerpo del issue de un lote se publica como lote —encabezado propio y lista de
       sus tareas— para los 19 lotes del registro, sin depender de que su «type» se haya
       escrito de una de las tres formas.

AC-09: LEXICON declara el valor canonico del «type» de un lote, y una comprobacion mecanica
       impide que el registro vuelva a tener dos. Si el firmante decide que el lote NO lleva
       «type», eso tambien se declara y la comprobacion lo hace cumplir.
```

**Lo que esto NO establece:** que `AC-09` deba resolverse en esta tarea. Si en `PHASE 2` resulta
que tocar `LEXICON` expande el alcance más de lo razonable, su sitio natural es `L-3` —*un hecho,
un nombre*— y se declara el traslado con motivo. Lo que sí queda establecido aquí es que
`AC-08` no se puede cumplir sin responder a `AC-09`.

---

**Firmado por:** pendiente. Esta revisión es material `[AGENTE]` (§14, `INTAKE-R07`) y se somete
junto con el `CHALLENGE` de `G1`: el firmante confirma la severidad y, en el mismo acto, si
`AC-08`/`AC-09` entran aquí o se trasladan a `L-3`.

---

### Revisión 2 — 2026-08-21 · `G1` resuelta por delegación

**Qué cambia:** el veredicto de `G1` pasa de `CHALLENGE` a `PASS`. Nada más.

**Motivo:** el firmante autorizó el trabajo autónomo del lote completo:

> «sigue sin parar, tienes mi VoBo y autorización necesaria para que trabajes de forma autónoma
> y no pares hasta terminar la épica».

La constancia con su alcance y sus seis excepciones declaradas está en
[`SESSION_LOG.md`](../../docs/implementation/SESSION_LOG.md), entrada
*«`EP-019` completa, autorizada al agente de forma autónoma»* (`EXEC-R04a`).

```
VEREDICTO: PASS
CHALLENGE aceptado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

**Lo que esto NO establece.** Que `S1` haya sido **declarada**. Sigue siendo **derivada** por el
agente de *«comenzar por ahí»*, y §14 lo dice. La delegación resuelve la compuerta; no convierte
una derivación en una declaración. Si el firmante la corrige, la corrección entra como Revisión 3.

**Firmado por:** Alberto Martínez (delegada). Base: la instrucción citada arriba. `SUITE-R27`:
contrastable, no probada.
