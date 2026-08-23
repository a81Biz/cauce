# `PT-129` — Escenarios de test   `PHASE 4`

> Cada `TS` tiene que poder **fallar**. Si no se puede escribir la comprobación que lo tumba, no es
> un criterio: es un deseo.

---

| TS | Escenario | Espera | Inversa que lo tumba |
|:---|:---|:---|:---|
| `TS-01` | `FDGE-R19` cita el vocabulario de `LEXICON` y **no lo copia** | `verify-suite` pasa | copiar la lista en `RULES` ⇒ `SUITE-R14` / `LEX-R23` la marcan como segunda definición |
| `TS-02` | `FDGE-R19` enumera los **cuatro** tipos, `cauce/<usuario>` incluido | un caso busca los cuatro | quitar uno ⇒ el caso falla |
| `TS-03` | `CORE.md` lleva la regla nueva | `npm run core:check` | editar `RULES` sin regenerar ⇒ `SUITE-R16` falla |
| `TS-04` | `ramaDeTarea(null, 'PT-125', 'x')` devuelve `null` | `null` | devolver `'chore/…'` ⇒ el caso falla — **es el comportamiento de hoy** |
| `TS-05` | `tracker rama PT-125` **dice que falta el `type`** y no propone nombre | mensaje con el motivo | proponer un nombre ⇒ el caso falla |
| `TS-06` | `ramaDeTarea('BUG', 'PT-129', 'slug', 'alberto martínez')` → `bug/alberto-martinez/PT-129-slug` | exacto | cambiar la normalización ⇒ falla |
| `TS-07` | Una rama que **no encaja** en ningún tipo se **nombra** | aparece en la salida | ignorarla ⇒ el caso no la encuentra |
| `TS-08` | Una rama efímera cuya tarea está **terminal** se reporta con el comando de borrado | aparece `PT-081` | no mirarla ⇒ falla |
| `TS-09` | `cauce/<usuario>` **no** se reporta como sobrante | ausente de la lista | tratarla como efímera ⇒ el caso la encuentra y falla |
| `TS-10` | Sin acceso al remoto, la comprobación sale `SIN EVALUAR` **y se distingue de «cero sobrantes»** | `SIN EVALUAR` | devolver «cero» ⇒ el caso lo detecta (`RULE-06`) |
| `TS-11` | Fuera de `--gate G4` **avisa**; en `--gate G4` **falla** | dos veredictos | igualarlos ⇒ una de las dos inversas falla |
| `TS-12` | La comprobación **no borra nada**: describe el comando | el árbol de ramas no cambia tras correrla | borrar ⇒ `SUITE-R06f`, y el caso lo detecta |

---

## Las dos inversas que importan

**`TS-04` tiene caso real hoy.** `PT-125` y `PT-126` están sin `type` en el registro por el defecto
de `PT-124`. La inversa se ejecuta **contra el árbol de verdad**, no contra un fixture: hoy
`tracker rama PT-125` devuelve `chore/alberto-martinez/PT-125-…` y ese nombre es **inventado**.

**`TS-10` es la que protege contra el verde por omisión.** Sin ella, un runner sin acceso al
remoto produciría el mismo informe que un repositorio con la topología perfecta — que es
literalmente lo que `publicar.yml` hace hoy con `SUITE-R43` (`PT-120`), medido en 108 de 108.

## Lo que NO se prueba, y se dice

- **Que alguien haga caso al aviso.** No es comprobable desde aquí y no se afirma.
- **Que la topología sea la correcta.** Se comprueba que el árbol coincide con lo declarado; si lo
  declarado está mal, esto sale verde. Esa decisión es de `PHASE 3` y está tomada allí.
- **El comportamiento contra Azure.** Se mide sobre GitHub, que es la plataforma declarada.
