# Autorrevisión — `PT-119`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`tools/matriz.mjs` y `docs/implementation/MATRIZ.md`: diecisiete clases, con veces, ordinal
declarado, primera y última aparición, tareas, regla dueña y **si esa regla puede fallar**. Todo
derivado; nada transcrito. `npm run matriz` la escribe, `npm run matriz:check` comprueba su
frescura dentro de `npm run verify`.

## La decisión que define la tarea

`AC-04` pide que «regla dueña» se derive. Una tabla `clase → regla` sería **exactamente** la copia
que diverge —`CE-008`, la clase que esta matriz existe para contar— cometida dentro de la matriz.

La pertenencia la **afirma la regla**, en su propio texto. Diez reglas la declaran ahora. Una
clase que ninguna cita sale **sin dueño**, y eso es un hecho medido, no un fallo del generador.

## El hallazgo de la primera corrida

**`SUITE-R59` existe y nada emite por ella.** Creada por `PT-101` tras medir **27** roturas de
escapado, gobierna `CE-002`, y ninguna herramienta la `fail()` ni la `warn()`. `audit` detecta
construcciones frágiles, pero bajo su propio recuento de huecos, no bajo la regla.

Es `P-003` de la Declaración de Valor en su enunciado literal: *«cada regla `HARD` que declara
comprobación tiene un script que puede fallar»*. Lo vio la matriz **la primera vez que se
ejecutó**, que es la prueba de que servía para lo que se pidió.

## Los cuatro defectos que aparecieron construyéndolo

**1 · La derivación sólo veía la fila de tabla.** `SUITE-R14` se define en forma **suelta**, así
que `CE-008` salía «sin dueño» **teniendo dueño**. Una clase mal marcada como huérfana es peor que
no derivar nada: parece un hecho.

**2 · «142 entradas recorridas» y son 164.** Yo contaba identificadores distintos, y `PT-094`
tiene tres entradas. La cifra buena ya estaba derivada en la cabecera de `EVENTOS.jsonl`.
Recontarla era una segunda fuente del mismo hecho —`CE-008`— dando un número distinto —`CE-010`—
bajo la etiqueta equivocada.

**3 · La fecha de generación rompía `--check`.** El archivo no era reproducible, así que la
comprobación de frescura habría fallado siempre: la forma en que una comprobación se apaga sola.

**4 · Y la duodécima rotura de escapado.** El primer parche entró por heredoc y `\r?\n` llegó como
salto literal. La respuesta fue la de `SUITE-R59`: escribir el archivo.

## Y la prueba inversa dio cuatro rojos **falsos**

Las cuatro mutaciones decían «no compila». No era cierto: las copias se escribían en un directorio
temporal y `matriz.mjs` importa `./regla.mjs`, que ahí no existe. **Cuatro rojos por el motivo
equivocado, contados como aciertos** — `CE-005` dentro de la prueba que existe para detectarlo, y
la tercera vez esta sesión que un arnés de prueba tiene el defecto que persigue.

## Lo que esta tarea NO establece

- **Que las nueve clases huérfanas deban tener regla.** Dice que no la tienen.
- **Que `CE-002` esté desprotegida.** Dice que **nada emite bajo `SUITE-R59`**.
- **Que la matriz priorice.** Enumera. Puntuar es `FPGE`; abrir lo decide una persona (`FPGE-R04`).
- **Que `CE-005` no tenga dueño de verdad.** El ledger se la atribuye a `RULE-06`, que vive en
  `11-Conventions.md` y **no se lee**: `AC-04` dice `RULES.md`. Límite declarado.

## Estado

| | |
|:---|:---|
| Escenarios | 18 de 18 |
| Prueba inversa | 4 supresiones, 4 escenarios distintos |
| Orphan Criterion | ninguno |
| `verify-fdge` | sin errores |
