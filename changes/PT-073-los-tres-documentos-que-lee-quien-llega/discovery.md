# PT-073 — Descubrimiento   `PHASE 2`

## Por qué esta tarea va al final

El intake lo pedía y el `HANDOFF` lo repite en su `no hacer`: *«escribir `MANUAL`, `README` o
`CASOS-DE-USO` antes de ejecutar las dos pruebas: escritos antes describen lo que uno **cree** que
pasa; escritos después, lo que **pasó**»*.

Y se nota en lo que hay que corregir: **ninguna de las cinco fricciones que añado al manual se me
habría ocurrido escribir en agosto.** Salieron de instalar el marco de verdad.

## Lo que estaba desactualizado, medido

| Documento | Qué decía |
|:---|:---|
| `CASOS-DE-USO` | «Varios agentes trabajando a la vez» como hueco entero — y `EP-016` cerró la identidad, los rangos de ID y la sesión por persona |
| `CASOS-DE-USO` | No mencionaba las dos pruebas: el catálogo describía un marco sin ellas |
| `README` (raíz) | **Sin cambios desde `v9.0.0`**, medido con `git diff` en `PT-085` |
| `MANUAL` | Sin una sola de las fricciones que la instalación real produce |

## Lo que se corrige, y de dónde sale cada línea

**`CASOS-DE-USO`** — el hueco de multiagente se estrecha a lo que sigue abierto de verdad: **la
coordinación del reparto**. Y entran dos huecos nuevos que `PT-019` declaró: migrar de verdad un
legado —se validó el informe, no la ejecución— y el legado sintético que no se construyó.

**`README`** — dice ahora **qué está demostrado y qué no**, con las dos pruebas y su resultado. Y
dice explícitamente que la migración de extremo a extremo **no** lo está.

**`MANUAL`** — cinco fricciones reales, con qué hacer en cada una. Y las dos que ya no verá nadie
porque se arreglaron en el mismo lote.

## Conclusión

`AC-04` pedía que ninguna cifra escrita a mano sobreviva si ya se deriva. La única que quedaba
—«varios agentes a la vez» como hueco cerrado— era **prosa desactualizada**, no una cifra: el
riesgo `D4`/`D5` del primer Foundation era copiar números, y aquí lo que envejeció fue una
afirmación.

Por eso `PT-085` añadió que **sellar exija resolver estos documentos**: sin eso, la próxima
versión los deja envejecer otra vez y nadie lo nota hasta que alguien los lea.
