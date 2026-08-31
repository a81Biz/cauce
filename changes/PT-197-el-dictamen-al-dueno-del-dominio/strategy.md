# `PT-197` · `strategy.md`

## La decisión

**El Dictamen se da de alta como componente declarándolo, y se produce UNO leyendo.** Ni generador
ni herramienta nueva: `PT-149` ya probó que un componente se declara en `LEXICON`, `RULES` y
`CASOS-DE-USO` **sin tocar código**.

| Pieza | Dónde | Qué |
|:---|:---|:---|
| 1 | `LEXICON.md` | El nombre, el trigger `[START DICTAMEN]`, y su sitio entre los componentes |
| 2 | `RULES.md` | `DICT-R01`…`DICT-R03`: las tres secciones, **en orden**, con su criterio de validez |
| 3 | `CASOS-DE-USO.md` | Su recorrido, y **qué lo hace válido** |
| 4 | `docs/implementation/DICTAMEN.md` | **El entregable**, sobre este repositorio |

## Por qué se produce leyendo y no generando

**Porque todavía no se sabe qué se automatiza.** Escribir el generador antes de haber hecho uno es
decidir la forma sin el dato — y este lote lleva diecisiete tareas demostrando lo que pasa cuando
se decide sin medir. Si más adelante merece automatizarse, será **con el dato de haberlo hecho una
vez a mano**.

Y hay una razón de fondo: **la sección 3 es un juicio**. Un generador produciría las dos primeras y
tendría que dejar la tercera en blanco — que es exactamente el documento que `FND-R24` dice que el
agente no puede escribir solo.

## Las tres reglas, y por qué el orden es una de ellas

```
DICT-R01   §1 dice, por CADA producto de la Declaracion de Valor, si cumple su «VALIDO si»
           VALIDO si: ningun producto declarado queda sin veredicto

DICT-R02   §2 nombra lo que el marco NO garantiza: lo declarado sin cubrir, las reglas sin
           verificador, las deudas certificadas y las paradas abiertas
           VALIDO si: ningun limite conocido queda sin nombrar

DICT-R03   §3 enuncia la decision que las dos anteriores habilitan, y va DESPUES
           VALIDO si: hay una decision que este documento permite tomar y otro no
```

**El orden no es presentación: es el criterio.** Primero lo que hay, después lo que falta, y sólo
entonces la decisión. Al revés sería una recomendación buscando datos que la sostengan — y ése es
el defecto que un entregable ejecutivo comete con más facilidad.

## Lo que el Dictamen NO es, y hay que decirlo

- **No sustituye a `PTSA`.** `PTSA` **audita** contra la Declaración de Valor; el Dictamen la
  **presenta** a quien no lee código. Confundirlos haría que uno de los dos sobrara.
- **No es un informe de estado.** `tracker estado` ya lo da. El Dictamen responde **si sirve**, no
  **qué hay**.
- **No es un `CHANGELOG`.** Éste cuenta qué cambió; aquél, si lo que hay justifica lo que viene.

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** el componente declarado con sus tres reglas, su trigger y su caso de uso; y **un**
Dictamen sobre este repositorio.

**Fuera, y consta:**
- **Ningún generador.** Se decide con el dato de haberlo hecho a mano.
- **Ninguna herramienta nueva**: `PT-149` probó que no hace falta.
- **El Dictamen de un proyecto destino**: este repositorio es el único caso disponible, y
  `SUITE-R41` hace que sea representativo **de la fuente**, no del destino. Se declara.
- **Que el Dictamen sirva.** Lo dice el firmante, y `AC-03` lo reserva desde el intake.

## El riesgo, y cómo se acota

El riesgo es **escribir un documento bonito que no permita decidir nada** — el fallo típico de un
entregable ejecutivo. Por eso `DICT-R03` no pide «una recomendación» sino **una decisión que este
documento permita tomar y otro no**, y por eso la evidencia de `AC-03` es que **el firmante lo
diga**, no que el agente lo afirme.
