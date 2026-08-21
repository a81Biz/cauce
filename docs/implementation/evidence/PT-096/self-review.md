# PT-096 — Autorrevisión `PHASE 6`

## Lo primero fue comprobar la premisa, y era falsa

El firmante escribió que *«los `.md` no están publicados en github»*. Antes de aceptarlo, `git
ls-tree origin/trabajo`: **el `intake.md` está**, y de los cuatro directorios que contrasté, tres
están además en `main`. No se había dejado de subir nada.

Lo que falta es el **enlace en el issue** — que es el único camino que una persona recorre, así
que la consecuencia que observó es exacta aunque la causa que supuso no lo sea.

Va en `§14` del intake y **no reescribí `§1`**: `INTAKE-R01` prohíbe que el agente corrija lo que
declaró el humano. Es la diferencia entre registrar un desacuerdo y borrarlo.

La otra mitad de su diagnóstico —*«en algún punto se cambió»*— era **correcta y medible**: los 11
cuerpos rotos son los 11 issues abiertos desde el 2026-08-19, fecha en que `PT-079` cerró midiendo
«0 de 85 rotos». Los 92 anteriores enlazan. Once de once no es una muestra: es la población.

## El arreglo evidente era el equivocado, y lo dijo medir

`esLote` fallaba para los tres últimos lotes, así que el issue de un lote no publicaba su lista de
tareas. Lo obvio: hacer que la lista salga.

Conté cuántos issues la llevan hoy: **14**. Y fui a ver qué decía `PT-035`, que la introdujo…
salvo que no la introdujo: la **declaró defecto**. *«Una tarea es SUB-ISSUE de su lote, NO un
enlace en su cuerpo: un enlace es texto, no da progreso, no cierra en cascada y no sale en el
árbol.»* `SUITE-R51` lo hizo regla `HARD`.

`PT-035` añadió el anidamiento —que funciona; lo verifiqué: `PT-096 #191 → sub-issue de EP-019
#189`— y **no retiró la copia narrada**.

**Que `esLote` fuera falso estaba tapando una violación de regla, no causándola.** Arreglar el
predicado sin más habría propagado la violación a tres lotes más, creyendo corregir un defecto.

Es lo más útil que tiene esta tarea, y no salió de razonar: salió de contar catorce.

## La decisión que tomé ya estaba tomada

Escribí en `PHASE 3` que un lote debe reconocerse por su ID y no por `type`. Al buscar dónde
ponerlo, `patrones.mjs:859`:

> *«Lo escribí primero con `type === 'EP'` y no casó NINGUNO: `EP-017` no tiene ese campo. El ID
> lo asigna el registro y siempre está; el campo es opcional, así que fiarse de él es depender de
> dos fuentes del mismo hecho y quedarse con la peor (`SUITE-R38`).»*

Mismo razonamiento, misma cita, escrito antes por alguien que tropezó con lo mismo. **Mi `D-1` no
era un hallazgo: era la segunda copia** — justo lo que ese comentario condena.

Se exporta desde ahí. La lección no es «reutiliza código»: es que **redescubrir cuesta lo mismo
que descubrir y encima no se nota**, y sólo se detecta yendo a buscar dónde poner una cosa en vez
de ponerla donde toca.

## Un cambio que compila, corre y miente

Al borrar `const esLote = a?.type === 'EP';` de `cuerpoDeIssue`, la expresión `esLote ? …` pasó a
referirse a la **función importada**. Siempre truthy. `PT-96` se publicó como
`**Implementación abierta**`.

No hay error de sintaxis, no hay excepción, no hay aviso. Sustituir una variable booleana por una
función del mismo nombre es un cambio invisible al leer el diff — el diff sólo muestra la línea
**borrada**, no las que cambiaron de significado.

Lo cazó **ejecutar la aserción del encabezado**. Si hubiera confiado en la lectura, habría
publicado 99 issues mal etiquetados.

## El arreglo llevaba dentro el defecto que arregla

`repararEnlacesMuertos` anuncia lo que hace:

