# Strategy — `PT-096`

> `PHASE 3`. Derivada de `discovery.md`; no lo contradice. Los criterios de éxito salen de los
> `AC-nn` del intake, no de aquí.

---

## 1. Objetivo

Que **el issue lleve al intake**, y que si alguna vez no puede, **algo lo diga** — en vez de
publicar una ruta muda con un `null` dentro y un espejo que declara «cuadra».

---

## 2. Solución

Cinco cambios, cuatro en `tracker.mjs` y uno en la documentación. Ninguno toca una regla: los
cuatro primeros hacen cumplir `SUITE-R51` y `SUITE-R56`, que ya existen.

### S-1 · La nota que explica el enlace no se emite si no hay enlace `AC-02`

`cuerpoDeIssue:470-475` emite *«El enlace apunta a `X`»* en la rama `else` sin comprobar que `X`
exista. Se condiciona a que haya enlace, y en su lugar se dice **qué hacer**:

```
sin ref durable:
  «Todavía no hay ref durable que lo contenga: el intake aún no está en ningún commit.
   Aparecerá en cuanto se integre — y si no, `tracker abrir --aplicar` lo republica.»
```

`PT-048` arregló **esta misma contradicción** en la rama hermana (`hayDirectorio === false`). Esto
es aplicar su arreglo donde faltaba, no uno nuevo.

### S-2 · La reparación alcanza al cuerpo que **no** enlaza `AC-04`

`repararEnlacesMuertos:1194` hace `if (!ref || refExiste(ref)) continue;`. Se separan los dos
casos, que no son el mismo:

```
ref presente y muerto     -> reparar          (lo de hoy)
ref ausente, y AHORA hay ref durable  -> reparar   (lo que falta: 8 de los 10)
ref ausente y sin ref durable         -> no tocar y DECIR que consta
```

Para no reescribir un issue que no es del tracker, «cuerpo del tracker» se reconoce por el
marcador que la propia función escribe: `Intake, criterios de aceptación y evidencia:`. Sin ese
marcador no se toca nada.

### S-3 · El espejo reporta el enlace **ausente** `AC-03`

`compararEspejo:208` lleva la misma guarda `ref && …`. Se añade el caso simétrico: **si el cuerpo
no enlaza y hoy existe un ref durable, es una divergencia** entre el registro y la plataforma
(`SUITE-R51`).

`compararEspejo` es una función pura y debe seguir siéndolo: hoy recibe `refExiste` inyectado, y
recibirá también `refDurable` por la misma razón —que el arnés pueda probarla sin git ni
credenciales—. Es el patrón que `PT-079` ya estableció en este archivo.

**Cuándo dispara, y por qué está bien:** no dispara en `PHASE 1` recién abierto el issue, porque
entonces no hay ref durable y no hay nada que enlazar. Dispara **en cuanto el intake entra en un
commit** y el cuerpo sigue mudo — que es exactamente el momento en que se puede arreglar. Y como
`npm run verify:espejo` corre en CI sobre la rama de trabajo, donde el espejo **bloquea**
(`SUITE-R47`), el caso deja de depender de que alguien mire.

### S-4 · Un lote se reconoce por su **ID**, no por un `type` que `LEXICON` no declara `AC-08`

`esLote = a?.type === 'EP'` y el registro guarda tres valores: `EP` (16), ausente (2), `EPIC` (1).
Se cambia por el hecho que `LEXICON` **sí** declara —`EP-NNN` es el identificador de un lote— y
que este mismo archivo ya usa en `indices()`:

```js
const esLote = /^EP-/.test(String(a?.id ?? ''));
```

**Y en el mismo acto se retira la lista `Tareas de este lote:`**, que es la parte contraintuitiva
y la que la medición ordena:

```
14 issues de lote la llevan hoy en prosa
PT-035  «una tarea es SUB-ISSUE de su lote, NO un enlace en su cuerpo»
SUITE-R51 (HARD)  la jerarquia es estructura, no prosa
```

