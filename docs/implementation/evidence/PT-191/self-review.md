# `PT-191` · self-review

## Lo que se sostiene

- **`AC` verificados: 4, ninguno huérfano.** Cada uno cita su `TS` y su caso ejecutable, y no hay
  escenario sin `AC` (`FDGE-R15`).
- **Comprobación inversa HECHA, no afirmada** (`inversa.txt`). Sobre el **mismo** fixture, el
  código anterior llega a «`--aplicar` escribe `SELLOS.json`» tanto **sin recibo alguno** como con
  un recibo que dice `HAY FALLOS`. Los cuatro casos no pasan con el código anterior: no miden el
  arreglo por casualidad.
- **`AC-04` existe porque los otros tres no bastan.** `AC-01` a `AC-03` los pasa entero un sellador
  que se niegue **siempre**. Sin el cuarto, el arreglo podría estar roto en la otra dirección y los
  tres seguirían verdes.
- **Código = design.** El cambio está donde `strategy.md` dijo: el veredicto sale del recibo, el
  recibo lo escribe la corrida completa, y `--verde` sigue siendo la decisión.
- **Sin credenciales ni datos personales** (`FDGE-R45`). Los recibos de los fixtures son sintéticos.
- **Convenciones** (`11-Conventions.md`): sin `debug`, sin restos, sin números escritos a mano.

## Cinco defectos, y los cinco los destapó EJECUTAR, no leer

Esto es lo más importante de esta revisión, y por eso va entero.

### Tres en el código que la sesión anterior dejó escrito sin correr

1. **`sellar-bloques.mjs` no honraba `MTH_RAIZ`.** Los tres casos le plantaban un recibo en un
   árbol sintético que la herramienta **nunca habría leído**: miraba el repositorio real. `TS-01`
   habría pasado **por el motivo equivocado** y `TS-02` y `TS-03` habrían fallado.
2. **El recibo iba DESPUÉS del recuento final**, y `selftest.sh:7284` busca el recuento con
   `tail -4` sobre el propio fuente.
3. **El fixture no tenía `package.json`.** El sellador lee de ahí qué MAYOR está vigente
   (`sellar-bloques.mjs:60`) y **reventaba** antes de mirar el recibo.

### Y dos MÍOS, en la primera versión de este arreglo

4. **La ruta del recibo era RELATIVA** (`$(dirname "${BASH_SOURCE[0]}")/../../implementation/…`).
   El arnés hace `cd "$WORK"` en el shell **principal** (`selftest.sh:1159` y `:3019`), así que al
   llegar al final el directorio de trabajo ya no es el repositorio. **La corrida completa de 1923
   casos terminó sin escribir recibo y NADA lo dijo**: la guarda `[ -d … ]` era falsa y el bloque
   se saltaba en silencio. El silencio parecía éxito — que es literalmente el defecto que esta
   tarea arregla, cometido dentro de su propio arreglo. Ahora usa `$RAIZ` y `$SUITE`, absolutas
   desde `selftest.sh:17`.
5. **El bloque se insertó en el sitio equivocado**, en mitad de la sección C (`:4967`), porque el
   ancla de inserción casó su **primera** aparición y no la última. Ahí `TOTAL` y `FAILED` **no son
   definitivos**: habría escrito un recibo a mitad de la corrida, con un recuento parcial y un
   veredicto que aún podía cambiar. Un recibo así habría certificado una corrida **sin terminar** —
   el peor fallo posible en esta tarea concreta.

**Lo que esto establece.** Los cinco son invisibles leyendo y los cinco caen en la misma dirección:
producen **silencio**, no rojo. Es la razón por la que `PHASE 5` cierra con «los casos en verde y
la comprobación inversa en rojo» y no con «el código está escrito».

## Una decisión de diseño que se declara: el recibo NO se versiona

`docs/implementation/CORRIDA.json` entra en `.gitignore`. Si viajara en el repositorio, cualquier
clon podría sellar sin haber corrido nada: bastaría con que el arnés no hubiera cambiado. El
**sello** sí se versiona —es la decisión, y su rastro debe sobrevivir—; el **recibo** es la prueba
local del hecho, y una prueba que se copia deja de probar.

## Lo que NO se cubre, y consta   `SUITE-R26`

**«Sólo `--todo` escribe recibo»** no tiene caso propio. Probarlo exigiría anidar la batería dentro
de sí misma, que es exactamente lo que `PT-188` acaba de impedir. Se sostiene por la guarda
`[ -n "$TODO" ] && [ -z "$ACOTADO" ]`, y `ACOTADO` lo levantan `--solo`, `--seccion` y
`--afectados` — así que también `--todo --solo X` queda sin recibo. **Se comprobó a mano** con el
bloque aislado y las dos combinaciones, y eso es lo que se afirma: comprobado a mano, no cubierto
por un caso. No se finge con un `grep` al código, que sería otro proxy (`CE-001`).

## El hallazgo que sale de aquí, y ya tiene tarea

`selftest.sh` mide el final del fuente por **posición** en dos sitios —`:7284` con `tail -4` y
`:7237` con `tail -40`— así que castiga cualquier añadido al final aunque nada de lo que mide haya
cambiado. Es la familia que el `HANDOFF` declara en `-18`, y el comentario de `:7235` ya la había
sufrido: `PT-086` amplió esa ventana de 14 a 40 líneas por exactamente esto, y dejó escrito que
«extraer por POSICIÓN es frágil en las dos direcciones». Ampliarla otra vez sólo movería el día en
que vuelve a pasar.

`PT-191` la **esquiva a sabiendas** y la deja registrada como **`PT-192`** en `EP-026`, no sólo en
prosa. Arreglarla aquí habría hecho que esta tarea cambiara dos cosas y ninguna quedara claramente
medida.

## Sin bloqueadores
