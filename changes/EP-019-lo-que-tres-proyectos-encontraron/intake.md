# Intake — LOTE `EP-019` · lo que tres proyectos encontraron

```yaml
---
id: EP-019
created: 2026-08-21
status: DRAFT
mode: SUPERVISED
origin: DIRECT
suite_version: 11.0.0
---
```

---

## 1. Objetivo común `[HUMANO]`

**Cerrar los veinte defectos que aparecieron al ejecutar el marco fuera de él, y las tres causas
que los producen.**

`EP-018` cerró lo que el marco encontró **auditándose a sí mismo**. Esto es distinto: son
hallazgos de **tres proyectos ejecutando**, dos de ellos ajenos a este repositorio.

```
cauce         2   los que quedaron declarados y sin arreglar al cerrar la 11.0.0
legado        6   «Inteligencia de Mercados Energeticos Mexicanos» · 4.12.0 · 114 tareas
calculadora  12   el primer ciclo FQAGE completo que ha corrido este marco
```

Y uno más, que es el que ordena el resto: **`INC-003` sigue abierto**. Se registró el 2026-08-20,
se escribió «reportado a `cauce`», y nadie abrió el `PT`. Lo encontró la calculadora comprobando
si actualizar el marco cerraba los hallazgos previos — **no se fio de que actualizar bastara**, y
tenía razón.

## Por qué juntos y no uno a uno

Los veinte no comparten archivo: comparten **tres causas**, y arreglar instancias sin tocar la
causa ya se intentó dos veces. `EP-017` corrigió cuatro instancias del patrón del proxy y apareció
la quinta al sellar; `EP-018` cerró ocho y la novena apareció tres días después.

---

## 2. Las tres causas, medidas

### `C-1` · El estado de una tarea se escribe una vez y nada lo reconcilia

Y cuando ese estado es **terminal y falso**, no sólo miente: **apaga comprobaciones**.

```
INC-009   «avanzar --a 10» declara INTEGRATED sin que nada se haya integrado
INC-011   un terminal falso apagaba CINCO comprobaciones sobre dos PT
INC-006   avanzar no aplica «IN_REVIEW → VALIDATION_PENDING: tipo BUG · siempre»
legado    80 intakes cuyo status miente · 80 de los 83 errores de SUITE-R35
```

`INC-011` es el que hay que leer entero. La calculadora tenía sus dos primeras tareas en `INTEGRATED`
con `git rev-list --count main` devolviendo `2`. Al corregirlo a `DONE` —lo único cierto— se
encendieron cinco comprobaciones y cuatro salieron en rojo sobre trabajo del día anterior:

> «`verify-fdge --all` daba verde con esos huecos todos los días, bajo un `HANDOFF` que decía
> "todo preparado"».

### `C-2` · Un hecho, varios nombres — la enfermedad de la v3, dentro de las herramientas

| | El hecho | Los nombres |
|:---|:---|:---|
| `INC-008` | dónde vive una nota de reanclaje | `avanzar` escribe `TRANSICIONES.log` · `CORE.md` dice `bitacora.md` |
| `INC-012` | los tipos de caso `QA` | `verify-qa.mjs` espera `EDGE\|NEG` · `CORE.md:1003` dice `EC\|EF` |
| `TD-04` | dónde vive el espacio de `QA` | el verificador busca `QA/` · git guardó `qa/` |
| `INC-004` | qué es la `11.0.0` | cuatro herramientas distintas bajo el mismo número |
| `INC-007` | cuándo se cierra el issue de una tarea | `SUITE-R46` pide terminal en `main` · `FDGE-R34` pide `DONE` en `G4` |

`TD-04` es el que más asusta: en Linux `QA/` y `qa/` **no** son el mismo directorio, así que la
verificación del ciclo entero se saltaría **en silencio y en verde**.

Y `INC-004` tiene su propio agravante, verificado: `Suite-CLAUDE-Template.md` declara
`suite_version: 5.2.0` y `firmantes: - Nombre Apellido`. `version.mjs` sólo busca
`Suite version: **X.Y.Z**`, así que **la herramienta que alinea 21 documentos es ciega al único
que se copia a cada proyecto destino** — y ese documento lleva una lista de firmantes falsa, en el
archivo contra el que `SUITE-R27` contrasta las firmas.

### `C-3` · Una regla nueva juzga trabajo escrito antes de que existiera

```
RIGE_DESDE   8 filas
RULES.md     HARD 151 · SOFT 13 · CHECK 20
```

`rigeDesde()` devuelve `true` sin fila, así que **143 reglas `HARD` juzgan hacia atrás**. El legado
lo midió: **31 de las 36 reglas nuevas** alcanzan a sus 113 `PT`, y el mismo árbol pasa de `0`
errores en `4.12.0` a `83` en `11.0.0`.

