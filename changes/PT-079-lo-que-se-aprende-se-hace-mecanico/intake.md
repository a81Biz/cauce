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
> enlaces y ya no es rastreable, éste fix debe solucionar ésto también»

Dos familias de defecto con **un mismo criterio**: lo que hoy depende de que alguien se acuerde
tiene que pasar a depender de algo que **falla**.

---

# Familia A · La trazabilidad se pierde al borrar la rama

## A.1 · Qué pasa, medido

`cuerpoDeIssue()` enlaza el directorio de la tarea en la rama donde el contenido «existe ahora»:

```js
const ramaDelEnlace = (viva && ramaTrabajo) ? ramaTrabajo : (rama ?? 'main');
```

`ramaTrabajo` es **la rama en la que se ejecutó el espejo**, no la rama de la tarea enlazada. Y
la rama de tarea se borra al fusionar (`FDGE-R19`: «se borra al fusionarse»).

Medido el 2026-08-19 sobre el tablero real:

```
$ para cada issue vivo: extraer la rama del enlace y comprobar si existe
  #142 -> fix/alberto-martinez/PT-074-…  404
  #139 -> fix/alberto-martinez/PT-074-…  404
  #137 -> fix/alberto-martinez/PT-075-…  404
  … (once más)
  ---
  14 de 16 enlaces rotos
```

## A.2 · Son DOS defectos, no uno

**A-1 · El enlace apunta a la rama equivocada.** El issue de `PT-072` apunta a la rama de
`PT-074` —**otra tarea**— porque el espejo se ejecutó estando en esa rama. Nada garantiza que el
contenido de `PT-072` esté ahí; está por casualidad, porque la rama salió de `trabajo`.

**A-2 · Y esa rama desaparece.** Al fusionar se borra, y el cuerpo del issue **no se
resincroniza** hasta el siguiente `tracker abrir --aplicar`. Entre el merge y esa ejecución —que
puede no llegar nunca— el enlace es un 404.

El propio cuerpo lo anuncia sin saberlo:

> *«El enlace apunta a `fix/alberto-martinez/PT-074-…`, que es donde el contenido existe ahora.
> Al integrarse pasará a `main` y este cuerpo se actualizará solo.»*

**«Se actualizará solo» es falso**: se actualiza si alguien vuelve a correr el espejo. `PT-036`
ya arregló una vez que el enlace apuntara «a donde el contenido está y no a donde estará»; lo que
no previó es que ese sitio **deja de existir**.

## A.3 · Cómo se soluciona

**Enlazar por `commit`, no por rama.** Un SHA no se borra: los commits de una rama fusionada
siguen alcanzables desde la rama por defecto para siempre.

```
antes    /tree/<rama-efimera>/changes/PT-NNN-slug     <- muere con la rama
despues  /tree/<sha-del-commit>/changes/PT-NNN-slug   <- permanente
```

El SHA es **el último commit que tocó ese directorio**, derivado con
`git log -1 --format=%H -- changes/PT-NNN-slug`. Es exacto y no hay que recordarlo.

Y **algo que falla**: `verify-fdge` comprueba que ningún issue vivo enlace a una rama
inexistente. Hoy 14 de 16 lo hacen y nada lo dice.

---

# Familia B · Escribo comprobaciones y no las ejecuto contra el caso real

## B.1 · Qué pasó, contado

**Nueve fallos** en este lote, todos de la misma raíz. No son hipótesis: cada uno tiene su
commit.

| # | Qué escribí | Por qué no valía | Dónde |
|:--|:---|:---|:---|
| 1 | «`EP-051` no debe aparecer» | aparece en avisos legítimos → **falla contra trabajo correcto** | `PT-055` `E1` |
| 2 | «`EP-050` debe aparecer» | aparece siempre → **pasaba en vacío** | `PT-055` `E3` |
| 3 | ídem, en negativo | mismo error | `PT-055` `E4` |
| 4 | «escritas por el arnes» | la nota dice «escrib**ió**», con tildes | `PT-076` `E8` |
| 5 | «una sola persona» | el texto dice «**UNA**» y `grep` distingue | `PT-068` |
| 6 | Una inversa que **no revertía nada** | `str.replace` no falla cuando no casa: **verde en los tres casos** | `PT-074` |
| 7 | Un arreglo que **no arreglaba nada** | el caso le pasaba una cadena donde la ruta real pasa `null` | `PT-068` |
| 8 | Una guarda demasiado gruesa | habría fallado contra trabajo correcto | `PT-076` |
| 9 | Tres intentos de andamiaje | `trlib()` ya lo resolvía **treinta líneas más arriba**, desde `PT-058` | `PT-066` |

**Los números 2 y 6 son los graves.** Un caso verde que no prueba nada **ocupa el sitio del que
haría falta** — es exactamente lo que `PT-050` documentó y lo que `TD-09` volvió a encontrar.

