# `PT-129` — Estrategia   `PHASE 3`

> Los caminos descartados, con su por qué. Lo que aquí no esté medido no está.

---

## La decisión que hay que tomar

`D-1` dejó dos vocabularios para el `<type>` de una rama y **no dijo cuál gana**. Es esto:

```
A   gana la REGLA          feat · fix · refactor · test · docs · chore
B   gana la HERRAMIENTA    bug · feature · chore · refactor · investigation
C   ninguno: el <type> de RAMA se declara aparte de los dos
```

## Lo medido antes de elegir

```
ítems en el registro     BUG 74 · CHORE 30 · FEATURE 22 · INVESTIGATION 2
ramas de tarea vivas     2, las dos con vocabulario A (fix/, chore/)
documentos que citan la forma «<type>/»   7
```

### `A` — gana la regla

Obliga a un **mapeo** ítem → tipo de commit: `BUG→fix`, `FEATURE→feat`, `CHORE→chore`,
`REFACTOR→refactor`. Y deja `INVESTIGATION` **sin destino**: no hay tipo de commit para una
investigación, que además no produce código (`FDGE-R10`).

**Descartado.** Un mapeo es una tabla nueva que traduce entre dos vocabularios, es decir **una
tercera representación del mismo hecho** — justo lo que `SUITE-R38` y `LEX-R22` existen para
impedir. Y un mapeo incompleto desde el primer día es una tabla que ya nace con un hueco.

### `B` — gana la herramienta

`ramaDeTarea()` ya deriva del `type` del ítem, que es un dato que **el registro tiene** y que
`LEXICON` §943 ya declara canónico. No hace falta traducir nada: el nombre de la rama sale del
mismo sitio que la etiqueta del issue y que el índice al que va la tarea.

Cuesta **tocar `FDGE-R19`**, que es regla de compuerta `G4`. Las dos ramas ya creadas con el otro
vocabulario **no se renombran**: la propia regla ya dice que una rama se termina como empezó
porque renombrarla rompe el pull request abierto sobre ella.

**ELEGIDO.** Tres razones, en orden de peso:

1. **El dato ya existe y es único.** El `type` del ítem lo declara `LEXICON`, lo escribe el
   registro y lo usan `tracker indices`, las etiquetas del issue y `verify-fdge`. Derivar de él
   añade **cero** representaciones nuevas; `A` añade una.
2. **`LEX-R21` ya lo resuelve.** El orden de autoridad es `LEXICON` → `RULES`. Los tipos de ítem
   están en `LEXICON` §943; el `<type>` de rama está en `RULES`. Cuando dos documentos dicen
   cosas distintas del mismo hecho, manda `LEXICON` — la regla es la que tiene que ceder, y esto
   no es una preferencia sino el criterio escrito.
3. **Lo que hay que cambiar es más pequeño.** `B` corrige una frase de una regla; `A` construye
   una tabla y hay que mantenerla cada vez que aparezca un tipo de ítem.

### `C` — un vocabulario propio para las ramas

**Descartado sin medir más.** Sería un **tercer** vocabulario para el mismo hecho, con siete
documentos que citar. Es la enfermedad que la v4 nació para eliminar, propuesta como solución.

---

## La estrategia, en cuatro movimientos

| # | Qué | Dónde |
|:--|:---|:---|
| `E-1` | `FDGE-R19` deja de enunciar el `<type>` de rama y **remite a `LEXICON`**, que ya declara los tipos de ítem. La regla enuncia la **topología**; el vocabulario no es suyo | `RULES.md` |
| `E-2` | `FDGE-R19` enumera los **cuatro** tipos de rama, con `cauce/<usuario>` citando a `LEXICON` §810. Y la lista de «Prohibidos» se desambigua: son **descripciones**, no `type` | `RULES.md` |
| `E-3` | `ramaDeTarea()` deja de inventar `chore` cuando falta el `type`: devuelve `null` y quien llama **lo dice** | `patrones.mjs:557` |
| `E-4` | Una comprobación **enumera las ramas reales** —`git ls-remote` y `--sort`— y las contrasta con la topología: cada rama encaja en un tipo, cada efímera tiene su tarea viva, y lo que no encaja **se nombra** | `verify-fdge.mjs` |

**`E-4` es la que cierra la clase.** `E-1` a `E-3` corrigen el enunciado y el derivador; sin `E-4`
seguiría sin haber nada que contraste la declaración con el árbol, que es `D-5` y es el hueco de
fondo.

## Lo que NO se hace, y por qué

- **No se renombra ninguna rama.** `FDGE-R19` ya lo declara y romper un PR abierto es peor que un
  nombre viejo. La comprobación **avisa** sobre las anteriores, como ya hace con el usuario.
- **No se borra ninguna rama.** `SUITE-R06f`: borrar una rama remota no se automatiza. `E-4`
  **describe el comando** (`EXEC-R07`).
- **No se crea el mapeo de `A`.** Descartado arriba con su motivo.

## El riesgo declarado

**`E-1` toca una regla de compuerta `G4`.** Si el cambio se redacta mal, el daño no es un rojo:
es que `G4` deje de exigir la topología. Por eso `E-4` va **en la misma tarea** y no en otra: la
comprobación que enumera es la que hace que el enunciado nuevo sea contrastable en vez de
confiable.
