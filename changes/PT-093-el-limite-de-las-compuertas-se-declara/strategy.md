# PT-093 — Estrategia   `PHASE 3`

## La decisión, y por qué es ésta

`H-009` es tipo `INVESTIGATION` porque no estaba claro que tuviera arreglo dentro del repositorio.
Medido en `PHASE 2`, **no lo tiene** — y los cuatro caminos que parecen tenerlo mueven el problema:

| Camino | Dónde acaba |
|:---|:---|
| Exigir un revisor aprobador | Imposible para el equipo de una persona que `SUITE-R22` declara soportado |
| Retirar credenciales de `gh` al agente | Rompe el espejo (`SUITE-R35`), única defensa contra la divergencia registro↔tablero |
| Firma criptográfica | El agente ejecuta en la misma máquina donde estaría la clave |
| Un segundo agente que apruebe | Dos agentes con las mismas credenciales no son dos personas |

**`SUITE-R27` ya resolvió el mismo dilema para las firmas**, y con la respuesta honesta: declarar
qué se garantiza y qué no. Se aplica el mismo criterio donde la consecuencia es irreversible.

## Lo que se escribe, y dónde

`EXEC-R04` gana una tabla de dos columnas —lo que el marco garantiza y lo que no— y una frase que
impide leer `0` revisores como un descuido.

`EXEC-R04a` fija la **forma** de la constancia. `PT-088` la fijó de hecho al escribir el
verificador, y dejarla implícita significaba que sólo la conocía quien leyera el código.

## Por qué una sub-regla y no un párrafo más

`LEX-R24` admite sub-IDs con letra minúscula pegada para las cláusulas de una regla. La forma de la
constancia **es una cláusula de `EXEC-R04`**, no una obligación nueva: sin `EXEC-R04` no habría
constancia que formatear.

Y con ID propio se puede **citar y emitir** por separado — que es lo que permite distinguir una
constancia ausente de una malformada.

## La distinción que trajo el diseño

```
sin constancia          ->  EXEC-R04   ·  se arregla ESCRIBIENDO la entrada
constancia sin nombre   ->  EXEC-R04a  ·  se arregla ANADIENDO el nombre
```

Fundirlas en un mensaje mandaría a quien lo lee a averiguar cuál de las dos era. **Dos hechos
distintos con arreglos distintos no comparten emisión** — es lo mismo que `PT-091` hizo con «no
existe» frente a «desviada».

## Lo que esta tarea NO hace, y es su límite

**No construye una prevención.** No la hay dentro del repositorio, y prometerla sería peor que
declarar el límite: daría por resuelto lo que sigue abierto.

Lo que queda es una afirmación contrastable con un nombre detrás. Quien figura en `firmantes`
responde de lo que lleva su nombre — igual que en una firma, y con la misma franqueza.
