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
