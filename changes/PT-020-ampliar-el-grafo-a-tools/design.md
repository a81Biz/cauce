# PT-020 — Diseño   `PHASE 4`

## El alcance

```
scope: "bin, docs/methodology/tools"
```

Los dos sitios donde vive el código propio, tal como el `CLAUDE.md` §Estructura ya declaraba.
**Fuera** (`FND-R28`): dependencias, salida de compilación, `changes/`, `graphify-out/`,
`docs/enterprise-documentation/`, y `selftest.sh` —el grafo es de dependencias entre módulos y un
shell no las declara—.

## `pt_at_generation`

Se pone al **último PT integrado** en el momento de generar. Si se deja en `0`, el grafo nace
`STALE` el mismo día: `FDGE-R43` compara contra los PT estructurales integrados desde su
generación, y con `0` son todos.

Es el defecto que tiene hoy, y regenerar sin tocarlo lo repetiría.

## Las tres expectativas, y qué se hace si no se cumplen

Escritas en `strategy.md` **antes** de generar. Si el grafo no responde a alguna, va al
`self-review` como hueco declarado — **no se ajusta el alcance hasta que salga bonito**, que es
la forma de convertir esto en una casilla marcada.

## Lo que este diseño **no** hace

No versiona `graphify-out/` —`SUITE-R37` dice que es regenerable y su frescura vive en el
registro—, y no cambia `FDGE-R43`: la regla ya era correcta, lo que estaba mal era el alcance
sobre el que corría.
