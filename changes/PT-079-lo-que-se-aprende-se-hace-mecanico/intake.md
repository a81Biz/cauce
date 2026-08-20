# PT-079 — Lo que se aprende se hace mecánico

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-079
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 1
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «analiza lo que se aprendió y genera una tarea, un fix para arreglarlo y que no vuelva a
> ocurrir (…) mientras trabajas en un PT particular y está la rama, se puede navegar y consultar
> los `.md` que detallan, pero llega un punto en el que la rama ya no está y se pierden los
> enlaces y ya no es rastreable»

> «cuando se definió que se separaran las ramas y se usara github quedamos de crear una rama en
> github específica para contener toda ésta documentación y no perderla (…) me parece que eso
> hay que ajustarlo»

> «todo lo que indicas es necesario revisar si pega a alguna regla de negocio o caso de uso que
> se use o que se tenga que describir en el manual y en el inicio de la operación para que no se
> pase por alto ni se olvide de su ejecución»

Tres familias, **un mismo criterio**: lo que hoy depende de que alguien se acuerde tiene que
pasar a depender de algo que **falla**.

---

# Familia A · La trazabilidad se rompe al borrar la rama

## A.1 · Lo que de verdad se pierde — corrección de mi primer diagnóstico

Lo primero que escribí fue que «se pierde la documentación». **Es falso, y comprobarlo importa:**

```
$ git ls-tree --name-only origin/trabajo changes/PT-075-una-regla-sin-verificador-no-ocurre/
  10 archivos
```

El contenido **está a salvo** en la rama de integración. Lo que muere es el **enlace**.

## A.2 · Dos defectos, medidos sobre el tablero real

**A-1 · El enlace apunta a la rama equivocada.**

```js
// tracker.mjs · cuerpoDeIssue()
const ramaDelEnlace = (viva && ramaTrabajo) ? ramaTrabajo : (rama ?? 'main');
```

`ramaTrabajo` es **la rama en la que se ejecutó el espejo**, no la de la tarea enlazada. Por eso
el issue de `PT-072` apunta a la rama de `PT-074`, que es otra tarea: el contenido estaba ahí
por casualidad, porque esa rama salió de `trabajo`.

**A-2 · Y esa rama se borra al fusionar** (`FDGE-R19`: «se borra al fusionarse»).

```
$ para cada issue vivo: extraer la rama del enlace y comprobar si existe
  #142 · #139 · #136 · #135 · #134 · #133 · #132 · #131 · #129 · #128 · #127 · #26
        -> fix/alberto-martinez/PT-074-…   BORRADA
  #137 · #94  -> fix/alberto-martinez/PT-075-…   BORRADA
  ---
  14 de 16 enlaces rotos
```

El propio cuerpo lo anuncia sin saberlo: *«Al integrarse pasará a `main` y este cuerpo se
actualizará solo»*. **«Solo» es falso**: se actualiza si alguien vuelve a correr el espejo.

`PT-036` ya arregló que el enlace apuntara «a donde el contenido está y no a donde estará». Lo
que no previó es que ese sitio **deja de existir**.

## A.3 · La rama que se acordó crear existe, y nunca se publicó

Esto es lo que el firmante recuerda, y el marco lo tiene escrito:

> `LEXICON` §6.5 · *«`proyectar` escribe la rama DERIVADA `cauce/<usuario>`: un agregado de lo
> vivo, **con el SHA de cada rama**. (…) Es LOCAL: publicarla es `--publicar`, una decisión y no
> un efecto colateral.»*

```
local:   cauce/alberto-martinez   ✅ existe · ESTADO.md + CHECKPOINT.json
origin:  desarrollo · main · trabajo      ❌ la proyección NO está
```

`tracker proyectar --publicar` **existe y funciona**. **Nunca se ejecutó.**

Y hay un segundo defecto dentro: la columna `SHA` de `ESTADO.md` está **vacía** (`—`) para casi
todas, porque una tarea en `PHASE 1` aún no declara rama. **El registro durable existe y no está
registrando lo durable.**

## A.4 · Cómo se soluciona

