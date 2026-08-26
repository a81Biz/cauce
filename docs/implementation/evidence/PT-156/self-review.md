# `PT-156` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | |
|:---|:---|
| `LEXICON` §3.6 | `FPGE`, con sus **siete** fases y la compuerta en la que `FPGE-R04` la pone |
| `FPGE-Implementation` · `FPGE-Prompts` | `[1]`..`[7]` → `PHASE n — Nombre`, en los **dos** |
| `patrones.mjs` | `FPGE.fases: SIN_EVALUAR` → `[1, 7]` |
| `verify-patrones` | **99 → 106** comprobaciones |
| Huecos de `audit` | **1 → 0** |
| `selftest` | 1727 → **1736** casos |
| Rojos de la batería | **7 → 0** |
| `CORE.md` | seis líneas de `diff`: dos sellos y la línea de `FPGE`. **263** reglas, sin cambio |
| `ROTURAS_DE_ESCAPADO` | **27 → 29** |

## 2. El apartado no faltaba por olvido

`FPGE` numeraba sus siete pasos como `[1]`..`[7]`. `LEXICON` §2 dice que `PHASE` es la **única**
palabra admitida para un paso de cualquier flujo de la suite y prohíbe **por su nombre**
`Step n` y `Etapa n` — **el corchete no está en esa lista**. Es la misma cosa con una grafía que
la prohibición no alcanzó, y por ahí se coló durante siete versiones.

Consecuencia medida: sin fases, no había rango que declarar; `patrones.mjs` llevaba
`SIN_EVALUAR`; `audit` reportaba el hueco. **La cadena era correcta de arriba abajo**, y por eso
`PT-144` hizo bien en no inventarse el rango. Lo que faltaba estaba tres documentos más arriba.

Por eso el orden fue forzoso: **primero `PHASE n`, después el apartado**. Al revés, `LEXICON`
habría declarado un rango de fases que no existían.

## 3. Al voltear una aserción, se abre el hueco que esa aserción tapaba

La aserción de `verify-patrones` **nacía al revés**: exigía que `fasesDe('FPGE')` fuera
`SIN_EVALUAR`. Y estaba **bien** mientras el dato no existía — defendía la declaración de
ignorancia, que es lo que `RULE-06` pide.

Al voltearla quedó un hueco nuevo: **nadie comprobaba que `LEXICON` tuviera el apartado** del que
el rango sale. Un `fases: [1, 7]` escrito sin apartado habría pasado en verde, y eso es
literalmente *«el rango inventado»* contra el que `PT-144` escribió `SIN_EVALUAR`.

Cerrado en el acto, y **en los dos sentidos**, porque una sola dirección no comprueba nada:

```
rango declarado + sin apartado  →  «rango INVENTADO (RULE-06)»
apartado + contrato SIN_EVALUAR →  «el contrato lo da por SIN_EVALUAR»
```

Derivado de `COMPONENTES`: **un séptimo componente entra solo**. Los dos sentidos se ejecutaron
sobre copias del árbol antes de escribir la tabla de `test-scenarios`.

## 4. La primera batería devolvió siete rojos, y ninguno era ruido

### 4.1 · Cuatro casos que sólo podían pasar mientras existía el defecto

`PT-147` afirmaba que los seis componentes entran en la auditoría de fases así:

```sh
chk "FIDE entra en la auditoria de fases"  "FIDE PHASE"  … node audit.mjs …
```

**`audit` sólo emite esa línea cuando el componente tiene un hueco.** Los tres casos pasaban
**porque `FIDE`, `FPGE` y `Foundation` fallaban**, y se pusieron en rojo el día en que dejaron de
fallar. Estuvieron en verde todo `EP-022` afirmando lo contrario de lo que ocurría.

**Y repetí la inversión en esta tarea**, copiando el patrón sin mirar contra qué asertaba.

Es `RULE-02` por el reverso: la regla dice que un fallo debe distinguirse de un éxito, y aquí el
éxito del caso **era** el fallo del sistema. No es un verificador débil: es un **indicador
invertido**, que avisa mientras el defecto se arregla.

No se retiraron: se hizo **verificable** lo que querían decir. `audit` publica la **anchura** de
lo que auditó —`Fases auditadas: FDGE 0-10 · … · FIDE 1-5  (6 de 6)`—, derivada de `COMPONENTES`.

El cuarto es hermano: `chkno "el ternario de la sigla ya no existe"` buscaba `=== 'Foundation' ?`
en `audit.mjs`, y **el comentario que explica el defecto contiene el defecto**. El caso se cazaba
a sí mismo. Ahora mira sólo código ejecutable — la lección de `PT-148`.

`PT-167` recoge lo que no se arregla aquí: **nada busca más casos invertidos** entre los 1736.

### 4.2 · Mi comprobación mataba fixtures ajenos

El contraste con `LEXICON` **fallaba** cuando el fixture copia sólo `tools/`, y eso ponía en rojo
casos de otras tareas **por una razón ajena a lo que probaban** — el mismo defecto que `PT-145`
midió cuando su fixture copió sólo `*.md`.

Corregido a `SIN EVALUAR`, publicado **antes** del veredicto: *«Todos los patrones cumplen su
contrato»* sin decir cuáles no se pudieron mirar es la promesa que `SUITE-R26` prohíbe.

### 4.3 · Décima rotura de escapado, y es la buena

El regex `/\r?\n/` del contraste **perdió sus escapes al escribirse** y `verify-patrones` dejó de
arrancar con un `SyntaxError`. `SUITE-R59`, **décima** medida en este repositorio y segunda en
este lote.

**Ésta es mejor que la novena.** En `PT-148` el mismo defecto produjo un regex que **compilaba y
no casaba nada**: el barrido seguía en verde mientras cuatro sitios legítimos saltaban, y sólo se
encontró mirando bytes con `cat -A`. Reventar el arranque **se ve**. Un regex que compila sin
casar nada, no.

Las dos se arreglaron igual: **quitando el regex**. `split(String.fromCharCode(10))` y `trim()`
dan la robustez ante CRLF sin escribir un solo escape.

## 5. Lo que esta tarea NO establece

- Que las siete filas de `LEXICON` §3.6 **coincidan** con las de los documentos operativos. Se
  verificó a mano; nada mecánico lo sostiene (`SUITE-R26`).
- Que no haya más grafías de paso fuera de `PHASE`. §2 prohíbe por lista, y la lista es
  incompleta por construcción → **`PT-166`**.
- Que el mapa de fases de `CORE` sea derivado. Sigue **tecleado**, y `FIDE` no aparece pese a
  tener rango → **`PT-165`**.
- Que una cita a un ID de regla **equivocado pero real** se detecte. No se detecta → **`PT-164`**.