La tarea que cerró `EXEC-R04a` arregló esto **para una sola regla**, y su `out-of-scope` dice
literalmente «no lo he medido». Ya está medido, y no por mí.

---

## 3. El hallazgo que no encaja en ninguna causa, y es el más grave

**`PTSA` exige emitir una letra de certificación y no define los umbrales.**

```
PTSA-R08        «Emitir una clasificacion de certificacion (A/B/C/F)»
§24             «Reglas de transicion» — sin subsecciones
§24.2 · §24.4   citadas dos veces para los umbrales · NO EXISTEN
```

En `4.12.0` y en `11.0.0`. Y lo que obliga a mirarlo primero: **nuestro propio `PTSA/RESUMEN.md`
dice `certificacion: B` y escribe `(75-89)`** — una banda que no aparece en ninguna especificación.
La inventó el agente que auditó.

Es la auditoría que decidió que el marco estaba listo para publicarse.

El legado hizo lo correcto ante el mismo hueco: **publicó los tres scores y no emitió letra**.

---

## 4. Criterio de éxito del lote `[HUMANO]`

**Que un proyecto destino no pueda estar en verde mientras esconde trabajo sin registrar.**

Concretamente, y medible:

```
1  un estado terminal FALSO se detecta antes de apagar nada
2  «QA/» y «qa/» dejan de decidir si el ciclo se verifica
3  las 151 reglas HARD declaran desde cuando rigen, o no rigen
4  PTSA define sus umbrales, o deja de exigir una letra
5  INC-003 cerrado, que lleva dos dias declarado y sin PT
```

**No se persigue el número de INC cerrados.** Se persigue que el patrón no pueda reaparecer: si al
cerrar el lote hay una `INC-016` de la misma forma, el lote falló aunque las quince estén cerradas.

---

## 5. Qué NO entra en el lote `[HUMANO]`

```
OUT: reauditar el marco con PTSA           -> primero se definen los umbrales (§3). Auditar
     contra una especificacion que cita secciones inexistentes reproduce el defecto

OUT: arreglar los proyectos destino        -> el legado y la calculadora tienen sus propias
     ramas y sus propios firmantes. Aqui se arregla el MARCO

OUT: subir la cobertura mecanica por si misma  -> lo mismo que EP-018 declaro: escribir
     verificadores para llegar a un porcentaje es fabricar verdes

OUT: rehacer las dos primeras tareas de la calculadora -> es decision de su firmante, y esta
     esperandola con las tres opciones escritas

OUT: publicar                              -> del firmante, y la 11.0.0 ya esta publicada
```

## La primera fila es la que ordena el trabajo

Con `§24.2` sin definir, **cualquier auditoría posterior arrastra el mismo hueco**. Y hay una
consecuencia incómoda que este lote tiene que resolver antes de tocar nada: **la «certificación B»
de `PTSA-2026-08-20` no es contrastable**, y fue el argumento con el que se publicó.

---

## 6. Cómo termina el lote   `FDGE-R53`

Termina cuando: los quince `INC` están cerrados o declarados con motivo, `verify-suite` y
`verify-fdge --all` pasan, la batería incluye un caso por cada causa que **falla sin el arreglo**,
y **un cuarto proyecto instalado desde npm no reproduce ninguno de los tres patrones**.

La última condición es la que lo separa de un lote de limpieza: los tres proyectos que
encontraron esto no son el banco de pruebas de la solución.

---

## 7. Origen de los hallazgos   `trazabilidad`

```
INC-003              calculadora · docs/implementation/INCIDENTS.log
                     2026-08-20 · se escribio «reportado a cauce» y no se abrio tarea

INC-004..INC-015     calculadora · docs/implementation/INCIDENTS.log
TD-04                2026-08-21 · la tarea del Docker y el ciclo QR-001

INC-001..INC-008     «Inteligencia de Mercados Energeticos Mexicanos»
del legado           2026-08-21 · la tarea de migracion 4.12.0 -> 11.0.0

RIGE_DESDE 8/151     medidos en ESTE repositorio al revisar las dos sesiones
§24.2 · §24.4        2026-08-21
```

### `INC-016` · el intake de un lote no tiene forma válida de escribirse

Escribir esta sección costó tres intentos, y ninguno fue un descuido:

```
con la tabla      INTAKE-R09 leyo la fila del legado como MIEMBRO del lote y
                  pidio su carpeta en changes/ — en otro repositorio

sin la tabla      el RESPALDO escanea el texto entero: toda mencion a una tarea
                  en PROSA se convierte en miembro

con los IDs       INTAKE-R09 exige que cada uno tenga su carpeta, o sea que el
del reparto       reparto no se puede PROPONER antes de crear ocho carpetas
```

