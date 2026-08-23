# `PT-119` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza** — se propone aquí y se resuelve
> en `G2`.

---

## `RULES.md` · diez reglas declaran la clase que gobiernan

**Ninguna obligación cambia.** Cada una gana una frase que dice de qué tropiezo es dueña:

| Regla | Clase | Qué añade |
|:---|:---|:---|
| `SUITE-R59` | `CE-002` | rotura de escapado — medida **27 veces** antes de que la regla existiera |
| `SUITE-R58` | `CE-006` | el acto fuera del comando, para el caso del registro |
| `FDGE-R52` | `CE-006` | …y para el caso de la transición de fase |
| `SUITE-R14` | `CE-008` | un hecho, varios nombres: una definición duplicada es cómo divergen |
| `SUITE-R46` | `CE-009` | el estado terminal adelantado al merge |
| `FND-R14` | `CE-010` | la cifra transcrita caduca |
| `FDGE-R29` | `CE-013` | el encabezado mal formado que bloquea la integración |
| `SUITE-R09` | `CE-014` | una regla nueva juzga hacia atrás — no retrofechar es lo mismo del otro lado |
| `FDGE-R19` | `CE-016` | trabajar sin allocation |
| `SUITE-R08` | `CE-016` | …por el otro extremo: sin identificador no hay allocation que citar |

**Por qué en la regla y no en una tabla.** Una tabla `clase → regla` es exactamente la copia que
diverge (`SUITE-R38`), y `CE-008` es la clase que la nombra: sería el defecto que la matriz existe
para contar, cometido en la matriz. Aquí la pertenencia la **afirma la regla**, y ninguna segunda
fuente puede contradecirla.

**Sólo se citan las que el ledger sostiene.** Adjudicar una clase a una regla que no la gobierna
sería peor que dejarla huérfana: la matriz diría «cubierta» sobre algo que nadie vigila.

## Lo que **no** se propone

- **Dar dueño a las nueve huérfanas.** La matriz las nombra; darles regla es trabajo con su propia
  decisión de diseño.
- **Hacer que `SUITE-R59` pueda fallar.** Es el hallazgo de la primera corrida y necesita una
  comprobación nueva. Va a `PT-126`.
- **Leer `11-Conventions.md`** para la propiedad. `AC-04` dice `RULES.md`; por eso `CE-005` sale
  sin dueño aunque el ledger se la atribuya a `RULE-06`. Se declara el límite.

## Autoridad

`LEX-R21` · la obligación vive en `RULES.md`. `LEX-R23` · un ID se define en un documento y los
demás citan — aquí la regla cita una **clase**, no otra regla, así que no hay redefinición.