`PT-035` añadió el anidamiento y **no retiró la copia narrada**. Que `esLote` fuera falso para los
tres últimos lotes estaba **tapando** una violación de `SUITE-R51`, no causándola. El anidamiento
real funciona —`PT-096 #191 → sub-issue de EP-019 #189`, verificado—, así que la prosa sobra.

Queda la cabecera `**Implementación abierta** · <título>`, que es información del lote y no una
segunda representación de la jerarquía.

### S-5 · Queda escrito donde una persona lo busca `AC-07`

```
CASOS-DE-USO.md  C5 pasa de «¿sigo pudiendo rastrear una tarea cerrada?» a cubrir las DOS
                 formas de perder el rastro: el enlace que MURIO y el que nunca existio
MANUAL.md        la nota del paso 4 dice hoy que el enlace apunta a un ref durable; se
                 añade que puede no haberlo TODAVIA, y que entonces se republica
RULES.md         SUITE-R51 se cita, no se modifica. Ya dice lo que hace falta
```

**`README.md` y `CLAUDE.md` NO se tocan, y va con motivo** — `PT-079` estableció que un arreglo
que no llega a los cinco sitios caduca, así que la omisión se declara en vez de ocurrir:

- `README.md` es la puerta de entrada al **repositorio** —qué es cauce, cómo se instala— y no
  describe la operación del tablero en ningún punto (`0` menciones al enlace o al issue). Añadir
  ahí la mecánica de republicar un cuerpo sería la primera.
- `CLAUDE.md` **parametriza y no legisla** (`SUITE-R00`). Su sección `Verificación` lista los
  comandos que deciden, y `npm run verify` —que ya incluye `verify:espejo`— **ya está**. Con
  `S-3`, el caso queda cubierto por un comando que el documento ya nombra: no hace falta una
  línea nueva, y añadirla sería enunciar una obligación donde `SUITE-R00` dice que no se enuncian.

---

## 3. Alternativas evaluadas

### A-1 · Exigir el commit **antes** de abrir el issue, en `PHASE 1` — **rechazada como única**

Es lo que hice a mano en esta tarea y funcionó: `#191` nació con enlace. Pero deja el resultado
colgando del **orden que use quien trabaje**, que es lo que `PT-079` acaba de quitar de en medio,
y no arregla los 10 ya publicados.

**Se recoge lo bueno sin la dependencia**: `S-3` hace que, si el orden fue el otro, la CI lo diga.
Y `S-5` documenta el orden bueno en el `MANUAL` como recomendación, no como requisito — porque una
recomendación que la máquina verifica es una recomendación que se puede ignorar sin daño.

### A-2 · Que `espejo` **reescriba** el cuerpo cuando lo vea mudo — rechazada

Cerraría el caso sin intervención, y es tentador. Se rechaza por dos motivos:

1. `espejo` es **lectura** y es lo que corre en CI. Un verificador que escribe en la plataforma
   convierte cada corrida de CI en una escritura, y un fallo a mitad deja el tablero en un estado
   que nadie pidió.
2. Es el patrón que `SUITE-R47` ya delimitó: el espejo **informa donde no decide**. Escribir es de
   `abrir --aplicar`, que es explícito.

### A-3 · Volver al respaldo `ramaTrabajo, o main` cuando no hay ref durable — rechazada

Es `OUT` en el intake y con razón: **es literalmente lo que producía los 14 enlaces muertos** que
`PT-079` arregló. Un enlace que da 404 es peor que una ruta sin enlace (`RULE-06`).

### A-4 · Declarar el `type` canónico de un lote en `LEXICON` dentro de esta tarea — **aplazada a `L-3`**

Era la salida evidente al hueco de vocabulario, y `S-4` la vuelve innecesaria **para esta tarea**:
derivar de `EP-` usa un nombre que `LEXICON` ya declara, así que el arreglo no depende de una
decisión de vocabulario que no está tomada.