```js
const pts = enFilas.length ? enFilas : [...sinCierre.matchAll(/PT-\d+/g)].map((m) => m[0]);
```

La corrección del 2026-08-08 movió esa lectura de «todo el texto» a «filas de tabla» para que
citar una tarea en prosa no la hiciera miembro. **El agujero se estrechó y no se cerró** — y el
respaldo lo reabre entero en cuanto no queda ninguna fila.

**Consecuencia: un intake de lote no puede citar trabajo anterior ni proponer su reparto.** Las
dos cosas son exactamente lo que un intake de lote existe para hacer.

Por eso el reparto de abajo usa `L-1`…`L-8`. Y resulta ser lo correcto por una segunda razón que
este defecto tapaba: **el registro asigna los identificadores** (`SUITE-R08`); escribirlos en el
intake antes de que los asigne es inventarlos.

Misma forma que `INC-015` en `FPGE-R01` —cualquier mención cuenta como declaración— y entra en
`L-7`.

### `INC-017` · abrir un lote no sella el estado, y `SUITE-R34` lo caza en CI

`tracker avanzar` estampa la línea `actualizado:` del `HANDOFF` como parte del acto atómico, y por
eso una transición de fase nunca deja el estado atrás. **Abrir un lote no pasa por `avanzar`**, así
que escribe en `changes/` sin tocar el estado y `SUITE-R34` bloquea — en CI, no en local, porque
compara marcas de **commit**.

Medido en esta sesión: **cuatro veces**, y las cuatro por el mismo camino —abrir, corregir un
estado a mano, escribir una constancia—. La regla hace su trabajo; lo que falta es que el acto que
escribe en `changes/` estampe el estado, igual que `avanzar`.

Entra en `L-7`.

---

## 8. Reparto propuesto y análisis de solapamiento   `[AGENTE]` · `FDGE-R40`

Ocho tareas. El reparto sigue las causas, no los `INC`: agrupar por síntoma es lo que hizo que
`EP-017` cerrara cuatro instancias y apareciera la quinta.

```
L-1  C-1   el estado terminal FALSO deja de apagar comprobaciones
              INC-009 · INC-011 · los 80 SUITE-R35 del legado
              tracker.mjs · verify-fdge.mjs · patrones.mjs · selftest.sh

L-2  C-1   avanzar aplica la transicion que LEXICON declara para un BUG
              INC-006
              tracker.mjs

L-3  C-2   un hecho, un nombre
              INC-008 (TRANSICIONES.log/bitacora.md) · INC-012 (EDGE|NEG vs EC|EF) · TD-04 (QA//qa/)
              tracker.mjs · verify-fdge.mjs · verify-qa.mjs · CORE.md via RULES/LEXICON

L-4  C-2   la version es un CONTENIDO, no un numero
              INC-004 · version.mjs ciego a la plantilla · Suite-CLAUDE-Template 5.2.0
              version.mjs · verify-suite.mjs · Suite-CLAUDE-Template.md

L-5  C-3   las 151 reglas HARD declaran desde cuando rigen, o no rigen
              RIGE_DESDE 8/151 · las 31 que alcanzan a los 113 PT del legado
              patrones.mjs · verify-suite.mjs

L-6  ---   PTSA define sus umbrales, o deja de exigir una letra
              §24.2 · §24.4 · nuestra propia «certificacion B (75-89)»
              PTSA-V3-Especificacion-Oficial.md · CORE-PTSA.md · verify-ptsa.mjs · PTSA/RESUMEN.md

L-7  ---   cinco defectos de FORMA, que son los que se cuelan
              INC-003 · INC-005 · INC-010 · INC-014 · INC-015
              verify-fdge.mjs · patrones.mjs · verify-qa.mjs

L-8  ---   lo que una compuerta no puede exigir sin contradecir a otra
              INC-007 · INC-013 · «--forzar» no es una compuerta (SUITE-R06e)
              verify-fdge.mjs · bin/cauce.mjs · EXECUTION-MODES.md
```

### Pares que comparten archivo

```
L-1 <-> L-2   tracker.mjs                       -> SERIALIZADOS
L-1 <-> L-3   tracker.mjs · verify-fdge.mjs     -> SERIALIZADOS
L-1 <-> L-5   patrones.mjs                      -> SERIALIZADOS
L-1 <-> L-7   verify-fdge.mjs · patrones.mjs    -> SERIALIZADOS
L-3 <-> L-7   verify-fdge.mjs · verify-qa.mjs   -> SERIALIZADOS
L-4 <-> L-5   verify-suite.mjs                  -> SERIALIZADOS
L-5 <-> L-7   patrones.mjs                      -> SERIALIZADOS
L-7 <-> L-8   verify-fdge.mjs                   -> SERIALIZADOS

Orden resultante:  L-6 · L-1 · L-2 · L-3 · L-4 · L-5 · L-7 · L-8
```

