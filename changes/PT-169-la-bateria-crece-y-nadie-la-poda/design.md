# `PT-169` · `design.md` — `PHASE 4`

## 1. `seccionesConCaso(texto, patron)`

Derivada del **propio arnés**, como `seccionesAfectadas`. Y **peca de más** a propósito: compara
contra el **cuerpo entero** de la sección, así que una mención en un comentario la activa.

**La asimetría es deliberada.** Correr una sección de más cuesta segundos; saltarse la que tenía
el caso es un **falso verde**, y el falso verde se archiva mientras el falso rojo se investiga.

La comparación es **literal**, igual que el `case ... in *"$SOLO"*` del arnés: si aquí fuera regex
y allí literal, un patrón con un punto activaría secciones que luego no ejecutarían ningún caso —
y el resultado sería «0 casos» tras correr media batería.

## 2. `ACOTADO`, y por qué no reutilicé `AFECTADOS`

```
AFECTADOS   POR QUE se filtra   (git dice qué cambió)
ACOTADO     QUE las secciones están filtradas
```

Un solo nombre para las dos cosas es lo que impedía que `--solo` usara un mecanismo ya escrito.

## 3. `muta(archivo, orden…)`

```sh
antes="$(cksum < "$f")"
"$@"
despues="$(cksum < "$f")"
[ "$antes" = "$despues" ] && echo "SUITE-R61 · FIXTURE_HUECO: …" && return 1
```

Tres decisiones:

- **Distingue «no existe» de «no cambió»** (`RULE-02`). Son defectos distintos con arreglos
  distintos: el primero es un fixture mal montado, el segundo un caso hueco. Fundirlos mandaría a
  quien lo lee a buscar cuál de los dos era.
- **El mensaje cita su regla** (`SUITE-R53`). Sin el ID, quien lo vea tiene que deducir de dónde
  viene.
- **No juzga si la mutación es útil.** Eso no es mecanizable (`SUITE-R26`); que **ocurrió**, sí.

## 4. `audit` gana un tercer estado

Sabía decir `hueco` o `cubierto`. Una **adopción en curso** no es ninguna de las dos: no es un
hueco —hay mecanismo y funciona— ni está cubierta —faltan sitios—. Sin el tercer estado, la única
salida era mentir en alguna dirección: bloquear por algo que crece a propósito, o callarlo.

Se llama **`warn`** y no `avisa`: `regla.mjs` deriva quién comprueba una regla buscando `fail(` y
`warn(`. Un nombre propio habría dejado `SUITE-R61` como *«ningún verificador la emite»* — cierto
para la derivación y falso para el lector.

Y publica **`3 de 61`**, con denominador: un porcentaje esconde si el total creció.

## 5. Lo que este diseño NO resuelve

- **El suelo de 47 s.** Son 211 reconstrucciones de un árbol inerte. Hacerlas una vez exige saber
  **cuál depende de la frescura**: se intentó, el universo pasó de 1749 a **1730** casos, y se
  revirtió.
- **El ruido en `stderr`** de las corridas acotadas → `PT-171`.
- **La duplicación entre casos.** `AC-03` la declara; el barrido que la encuentre depende de
  `PT-167`, que corre después y sobre el árbol ya podado.
