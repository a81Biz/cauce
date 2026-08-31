# `PT-206` · `discovery.md`

## 1. Lo medido

```js
const clase = campo(/^Clase de evento:\s*(CE-\d{3})\s*$/im);   // verify-fdge.mjs:2847
//                                                    ^^^^      exige FIN DE LINEA
```

```
entradas que DECLARAN una clase :  76
que LEX-R31 llega a ver         :  22
invisibles para la regla        :  54   (71 %)
```

La convención **mayoritaria del propio `HISTORY.log`** es `CE-NNN — descripción`, y el `\s*$` no la
admite. **Tres de cada cuatro entradas que cumplen la regla salen como incumpliéndola.**

## 2. Es el defecto de `PT-198`, en otra herramienta

| | `PT-198` | aquí |
|:---|:---|:---|
| El regex | `/^status:[ \t]*\S+[ \t]*$/m` | `/^Clase de evento:\s*(CE-\d{3})\s*$/im` |
| Lo que rompe | `status: READY  # comentario` | `Clase de evento: CE-005 — descripción` |
| El mensaje | «no declara `status`» | «no declara `Clase de evento`» |
| La verdad | **Lo declara** | **Lo declara** |

## 3. Por qué `PT-198` no lo cazó, y consta

Midió **`tracker.mjs`** —siete expresiones sobre cuatro campos— y su `discovery` declaró: *«ningún
otro `.mjs` de `tools/` los tiene»*. **Cierto para `status`/`phase`/`type`/`epic`; falso para la
familia entera** de campos anclados a fin de línea.

Es `CE-005` **dentro de la tarea que cerraba `CE-005`**: se miró donde se sabía mirar.

## 4. Una afirmación de la parada que era FALSA, y se corrige aquí

La parada decía: *«`eventos.mjs` sí las cuenta, así que el mismo hecho se lee de dos formas y una
se equivoca — `SUITE-R38`»*. **Comprobado antes de construir sobre ello, es falso.**

```js
'CE-005': ['verde por vac[ií]o', 'verde por no haber mirado', 'falso verde', …]   // eventos.mjs:45
```

`eventos.mjs` **no lee esa línea**: clasifica por **frases del cuerpo**. Son **dos hechos
distintos** — uno **deduce** la clase de lo que la entrada cuenta, el otro comprueba que la
**declare**. **No hay `SUITE-R38`**, y unificarlos habría sido peor que el defecto.

## 5. La familia, barrida — que es lo que `PT-198` no hizo

```
once expresiones de tools/ anclan un campo a fin de linea:
  ^Clase de evento:…$   ^Compuertas:.*$   ^Estructural:\s*(sí|si|no)\s*$   ^actualizado:.*$
  ^certificacion:\s*([ABCF])\s*$   ^confidence:…$   ^health:…$   ^health_unstable:…$  (×2)

de ellas CINCO exigen un VALOR CONCRETO, que es donde el riesgo es real:
  Estructural · certificacion · confidence · health · health_unstable
```

Las de `.*$` no corren riesgo: aceptan cualquier cosa hasta el final. **Ninguna de las cinco ha
fallado todavía** — se cuentan y se nombran, y arreglarlas es otro trabajo.

## 6. Lo que NO se toca   `SUITE-R26`

- **`LEX-R31` sigue avisando**, no bloqueando: no todo trabajo repite un tropiezo.
- **No se retrofecha** ninguna entrada anterior a la regla (`SUITE-R09`, `CE-014`).
- **No se reescriben las 76 cabeceras**: el defecto es del regex.
