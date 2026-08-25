# PT-150 · `discovery.md` — `PHASE 2` Analysis (`2-B`)

> `2-B` expande qué · dónde · cuándo · cómo · por qué, con hipótesis **respaldada por evidencia**,
> y declara las tres confianzas (`FDGE-R09`).

## 1. Qué — y es peor de lo que el intake decía

El intake describía **una** herramienta con una lista equivocada. Lo medido es que **cuatro
fuentes declaran la escala de severidad y una contradice a las otras tres**:

| Fuente | Escala | ¿Correcta? |
|:---|:---|:---|
| `LEXICON` §8.3 — el documento que manda (`LEX-R21`) | `S1 S2 S3 S4` | **es la fuente** |
| `verify-fdge.mjs:166` · `RE_SEVERITY = /^\s*severity:\s*(S[1-4])/im` | `S1 S2 S3 S4` | sí |
| Las tres plantillas de `INTAKE/templates/` | `S1 \| S2 \| S3 \| S4` | sí |
| **`tracker.mjs:2556`** · `const SEVERIDADES = ['S0','S1','S2','S3']` | `S0 S1 S2 S3` | **no** |

`tracker` es el único que discrepa, y además **atribuye su lista a `LEXICON`** en el mensaje de
error. No es «una copia que divergió»: es una copia que **cita como fuente al documento que
contradice**.

## 2. Dónde — las dos herramientas se contradicen entre sí, no solo con el documento

Esto no estaba en el intake y cambia el tamaño del defecto:

```
severity: S4    verify-fdge la ACEPTA   ·   tracker asignar la RECHAZA
severity: S0    tracker la ACEPTA       ·   verify-fdge NO la reconoce (S[1-4])
```

**Hay un rango donde el marco se contradice consigo mismo.** Una tarea con `S4` pasa el
verificador y no se puede crear con el comando; una con `S0` se crea con el comando y su intake
no casa el patrón que `FDGE-R04` exige.

## 3. Cuándo — el rastro que dejó, medido en el registro

```
S4  ·  4 allocations   PT-015 · PT-016 · PT-017 · PT-051      todas INTEGRATED
S0  ·  1 allocation    PT-107                                  INTEGRATED
```

Y el contraste con sus intakes es el dato que explica **cómo** entraron:

- **`PT-107`** declara `severity: S0` **en su intake**, no solo en el registro. Es decir: el
  humano escribió `S0`, la herramienta lo aceptó, y `verify-fdge` no lo caza **porque está
  `INTEGRATED`** — lo terminal no se rejuzga. La divergencia entró y quedó.
- **Los cuatro `S4`** **no declaran `severity` en el frontmatter de su intake**. Son de antes de
  que `asignar` escribiera el campo (`PT-103` lo describe: *«esto escribía cuatro campos de nueve
  y dejaba fuera type, severity, epic y phase»*), así que su `S4` se escribió **a mano en
  `REGISTRY.json`** — el rodeo que el `HANDOFF` tiene en su lista de `no hacer`.

## 4. Cómo — la plantilla que el paquete distribuye propone un valor que el comando rechaza

El hallazgo más limpio, y reproducible en dos líneas:

```
docs/methodology/INTAKE/templates/CHANGE-REQUEST.md:13
    severity: S4               # [HUMANO] S1 | S2 | S3 | S4

$ node docs/methodology/tools/tracker.mjs asignar PT --slug x --severidad S4 --ver
    «S4» no es una severidad. LEXICON declara: S0 · S1 · S2 · S3
```

**La plantilla que `@a81biz/cauce` instala en cada proyecto destino trae `S4` por defecto**, y el
comando que abre trabajo lo rechaza citando a `LEXICON`, que sí lo declara.

Es exactamente la clase de defecto de `PT-083` —«la plantilla que el paquete distribuye fallaba
su propio verificador»— sobre otro campo. Y afecta a **todo proyecto instalado**, no solo a este.

## 5. Por qué — hipótesis, con su evidencia

**`S0` no es un descuido: es un vocabulario que alguien usó y nunca se declaró.**

`PT-107` lo escribió en su intake deliberadamente —era «el registro no se reescribe entero: dos
comandos a la vez pierden una allocation en silencio», un defecto de pérdida de datos— y quien lo
escribió quería decir «más grave que `S1`». `LEXICON` no ofrece ese peldaño: su `S1` ya es
«sistema caído, pérdida de datos».

La lista de `tracker` parece haberse escrito **para admitir ese caso**, y al hacerlo desplazó la
escala entera un peldaño: perdió `S4` por el otro extremo sin que nadie lo notara, porque `S4` es
«deuda sin impacto observable» y casi nunca se abre trabajo con ella.

**Es la hipótesis, no un hecho**: no hay commit que lo declare. Lo que sí es hecho es que la lista
está en el código, contradice al documento que cita, y ya produjo cinco divergencias.

## 6. Confianzas — `FDGE-R09`

```
RootCause     95%   la lista literal esta en tracker.mjs:2556, medida y reproducida
Architecture  90%   PT-144 dejo el mecanismo: una constante canonica con contrato en
                    patrones.mjs y su asercion en verify-patrones
Solution      85%   el arreglo es directo; lo que baja la confianza es la DECISION sobre
                    S0 — ver 7
```

Ninguna por debajo del 70%: **no escala a `INVESTIGATION`**.

## 7. Lo que hay que decidir, y no lo decide el agente

`S0` está en uso, en una allocation integrada y en el intake que la firmó. Hay dos salidas y
**solo una de ellas es de esta tarea**:

```
A · LEXICON manda (LEX-R21): la escala es S1..S4. `S0` deja de aceptarse, lo ya escrito
    NO se rejuzga (AC-06), y si alguien necesita el peldaño lo pide en LEXICON.
    ← ES LA DE ESTA TAREA. El intake ya la fijo en AC-02 y AC-04.

B · LEXICON gana un S0 y la escala pasa a cinco niveles.
    ← NO es de esta tarea: cambiar la escala de severidad de la suite es una decision de
      metodologia, no un arreglo de herramienta, y modificar LEXICON desde aqui seria la
      direccion prohibida (LEX-R21).
```

Se ejecuta **A**, que es lo firmado. La existencia de `B` como opción legítima queda declarada:
si el firmante prefiere el peldaño, esto se revierte y se abre trabajo sobre `LEXICON`.

## 8. Acoplamiento

`SEVERIDADES` se usa en **dos líneas del mismo archivo** (`tracker.mjs:2594-2595`) y en ningún
otro sitio. Radio de impacto mínimo.

Pero `AC-07` —«un valor fuera de la escala no puede entrar por ningún camino»— **no se cumple hoy
y no lo va a cumplir esta tarea sola**: `REGISTRY.json` se puede escribir a mano, y así entraron
los cuatro `S4`. Lo que sí puede hacerse es que **un verificador lo cace**, y ahí está el
resultado real de `AC-07`.

## 9. Complejidad

```
Complejidad: STANDARD
```

El cambio es de pocas líneas, pero **destapa una contradicción entre dos herramientas** y toca un
campo que gobierna el carril `HOTFIX` (`FDGE-R22`: `HOTFIX` solo con `S1`). No es `TRIVIAL`.
