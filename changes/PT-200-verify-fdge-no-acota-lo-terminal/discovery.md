# `PT-200` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. El defecto, en una línea

```
docs/methodology/tools/verify-fdge.mjs:2974
```

```js
const terminal = new Set(['CLOSED', 'REJECTED', 'REVERTED', 'DEFERRED']);
```

**`INTEGRATED` no está en la lista.** Y es el estado en el que acaba **toda tarea que se termina
bien**: `LEXICON §5.1` lo define como «mergeado a la línea principal».

## 2. La medida

```
reparto de los 203 PT del registro
  INTEGRATED   183
  DRAFT          9
  DONE           5
  CLOSED         3
  DEFERRED       3

verify-fdge --all recorre   197 de 203
  de esos, INTEGRATED       183
  vivos de verdad            14
```

**El 93 % del trabajo de cada corrida se hace sobre tareas cuyo código ya está en `main` y cuyo
issue ya está cerrado.** Tarda entre 9 y 14 minutos, y corre en cada `npm run verify` y en cada push.

## 3. La asimetría, en el mismo `verificacion.yml`

| Paso | Qué hace |
|:---|:---|
| `Batería de casos · salta los bloques sellados` | **acota**: 1950 → 153 casos |
| `Cumplimiento de los artefactos propios` | **no acota**: 197 de 203, siempre |

`EP-025` construyó entero el mecanismo del sello —bloques, huella, veredicto, recibo— **para la
batería**, y la otra mitad de la verificación se quedó fuera. Lo dijo el firmante:

> *«si se selló la prueba, el artefacto también»*

## 4. Por qué `INTEGRATED` no estaba, y no fue un descuido

El comentario de `:2971` explica por qué `DEFERRED` **sí** está:

> *«un aplazado no tiene intake ni ha recorrido fases, y exigírselo sería un rojo permanente».*

`INTEGRATED` es distinto: **sí** tiene todo, y por eso pasa. La lista no se escribió pensando en el
coste, sino en quién podía dar rojo. Nadie la revisó cuando la cifra creció de veinte tareas a
doscientas.

Y `PT-098` ya avisó de que `INTEGRATED` **apaga seis comprobaciones**: parte del trabajo sobre esas
183 ni siquiera comprueba nada.

## 5. Por qué NO basta con añadir `INTEGRATED` a la lista

Un `PT` integrado tiene su código en `main`, pero **sus artefactos siguen en el repositorio**:
`changes/PT-NNN-slug/`, `evidence/PT-NNN/`, su entrada en `HISTORY.log`, su allocation. Nada impide
que alguien los edite o los borre después.

Saltarlos sin más convertiría la compuerta en ciega para el 93 % del repositorio. **Es exactamente
el defecto que `PT-191` acaba de cerrar en la batería**: un bloque no se certifica por no haber
cambiado, sino por haber pasado — y para saber si cambió hace falta una huella.

## 6. Lo que el precedente ya resolvió, y aquí se reutiliza

`PT-175` y `PT-191` dejaron el mecanismo entero:

- el sello guarda **su veredicto**, no sólo su huella;
- la huella incluye **las herramientas**, porque un cambio en el verificador puede cambiar el
  veredicto sin que el artefacto se toque;
- sellar es una **decisión** (`--verde`), no un efecto de ejecutar el comando;
- y sólo certifica una corrida **completa** y en verde, comprobada por un recibo.

Las cuatro piezas valen aquí sin cambios conceptuales. Lo que hay que decidir es **qué entra en la
huella de un `PT`**, y eso es el trabajo de la tarea (`RULE-06`).

## 7. Lo que NO está roto

- **Lo que `checkPT` comprueba.** Es correcto y no se toca.
- **`allOpenPTs` como función.** Su lista de terminales sigue siendo la correcta para lo que
  significa «terminal»; lo que falta es un segundo criterio —**sellado y sin cambios**— que es otra
  cosa.
