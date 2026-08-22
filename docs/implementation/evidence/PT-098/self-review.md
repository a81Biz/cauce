# PT-098 — Autorrevisión `PHASE 6`

## Mi primer diseño rompía otra regla, y lo dijo leerla

Escribí que `avanzar` debía **negarse** a escribir `INTEGRATED` sin merge. Es lo obvio y está mal:
`SUITE-R46` exige el orden contrario —*«apuntar el estado terminal en la rama de trabajo, mergear,
y cerrar después»*—. Negarse haría imposible lo que otra regla obliga.

Parecía un choque de reglas, de los que `PT-029` construyó un detector para encontrar. **No lo
es.** `LEXICON` §5.1 ya distingue `DONE` —«terminado, esperando `G4`»— de `INTEGRATED` —«mergeado
a la línea principal»—, y `FDGE-R34` confirma que **`G4` exige `DONE`**.

Así que el comando llevaba escribiendo **el estado equivocado**, no uno falso. Y eso reencuadra la
tarea entera: no hay que impedir nada, hay que **escribir lo cierto**.

El detector de `PT-029` no habría encontrado esto, y conviene decir por qué: no hay dos textos en
conflicto. Hay un texto y un comando que no lo sigue.

## Tres valores, no dos, y el tercero es el que evita un rojo inarreglable

```
true    su changes/ esta en la principal
false   esta en la de integracion pero NO en la principal
null    no se puede saber  ->  SIN EVALUAR
```

Con dos valores, el `false` tendría que cubrir «no está» y «no lo sé». La segunda produce rojos que
nadie puede arreglar: un clon superficial, un `origin` ausente, una rama sin traer. **`PT-056` pagó
dos veces por eso** — comprobaciones verdes en local y rojas en CI por el entorno, no por el hecho.

Y se ve en datos reales: `PT-097` marcado `INTEGRATED` sale **`SIN EVALUAR`**, no en rojo, porque
su directorio vive en una rama sin fusionar. Afirmar «no integrado» ahí sería acusar sin mirar.

## Los 91 se midieron **antes** de diseñar

```
INTEGRATED en el registro   91
  en verde                  91
  en rojo                    0
```

Si alguno hubiera salido falso, el intake tendría que decir qué se hace con él. **No lo dice
porque no hay ninguno**, y eso se comprobó antes de escribirlo — no después, para no descubrir a
mitad que el arreglo abría deuda.

De las 91, **58 no declaran rama**. Eso hacía parecer inviable la comprobación, y era falso: el
contraste pregunta por el **directorio**, reutilizando el mecanismo que `PT-096` construyó esta
misma sesión. Alcanza a las 91.

## Dos casos protegían el defecto

`:5202` y `:5204` afirmaban que llegar a la última fase marca `INTEGRATED`. En ese fixture **nada
se ha mergeado**, así que ese `INTEGRATED` era falso y el caso lo celebraba.

No se hicieron pasar. Se invierten con su motivo, y **se conserva lo que sí probaban**: que
`avanzar` escribe el estado terminal en las **dos** fuentes —registro y YAML—, que es de lo que
nació `PT-089`. Sólo cambia **cuál** escribe.

Van **cinco** casos así en este lote. Ya no es una anécdota: es que un arreglo anterior deja tests
que documentan el estado anterior, y nadie vuelve a mirarlos hasta que el siguiente los rompe.

## El freno que faltaba

Añadí `chkno "…y sin merge NO afirma INTEGRATED"`. Sin él, **«escribir siempre `DONE`» pasaría los
dos casos corregidos** — y sería peor que el defecto, porque nada llegaría nunca a `INTEGRATED`.

Es la misma forma que `TS-02`: por cada positivo, el negativo que impide la solución degenerada.

## Cuarta rotura de escapado

Un `replace(/\/g, '/')` pasó por una transformación de texto y quedó como `/\/g` — un regex sin
cerrar. **La solución no fue escaparlo mejor: fue quitarlo.** La ruta se compone con `/` desde el
principio, que es lo que git necesita en una referencia `rama:ruta`.

Cuatro roturas de escapado en esta sesión. La lección acumulada es que **el escape que no existe no
se rompe**.

## Lo que no hice

**No toqué la exención de lo terminal en las seis comprobaciones.** Existe para no exigir bitácora
retroactiva a lo integrado antes de la `5.1.0`, y quitarla pondría en rojo todo repositorio con
historia. **Falla el dato, no la exención** — y arreglar el dato las arregla las seis.

**No auditè los 22 usos de `ESTADOS_TERMINALES`.** Seis en `verify-fdge` están contados —`INC-011`
contó cinco, las que alcanzaban a *sus* dos tareas—; los de `tracker` y `patrones` no. Va
declarado.

**No cambié qué ejerce `--all`.** `--gate G4` sí caza este caso; `--all` no. `INC-010` lo llama
«cada compuerta es una revisión sorpresa». Cambiarlo afecta a todas las compuertas y merece su
propia medición.