```js
notas.push(`${a.id} #${a.issue}: se repararia el enlace «${ref}» -> «${durable}»`);
```

Para el cuerpo **mudo**, `ref` es `null`. El mensaje habría escrito `«null»` — dentro del arreglo
del `null`.

Es la tercera vez en este repositorio: `PT-095` metió el byte `0x08` en el comentario que advertía
del byte `0x08`. **La zona más peligrosa de un arreglo es el texto con el que se anuncia**, porque
nadie la revisa con el mismo cuidado que la lógica.

## Dos casos de la batería protegían el defecto

`:1787` afirmaba que el cuerpo dice «donde el contenido existe ahora» **sin** ref durable — el
`null` con un test verde encima. `:1614` afirmaba que la lista en prosa se emite.

No los hice pasar. Se invierten, con su motivo escrito al lado. **Un caso que codifica el defecto
no es una red de seguridad: es el defecto con un test que lo protege**, y hacerlo pasar habría
sido el camino más rápido a un verde falso.

De cada uno conservé la mitad que sí valía: el orden de apertura sigue importando —el lote se crea
después que sus tareas para que el **anidamiento** las encuentre—, así que reescribí el *porqué*
en vez de borrar la regla. Un orden correcto con un motivo caduco es el que alguien quita el día
que lee el motivo y no lo encuentra.

## Diez rojos válidos, y seis que no lo son — dicho, no disimulado

`FDGE-R17` pide que el rojo falle **por su aserción**. Los seis casos de `decisionDeEnlace` no
podían: la función no existía, así que su fallo era «la herramienta reventó», que este arnés trata
—con razón— como «no verifica nada».

**Son especificación de comportamiento nuevo, no reproducción del defecto**, y va escrito en el
propio `selftest.sh`, no en un comentario de este documento. La reproducción de `AC-04` se mide
donde sí se puede: sobre el tablero real.

Y un caso mío **habría pasado hoy por el motivo contrario al que lo justifica**: `TS-04` sin
`type:'EP'` en el fixture no es un lote, la lista no se emite y `trlibno` da verde. Lo vi
ejecutándolo. Un caso que no puede fallar no prueba nada — la forma barata de «una inversa que
sale en cero».

Otro pasaba con la **divergencia equivocada**: sin etiquetas en el fixture, `compararEspejo`
devolvía un `SUITE-R35` espurio, así que el caso habría seguido verde el día que el cuerpo mudo
dejara de detectarse.

## La inversa, y lo que enseñó de más

Cinco retiradas, ninguna en cero. Pero el dato que importa no es ése:

```
D-11 · decisionDeEnlace   caen 3  ·  y una es «el espejo ve el cuerpo mudo»
```

**Si retirar la decisión sólo hubiera hecho caer sus tres casos propios, significaría que el
espejo conservaba su copia de la guarda** — que es exactamente lo que se venía a quitar. Que
arrastre a `S-3` es la prueba de que hay una sola fuente, no ruido.

## Lo que encontré ejecutando y no arreglé

`tracker asignar` crea la allocation **sin `phase`**, y `avanzar` hace `Number(undefined)` → `NaN`,
con lo que `destino !== actual + 1` es siempre cierto. **Ninguna tarea creada por `asignar` puede
avanzar**, y `asignar` es el único camino que `PHASE 1` autoriza para pedir un identificador.

No había saltado porque `asignar` entró en `PT-062` y `PT-096` es la **primera** allocation que se
crea con él. Escrito, documentado, verificado y nunca ejecutado — la `FAMILIA C` de `PT-079`.

Lo desbloqueé escribiendo `phase: 1` a mano, **una vez**, con su excepción declarada en
`SESSION_LOG.md`. No lo arreglé: el out-of-scope no lo cubre y ampliarlo es el error que `EP-017`
pagó dos veces.

## Y caí en `SUITE-R34` con el aviso delante

CI en rojo: toqué `changes/` sin volver a sellar el `HANDOFF`. El bloque `no hacer` de ese mismo
archivo lo lleva escrito **dos veces**, una de ellas diciendo «pasó CUATRO veces».

Leerlo no basta. Es el argumento entero de `INC-017` y de `L-7`: lo que falta no es una
advertencia mejor, es que el acto que escribe en `changes/` **estampe**, como hace `avanzar`.
