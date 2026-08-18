# PT-023 — Descubrimiento   `PHASE 2` · `2-B`

## Lo que se midió

Las **40** `spec-changes.md` del repositorio, **110** filas que nombran un documento, contrastadas
contra los archivos que los commits de cada PT tocaron de verdad.

```
PTs con spec-changes.md                                    40
Filas que nombran un documento                            110
Filas cuyo documento NO aparece en ningún commit del PT      4
Filas cuyo documento no se pudo localizar                    0
```

## Los cuatro candidatos, contrastados uno a uno

**El proxy no es la verdad.** «Ningún commit del PT tocó ese archivo» es un indicio, no un
veredicto: hay dos formas de cumplir una declaración sin que el commit lleve el nombre del PT.
Los cuatro se abrieron y se miraron.

| # | PT | Documento | Veredicto |
|:---|:---|:---|:---|
| 1 | `PT-018` | `FDGE-Prompts.md` | **DEFECTO REAL** — ver abajo |
| 2 | `PT-018` | `PHASES.md` | Cumplida, **por otro PT y otro lote** |
| 3 | `PT-037` | `CORE.md` | Cumplida · falso positivo del proxy |
| 4 | `PT-039` | `tools/build-core.mjs` | Cumplida · falso positivo del proxy |

### 1 · `PT-018` → `FDGE-Prompts.md` — el defecto

`PT-018` declaró tres cambios. El tercero decía: *«Igual, en el texto copiable (`SUITE-R20`)»* —
es decir, llevar a `FDGE-Prompts.md` lo mismo que llevaba a `RULES.md`: que la columna «Dónde va»
es **vocabulario cerrado** y que la cita es **recíproca**.

Lo que hay hoy en `FDGE-Prompts.md:183`:

> **`SUITE-R44`: lo que el lote aplaza se asigna, no se narra.** Una fila de `out-of-scope.md`
> que apunte a trabajo futuro cita el identificador que lo sostiene — **normalmente** una
> allocation en `DEFERRED`, con su issue abierto.

```
grep -c "vocabulario cerrado\|recíproc" docs/methodology/FDGE-Prompts.md   →  0
```

Ese párrafo lo escribió **`PT-013`** (`c7ba859`), *antes* de `PT-018`. `PT-018` declaró que lo
actualizaría y no lo tocó. Y la palabra que sobrevive es **«normalmente»** — exactamente la prosa
que `SUITE-R44` existe para eliminar, dentro del texto que `SUITE-R20` manda que sea **copiable
tal cual**.

Es peor que un documento sin actualizar: es el documento del que se **copia**.

### 2 · `PT-018` → `PHASES.md` — cumplida, pero no por quien la declaró

El bloque `APLAZAR` de `PHASES.md:285` **sí** dice el vocabulario cerrado y la reciprocidad. Lo
escribió **`PT-022`** (`7fd7eb4`), del lote **`EP-005`** — `PT-018` es de `EP-004`.

La declaración se cumplió cuatro días y un lote después, por una tarea que no sabía que estaba
cumpliendo la declaración de otra. Nada conectó las dos: ni una regla, ni una herramienta, ni una
fila. Que saliera bien fue **suerte**, y la suerte no es un control.

### 3 y 4 · `PT-037` y `PT-039` — falsos positivos del proxy

Ninguno de los dos tiene **un solo commit** que lleve su identificador en el mensaje: su trabajo
entró bajo commits del lote. El proxy los marca y el contenido está:

```
PT-039 · build-core.mjs:310   el bloque «petición o conversación» abre el núcleo,
                              antes del bloque del tablero (:314). Está.
PT-037 · CORE.md              npm run core:check → «CORE.md sincronizado». Está.
```

## Lo que esto significa para el marco

**De 4 candidatos, 3 no eran defectos.** Un 75 % de falsos positivos, medido. Y las dos causas son
estructurales, no arreglables afinando el detector:

1. El trabajo de un PT puede entrar bajo un commit del **lote** y no llevar su nombre.
2. Una declaración puede cumplirla **otro PT**, y sigue cumplida.

Por eso `FDGE-R22` no puede tener un verificador que diga «esta declaración no se hizo»: diría
que no en tres de cada cuatro casos en que sí. Lo único mecanizable es lo que ya está limpio —que
el documento nombrado **exista**: 0 de 110 filas fallan—, y eso no era el defecto.

**Lo que sí se puede cerrar mecánicamente es el caso concreto:** que `FDGE-Prompts.md` lleve el
vocabulario cerrado y la reciprocidad, y que no pueda volver a perderlos. No es la regla general
—no la hay honesta— pero es el hueco que hoy existe y deja de existir.
