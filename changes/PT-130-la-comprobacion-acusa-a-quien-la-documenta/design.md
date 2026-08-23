# Diseño — `PT-130`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · `contradiceElRegistro`, línea `tarea:`

```
antes    cortar en la primera palabra de estado terminal
         juzgar TODOS los identificadores del trozo de delante

ahora    sujeto = el PRIMER identificador
         falla si el registro lo tiene TERMINAL
         y la propia línea NO lo declara terminal
```

**Por qué el primero.** La línea `tarea:` afirma **una** tarea en curso: el checkpoint es uno
(`LEX-R26`). El resto de identificadores son contexto — la tarea anterior, el lote, una cerrada,
una que espera validación — y evaluarlos es leer una afirmación que la línea no hace.

## 2 · La guarda que impide sobrecorregir

```js
const loDeclara = new RegExp(sujeto + '[^.]{0,80}(INTEGRAD|CERRAD|CLOSED|DEFERRED)', 'i').test(lt);
```

Decir «`PT-096` `INTEGRATED`, cerrada el martes» es correcto. Sin esta guarda, el sujeto terminal
fallaría **aunque la línea lo diga**, que es el mismo defecto por el otro lado.

**Ochenta caracteres y no toda la línea**: el estado tiene que estar **junto** al identificador
para que se le atribuya. Es el mismo principio que `PT-125` tuvo que aprender con el ordinal, y
por la misma razón.

## 3 · `SUJETOS['SUITE-R34']`   `AC-03`

```
establece    el SUJETO de «tarea:» no está terminal mientras la línea lo presenta en curso,
             y ningún lote declarado ABIERTA o CERRADA se contradice con su estado
noEstablece  NO evalúa los demás identificadores que la línea mencione: nombrar una tarea
             cerrada PARA DECIR que está cerrada es correcto, y acusarlo sería acusar a
             quien documenta el hecho que esta regla vigila (CE-017)
```

Un rojo sin alcance declarado se lee como «el bloque entero contradice al registro».

## 4 · `lecturasDeAlcanceAmplio`   `AC-04`

Enumera —no arregla— las lecturas que buscan una marca en **todo** un texto y concluyen sobre un
hecho concreto. La heurística se declara: una variable cuyo **nombre** dice que es un archivo o un
cuerpo entero, sobre la que se pregunta `.includes(` o `.test(`.

**Es una heurística y se dice.** No enumera intenciones, enumera **formas**: una lectura amplia
legítima entra en la lista igual, y sacarla exige mirarla.

Tres decisiones dentro:

- **Los comentarios no cuentan.** Nombrar el patrón para explicarlo no es leerlo. Es la
  autorreferencia que ya mordió en `PT-051` y en el lint de helpers.
- **Sin fuentes devuelve `null`**, no `[]`. «No se pudo mirar» y «cero» no son lo mismo
  (`RULE-06`) — y aquí no es teórico: la primera versión midió **cero** por una expresión rota.
- **Se publica archivo y línea**, no sólo el recuento. Un número sin dónde no se puede ir a mirar.

## 5 · Lo que este diseño NO hace

- **No cambia lo que `SUITE-R34` establece.** El hecho que vigila es correcto.
- **No toca la línea `implementación:`**, ya anclada por adyacencia.
- **No arregla las once lecturas enumeradas.**
- **No reescribe ningún texto para esquivar el falso positivo.**
