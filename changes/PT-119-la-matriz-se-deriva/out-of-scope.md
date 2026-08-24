# Fuera de alcance — `PT-119`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Clasificar | La clasificación es la **entrada**, no la salida | `PT-125` |
| Abrir tareas desde la matriz | Propone enumerando; abrir lo decide una persona (`FPGE-R04`) | — |
| Puntuar o priorizar | Es `FPGE` y tiene su propia fórmula | `PT-126` |
| Que `sellar` mida la matriz y `FPGE` la lea | Necesita la matriz, que es lo que se entrega aquí | `PT-126` |
| Dar dueño a las nueve clases huérfanas | La matriz las **nombra**; darles regla es trabajo con su propia decisión de diseño, y son nueve | `PT-126` las publica como candidatos |
| **Que `SUITE-R59` pueda fallar** | Hallazgo de la primera corrida: la regla existe y **nada emite por ella**. Arreglarlo es escribir una comprobación nueva, con su propio alcance | `PT-126` |
| Leer `11-Conventions.md` para la propiedad de clases | `AC-04` dice `RULES.md`. `RULE-06` vive en las convenciones del proyecto y por eso `CE-005` sale sin dueño aunque el ledger la atribuya | — |
| Estampar la fecha de generación | Haría el archivo irreproducible y apagaría `--check` | — |

---

## Lo que esta tarea **produce** y no resuelve

**Nueve de diecisiete clases no tienen regla que las reclame**, y entre ellas están las tres más
repetidas: `CE-004` (7 instancias, ordinal declarado **9**), `CE-001` (6, ordinal **12**) y
`CE-003` (6, ordinal **7**).

**Y una décima, distinta y peor:** `CE-002` tiene regla —`SUITE-R59`, creada tras medir **27**
roturas— y **ninguna herramienta emite por ella**. Una obligación que no puede fallar es
exactamente lo que `P-003` de la Declaración de Valor exige que no exista.