**`L-6` va primero y no es por solapamiento** —no comparte un solo archivo con los demás—. Va
primero porque mientras `§24.2` no exista, cualquier auditoría que se ejecute durante el lote
arrastra el mismo hueco, y este lote acabará auditándose.

### Solapamiento que hace inviable el orden

**Ninguno**, y ocho pares quedan serializados. El riesgo real es otro y conviene decirlo antes de
que parezca una regresión:

`patrones.mjs` lo importan ocho herramientas, y **cuatro de las ocho tareas lo tocan**. Se
midió que un cambio ahí obliga a 669 de los casos y **405 s** de batería; hoy la batería tiene
`1229` casos, así que ese número ha subido. El ahorro de la batería parcial será pequeño en este
lote, igual que en `EP-018`.

### Lo que este reparto NO establece

Que ocho sea el número correcto. Sale de las tres causas medidas más los tres sueltos; **la
primera tarea que abra su intake puede partir en dos o fundirse con otra**, y eso es información,
no una desviación del plan.

## 9. Firma   `INTAKE-R06`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que el objetivo, el criterio de éxito y el out-of-scope reflejan mi intención: SÍ
```

> **Base de esta firma**, escrita por el agente porque `INTAKE-R06` no le permite firmar:
> *«abre la épica para empezar a trabajar»*, y antes *«documentar éste hallazgo de el choque entre
> reglas, será la siguiente épica junto con lo que encontremos en los otros sitios»*.
> `SUITE-R27` declara qué vale: una afirmación contrastable, no una prueba.

## 10. Resultado de la compuerta `G1`   `[AGENTE]`

```
VEREDICTO: PASS
```

`DoR-1` objetivo declarado y común a los veinte · `DoR-2` las tres causas **medidas**, no
supuestas · `DoR-3` criterio de éxito con cinco condiciones observables y una que declara cuándo
el lote **falló** aunque todo esté cerrado · `DoR-4` out-of-scope con motivo, incluidos los dos
proyectos que no se tocan · `DoR-5` firma con su base y su límite.

---

## Cierre del lote   `SUITE-R45`

Lo que se resuelve **al cerrar** y en ningún otro sitio: escrito como fila en cada tarea sería la
misma regla copiada nueve veces, y las copias divergen (`SUITE-R38`).

> **El lote está abierto.** Casi todo está `PENDIENTE` a propósito: rellenar estas filas para que
> la compuerta pase sería fabricar un verde, que es lo que `PT-055` señaló y lo que el bloque
> `no hacer` del `HANDOFF` prohíbe por escrito. Se declara la forma; el estado se escribe cuando
> ocurra.

| Qué | Cómo se resuelve | Estado |
|:---|:---|:---|
| Entrada en `CHANGELOG.md` con guía de migración | `SUITE-R19`, enumerando las reglas nuevas si las hay | **HECHO** · `12.0.0`, con las cinco reglas nuevas citadas y qué hacer al actualizar |
| Número de versión | `MAJOR` si alguna tarea introduce una regla `HARD` nueva; `MINOR` si sólo añade verificadores a reglas existentes. `L-5` es la candidata a `MAJOR`: `RIGE_DESDE` para las 151 `HARD` cambia a qué alcanza cada regla | **HECHO** · `MAJOR` → `12.0.0`. Entran cinco reglas `HARD` |
| `RIGE_DESDE` de toda regla nueva | `PT-081` · sin fila, rige hacia atrás | **HECHO** · `PT-106` para las diecinueve históricas; `LEX-R08` y `SUITE-R58` con su fila al nacer |
| Sello de la versión | los ocho pasos de `tracker sellar`, con la batería **completa** (`SUITE-R57`) | **HECHO** salvo los pasos 7 y 8 —tag y PR—, que son humanos (`SUITE-R06a`) |
| Los quince `INC` de los tres proyectos | cerrados, o declarados con motivo y su destino | **`PT-109`** · desglose fila a fila en la `Revisión 4`: seis arreglados, tres declarados sin acceso en `PT-109`, dos ya declarados en `§7`, y seis sin tocar —de esos, `INC-007` e `INC-013` son `L-8`, que no se ejecutó |
| `INC-003` de la calculadora | lleva desde el 2026-08-20 declarado y sin `PT` — es la fila `5` del criterio de éxito | **`PT-109`** · declarado sin arreglar: su descripción no está en esta máquina |
| El `type` canónico de un lote en `LEXICON` | `AC-09` de `L-0`, **retirado** allí y trasladado aquí: `EP` ×16, ausente ×2, `EPIC` ×1 | **`PT-100`** · `LEX-R27` declara que un lote **NO** lleva `type` |
| Que `tracker asignar` escriba `phase` | encontrado ejecutando `L-0`: sin él, ninguna tarea creada por `asignar` puede avanzar | **`PT-103`** · y además `type`, `severity`, `epic` y `title` |
| Que `avanzar` aplique la escalera de `status` | `LEXICON:304` la declara obligatoria para un `BUG` y nadie la aplica | **`PT-099`** (parada del `BUG`) y **`PT-105`** (peldaño de en medio) |
| Los seis `type === 'EP'` de `verify-fdge.mjs` | medidos y hoy latentes; el próximo lote sin viabilidad fallará `FDGE-R54` como si fuera una tarea | **`PT-100`** · cero, con el helper que `patrones.mjs` exporta |
| Que el espejo **reporte** una divergencia de texto | `L-0` hizo que `abrir --aplicar` la corrija; el espejo compara estado, no cuerpo | **`PT-111`** · medido hoy: el espejo **no compara** título ni cuerpo. Sigue entero |
| Lo que las tareas aplacen | cada `out-of-scope.md` cita un identificador que lo sostiene (`SUITE-R44`) | **HECHO** · cada `out-of-scope.md` cita el identificador que lo sostiene (`SUITE-R44`) |
| Un cuarto proyecto instalado desde npm | §6 lo exige: los tres que encontraron esto **no** son el banco de pruebas de la solución | **NO HECHO, y se dice** · el paquete publicado es la `11.0.0` y el lote vive en la `12.0.0`, que no se publica. Se resuelve cuando exista ese paquete, y publicar es acto del firmante |
**El merge y la publicación no son filas de esta tabla** (`SUITE-R45`): no son trabajo que el lote
absorba al cerrar, son el cierre mismo — listarlos convertiría la compuerta en su propio bloqueo.

### Una fila que ya se puede escribir, y su límite

`L-0` cerró con el tablero medido: **20 cuerpos de issue inutilizables → 0**, `10` con el literal
`null` → `0`, `14` listas en prosa → `0`. Eso **no** es una fila de cierre —es trabajo de una
tarea, y ahí está su evidencia— pero sí adelanta parte de la fila del criterio de éxito §4·1: un
proyecto destino ya no puede estar en verde mientras su tablero no lleva a ninguna parte.

Lo que **no** adelanta, y conviene no confundirlo: `§4` habla del **estado terminal falso**, que
es `C-1` y sigue entero.

---

## Revisión 1 — 2026-08-21 · entra `L-0`, y el reparto pasa a nueve

> `SUITE-R09` · append-only. Nada de lo anterior se modifica.

**Qué cambia:** el reparto de §8 pasa de ocho tareas a nueve. Se añade `L-0` **delante de todas**,
incluida `L-6`.

**Motivo:** un hallazgo del firmante, medido antes de aceptarlo.

```
L-0  ---   un enlace que falta no es un enlace roto
              el cuerpo del issue no enlaza al directorio, y el issue de un lote no
              lista sus tareas · 10 de 114 cuerpos publicados
              tracker.mjs · selftest.sh · CASOS-DE-USO · MANUAL · README · CLAUDE.md
