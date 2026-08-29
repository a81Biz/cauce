# `PT-199` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Nueve casos ejecutables en `selftest §EP-026`.
- **Comprobación inversa hecha, no afirmada** (`inversa.txt`): el esqueleto anterior monta **2**
  archivos y falla las tres rutas que los casos comprueban; el derivado monta **87** y las tres
  pasan.
- **La lista no se enumera: se deriva.** La ruta que una tarea futura añada al andamiaje entra en el
  esqueleto **el mismo día que se escribe**, porque sale del mismo archivo donde ella vive. Es la
  forma de `PT-176` con los bloques y de `PT-091` con el inventario.
- **Convenciones** (`11-Conventions.md`): sin `debug`, sin restos.

## Tres cosas que sólo se vieron EJECUTANDO, y dos eran mías

### 1 · El esqueleto derivado costaba 8,1 s por montaje

`build_fixture` se invoca **265 veces**. La primera versión hacía un `mkdir`/`: >` **por ruta**
—unos 350 procesos— y medía **8159 ms** por montaje: **~36 minutos** de corrida acotada.

Habría destruido el ahorro que `EP-025` acababa de conseguir (126 casos / 4m23s), que es exactamente
por lo que `PT-086` llamó «barato» a su esqueleto. Reescrito a **dos procesos** —un `mkdir -p` con
todos los directorios y un `touch` con todos los archivos— baja a **211 ms**: **−97 %**.

**Lo destapó cronometrarlo, no leerlo.** Un arreglo correcto que multiplica por 8 el coste de la
compuerta es un arreglo que empuja a saltársela.

### 2 · La derivación necesitaba su propia guarda de terreno

El `grep` capturaba dos cosas que no son rutas:

- **`$WORK/...`** — de una **elipsis en un comentario**, y el mío. Creaba un archivo llamado `...`
  que hacía reventar `git add -A` con «unable to index file», y rompió el andamiaje de `PT-056`.
- **`$WORK/../autoalojado`** y cinco más — rutas que **salen de `$WORK`**. Montarlas habría escrito
  en el directorio **padre**: el defecto exacto que `PT-188` cerró con dos puertas, reintroducido
  por la puerta de atrás.

Se descarta cualquier segmento formado sólo por puntos. `.gitignore` y `.sin-gh` pasan, y hay un
caso que lo fija en las dos direcciones.

### 3 · Mi primer discriminador de `TS-03` no discriminaba

`_act199` comprobaba `-f docs/enterprise-documentation/11-Conventions.md` para distinguir el fixture
completo del esqueleto. **El esqueleto también monta esa ruta** —está entre las 172— así que el caso
daba `COMPLETO` en los dos escenarios y **pasaba por la razón equivocada**. Con `-s` en vez de `-f`
sí distingue: el esqueleto deja los archivos **vacíos**.

Es la familia de `PT-181` —una aserción que casa de más— aparecida mientras se arregla otra cosa.

### 4 · Montar directorios sueltos rompió DIECIOCHO casos de secciones activas

El esqueleto creaba también los directorios derivados, y `$WORK/ep024` estaba entre ellos.
`proj24()` usa **la existencia de ese directorio** como centinela de «fixture ya construido»:

```bash
local d="$WORK/ep024"
if [ ! -d "$d" ]; then   ... construye el REGISTRY del fixture ...  fi
```

Con el directorio montado, el fixture **no se construía nunca**, y 18 casos de secciones **activas**
caían con «No hay `REGISTRY.json` legible». No los vio la sección nueva: los vio la corrida acotada
entera.

**El arreglo fue crear MENOS, no parchear el fixture ajeno.** El esqueleto existe para que
`perl -pi archivo` y `printf > archivo` no fallen; para eso bastan los **archivos** y sus **padres**.
Un directorio vacío no aporta y sí interfiere. Hay un caso que lo fija.

Es la misma lección que el punto 3 con otro operador: **`-d` no distingue «construido» de «existe
vacío»**, igual que `-f` no distinguía «montado por el fixture» de «montado inerte».

## El coste, medido y declarado

| | casos | tiempo |
|:---|---:|---:|
| acotada **antes** | 126 | 4m 23s — **con 33 errores** |
| acotada **ahora** | 136 | 7m 10s — **con 0** |

El esqueleto se monta 265 veces a ~180 ms. **Se probó una plantilla montada una vez y copiada con
`cp -a`**: 134 ms frente a 183 ms — un 27 % mejor que no cambia el orden de magnitud y añade una
plantilla que mantener y limpiar. Se descarta, y la medida queda escrita para que la decisión sea
contrastable y no una impresión.

La acotada sigue siendo **−77 %** frente a la completa. El aumento es real y es el precio de que la
salida se pueda leer; se dice en vez de esconderlo en un promedio.

## Lo que NO se cubre, y consta   `SUITE-R26`

**No se afirma cobertura total.** El `grep` no ve rutas construidas en variables
—`local d="$WORK/p199"; … "$d/a.sh"`—, y son **14 raíces**. Perseguirlas exigiría interpretar el
shell.

Lo que se hace en su lugar es **decirlas**: cada corrida acotada imprime cuántas rutas derivó y
**enumera** las raíces que no puede derivar. `AC-02` mide eso, y por eso `AC-01` no basta solo:
`AC-01` lo satisface añadir dos rutas a mano, que es el defecto de hoy con otra cifra.

## Un camino descartado que conviene recordar

**Que el andamiaje no se ejecute cuando la sección está inactiva** es la salida limpia, y no se hizo:
exigiría envolver el montaje de cientos de casos —hoy es código suelto entre `chk` y `chk`— y cada
envoltura es una oportunidad de cambiar lo que un caso mide. Queda anotado en `strategy.md §4` por
si algún día se reestructura el arnés.

## Sin bloqueadores
