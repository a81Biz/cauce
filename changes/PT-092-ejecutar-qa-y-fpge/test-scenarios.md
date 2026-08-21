# PT-092 — Escenarios   `FDGE-R16`

| | Escenario | Espera |
|:---|:---|:---|
| `E1` | `ROADMAP.md` sobre el árbol real | tiene candidatos |
| `E2` | `verify-qa` sobre él | **todos** citan evidencia de origen |
| `E3` | idem | la frescura de las fuentes está declarada |
| `E4` | `ROADMAP.md` | **no promueve nada** |
| `E5` | `ROADMAP_HISTORY.log` | la corrida quedó registrada |
| `E6` | `ROADMAP.md` | dice que **el orden es un juicio**, no un cálculo |
| `E7` | `CASOS-DE-USO.md` | declara que `QA` **no aplica** |
| `E8` | idem | …y por qué **no se forzó** |
| `E9` | `10-Technical-Debt.md` | `TD-15` separa «no aplica» de «pendiente» |
| `E10` | `INCIDENTS.log` | `INC-001` registrado |
| `E11` | `ROADMAP.md` | …y con **candidato de seguimiento** |

## `E6` es el que impide que ocho decimales parezcan un cálculo

Dos de los seis factores de la fórmula son **juicio del agente**, y los dos multiplican. Sin la
sección que lo dice, `13.5` y `11.3` se leen como medidas.

## `E11` no es redundante con `E10`

`E10` comprueba que el incidente **se registró**. `E11`, que **tiene seguimiento** — y `FPGE-R05`
da `Urgency +1.0` precisamente a un incidente abierto sin PT, así que sin candidato el propio
roadmap se contradiría.

## `E8` es el que hace que `E7` signifique algo

Declarar un hueco sin decir por qué no se cerró es indistinguible de no haberlo intentado. La
frase que se comprueba —*«fabricar un verde en el componente…»*— es el motivo, y es el mismo que
`PT-072` usó para no declarar plataforma.

## Lo que NO se prueba

**Que el orden del roadmap sea el correcto.** No es mecanizable: dependería de acertar en dos
juicios. Lo que se comprueba es que **el juicio esté declarado como tal**.