| | Qué | Por qué |
|:---|:---|:---|
| 1 | El enlace apunta a un **ref durable**: la rama de integración si el contenido ya está ahí, y si no, el **commit** que lo contiene | Un SHA no se borra; `trabajo` tampoco |
| 2 | `proyectar` registra el **SHA del contenido**, no sólo el de la rama viva | Hoy la columna está vacía justo cuando haría falta |
| 3 | **Publicar la proyección deja de ser opcional** al cerrar una tarea | Es la rama que se acordó para no perder esto |
| 4 | `verify-fdge` **falla** si un issue vivo enlaza a una rama inexistente | Hoy 14 lo hacen y nada lo dice |

**Lo que NO cambia:** la rama efímera se sigue borrando (`FDGE-R19`) y la proyección sigue siendo
**derivada** —sólo la escribe la herramienta, con su marca `cauce:proyeccion`—. Lo que cambia es
que deja de depender de que alguien se acuerde de publicarla.

---

# Familia B · Escribo comprobaciones y no las ejecuto contra el caso real

## B.1 · Diez fallos en este lote, cada uno con su commit

| # | Qué escribí | Por qué no valía | Dónde |
|:--|:---|:---|:---|
| 1 | «`EP-051` no debe aparecer» | aparece en avisos legítimos → **falla contra trabajo correcto** | `PT-055` `E1` |
| 2 | «`EP-050` debe aparecer» | aparece siempre → **pasaba en vacío** | `PT-055` `E3` |
| 3 | ídem, en negativo | mismo error | `PT-055` `E4` |
| 4 | «escritas por el arnes» | la nota dice «escrib**ió**», con tildes | `PT-076` `E8` |
| 5 | «una sola persona» | el texto dice «**UNA**» | `PT-068` |
| 6 | «no est» | la salida dice «**No est**á» | `PT-066` `E5` |
| 7 | Una inversa que **no revertía nada** | `str.replace` no falla cuando no casa: **verde en los tres casos** | `PT-074` |
| 8 | Un arreglo que **no arreglaba nada** | el caso le pasaba una cadena donde la ruta real pasa `null` | `PT-068` |
| 9 | Una guarda demasiado gruesa | habría fallado contra trabajo correcto | `PT-076` |
| 10 | Casos que usan un helper definido **mil líneas más abajo** | dos veces: `TRR` y `RG2` | `PT-076`, `PT-066` |

**Los números 2 y 7 son los graves.** Un caso verde que no prueba nada **ocupa el sitio del que
haría falta** — es lo que `PT-050` documentó y `TD-09` volvió a encontrar.

## B.2 · La raíz

**Escribo la comprobación y no la ejecuto contra el caso real antes de darla por buena.** Es
literalmente la instrucción del firmante en el primer mensaje de la sesión.

Y el patrón que la produce: **asertar sobre si un identificador aparece en una salida**. Casi
nunca prueba lo que pretende, porque las herramientas nombran cosas por muchos motivos. Lo que sí
sirve, y este lote lo demostró tres veces:

```
sobre el VEREDICTO   «✗ SUITE-R45»  ·  «bajo evaluacion: EP-050»
sobre una HUELLA     md5sum antes y despues    <- no se satisface por accidente
```

## B.3 · Cómo se soluciona, y qué NO se puede

**No se arregla con disciplina.** «Tener más cuidado» es lo que ya falló diez veces.

| | Guarda | Ataca |
|:---|:---|:---|
| `B-1` | Helper `inversa` que **aborta si el patrón no casa** | #7 |
| `B-2` | Señalar aserciones ancladas sólo en un identificador | #1, #2, #3 |
| `B-3` | Señalar un caso que invoca un helper **definido después** | #10 |
| `B-4` | **Declarar** lo no comprobable | #4, #5, #6, #8, #9 |

**`B-4` es la honestidad de la tarea.** Que un caso se haya visto **en rojo antes** del arreglo no
deja rastro en el repositorio, y que una aserción case con la salida real sólo se sabe
ejecutándola. `PT-023` midió que un verificador equivocado tres de cada cuatro veces es peor que
ninguno: se declara en `TD-16`, no se finge.

---

# Familia C · Que no se pase por alto ni se olvide de su ejecución

Esto es lo que el firmante añadió, y es lo que hace que las familias A y B **duren**.

## C.1 · Comprobado: no está en ninguno de los cuatro sitios

