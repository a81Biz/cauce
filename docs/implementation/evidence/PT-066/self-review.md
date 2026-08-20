# PT-066 — Autorrevisión   `PHASE 6`

## Qué se arregló

`definicionDe()` decidía por **mención**: devolvía la primera línea que contenía el ID y casaba
`HARD|SOFT`. **47 de 197 reglas mal.**

```
21  se declaraban INEXISTENTES  ← las 20 CHECK de RULES.md y las 15 EXEC-* en prosa
26  devolvian el texto de OTRA regla, bajo la cabecera «definida en RULES.md»
```

Las 26 son las peores: **no fallan, mienten con formato de respuesta correcta.** Es exactamente
lo que este mismo archivo tiene escrito veinte líneas más abajo, en un comentario de `PT-051`:

> *«Una linea equivocada y creible es peor que ninguna.»*

`PT-051` arregló ese patrón en `fallosPosibles`. `definicionDe`, en el mismo archivo, lo conservó.

## Y el mensaje acusaba

Cuando no encontraba, `regla.mjs` imprimía: *«ese mensaje apunta a una regla que no existe — y
eso es un defecto, no una laguna tuya»*. Con 21 falsos negativos, eso convertía **citas
correctas en acusaciones**.

Le pasó a este agente en `PHASE 0` de esta sesión: consultó `EXEC-R14`, `EXEC-R11` y `SUITE-R13`
—las tres existen— y las tres se declararon inexistentes. Fue el primer hallazgo del lote.

## El arreglo, y lo que costó verlo

Lo que distingue definir de mencionar es **una** cosa: la definición **empieza** por su ID. El
ancla `^` es todo el arreglo, y la severidad deja de ser criterio — era justo lo que dejaba
fuera `CHECK` y la prosa.

**Pero son dos formas, no tres.** Mi primera versión trató `LEXICON.md` como tabla, igual que
`RULES.md`, y dejó fuera **las `LEX-R` enteras**. Lo dijo comprobarlo contra `LEX-R26`, no
leerlo: `LEXICON.md` y `EXECUTION-MODES.md` definen en prosa porque lo que definen son nombres y
compuertas, no filas de un catálogo de componente.

**El formato de los documentos no se toca.** Cambiar `EXECUTION-MODES.md` para que la
herramienta lo parsee más fácil sería arreglar lo que está bien para no arreglar lo que está mal.

## El caso, y por qué no es una muestra

Recorre el universo **derivado** de los tres documentos propietarios y exige, por cada ID, **dos**
cosas:

```
d = definicionDe(ID)
d NO es null                       ← no lo declara inexistente
d.texto EMPIEZA por ese mismo ID   ← no devuelve el de otra regla
```

La segunda es la que faltaba. Sin ella, «devuelve algo» pasa por «devuelve lo correcto» — que es
exactamente cómo 26 reglas devolvían texto ajeno sin que nadie lo viera durante meses.

Y el universo se **deriva**, no se escribe: una lista a mano se queda corta en cuanto alguien
añade una regla (`SUITE-R53`).

## Lo que costó, y es la lección repetida

**Tres intentos para que el comprobador arrancara**, todos por lo mismo: escribí el andamiaje
sin mirar cómo lo resolvía el arnés.

1. `import` estático desde `process.env` — no es válido, hace falta `import()` dinámico.
2. Construí el `file://` en el shell — da una ruta MSYS que `node` no acepta como absoluta.
3. `trlib()` **ya resolvía esto desde `PT-058`**: pasa la ruta por entorno y la convierte con
   `pathToFileURL` **dentro** de `node`.

La solución llevaba dos años escrita treinta líneas más arriba en el mismo archivo. Mirarla
primero habría costado un minuto.

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Formas de definición | 3, una por documento | **2** — `LEXICON` y `EXECUTION-MODES` comparten la prosa |
| Casos | 6 | **2** — el que recorre el universo cubre `AC-01`..`AC-04` y `AC-06`; `E5` es la guarda |
| Intentos de andamiaje | 1 | 3 |

`AC-01`..`AC-06`, los seis verificados.
