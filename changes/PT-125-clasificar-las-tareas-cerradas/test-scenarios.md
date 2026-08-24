# Escenarios de test — `PT-125`

> `FDGE-R17`: rojo primero, y **válido**.
>
> El intake declaró esta tarea exenta de matriz de tests por no producir código. **Deja de estar
> exenta**: se publica `tools/eventos.mjs`, y la desviación está declarada en `strategy.md`.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | Un registro lleva tarea, fecha, clase, cita y naturaleza | `CE-001` con cita |
| `TS-02` | La cita es **literal**, no parafraseada | `instancia doce` aparece tal cual |
| `TS-03` | Toda clasificación va marcada `DECLARADO` | `DECLARADO` |
| `TS-04` | Ninguna se presenta como `MEDIDO` | `NINGUNA MEDIDO` |
| `TS-05` | Una **mención** no se cuenta como instancia | `MENCION` |
| `TS-06` | …y no se borra: se marca con su motivo | el motivo aparece |
| `TS-07` | …y la misma clase en otra tarea **sí** es instancia | `INSTANCIA` |
| `TS-08` | Una entrada sin clase queda **recorrida** | `recorrida` |
| `TS-09` | Afirmar recurrencia sin nombrar la forma es **otro** estado | `NO nombra la forma` |
| `TS-10` | …y ese estado conserva su cita | `tercera vez` |
| `TS-11` | El ordinal sale de lo que la cita declara | `12` |
| `TS-12` | …también en forma cardinal | `27` |
| `TS-13` | …y sin número declarado dice `null`, no cero | `null` |
| `TS-14` | Clasificar **no toca** `HISTORY.log` | `NO TOCA EL LEDGER` |
| `TS-15` | Sin ledger legible **no** escribe un archivo vacío | `NO ESCRIBIO` |
| `TS-16` | …y lo **dice** en vez de callar | `no es lo mismo` |

---

## Los que existen porque algo falló

**`TS-05`, `TS-06`, `TS-07`** — el matcher marcaba `PT-127` como instancia de `CE-006` cuando la
entrada dice literalmente *«**No** es el acto fuera del comando»*. Catorce de setenta señales eran
menciones. Contarlas habría inflado la matriz con recurrencias que **no ocurrieron**: `CE-001`
—tomar la mención por el hecho— cometido dentro de la herramienta que existe para contar
instancias de `CE-001`.

**`TS-09` y `TS-10`** — son el estado de en medio, y sin ellos se perdería lo más útil que produjo
esta tarea: **40 entradas dicen que algo se repite y no dicen qué**. Fundirlas con «no dice nada»
haría desaparecer un hueco medido.

**`TS-15` y `TS-16`** — el negativo. Un `EVENTOS.jsonl` vacío diría «ningún evento», que no es lo
mismo que «no se pudo mirar» (`RULE-06`). Sin ellos, la herramienta podría fallar en silencio
produciendo un archivo que parece una medición.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| La lista `MENCIONES` revisada a mano | `TS-05` `TS-06` |
| `ordinalDe` | `TS-11` `TS-12` `TS-13` |
| El registro por entrada **recorrida** | `TS-08` `TS-09` `TS-10` |
| `fraseDe` | `TS-02` — la cita deja de ser la frase |

Cuatro supresiones, cuatro escenarios distintos.

### Y el escenario de la cita estuvo mal escrito

La primera versión comprobaba que la cita **contuviera** «instancia doce». Con eso, quitar
`fraseDe` **no tumbaba nada**: el recorte de respaldo también la contiene. Un caso pasando por el
motivo equivocado —`CE-005`— dentro de la prueba que existe para detectarlos. Ahora comprueba
que la cita **sea** la frase.

Y el fixture también estaba mal: sin un punto antes, `«## PT-131 — x\nEs el proxy…»` no tiene dos
frases, así que la «frase» era el texto entero y el escenario fallaba sobre el módulo **intacto**.
Se corrigió el fixture, no el comportamiento — que es el error que casi cometo en `PT-111`.
