# Estrategia — `PT-119`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## La decisión que define la tarea: de dónde sale «regla dueña»

| Opción | Por qué NO / SÍ |
|:---|:---|
| Una tabla `clase → regla` en el generador | Es **exactamente** la copia que diverge. `SUITE-R38` la prohíbe, y `CE-008` la nombra: el defecto que la matriz existe para contar, cometido en la matriz |
| Una tabla en `LEXICON` §4.4, junto a las clases | Mejor, pero sigue siendo una tabla que hay que mantener en paralelo a `RULES.md`. Cuando una regla cambie de alcance, nadie la actualizará |
| **Que la regla CITE su clase, en su propio texto** | **Gana.** La pertenencia vive donde vive la regla; no hay dos sitios que puedan divergir. Y una regla que reclama un tropiezo lo está **afirmando**, que es contrastable |

Con esa vía, una clase que ninguna regla cita sale **sin dueño** — y eso es un **hecho medido**,
no un fallo del generador. Es lo que hace que la matriz sirva.

## Tres desenlaces, no dos   `AC-03`

La lección de `PT-110`, y el propio intake la declaró como lo que importa:

```
matriz con cifras     las fuentes se leyeron
matriz con ceros      se leyeron y no hay eventos
SIN EVALUAR           NO se pudo leer — y NO se escribe archivo
```

Sin el tercero, un `EVENTOS.jsonl` ilegible produciría **el mismo informe** que uno perfecto con
cero eventos. Un archivo vacío diría «ningún evento» donde lo cierto es «no se pudo mirar».

## Sin fecha de generación, y es deliberado

`AC-05` pide que `verify` compruebe la frescura. Estampar la fecha de hoy haría el archivo
irreproducible y `--check` fallaría **siempre** — que es la forma en que una comprobación de
frescura se apaga sola: nadie mira un rojo permanente.

Se declara el **rango de los datos** —`de 2026-08-13 a 2026-08-23`—, que se deriva y además dice
más: de cuándo a cuándo va lo medido.

## Lo que la matriz NO hace

- **No prioriza ni puntúa.** Eso es `FPGE` y tiene su propia fórmula.
- **No abre nada.** Propone enumerando; abrir lo decide una persona (`FPGE-R04`).
- **No clasifica.** La clasificación es la **entrada**, no la salida: es `PT-125`.
- **No cuenta menciones como instancias.** Contarlas inflaría la matriz con recurrencias que no
  ocurrieron.
