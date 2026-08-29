# `PT-198` · `test-scenarios.md`

## `TS-01` — un `status` con comentario en línea **se lee**   → `AC-01`

```
DADO   un intake cuyo frontmatter dice «status: READY   # G1 CHALLENGE aceptado»
CUANDO el tracker sincroniza su estado
ENTONCES lo lee, y el comentario SIGUE AHI despues de escribir
```

Que sobreviva el comentario es parte del escenario, no un extra: un lector que lo lea y un escritor
que lo borre cambian un defecto por otro.

## `TS-02` — un intake **sin** el campo sigue fallando   → `AC-02`

```
DADO   un intake sin linea «status:»
CUANDO el tracker sincroniza
ENTONCES falla, y dice que el campo NO ESTA
```

**Es la pareja que impide arreglarlo en la dirección peligrosa.** Sin `TS-02`, `TS-01` lo cumple un
lector que acepte cualquier cosa.

## `TS-03` — los dos casos dan mensajes **distintos**   → `AC-03`

```
DADO   los dos intakes de arriba
CUANDO fallan
ENTONCES el ausente dice «no declara» y el ilegible dice «no se pudo leer» CON su linea
```

## `TS-04` — la expresión vive en **un** sitio   → `AC-04`

```
DADO   el arbol de tools/
CUANDO se cuentan las expresiones ancladas «^campo:…$» sobre el frontmatter
ENTONCES no queda ninguna suelta: las siete pasan por patrones.mjs
```

## `TS-05` — y los otros tres campos también   → `AC-01` · `AC-04`

```
DADO   un intake con comentario en «phase», «type» y «epic»
CUANDO el tracker los lee
ENTONCES los tres se leen
```

Sin `TS-05`, `AC-04` lo cumple un sitio único **que sólo usa `status`** — que es exactamente el
`CE-007` que esta tarea persigue: la herramienta correcta existe y nadie la invoca.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **No se promete que el frontmatter sea YAML válido**: se cubre el escalar con comentario, que es
  el caso medido. Un parser completo es otra decisión y otro coste.
- **Los casos plantan el comentario en un fixture**, no lo buscan en el árbol. Buscarlo acusaría a
  este mismo documento, que lo cita — es `CE-017`, y `PT-193` ya pagó esa lección.