```

### Por qué delante de `L-6`

`L-6` va primero porque *«este lote acabará auditándose»*. `L-0` va antes por la misma clase de
razón, un escalón más abajo: **este lote acabará siguiéndose desde el tablero**, y hoy el tablero
no lleva a ninguna parte. Las nueve tareas van a abrir su issue por el mismo camino que abrió el
de este lote, así que cada una nacerá con el mismo hueco mientras no se cierre.

No es una prioridad declarada de oficio: el firmante escribió *«eso debe ser corregido y agregado
como tarea y **comenzar por ahí**»*.

### Solapamiento

```
L-0 <-> L-1   tracker.mjs                       -> SERIALIZADOS
L-0 <-> L-2   tracker.mjs                       -> SERIALIZADOS
L-0 <-> L-3   tracker.mjs                       -> SERIALIZADOS
L-0 <-> L-7   selftest.sh                       -> SERIALIZADOS
L-0 <-> L-6   ninguno
```

`L-0` toca `tracker.mjs`, que ya estaba serializado con `L-1`, `L-2` y `L-3`. Ir **primero** no
añade ningún par nuevo: lo que hace es que las tres lo encuentren ya arreglado. El orden queda:

```
L-0 · L-6 · L-1 · L-2 · L-3 · L-4 · L-5 · L-7 · L-8
```

### La cuarta cara, y a quién pertenece

Midiendo `L-0` apareció que el `type` de un lote está escrito de **tres formas** en el registro
—`EP` (16), ausente (2) y `EPIC` (1)— y que `LEXICON` §8.1 no declara ninguna: enumera el `type`
de una **tarea** y nada para un lote. La consecuencia es que el issue de un lote **nunca ha
listado sus tareas**: `EP-017`, `EP-018` y `EP-019` fallan la comparación de la herramienta.

Es la causa `C-2` de §2 —*un hecho, varios nombres*— y por tanto **material de `L-3`**. Se declara
aquí para que no se descubra dos veces, y el reparto entre `L-0` y `L-3` se decide al abrir la
primera de las dos: `L-0` no puede publicar la lista de tareas de un lote sin que exista el nombre
canónico, y elegirlo por su cuenta sería inventar vocabulario, que es lo que `LEX-R21` prohíbe.

### Lo que esta revisión NO establece

Que nueve sea el número correcto, igual que §8 no establecía que lo fuera ocho. Y tampoco que
`L-0` sea la última tarea que se añada: aparecerán más mientras el lote se ejecute, y ese es el
comportamiento previsto — §4 declara que el lote **falla** si al cerrarlo reaparece un defecto de
la misma forma, no si el reparto crece.

### Sobre `INC-016`

Esta revisión **no escribe ningún identificador de tarea**, por el mismo motivo que §8: el
registro asigna (`SUITE-R08`), y citarlo aquí convertiría la mención en pertenencia por el
respaldo que `INC-016` describe. La pertenencia de `L-0` al lote vive donde tiene que vivir —el
campo `epic` de su `allocation`— y desde ahí la deriva la plataforma.

```
Revisión solicitada por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que la ampliación del reparto refleja mi intención: SÍ
```

> **Base de esta firma**, escrita por el agente (`INTAKE-R06`): *«eso debe ser corregido y
> agregado como tarea y comenzar por ahí»*, 2026-08-21. `SUITE-R27`: contrastable, no probada.

---

## Revisión 2 — 2026-08-21 · lo que las cinco primeras tareas dejaron declarado

> `SUITE-R09` · append-only. La tabla del `## Cierre del lote` **no se reescribe**: esta revisión
> la **amplía** con lo que apareció ejecutando, y dice de quién es cada cosa.

