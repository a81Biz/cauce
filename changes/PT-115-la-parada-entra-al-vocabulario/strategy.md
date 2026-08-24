# `PT-115` — Estrategia   `PHASE 3`

## La decisión: qué es una parada

`O-1` del intake del lote ya está resuelta y firmada: **se publica la parada que lleva una
decisión**, con motivo dentro de una **lista cerrada**. El literal —«después de cada tanda de
herramientas»— se descartó con su coste medido: cuarenta comentarios por tarea entierran
`SUITE-R43`, que es la regla que detecta al humano sin responder.

Lo que falta decidir aquí es **cuáles son esas clases**.

## Las clases de `motivo`, derivadas de esta sesión

No se inventan: **se leen de lo que de verdad detuvo el trabajo** en `EP-020`, que es la única
evidencia disponible.

| Clase | Qué es | Instancia real |
|:---|:---|:---|
| `hallazgo` | Se encontró un defecto que no se buscaba | los 16 issues duplicados, hallados por el espejo |
| `condicion-bloqueante` | Algo impide seguir y no depende del agente | `SUITE-R57` bloqueando `G2` de todo el repositorio |
| `compuerta` | Una compuerta pide decisión humana | `G3` de `PT-131`, pedida expresamente |
| `abre-trabajo` | La parada produce una allocation nueva | `PT-132` naciendo de los duplicados |
| `limite-alcanzado` | Se llegó al borde de lo que se puede afirmar | `AC-06` de `PT-124`, declarado sin hacer |
| `desafio-al-intake` | `INTAKE-R07`: el agente discrepa de lo firmado | `O-1`, el desafío al enunciado literal |

**Seis, y cerrada.** Ampliarla es un cambio de metodología, no un parche — igual que la lista de
tipos de ítem que `PT-124` acaba de cerrar.

## Las clases de `desenlace`

| Clase | Qué ocurre después |
|:---|:---|
| `continua` | se sigue con la misma tarea |
| `abre` | nace una allocation: `PT-NNN` o `EP-NNN` |
| `cambia-fase` | es una transición — **el caso particular de `FDGE-R52`** |
| `detiene` | el trabajo para y espera a una persona |
| `declara` | se registra un límite y no se hace nada más |

## La regla: `FDGE-R55`

```
FDGE-R55  HARD  Toda parada con decision se escribe en la tarea que la motiva, antes de
                continuar. Lleva su MOTIVO, la EXPLICACION, y su DESENLACE. Destino: el
                issue si hay plataforma, TRANSICIONES.log si no — el MISMO que la nota de
                reanclaje (LEX-R22). Append-only. FDGE-R52 es su caso particular: una
                transicion es una parada cuyo desenlace es «cambia-fase».
```

**Y lo que la regla NO promete**, escrito en ella misma (`SUITE-R26`): una parada cuyo desenlace es
`continua` **no la puede exigir ningún script desde el repositorio** — no deja rastro contra el que
contrastar. Lo mecanizable es el desenlace que **sí** lo deja, y es `PT-117`.

## Los tres movimientos

| # | Qué | Dónde |
|:--|:---|:---|
| `E-1` | `LEXICON` declara `PARADA`, sus dos listas cerradas y su destino | `LEXICON.md` |
| `E-2` | `RULES` declara `FDGE-R55`, y `FDGE-R52` cita que es su caso particular | `RULES.md` |
| `E-3` | `CORE` regenerado, y `PHASES` nombra la parada donde toca | `CORE.md` · `PHASES.md` |

## Lo que NO se hace

- **No se relaja `FDGE-R52`.** Sigue exigiendo sus tres líneas por transición, con su verificador.
- **No se inventa un archivo nuevo.** El destino es el que ya existe.
- **No se construye el comando.** Es `PT-116`.
- **No se exige nada todavía.** `FDGE-R55` nace sin verificador; quien lo pone es `PT-117`, y hasta
  entonces la regla es una obligación declarada — que es lo que `SUITE-R26` llama *una
  recomendación* si se queda ahí. Por eso las tres tareas van seguidas.

## El riesgo declarado

**Una lista cerrada mal elegida se rodea.** Si un motivo real no encaja en las seis clases, el
agente hará lo que hizo con `asignar` cuando le faltaban campos: **saltarse la herramienta**
(`PT-103`). Por eso las seis salen de instancias medidas y no de imaginar casos, y por eso `PT-119`
publicará **cuántas paradas hubo por clase** — si alguna sale en cero, o sobra o la lista está mal.
