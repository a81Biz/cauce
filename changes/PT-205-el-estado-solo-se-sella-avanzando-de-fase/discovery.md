# `PT-205` · `discovery.md` — las dos roturas son **predecibles en local**, y ahí está el arreglo

## 1. El diseño no está mal. Falta quien reclame

```js
// tracker.mjs:570 · decisionDeEnlace — la decisión, separada del efecto
return durable ? 'REPARAR_MUDO' : 'MUDO_SIN_REF_DURABLE';
```

> *«`MUDO_SIN_REF_DURABLE` es el freno: al abrir el issue el intake todavía no está commiteado, así
> que `refDurableDe` responde `null` CON RAZÓN y no hay nada que enlazar. Exigirlo ahí sería pedir
> un enlace a un commit que no existe.»* — `tracker.mjs:566`

**El freno es correcto.** El hueco es que, cuando el ref **pasa a ser** durable, nadie lo reclama
salvo CI. El estado `MUDO_SIN_REF_DURABLE` es legítimo **hoy** y será incumplimiento **mañana**, y
entre los dos momentos no hay nada.

## 2. Y republicar **no necesita commit**

`tracker abrir --aplicar` escribe el **cuerpo del issue en la plataforma**, no archivos. Así que la
reparación es:

```
git push  →  tracker abrir --aplicar        (y ya está: sin commit, sin CI de por medio)
```

Un comando, cinco segundos. **El coste no es arreglarlo: es enterarse**, y enterarse cuesta un
viaje de CI de siete minutos.

## 3. Lo decisivo: las dos son **predecibles antes de empujar**

Ésta es la diferencia con el límite que `PT-201` declaró. Aquél era *lo que no se puede saber en
local*. Esto **sí** se puede:

| | Lo que hay en local | Lo que pasará |
|:---|:---|:---|
| `SUITE-R51` | El intake **existe en el árbol** y el cuerpo del issue **no lleva enlace** | Al empujar, el ref se vuelve durable → `REPARAR_MUDO` |
| `SUITE-R34` | `git status` dice que `changes/` está sucio y `HANDOFF.md` no | Al commitear, `changes/` quedará **más nuevo** que `HANDOFF.md` |

**Las dos se derivan de lo que ya está delante.** No hace falta red, ni adivinar: hace falta
mirar el árbol de trabajo en vez de sólo lo commiteado.

`PT-201` ya puso medio aviso —*«MEDIDO SOBRE LO COMMITEADO … no predice la CI hasta que
commitees»*— y **aun así volvió a fallar**, porque ese texto dice *no lo sé*, cuando en realidad
**se puede saber**.

## 4. Lo medido, y por qué duele

```
$ gh run list --branch chore/…/EP-026-PT-203-…
  failure  2 min   ✗ SUITE-R51        failure  7 min   ✗ SUITE-R51
  failure  8 min   ✗ SUITE-R34        failure  5 min   ✗ SUITE-R34 · INTAKE-R09 · FDGE-R55 ×2
  ---
  55 min de CI en la rama · 17+ en corridas FALLIDAS
```

**Cuatro veces la misma forma en una sola rama.** Y cada una cuesta el viaje completo, no los
minutos de la máquina.

## 5. Una tercera rotura, de la misma familia

En el último fallo apareció `FDGE-R55`: `PT-204` y `PT-205` sin `origen_parada`. Escribí los
archivos de parada **a mano** en vez de invocar `tracker parada`, que escribe el campo **en el
mismo acto** que publica.

```
✗ FDGE-R55  PT-204: sin «origen_parada». […] la escribe el comando en el mismo acto que la publica:
            tracker parada <PT que paro> --motivo <clase> --texto <ruta> --desenlace abre --abre PT-204
```

**El mensaje es ejemplar** —dice el comando exacto— y aun así el hueco es el mismo: nada avisó
**antes** de empujar de que el archivo escrito a mano dejaría el registro incompleto. También es
predecible en local: el `.md` de parada existe y `origen_parada` no.

## 6. Qué NO es el arreglo

- **No es quitar reglas.** Las tres tenían razón y sus rojos fueron verdad.
- **No es un hook de `pre-commit`**: no corre en CI, se salta con `--no-verify`, hay que instalarlo,
  y `SUITE-R06` no automatiza lo que el marco no controla.
- **No es predecir lo impredecible**: el límite de `PT-201` sigue siendo un límite. Esto es lo otro.

## 7. Lo que NO se toca   `SUITE-R26`

- `decisionDeEnlace` y sus cinco resultados: la decisión es correcta y está bien separada del efecto.
- El freno `MUDO_SIN_REF_DURABLE`: exigir el enlace al abrir sería pedir un commit inexistente.
- La prosa del `HANDOFF` (`LEX-R26`).