```
$ grep -c "proyectar\|proyeccion"  CORE.md PHASES.md     -> 0, 0    ninguna fase la invoca
$ grep -c "proyecc"                verify-fdge.mjs        -> 0       nada la exige
$ grep -i "proyecc"                CASOS-DE-USO.md        -> nada    no hay caso de uso
$ grep -i "proyectar"              MANUAL.md              -> nada    el manual no la nombra
```

`SUITE-R31` gobierna «medir la divergencia del marco» — **no** publicar la proyección. **Ninguna
regla la exige.**

Es el mismo patrón que `PT-075` encontró con la viabilidad y que este lote lleva seis veces:
**un mecanismo que existe, es correcto, y nada lo invoca.**

## C.2 · Dónde entra cada cosa

| Sitio | Qué falta |
|:---|:---|
| `RULES.md` | La regla que obliga a que el rastro sobreviva a la rama |
| `PHASES.md` · `PHASE 9` | La cita: al integrar, publicar la proyección |
| `CASOS-DE-USO.md` | Dos casos: **`A5`** (inicio de sesión → publicar lo pendiente) y uno nuevo en **`C`** (¿sigo pudiendo rastrear una tarea cerrada?) |
| `MANUAL.md` | El paso, en el recorrido de una tarea |
| `verify-fdge` | Lo que **falla** si no se hizo |

**Los cinco, o ninguno.** Una regla sin fase que la cite no se abre; una fase sin verificador no
se cumple; y un manual que no lo menciona hace que quien llega nuevo nunca lo ejecute — que es
exactamente por lo que la proyección lleva sin publicarse desde que se diseñó.

---

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El enlace del issue apunta a un **ref durable** | el cuerpo no enlaza a una rama efímera |
| AC-02 | El ref es **el del contenido**, derivado | no la rama en la que corre el espejo |
| AC-03 | Los 14 enlaces rotos quedan **arreglados** | tras el espejo, ninguno apunta a una rama inexistente |
| AC-04 | **Algo falla** si un issue vivo enlaza a una rama que no existe | `verify-fdge` lo reporta con su número |
| AC-05 | `proyectar` registra el **SHA del contenido** | la columna deja de estar vacía |
| AC-06 | La proyección **se publica**, y no depende de acordarse | citada en `PHASE 9` y exigida |
| AC-07 | Una inversa que **no revierte** aborta | el helper falla si el patrón no casa |
| AC-08 | Una aserción anclada sólo en un identificador **se señala** | caso que las enumera con su línea |
| AC-09 | Un caso que invoca un helper **definido después** se señala | caso que lo detecta por número de línea |
| AC-10 | La regla nueva está **en los cinco sitios** | `RULES` · `PHASES` · `CASOS-DE-USO` · `MANUAL` · verificador |
| AC-11 | Lo no comprobable queda **declarado** | `TD-16` |
| AC-12 | La inversa está hecha y **cae de verdad** | con el helper de `AC-07` |

**`AC-04`, `AC-07` y `AC-10` son el corazón.** Sin `AC-04`, los 14 enlaces se rompen otra vez
mañana. Sin `AC-07`, la próxima inversa vuelve a dar verde sin revertir. Sin `AC-10`, todo esto
depende otra vez de que alguien se acuerde.

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: ningún issue vivo enlaza a una rama inexistente y `verify-fdge` falla si vuelve
> a pasar; la proyección se publica como parte de integrar y una regla lo exige desde los cinco
> sitios; una inversa que no revierte aborta; y lo que no se puede comprobar está en `TD-16`.

## 4. Qué NO entra   `[AGENTE]`

- OUT: dejar de borrar la rama efímera. **Debe** morir (`FDGE-R19`); lo que no debe morir es el enlace.
- OUT: que la proyección deje de ser derivada. Sigue escribiéndola sólo la herramienta, con su marca `cauce:proyeccion`.
- OUT: reescribir los cuerpos de issues **cerrados**. Su enlace ya apunta a la rama por defecto.
- OUT: prohibir las aserciones sobre identificadores — `AC-08` **avisa**, no bloquea. Hay casos legítimos y convertirlo en error rompería los existentes.
- OUT: comprobar que un caso se escribió **antes** que su código (`FDGE-R17`). No es observable; se declara en `TD-16`.
- OUT: revisar los ~130 casos de aserción que ya existen. Se **enumeran**; revisarlos es otra tarea, y `AC-08` la deja medida.

## 5. Firma

```
Firmado por lote: EP-017
```
