# PT-064 — Descubrimiento   `PHASE 2`

> Medido el 2026-08-18.

## 1. Ninguna cifra pide el autor

Las tres derivaciones que alimentan el coste, el precedente y el techo:

```
cerradasConCoste()   git log --format=%H %s      el SHA y el asunto
porSesion()          git log --format=%H %cs     el SHA y la fecha
movidoDesde()        git log --format=%H %s      el SHA y el asunto
```

**Ninguna pide `%an` ni `%ae`.** La única función del marco que mira el autor es `personas`
(`PT-061`), y no alimenta ninguna cifra.

Con una persona da igual: todo el trabajo es suyo. Con dos, **cada una de las tres cifras mezcla el
trabajo de las dos**, y sobre ellas decide la compuerta de `PT-059`.

## 2. Qué se rompe exactamente, cifra por cifra

| Cifra | Qué hace hoy | Con dos personas |
|:---|:---|:---|
| **Coste típico** | Mediana de las cerradas del tipo | Mezcla — pero puede ser **correcto**: más casos, mejor referencia |
| **Precedente** | Lo mayor completado en la sesión | **Falso**: compara contra trabajo ajeno |
| **Techo histórico** | La mayor sesión registrada | **Inflado**: el día de dos personas cuenta como una sesión |

Las tres se comportan distinto, y por eso no se arreglan igual:

- El **precedente** decide si empezar una tarea *ahora*. Si sale del trabajo de otro, la compuerta
  aprueba por un motivo que no existe.
- El **techo** decide si una tarea **nunca cabría** (`AC-06` de `PT-059`). Inflado, esa salvaguarda
  no salta nunca.
- El **coste típico** es una referencia de un tipo de tarea. Mezclar personas ahí **no es un
  defecto obvio**: más casos es mejor referencia, y el coste de un `BUG/STANDARD` no depende
  necesariamente de quién lo haga.

## 3. Y por eso `AC-03` es una decisión, no un descuido

El intake pide que el coste típico pueda pedirse **de todos** o **de una persona**, y que diga cuál
es. Medido lo de arriba, eso es lo correcto:

- **De todos**: más casos. Hoy `CHORE/STANDARD` tiene 17 cerradas; partirlas entre dos personas
  dejaría grupos por debajo de `MINIMO_REFERENCIA` y `costeDe` devolvería `SIN REFERENCIA`.
- **De una**: más ajustado, si se cree que el coste depende de quién.

Las dos valen. Lo que no vale es **no saber cuál te están dando**.

## 4. El techo, medido hoy

```
techo historico 29286 (MEDIDO)   la mayor sesion registrada
```

29 286 líneas en un día. Con una persona eso es una sesión larga y real. Con dos, el mismo número
podría ser **dos sesiones de 15 000** — y la salvaguarda de `AC-06` (`PT-059`) usaría un techo que
nadie ha alcanzado nunca.

## 5. Lo que ya existe y sirve

`PT-061` dejó `personaDe(autor, personas)`, que responde con una persona **declarada** o `null` con
motivo. Es exactamente lo que hace falta: pedir `%an` y `%ae` a git y pasarlos por ahí.

Y deja también el caso que `AC-04` pide: **un commit de un autor no declarado no se reparte**. Es
`SIN EVALUAR` — no se le adjudica a nadie por parecido, que es lo que `PT-061` decidió.

## 6. Lo que esto obliga

1. Las tres derivaciones piden el autor (`%an`, `%ae`) y lo pasan por `personaDe`.
2. El **precedente** y el **techo** se filtran por persona. Son los que deciden.
3. El **coste** admite las dos formas y **dice cuál** está dando.
4. Un commit sin persona declarada **no se reparte**: `SIN EVALUAR`.
5. Con una sola persona declarada —o ninguna— las cifras **no cambian**. Es lo que impide que esta
   tarea rompa `EP-015`.
