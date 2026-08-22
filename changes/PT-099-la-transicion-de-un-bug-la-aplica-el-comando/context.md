# Context — `PT-099`

## 1. Qué se leyó

| Fuente | Para qué | Estado |
|:---|:---|:---|
| `LEXICON` §5.1 | la máquina de estados | `IN_REVIEW → VALIDATION_PENDING : tipo BUG · siempre` |
| `RULES.md` `FDGE-R26` | la regla `HARD` que lo exige | cita `LEX-R08`, severidad `H` |
| `tools/tracker.mjs` · `avanzar` | quién escribe `status` | **un solo sitio**, ahora `estadoTerminalDe` (`PT-098`) |
| `tools/verify-fdge.mjs` `:1946` | qué comprueba `FDGE-R26` | sólo un `BUG` **ya en `DONE`** |
| `grep -rn LEX-R08 tools/` | quién lo hace cumplir | **nadie** |
| `SESSION_LOG.md` | mis tres excepciones de esta sesión | la evidencia |

## 2. Lo medido

```
BUGs en el registro                     51   (48 INTEGRATED, 3 DONE)
que pasaron por VALIDATION_PENDING       0
verificadores que citan LEX-R08          0
veces que lo rodee a mano en esta sesion 3   (PT-096, PT-097, PT-098)
```

## 3. La grieta exacta

`FDGE-R26` comprueba que **un `BUG` en `DONE`** lleve su firma de `G3`. Un `BUG` que llega a
`PHASE 9` con `IN_REVIEW`, `READY` o `DRAFT` **no está en `DONE`**, así que la comprobación no lo
mira y `verify-fdge --all` lo verifica limpio.

La regla vigila la **salida** y nadie vigila la **entrada**.

## 4. Confianzas — `FDGE-R09`

```
RootCause     98%   el codigo tiene UN solo «a.status =» y esta citado. Confirmado por dos
                    proyectos y reproducido TRES veces por mi en esta sesion.

Architecture  93%   extiende estadoTerminalDe, que L-1 acaba de crear, en vez de añadir un
                    segundo sitio que escriba status —lo que seria la averia de SUITE-R38
                    cometida dos tareas despues de arreglarla—. -7 porque hay que decidir
                    en que FASE se aplica la transicion, y eso no es obvio.

Solution      85%   -15 por §5.
```

## 5. Lo que hay que decidir en `PHASE 3`

**¿En qué fase escribe `VALIDATION_PENDING`?**

`LEXICON` dice `IN_REVIEW → VALIDATION_PENDING`, pero `avanzar` no escribe `IN_REVIEW` nunca — la
escalera entera está sin aplicar, no sólo este peldaño.

```
(a) aplicar la escalera COMPLETA          -> arregla mas de lo que la tarea declara
(b) solo la transicion del BUG            -> deja la escalera a medias, otra vez
```

**`PHASES` da la respuesta sin inventar nada:** `PHASE 7 · Validation` dice literalmente *«BUG →
`VALIDATION_PENDING` y PARA. Solo un humano lo lleva a `DONE`»*. Ésa es la fase, y está escrita.

Así que `(b)` bien acotada: **la transición se aplica al entrar en `PHASE 7`**, que es donde el
procedimiento ya la sitúa. La escalera completa es otra tarea y se declara.

## 6. Lo que este contexto NO establece

- **Que ningún otro comando escriba estado.** `INC-006` midió `avanzar`; aquí tampoco se auditan
  los demás.
- **Que los 51 `BUG` existentes estén mal.** Están **sin el dato**, que es distinto. Retrofecharlo
  sería falso (`CORE.md`: «lo ya terminado no se retrofecha»).