Cinco tareas cerradas —`L-0`, `L-6`, `L-1`, `L-2` y su medición— destaparon **nueve** cosas que no
estaban en el reparto original. Ninguna se arregló de paso: cada una lleva dueño o queda aquí.

| Qué | De dónde salió | Estado |
|:---|:---|:---|
| El `type` canónico de un lote en `LEXICON` | `L-0` · `EP` ×16, ausente ×2, `EPIC` ×1 | **PENDIENTE** · `L-3` |
| Los seis `type === 'EP'` de `verify-fdge.mjs` | `L-0` · medidos y hoy latentes | **PENDIENTE** · `L-3` |
| Que `tracker asignar` escriba `phase` | `L-0` · ninguna tarea creada con él puede avanzar | **PENDIENTE** · `L-1` lo declaró, sigue abierto |
| Que el espejo **reporte** una divergencia de texto | `L-0` · `abrir --aplicar` la corrige, `espejo` no la ve | **PENDIENTE** · `L-7` |
| Que `verify-suite` cace **secciones** citadas que no existen | `L-6` · hoy caza reglas, no secciones. Con esto, `§24.2` habría saltado el día que se escribió | **PENDIENTE** · sin dueño |
| Recalcular el `Risk` publicado (`73`) | `L-6` · se calculó con `H-001` y `H-006` activos; hoy quedan siete y `Σ = 37` | **PENDIENTE** · arrastra `INC-008` |
| Que `--all` ejerza lo que ejerce `--gate G4` | `L-1` · `INC-010`: «cada compuerta es una revisión sorpresa» | **PENDIENTE** · sin dueño |
| La escalera **completa** de `status` | `L-2` · `avanzar` tampoco escribe `IN_PROGRESS` ni `IN_REVIEW` | **PENDIENTE** · sin dueño |
| Auditar las aserciones atadas a cifras que **crecen** | `L-2` · `PT-0` cayó al cruzar `PT-100`. Ya pasó al llegar a 20 | **PENDIENTE** · sin dueño |
| Que `sellar` recalcule las cifras del inventario | `L-1` `L-2` · `FND-R14` cayó **tres veces** en este lote | **PENDIENTE** · sin dueño |

### Lo que estas cinco tareas **sí** resolvieron

```
enlaces del tablero      20 cuerpos inutilizables -> 0 · 10 con «null» -> 0 · 14 listas en prosa -> 0
umbrales de PTSA         §24.2, §24.3 y §24.4 escritas SIN inventar una sola cifra
                         PTSA-R81 (el minimo) · PTSA-R82 (publicar health_unstable)
                         la «B» recalculada, y la banda «(75-89)» retirada
estado terminal          INTEGRATED contrastado con el arbol · 91 de 91 en verde
                         los 58 sin rama declarada, alcanzados igual
transicion del BUG       la aplica «avanzar», con su RIGE_DESDE y su verificador
bateria                  1229 -> 1286 casos · cero fallos · cuatro inversas limpias
```

