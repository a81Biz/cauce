# PT-088 — Estrategia   `PHASE 3`

## La decisión de fondo

**No se persigue el porcentaje.** `SUITE-R26` dice que la cobertura *aspira, no exige*, y el Acid
Test de `P-003` **pasa**: las 20 reglas marcadas `CHECK` tienen verificador, cero excepciones.

Entran tres reglas porque **sostienen el dominio declarado**, no porque falten. Si el criterio
fuera «faltan», entrarían las 101 y el resultado sería un montón de verificadores escritos para
mover un número — que es literalmente el defecto que este lote combate.

---

## `A` · `SUITE-R09` — caminos considerados

| | Por qué se descarta |
|:---|:---|
| **Hash encadenado** por entrada, estilo blockchain | Establece el hecho de verdad y **rompe todos los ledgers existentes**: 4 036 + 2 637 líneas sin hash. Migrarlas exige reescribirlas, que es justo lo prohibido |
| Comparar el **archivo completo** contra la versión anterior | Falla en cada `commit` normal: un append cambia el archivo. Habría que exceptuar el append, y entonces se está contando líneas otra vez, con más código |
| Comprobar sólo **el último commit** | Una reescritura hecha hace tres commits pasa para siempre. La ventana es lo que se está comprobando y elegirla corta es elegir no ver |
| **Contar líneas borradas desde el tag anterior** ✅ | Es lo que se adopta |

### Por qué la ventana es **el tag anterior** y no `HEAD~1` ni `origin/main`

`PT-081` se equivocó eligiendo `origin/main` como línea base: la comprobación **se apagó justo el
día que la regla entró**, porque lo que buscaba aterrizó en `main`.

El tag es una marca **inmutable y deliberada**. Y la regla que lo garantiza ya existe:
`SUITE-R57` obliga a sellar antes de acumular, así que el tag anterior nunca queda muy atrás.

### Lo que se acepta a cambio, y se declara

La comprobación **no distingue** una corrección legítima de una falsificación: las dos aparecen
como líneas `-`. En un append-only las dos están prohibidas, así que es el comportamiento correcto
— pero significa que un `fail` de `SUITE-R09` **no acusa de mala fe**, sólo de haber reescrito.
> **Corrección del 2026-08-20, y la trajo el arnés.** Aquí se declaró que una alteración de
> **igual recuento** pasaba. **Es falso.** `git` representa una modificación como `-vieja` más
> `+nueva`, así que la línea `-` está en el diff y la comprobación **sí la caza**.
>
> El límite real es otro: **no distingue una corrección legítima de una falsificación**. En un
> append-only las dos están prohibidas —lo que se corrige se corrige añadiendo—, así que la
> comprobación es correcta; lo que estaba mal era mi descripción de ella.
>
> **Declaré un límite sin medirlo**, que es la misma forma que `PT-087` cierra. Lo midió el
> caso, no yo.


---

## `B` · `EXEC-R04` — caminos considerados

| | Por qué se descarta |
|:---|:---|
| Exigir un **revisor aprobador** en `main` | Imposible para el equipo de una persona que `SUITE-R22` declara soportado: nadie aprueba su propio PR. Es `H-009`, y es de `PT-093` |
| Retirar credenciales de `gh` al agente | Rompe el espejo (`SUITE-R35`), que es lo único que impide que registro y tablero diverjan |
| Comprobar **todos** los merges históricos | **17 fallos** sobre trabajo de agosto. Nace roja, y una comprobación que nace roja se apaga |
| **Merges posteriores a la versión de entrada, con constancia** ✅ | Es lo que se adopta |

### El dato que lo decide

```
merges a main            18
merges desde v9.0.0       1     y tiene su constancia
```

Con `RIGE_DESDE`, la regla nace **verde sobre lo existente y viva sobre lo que venga**. Sin
`RIGE_DESDE` es inaplicable — no «menos elegante»: inaplicable.

### Lo que esta comprobación NO establece

**Que la autorización fuera real.** El agente escribe la constancia. Es exactamente `H-009`, y
`PT-093` existe para declararlo. Aquí se construye el rastro; allí se dice lo que vale.

---

## `C` · `SUITE-R01` — caminos considerados

| | Por qué se descarta |
|:---|:---|
| Verificar que **existan artefactos** en cada `PT` | Mide cumplimiento de formato y afirmaría medir honestidad epistémica. **Es la séptima instancia del patrón**, escrita por el lote que existe para cerrarlo |
| Descomponerla en sub-reglas nuevas | Sus consecuencias **ya están verificadas**: `FDGE-R23`, `FDGE-R24`, `PTSA-R14`, `SUITE-R11`. Crear más sería definir dos veces lo mismo (`PT-080`) |
| Marcarla `CHECK` y escribir *algo* | `RULES.md` lo llama por su nombre: *«marcar `CHECK` una regla que ningún script verifica es una promesa falsa»* |
| **Declararla `NO_VERIFICABLE` con motivo y firma** ✅ | Es lo que se adopta |

### Por qué declarar es la respuesta correcta y no una rendición

`SUITE-R01` es una **regla sombrilla**: no se verifica, se **instancia**. Su valor está en que las
cuatro reglas que la instancian sí se comprueban.

`NO-VERIFICABLES.md` existe desde `PT-078` con cinco reglas ya declaradas. El estado actual —ni
verificada ni declarada— es el único que no es defendible.

---

## Excepción `FDGE-R18` declarada

`AC-06` cierra por la vía de la **declaración**: su «test» es una fila en `NO-VERIFICABLES.md` con
motivo y firma, y un caso de la batería que comprueba que la fila existe y que `audit` la clasifica
como `NO_VERIFICABLE`. No hay archivo de test de comportamiento porque **no hay comportamiento que
probar** — y ése es el hallazgo, no una carencia de la tarea.

---

## Orden de implementación, y por qué

```
1. SUITE-R09   la unica de las tres cuyo mecanismo ya se vio en ROJO (PHASE 2)
2. EXEC-R04    reutiliza la ventana «desde el tag» que instala la primera
3. SUITE-R01   declaracion; no depende de codigo, y va ultima para que la lista
               de NO-VERIFICABLES se escriba sabiendo ya que SI se pudo verificar
```

**`SUITE-R01` va última a propósito.** Declararla no verificable **antes** de intentar las otras
dos sería declarar sin haber medido; después, la declaración dice «se intentaron tres, dos salieron
y ésta no, por esto» — que es una afirmación contrastable y no una excusa.

---

## Lo que esta tarea deja para `PT-087`

Las tres comprobaciones **necesitan declarar qué no establecen**, y hoy no hay forma de decirlo:

```
SUITE-R09   cuenta lineas borradas, no detecta alteracion con recuento constante
EXEC-R04    comprueba que hay constancia, no que la autorizacion fuera real
SUITE-R01   no se verifica: se instancia en otras cuatro
```

Ése es el banco de pruebas. Si el mecanismo de `PT-087` no sabe expresar estas tres frases, está
mal — y se sabrá **antes** de imponerlo a 224 reglas.
