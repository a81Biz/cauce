# PT-065 — Autorrevisión   `PHASE 6`

## Lo entregado

```
SESSION-<usuario>.json     la marca, una por persona
archivoSesion              pura · sin persona, SESSION.json
sesionesAjenas             pura · las de otros, sin la propia ni las sin persona
tracker sesion             la propia, y DICE que hay otras
LEXICON §6.2 y §6.5e       el contrato · sin regla nueva
casos                      955 → 977
```

## Lo que la marca hacía mal, y por qué era peor de lo que parecía

`SESSION.json` no tiene persona **y está versionado**. Las dos cosas juntas son el problema: la
marca de una persona no solo se pierde localmente — **se propaga**.

Reproducido:

```
$ git merge ana
CONFLICT (content): Merge conflict in SESSION.json
```

**Conflicto en cada merge**, en un archivo que no es trabajo sino mecánica transitoria. Y la
resolución obvia —quedarse con uno— **borra la sesión del otro**: a partir de ahí su precedente
sale de una marca que no es suya.

Es distinto del conflicto de `PT-062`: allí el daño era que **parecía pequeño**; aquí es ruidoso y
constante.

## Un archivo por persona, no un archivo con N sesiones

| | Conflicto en cada merge |
|:---|:---|
| Un archivo con `sesiones: [...]` | **Sí** — dos personas escriben el mismo archivo |
| **Un archivo por persona** | **No** — nadie toca el de nadie |

Misma lógica que `PT-062` con los identificadores: **evitar la colisión por construcción**, no
resolverla mejor.

## Y no contradice `LEX-R26`, dicho explícitamente

La forma se parece y el criterio es distinto. `CHECKPOINT.json` **es uno** porque responde por *la
tarea en curso*: escribirlo sobre otra la sustituye, y eso está bien. `SESSION.json` responde por
*una sesión*, y puede haber varias a la vez.

Lo dejé escrito en `LEXICON`, en el `spec-changes` y en el `out-of-scope` porque es exactamente el
tipo de parecido que produce una regla mal aplicada dos lotes después.

## Lo que no hizo falta tocar

`sesionDe` y `handoffDeSesion` (`PT-060`) son **puras y reciben la marca**: no la leen. Y el
filtrado de lo que la sesión deriva ya lo hizo `PT-064`.

Esta tarea cambia **de qué archivo sale la marca**, y añade que las ajenas se vean. Poco código
para el problema que resuelve, y eso es señal de que las cuatro anteriores dejaron las piezas en su
sitio.

## Lo que no queda comprobado

**Que dos personas trabajen a la vez de verdad.** El conflicto está reproducido y esto lo evita por
construcción — pero la sesión ajena de la evidencia está **simulada** escribiendo el archivo a
mano.

**Que las sesiones ajenas se miren.** Se enseñan; que alguien las lea no se comprueba — y si no se
leen, dos personas seguirán sin entender por qué sus cifras no cuadran, que es justo lo que `AC-06`
intenta evitar.

**Que no se acumulen archivos.** Son uno por persona, no uno por día. El de alguien que deje el
proyecto se queda, y borrarlo sería decidir por él. Es un archivo, no un problema — pero nadie ha
vivido con esto el tiempo suficiente para saberlo.
