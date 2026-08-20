# PT-080 — Descubrimiento   `PHASE 2`

## Las tres, y lo que cada copia había perdido

Encontradas en `PT-067` al derivar el universo de reglas de sus tres documentos propietarios.
**Las tres copias ya divergían, y siempre en la misma dirección**: la de `EXECUTION-MODES.md`
soltaba una obligación.

| Regla | `RULES.md` exige | La copia **omitía** | Consecuencia |
|:---|:---|:---|:---|
| `FDGE-R22` | «Solo `severity: S1`» **y** `PHASE 2,3,4,7,8` retroactivas | **las dos** | el carril `HOTFIX` abierto a un `S3` — y ese carril difiere `G2` y `G3` |
| `FDGE-R40` | los PTs solapados **se serializan** | la serialización | el solapamiento se calcula, se declara y se ejecuta en paralelo igual |
| `FDGE-R41` | el **`EP-NNN` pasa a `BLOCKED`** | la transición | el lote se para y el registro sigue diciendo que vive |

`FDGE-R22` es la peor: la copia débil **abre una puerta a saltarse dos compuertas**.

## Por qué no lo vio nadie

`verify-suite` comprueba cinco cosas: vocabulario derogado, reglas citadas que no existen,
obligaciones en documentos que sólo explican, enlaces rotos y versiones desalineadas.

**Ninguna es «que una regla se defina una sola vez»** — que es la única de las cinco por la que se
escribió la v4. `CLAUDE.md` lo cuenta: *«La v3 tenía la misma regla escrita a mano en cuatro
documentos, y las cuatro copias divergieron —eso produjo ocho defectos críticos, incluido un
ruleset que ordenaba destruir datos»*.

`LEX-R22` y `SUITE-R38` ya lo prohíben. Lo que faltaba era quien lo mirara.

## Conclusión

El arreglo no es borrar el texto de `EXECUTION-MODES`: ese documento **explica cómo se ejecuta un
lote** y necesita nombrar las reglas. Lo que no puede es **enunciarlas**.

Las tres pasan a **citar** por ID, y la obligación completa vive donde le corresponde. Medido:
`EXECUTION-MODES` pasa de 17 definiciones a 14.

Y el detector —`definidasDosVeces`— es lo que impide la cuarta. Comprobado en las dos direcciones:
con una duplicada inyectada, `verify-suite` **falla**; al retirarla, vuelve a verde.
