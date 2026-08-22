# Diseño — `PT-111`

```
tituloDerivado   `${a.id} · ${a.slug}`
tituloPublicado  el que trae la plataforma

difieren  ->  SUITE-R35, nombrando LOS DOS y el comando que lo corrige
iguales   ->  nada
vacio     ->  nada: sin titulo publicado no hay con que comparar
```

**Dentro de `compararEspejo`**, que es **pura y exportada** — se puede probar sin red, que es lo
que hace que el caso exista.

## Lo que no hace

**No corrige.** `abrir --aplicar` republica desde `PT-096`. Consultar el estado no puede modificar
el tablero.
