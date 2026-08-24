# `PT-114` — Escenarios de test   `PHASE 4`

| TS | Escenario | Espera | Inversa que lo tumba |
|:---|:---|:---|:---|
| `TS-01` | Cuerpo «sin enlace» **con** ref durable ⇒ divergencia | `true` | no detectarlo ⇒ el firmante no puede leer el intake y nadie lo dice |
| `TS-02` | Cuerpo «sin enlace» **sin** ref durable ⇒ correcto, no se toca | `false` | marcarlo ⇒ se acusa a la decisión de `PT-096`, que es correcta |
| `TS-03` | Cuerpo **con** enlace y ref durable ⇒ correcto | `false` | marcarlo ⇒ ruido en cada corrida |
| `TS-04` | Sin poder leer el cuerpo ⇒ `null`, no `false` | `null` | devolver `false` ⇒ verde por omisión (`RULE-06`) |
| `TS-05` | Sin saber si hay ref ⇒ `null` | `null` | devolver `false` ⇒ lo mismo |
| `TS-06` | El literal que busca es **el mismo** que `cuerpoDeIssue` escribe | una sola constante | dos copias ⇒ divergen y el caso lo caza |

## La inversa que decide

**`TS-02`.** Si marcara el caso sin ref durable, estaría acusando a `PT-096` de un defecto que no
tiene — y el ruido en cada corrida enseñaría a ignorar la comprobación, que es peor que no
tenerla.

**`TS-04` es la segunda**: devolver `false` en vez de `null` diría «todo bien» sin haber podido
mirar. Es lo que `publicar.yml` hace hoy con `SUITE-R43`, medido en 108 de 108.
