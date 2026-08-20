# PT-079 — Autorrevisión   `PHASE 6`

## Qué se entrega, en tres cifras

```
ENLACES DEL TABLERO      20 de 40 rotos   ->   0 de 85
PROYECCION · SHA         columna vacia    ->   el SHA del contenido
LOS CINCO SITIOS         0 de 5           ->   5 de 5
```

## Familia A · la trazabilidad

**Corregí mi primer diagnóstico antes de escribir código.** Dije que se perdía la documentación
y es falso: `changes/PT-075/` tiene sus 10 archivos en `trabajo`. **Lo que muere es el enlace.**
La distinción decidió el arreglo — no hay que salvar los `.md`, hay que apuntar a algo que no
desaparezca.

Dos defectos, no uno:

| | Qué | Evidencia |
|:---|:---|:---|
| `A-1` | El enlace salía de **la rama donde corría el espejo** | el issue de `PT-072` apuntaba a la rama de `PT-074` |
| `A-2` | Y esa rama se borra al fusionar (`FDGE-R19`) | 14 de 16 con 404 |

**Y la rama que el firmante recordaba existía.** `LEXICON` §6.5 la describe desde `PT-054`,
`tracker proyectar --publicar` funciona, y **nunca se ejecutó**. Su columna `SHA` estaba además
vacía justo para las tareas de `PHASE 1`–`4`: el registro pensado para ser durable no estaba
registrando lo durable.

## Familia B · las guardas, y lo que aprendí escribiéndolas

Tres guardas: `inversa()` **aborta**, y dos lints **avisan** —7 aserciones sospechosas y los
helpers mal colocados—.

**Escribiéndolas cometí tres veces lo que detectan.** No es anécdota: es la medida de que el
problema es real y no de descuido puntual.

1. **El caso de `inversa` pasaba en verde con el helper sin escribir.** El `if` fallaba porque
   la orden no existía y devolvía `ABORTA`. Es el falso verde que la tarea persigue, cometido al
   escribirla. Lo cazó ejecutarlo **antes** de implementar — que es justo para lo que sirve
   `FDGE-R17`, y la primera vez en el lote que ese orden me sirvió de algo.
2. **`lint_helpers` se acusó a sí mismo por sus propios comentarios** — familia `PT-051`.
3. **Y después por la línea que declaraba su lista de helpers.**

Las tres se resolvieron **anclando el «uso» en la invocación de caso**, en vez de ir tapando
cada autorreferencia por separado. Tapar la primera me llevó a la segunda; cambiar el criterio
las cerró las dos.

## Familia C · por qué las otras dos no bastaban

`PT-075` demostró que una regla sin verificador no ocurre. La proyección lo demuestra mejor:
**estaba diseñada, escrita, implementada y documentada en `LEXICON` — y nunca se ejecutó.**

Comprobado antes de tocar nada:

```
CORE.md · PHASES.md   0     verify-fdge   0     CASOS-DE-USO   nada     MANUAL   nada
```

`SUITE-R56` entra en los cinco. **Los cinco son un criterio, no cinco**, y si uno faltara el
arreglo caducaría igual que caducó el de `PT-054`.

## `AC-03` lo di por cumplido con una medición parcial

Es el error más serio de la tarea y lo encontró **rehacer la medición en `PHASE 9`**, no una
comprobación. Medí «0 de 17» sobre los issues **vivos** de `EP-017` y lo escribí como si fuera
el tablero. Medido completo seguían **20 de 40 rotos** con el arreglo ya puesto.

El motivo es la propia regla del revés: `sincronizarCuerpos()` recorría sólo las vivas — y una
tarea viva **tiene** su rama, así que su enlace funciona. **El que se rompe es el de la tarea
cerrada**, que es exactamente aquella para la que existe `SUITE-R56`. Había arreglado la
podredumbre futura sin tocar un solo cuerpo ya publicado.

`repararEnlacesMuertos()` sólo reescribe si el ref publicado ya no resuelve y sólo si hay uno
durable; si no lo hay, lo dice en vez de inventarlo (`RULE-06`). **26 issues reparados, y la
segunda pasada no repara ninguno.** Medición final: **0 de 85**.

Y un segundo error dentro del mismo: mi script de medición cortaba el ref en la primera barra
cuando `FDGE-R19` le da tres segmentos. Devolvía `fix` o `chore` y **acertaba el veredicto por
casualidad**. Un extractor que corta de menos no falla — es la misma forma de error que esta
tarea persigue, cometida al medirla. Cubierto con un caso de ref de tres segmentos.

## Dos errores de ubicación, y uno que se repite

**Puse la comprobación del enlace en `verify-fdge`**, con funciones que no existen ahí. Su sitio
es el **espejo**: un enlace que ya no abre es una divergencia entre el registro y la plataforma
(`SUITE-R35`). Revertido y reubicado.

**Y seis casos previos de `PT-036` y `PT-048` cayeron.** No los hice pasar: revisé cada uno.
Cinco sólo cambian de dónde sale el ref —su intención se conserva—. El sexto **cambia de
sentido** y es el núcleo del arreglo: «sin saber la rama, cae en la principal» era literalmente
lo que producía los enlaces muertos.

`PT-036` arregló el 404 **al empezar**; `PT-079` arregla el 404 **al terminar**. Los dos tenían
razón, y `refDurable` es la síntesis.

**Cuarta vez en el lote insistiendo en generar archivos con scripts** —heredocs rotos, backticks
anidados, `CRLF`, saltos literales—. Cada vez la solución fue escribir el archivo directamente.
Lo que me lleva al script es que *parece* más rápido, y nunca lo es.

## Lo que NO se verifica, y está declarado en `TD-16`

Que un caso se viera **en rojo antes**, que una aserción **case con la salida real**, y que las
7 sospechosas sean de verdad malas. Los tres se declaran con su motivo en vez de fingir que las
guardas los cubren: cubren tres síntomas de `FDGE-R17`, no la disciplina.

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Sitio del verificador | `verify-fdge` | **el espejo** — lo dijo intentarlo |
| Casos previos tocados | 0 | **6**, revisados uno a uno |
| Columnas de la proyección | 1 SHA | **2** — rama y contenido, con semánticas distintas |

`AC-01`..`AC-12`, los doce verificados. `selftest` 1024 → **1042**, cero fallos, y `PT-076` sin
regresión.