El hueco **sigue existiendo** —tres valores para el mismo hecho en el registro— y es material de
`L-3`, *un hecho un nombre*, que es su dueña. Se declara aquí para que no se descubra dos veces.

---

## 4. Dependencias y riesgos

```
DEP  ninguna con L-1..L-8. L-1, L-2 y L-3 tocan tracker.mjs y estan SERIALIZADAS
     detras de esta por el analisis de solapamiento del lote

RIE-1  patrones.mjs lo importan ocho herramientas y la bateria completa son 1229
       casos (~10 min). Esta tarea NO toca patrones.mjs, asi que la bateria parcial
       sirve; la completa se corre igual antes de G3

RIE-2  S-2 reescribe el cuerpo de 8 issues CERRADOS. Reescribir un cuerpo no cambia
       el estado de un issue —es dato derivado del registro (SUITE-R35)— y PT-079 ya
       lo hizo con 26. Riesgo bajo y precedente medido

RIE-3  S-4 retira texto de 14 issues publicados. Es la parte que puede parecer una
       REGRESION al mirarla, y por eso va con su medicion en el mensaje del commit y
       en HISTORY: no se pierde informacion, se retira la copia; la jerarquia real
       sigue en el arbol de sub-issues

RIE-4  el «marcador de cuerpo del tracker» de S-2 es una cadena literal. Si alguien
       cambia el texto de cuerpoDeIssue, la reparacion deja de reconocer sus propios
       cuerpos EN SILENCIO. Se cubre con un caso de bateria que ata las dos cosas
```

## 5. Análisis de regresión — `FDGE-R12`

```
cuerpoDeIssue        lo usan abrir(), sincronizarCuerpos() y repararEnlacesMuertos().
                     Casos vivos de PT-036, PT-048 y PT-079 lo cubren: se espera que
                     SIGAN pasando, y si alguno cae se mira antes de tocarlo — es lo
                     que PT-079 documento («el sexto CAMBIA DE SENTIDO»)

compararEspejo       funcion pura con arnes propio. Añadir un parametro inyectado
                     sin valor por defecto romperia a sus llamadores: se añade con
                     el mismo patron que refExiste, que ya es opcional

esLote               afecta al cuerpo de 19 lotes. Los 14 con lista pierden la lista;
                     los 3 recientes ganan la cabecera correcta. Se mide ANTES y
                     DESPUES sobre el tablero, no sobre la intencion
```

## 6. Criterios de éxito — derivados de los `AC`

```
AC-01 AC-02   ningun cuerpo publicado contiene «null»; 0 rutas mudas con ref durable
AC-03         espejo reporta el caso, y BLOQUEA en la rama de trabajo
AC-04         los 8 terminales reparados
AC-05         medido sobre el tablero COMPLETO, con denominador
AC-06         la bateria falla SIN el arreglo — tres casos, uno por punto
AC-07         C5 y MANUAL escritos; README y CLAUDE.md declarados con motivo
AC-08         19 de 19 lotes con cabecera correcta y 0 con lista en prosa
AC-09         NO se cumple aqui: se declara y pasa a L-3
```

## 7. Autorrevisión

- **¿Contradice algo el intake?** No. Amplía `AC-08`/`AC-09` por la Revisión 1, que es material
  del agente y va al `CHALLENGE`, ya resuelto.
- **¿Alguna regla violada?** `S-4` retira texto de issues publicados: `SUITE-R09` es append-only
  para el **repositorio**, no para el cuerpo derivado de un issue, que `SUITE-R35` declara
  espejo del registro. `PT-079` reescribió 26 con el mismo criterio.
- **¿Algún `AC` sin cubrir?** `AC-09`, declarado y trasladado. Los ocho restantes tienen su
  cambio y su caso.
- **¿Dependencia no declarada?** `S-3` necesita que `refDurableDe` sea accesible desde donde se
  construye la comparación. Hoy lo es: `PT-079` ya lo extrajo por esa razón.