### Cinco casos de la batería que **protegían defectos**

No se hicieron pasar: se invirtieron con su motivo, conservando de cada uno la mitad que sí valía.

```
:1614  la lista en prosa se emite              PT-096
:1787  la nota se emite sin ref durable        PT-096
:2226  el cuerpo del lote enumera con su issue PT-096
:5202  la ultima fase marca INTEGRATED         PT-098
:5204  …y lo escribe en el YAML                PT-098
```

**Ya no es una anécdota**: un arreglo anterior deja tests que documentan el estado anterior, y
nadie vuelve a mirarlos hasta que el siguiente los rompe. Es candidato a fila propia si vuelve a
salir en `L-3`…`L-8`.

### Lo que esta revisión NO establece

Que el reparto de nueve siga siendo el correcto. Cinco de las nueve están hechas y han añadido
diez filas a esta tabla: el lote **crece al ejecutarse**, que es lo que `§8` ya declaraba —*«la
primera tarea que abra su intake puede partir en dos o fundirse con otra, y eso es información, no
una desviación del plan»*—.

Lo que sí establece: **ninguna de las diez se arregló de paso**, y cada una consta con su medición
hecha para que quien la tome no repita el trabajo.

```
Revisión solicitada por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
Fecha: 2026-08-21
```


---

## Revisión 3 — 2026-08-21 · cuatro tareas más, y lo que destaparon
> `SUITE-R09` · append-only. Las tablas anteriores **no se reescriben**: esta revisión dice qué
> filas quedaron resueltas, **por quién**, y qué apareció nuevo. `SUITE-R45` permite que una fila
> se cierre `HECHO` **o con el identificador al que se movió**.

### Filas que quedan resueltas

| Fila | Quién la resolvió |
|:---|:---|
| El `type` canónico de un lote en `LEXICON` | `PT-100` · `LEX-R27` declara que un lote **NO** lleva `type` |
| Los seis `type === 'EP'` de `verify-fdge.mjs` | `PT-100` · cero, con el helper que `patrones.mjs` exporta |
| Que `tracker asignar` escriba `phase` | `PT-103` · y además `type`, `severity`, `epic` y `title` |
| Que `avanzar` aplique la escalera de `status` | `PT-099` (parada del `BUG`) y `PT-105` (peldaño de en medio) |

### Lo que apareció ejecutando estas cuatro

| Qué | De dónde salió | Estado |
|:---|:---|:---|
| El escapado que no existe no se rompe | señalado por el firmante · **ocho** roturas en una sesión, y el marco las cuenta en **cuatro comentarios** separados sin sumar: son diecisiete | **`PT-101`** |
| La versión es un contenido, no un número | `L-4` · `version.mjs` decía «todo alineado» con **cuatro** declaraciones muertas | **`PT-102`** · HECHO |
| El registro solo lo escribe el comando | señalado por el firmante · `asignar` escribía **4 campos de 9**, así que cumplir el marco exigía saltárselo | **`PT-103`** · HECHO |
| El tablero dice en qué paso estás | pedido el 2026-08-13 · `EP-007` entregó un comando y **declaró** el hueco | **`PT-104`** · HECHO |
| El estado que una compuerta exige lo escribe un comando | salió de **aplicar** `PT-103` · `FDGE-R34` pedía `DONE` y nadie lo escribía | **`PT-105`** |
| Que `sellar` recalcule las cifras del inventario | `FND-R14` ha caído **CINCO** veces en este lote | **PENDIENTE** · sin dueño |
| Que el grafo se use, no solo se declare | señalado por el firmante · `SUSPECT` durante **seis** tareas, declarado en seis `context.md` y usado en cero. Al regenerarlo dio el diagnóstico de `PT-102` | **PENDIENTE** · sin dueño |
| Que `PHASES` cite la máquina de estados que el tablero publica | `PT-104` publica el paso, sus reglas y sus artefactos; `PHASES` no lo menciona | **PENDIENTE** · sin dueño |

### Lo que estas cuatro enseñan sobre el lote, y conviene no perder

**Un defecto tapado por un rodeo no se puede ver.** `PT-105` salió de **aplicar** `PT-103`: mientras
escribir el registro a mano era rutina, el hueco de `FDGE-R34` no podía notarse, porque cada tarea
lo tapaba sin registrar que lo hacía. Arreglar el rodeo hizo visible lo que el rodeo ocultaba.

**Una escalera a medias no lo parece desde ninguno de sus peldaños.** `PT-098` puso el de arriba y
`PT-099` el de abajo; los dos correctos en su caso. El hueco solo aparece mirando la escalera
entera — y a la escalera entera solo se la mira cuando algo obliga a recorrerla sin atajos.

