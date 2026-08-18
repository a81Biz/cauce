# PT-057 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `costeDe` con cinco tareas del mismo tipo | `referencia` con las tres medidas |
| E2 | AC-01 | …y las medidas son **medianas**, no medias | la mediana de `[1,1,1,1,100]` es `1` |
| E3 | AC-01 | …y cada medida lleva su **rango** | `min` y `max` |
| E4 | AC-02 | Filtrar por tipo **y** complejidad | solo las de ese grupo |
| E5 | AC-02 | Filtrar solo por tipo | todas sus complejidades |
| E6 | AC-02 | Sin filtro | todas las cerradas |
| E7 | AC-03 | Con **cuatro** tareas | `referencia: null` — no extrapola |
| E8 | AC-03 | …y **dice** cuántas hay y cuántas hacen falta | el motivo |
| E9 | AC-03 | …y enseña los casos **en crudo** | `casos_crudos` |
| E10 | AC-03 | Con **ninguna** tarea | `referencia: null` y motivo distinto |
| E11 | AC-03 | El umbral se puede cambiar sin tocar la función | `minimo` como opción |
| E12 | AC-04 | `duenoDe` toma el `PT` del **asunto** | el primero |
| E13 | AC-04 | …y **no** el del cuerpo | un asunto sin `PT` da `null` |
| E14 | AC-04 | …y con varios en el asunto, el **primero** | no el último |
| E15 | AC-01 | `tracker coste CHORE STANDARD` sobre el repositorio real | una cifra y de cuántas sale |
| E16 | AC-03 | `tracker coste CHORE SIMPLE` sobre el repositorio real | `SIN REFERENCIA` |
| E17 | AC-04 | `tracker coste` **sin credencial de tablero** | funciona igual |
| E18 | AC-04 | `MINIMO_REFERENCIA` está declarado con su nombre | no enterrado en un `if` |

**`E2` es el que separa esto de una cifra que engaña.** Con grupos de 6 a 13 y rangos de diez
veces, una media la arrastra un solo caso.

**`E7`–`E10` son `AC-03`, y distinguen tres cosas**: hay referencia, hay datos pero pocos, y no
hay nada. Las tres respuestas son distintas porque las tres situaciones lo son.

**`E17` está porque CI se lo enseñó a `PT-056`**: una acción que se deriva del registro y de git
no puede exigir credencial de plataforma, o queda inservible justo donde se decide un merge.

## Lo que ningún caso puede comprobar

**Que la referencia sirva para decidir.** Se comprueba que sale de las tareas cerradas, que dice
de cuántas y que con pocas se calla. Si 1966 líneas es «mucho» o «poco» para tu tarea es un
juicio, y esta tarea no lo hace — lo hará `PT-059` con lo que `PT-058` le dé.

**Que el umbral de cinco sea el correcto.** No hay dato que lo demuestre. Está declarado como
juicio, con nombre y comentario, para que se pueda discutir.

**Que la referencia describa el presente.** `BUG/TRIVIAL` sale más caro que `BUG/STANDARD` porque
sus tareas son anteriores a `FDGE-R19`. La salida dice de **cuántas** sale, no de **cuándo**.