## B.2 · La raíz, en una frase

**Escribo la comprobación y no la ejecuto contra el caso real antes de darla por buena.** Es
literalmente la instrucción del firmante en el primer mensaje de la sesión.

Y el patrón concreto que la produce: **asertar sobre si un identificador aparece en una salida.**
Casi nunca prueba lo que pretende, porque las herramientas nombran cosas por muchos motivos
—avisos, referencias cruzadas, el cuerpo de otra regla—.

Lo que sí sirve, y este lote lo demostró tres veces:

```
sobre el VEREDICTO   «✗ SUITE-R45»  ·  «bajo evaluacion: EP-050»
sobre una HUELLA     md5sum antes y despues     <- no se satisface por accidente
```

## B.3 · Cómo se soluciona — y qué NO se puede solucionar

**No se arregla con disciplina.** «Tener más cuidado» es lo que ya fallaba nueve veces. Tres
guardas mecánicas, y una declaración honesta:

**B-1 · Una inversa que no revierte, falla.** Helper en el arnés: `inversa <archivo> <patrón>
<reemplazo>` que **aborta si el patrón no casa**. Convierte mi `assert` manual —que olvidé una
vez— en la única forma de escribir una inversa.

**B-2 · Una aserción anclada sólo en un identificador se señala.** Un `chk`/`chkno` cuyo patrón
es únicamente `PT-\d+` o `EP-\d+`, sin marca de veredicto, es sospechoso por construcción. Se
avisa con su línea, no se prohíbe: hay casos legítimos, y convertirlo en error rompería los que
ya existen.

**B-3 · Lo que NO se puede comprobar, se declara.** Que un caso se haya visto **en rojo antes**
de existir el arreglo no es observable desde el repositorio: no hay rastro de cuándo se escribió
cada aserción. Es la disciplina de `FDGE-R17`, y seguirá dependiendo de que se cumpla. Se declara
en `10-Technical-Debt` en vez de fingir que `B-1` y `B-2` la cubren.

---

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El enlace del issue apunta a un **commit**, no a una rama efímera | el cuerpo lleva `/tree/<sha>/` y el sha existe |
| AC-02 | El sha es **el del contenido**, derivado | `git log -1 -- changes/PT-NNN-slug`, no la rama en la que corre el espejo |
| AC-03 | Los 14 enlaces rotos de hoy quedan **arreglados** | tras `tracker abrir --aplicar`, ninguno apunta a una rama inexistente |
| AC-04 | **Algo falla** si un issue vivo enlaza a una rama que no existe | `verify-fdge` lo reporta con su número de issue |
| AC-05 | Una inversa que **no revierte** aborta | el helper falla si el patrón no casa; hoy `str.replace` no dice nada |
| AC-06 | Una aserción anclada sólo en un identificador **se señala** | caso que la enumera con su línea |
| AC-07 | Lo no comprobable queda **declarado** | `TD-16`: que un caso se viera en rojo antes no es observable |
| AC-08 | La inversa está hecha y **cae de verdad** | revertido cada arreglo, su caso cae — comprobado con el helper de `AC-05` |

**`AC-04` y `AC-05` son el corazón.** Sin `AC-04`, arreglar los 14 enlaces de hoy los deja rotos
otra vez mañana. Sin `AC-05`, la próxima inversa vuelve a dar verde sin revertir.

**`AC-07` es la contención.** `PT-023` midió que un verificador equivocado tres de cada cuatro
veces es peor que ninguno. Si la disciplina de `FDGE-R17` no es observable, se dice — no se
inventa una comprobación que diga «correcto» siempre.

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: ningún issue vivo enlaza a una rama inexistente y `verify-fdge` falla si vuelve
> a pasar; una comprobación inversa que no revierte aborta en vez de dar verde; y lo que no se
> puede comprobar de `FDGE-R17` está declarado en `10-Technical-Debt`.

## 4. Qué NO entra   `[AGENTE]`

- OUT: reescribir los cuerpos de issues **cerrados**. `SUITE-R46` los cierra tras `G4` y su enlace apunta ya a la rama por defecto: no están rotos.
- OUT: prohibir las aserciones sobre identificadores. Hay casos legítimos —`AC-06` **avisa**, no bloquea— y convertirlo en error rompería los que ya existen.
- OUT: comprobar que un caso se escribió **antes** que su código (`FDGE-R17`). No es observable desde el repositorio; se declara en `TD-16`.
- OUT: los 130 casos de aserción que ya existen. Se **enumeran** los sospechosos; revisarlos uno a uno es otra tarea, y `AC-06` la deja medida.
- OUT: cambiar `FDGE-R19` ni dejar de borrar la rama al fusionar. La rama efímera **debe** morir; lo que no debe morir es el enlace.

## 5. Firma

```
Firmado por lote: EP-017
```