**Los tres hallazgos mayores de la sesión los vio una persona, no una herramienta.** El grafo sin
usar, las roturas de escapado y el marco que no obliga. Ninguna comprobación los tenía, y `PT-104`
existe para que el siguiente sea al menos **visible** — no para garantizar que se vea.

### Lo que esta revisión NO establece

- **Que el reparto esté completo.** Cinco tareas nuevas en un día salieron de ejecutar, no de
  planificar. Es esperable que ejecutar las que quedan destape más.
- **Que `PT-104` cambie la conducta del agente.** No es comprobable y no se afirma.


---

## Revisión 4 — 2026-08-22 · el cierre del lote, fila a fila
> `SUITE-R09` · append-only. Las tablas anteriores **no se reescriben**. `SUITE-R45` pide que cada
> fila del `## Cierre del lote` quede **`HECHO`** o **con el identificador al que se movió** — un
> lote no cierra dejando sin responder lo que él mismo se asignó.

| Fila | Resolución |
|:---|:---|
| Entrada en `CHANGELOG.md` con guía de migración | **HECHO** · `12.0.0`, con las cinco reglas nuevas citadas y qué hacer al actualizar |
| Número de versión | **HECHO** · `MAJOR` → `12.0.0`. Entran cinco reglas `HARD` |
| `RIGE_DESDE` de toda regla nueva | **HECHO** · `PT-106` para las diecinueve históricas; `LEX-R08` y `SUITE-R58` con su fila al nacer |
| Sello de la versión | **HECHO salvo los pasos 7 y 8**, que son humanos (`SUITE-R06a`): el **tag** y el **PR a `main`** |
| Los quince `INC` de los tres proyectos | **PARCIAL, declarado** · ver el desglose abajo |
| `INC-003` de la calculadora | **`PT-109`** · declarado sin arreglar: su descripción no está en esta máquina |
| El `type` canónico de un lote en `LEXICON` | **`PT-100`** · `LEX-R27` declara que un lote **NO** lleva `type` |
| Que `tracker asignar` escriba `phase` | **`PT-103`** · y además `type`, `severity`, `epic` y `title` |
| Que `avanzar` aplique la escalera de `status` | **`PT-099`** (parada del `BUG`) y **`PT-105`** (peldaño de en medio) |
| Los seis `type === 'EP'` de `verify-fdge` | **`PT-100`** · cero, con el helper de `patrones.mjs` |
| Que el espejo **reporte** una divergencia de texto | **`PT-111`** · medido hoy: el espejo **no compara título ni cuerpo**. Sigue entero |
| Lo que las tareas aplacen | **HECHO** · cada `out-of-scope.md` cita el identificador que lo sostiene |
| Un cuarto proyecto instalado desde npm | **NO HECHO, y se dice** · ver abajo |

### Los quince `INC`, desglosados

```
ARREGLADOS      INC-004  PT-102   la version es un CONTENIDO
                INC-006  PT-099   la escalera de status
                INC-008  PT-100   donde vive la nota de reanclaje
                INC-010  PT-109   cada compuerta es una revision sorpresa
                INC-012  PT-100   los tipos de caso QA
                INC-015  PT-109   una mencion no es una declaracion

DECLARADOS      INC-003  PT-109   sin descripcion accesible
SIN ARREGLAR    INC-005  PT-109   idem
                INC-014  PT-109   idem

DECLARADOS      INC-016  §7 del intake
YA EN EL LOTE   INC-017  §7 del intake

SIN TOCAR       INC-001  INC-002  INC-007  INC-009  INC-011  INC-013
                de estos, INC-007 e INC-013 son L-8, que NO se ha ejecutado
```

**Seis arreglados, tres declarados sin acceso, dos ya declarados y seis sin tocar.** No se cierra
diciendo «los quince»: se dice **cuáles**.

### La fila que NO se hizo, y por qué se dice en vez de callarse

**«Un cuarto proyecto instalado desde npm».** El `§6` del intake la exige con este razonamiento:
*los tres proyectos que encontraron esto **no** son el banco de pruebas de la solución.*

**No se ha hecho.** Y el motivo importa: el paquete publicado es la **`11.0.0`**, y todo lo que
este lote arregla vive en la **`12.0.0`**, que **no se publica** —no está autorizado—. Instalar la
`11.0.0` en un cuarto proyecto probaría el marco **anterior** al lote.

La fila queda **abierta y con su condición**: se resuelve cuando exista un paquete `12.0.0`
publicado, y publicar es acto del firmante.

### Lo que este cierre NO establece

- **Que los seis `INC` sin tocar sean menores.** Dos de ellos son `L-8`, que no se ejecutó.
- **Que el marco funcione en un proyecto ajeno.** Es exactamente lo que la fila del cuarto
  proyecto existe para comprobar, y sigue sin comprobarse.
