# PT-048 — Estrategia   `PHASE 3`

## Objetivo

Que el cuerpo de un issue **diga lo que hay** en vez de enlazar a lo que no hay.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Crear el directorio vacío al aplazar | `SUITE-R44` dice que un `DEFERRED` está exento, y `SUITE-R32` describe qué le pasa a un espacio vacío: desaparece en el primer clon. Además promete artefactos que nadie va a escribir |
| Quitar el enlace de **todos** los cuerpos | Rompe el caso normal, que es el 90 %: un PT vivo con su directorio |
| Comprobar por `status === 'DEFERRED'` | Infiere desde el estado en vez de mirar. Un PT recién asignado tampoco tiene directorio hasta que `PHASE 1` lo crea, y también daría 404 |
| **Mirar si el directorio existe** | Es el hecho, no una inferencia sobre él |

## Solución

```js
const hayDirectorio = existsSync(join(ROOT, dir));
const enlace = hayDirectorio
  ? (url ? `[…](${url}/tree/${ramaDelEnlace}/${dir})` : `${dir}/ — en el repositorio`)
  : 'sin artefactos todavía: es una allocation aplazada (SUITE-R44)';
```

**Se mira el directorio, no el estado.** Un `DEFERRED` es el caso más común pero no el único: un
PT recién asignado tampoco lo tiene hasta que `PHASE 1` lo crea, y con el estado como criterio ese
seguiría dando 404.

Es el mismo principio que `RULE-06` aplica a los datos que faltan: **no se infiere lo que se puede
mirar**.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| El cuerpo de los 11 issues vivos con directorio | Caso propio: con directorio, el enlace queda **idéntico** |
| `cuerpoDeIssue` es pura y exportada | El dato nuevo viaja en el contexto que ya recibe; la función no toca el disco |
| Los cuerpos ya publicados | `abrir --aplicar` los resincroniza: la transición es automática, como con la rama de `PT-036` |
| Un lote (`EP`) sin directorio | Mismo trato: dice lo que hay |

## Criterios de éxito, derivados de los AC

- `AC-01` → sin directorio, no hay enlace
- `AC-02` → dice qué es: una allocation aplazada, aún sin artefactos
- `AC-03` → con directorio, idéntico a hoy
- `AC-04` → comprobado sobre `PT-019` y `PT-025`, las dos que quedan

## Autorrevisión

Contradicciones: ninguna con `SUITE-R44` —se apoya en ella— ni con `PT-036`, cuya lógica de rama
no se toca. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** que el issue de un aplazado tenga poco que decir. Sigue sin intake ni
fases, porque `SUITE-R44` así lo quiere. Lo que cambia es que **no mienta**.
