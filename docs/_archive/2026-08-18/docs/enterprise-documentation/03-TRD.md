# 03-TRD — requisitos técnicos

> Foundation `PHASE 3` · 2026-08-13 · suite 5.2.3
> Todo hecho cita archivo y línea, o el comando que lo evidencia (`FND-R01`).

## Stack

| | | Fuente |
|:---|:---|:---|
| Lenguaje | JavaScript ESM (`"type": "module"`) | [package.json:5](../../package.json#L5) |
| Runtime | Node ≥ 18 · desarrollado y verificado en 22 | [package.json:30-32](../../package.json#L30-L32) · [verificacion.yml](../../.github/workflows/verificacion.yml) fija `node-version: '22'` |
| Shell | Bash para la batería de casos | `tools/selftest.sh`, 1 110 líneas |
| Dependencias | **Ninguna**, ni de producción ni de desarrollo | [package.json](../../package.json) |
| Módulos usados | Solo estándar: `node:fs` · `node:path` · `node:url` · `node:crypto` · `node:child_process` | Cabecera de importaciones de cada herramienta |
| Distribución | npm público con procedencia firmada (`--provenance`) | [publicar.yml:99](../../.github/workflows/publicar.yml#L99) |

**Por qué cero dependencias.** El paquete se instala **dentro** de repositorios ajenos y sus
herramientas se ejecutan desde el `docs/methodology/tools/` del proyecto destino, donde no hay
`node_modules` propio. Cualquier dependencia obligaría a instalarla allí o a empaquetarla. Es
una restricción de diseño, no una casualidad: se comprueba sola —el día que alguien añada un
`import` de terceros, las herramientas dejan de arrancar en el destino.

## Contratos de ejecución

### Códigos de salida

Convención uniforme, y la tercera es la que evita un falso verde:

| Código | Significado |
|:---|:---|
| `0` | Sin errores |
| `1` | Hay errores · bloquea |
| `2` | **Nada que verificar aquí** — no aplica, distinto de «todo bien» |

El `2` existe porque «no hay auditoría PTSA en este proyecto» y «la auditoría PTSA está
correcta» no pueden reportarse igual. [bin/cauce.mjs:181](../../bin/cauce.mjs#L181) lo trata
explícitamente: `peor = Math.max(peor, r === 2 ? 0 : r)`.

### El binario

Cinco comandos ([bin/cauce.mjs:110-205](../../bin/cauce.mjs#L110-L205)):

| Comando | Qué hace |
|:---|:---|
| `cauce install [ruta]` | Copia `docs/methodology/` al destino y genera el núcleo. Se niega si la copia del destino difiere (`SUITE-R31`) salvo `--forzar`. Si el destino **es** cauce, no copia: lo dice y regenera el núcleo. |
| `cauce verify [ruta]` | Encadena `verify-suite` · `build-core --check` · `verify-fdge --all` · `verify-qa` · `verify-ptsa` · `revisar-secretos` |
| `cauce compare [ruta]` | Qué difiere entre la copia del proyecto y la del paquete, y en qué dirección |
| `cauce core [ruta]` | Regenera `CORE.md` y `CORE-PTSA.md` |
| `cauce version` | La versión del paquete |

### Detección de autoalojamiento   `SUITE-R41`

```js
const esCauce = (dir) => JSON.parse(readFileSync(join(dir,'package.json'))).name === PKG_PROPIO.name;
const AUTOALOJADO = CARGA === SUITE_EN_DESTINO || esCauce(DESTINO);
```
[bin/cauce.mjs:55-60](../../bin/cauce.mjs#L55-L60)

Por **identidad**, no por ruta. Comparar rutas solo acierta si carga y destino son el mismo
directorio; con el paquete instalado como dependencia de sí mismo hay dos binarios homónimos que
se comportan distinto —`npx cauce` resuelve al del repositorio y detecta, `node_modules/.bin/cauce`
resuelve al del paquete y no— y el segundo es el que usa cualquier `npm run`, porque npm pone
`node_modules/.bin` en el `PATH`.

## Requisitos de integridad

### El sello del núcleo

`CORE.md` es generado y no debe editarse a mano (`SUITE-R16`). La comprobación es un hash del
**contenido normalizado** de las fuentes, no de sus bytes: un árbol de trabajo puede tener CRLF
en Windows y LF en Linux, y comparar bytes crudos daría desincronizado en cada máquina distinta.
La fórmula vive una sola vez, en `tools/patrones.mjs` — estuvo copiada en tres archivos y
normalizar dos dejó al tercero contradiciendo a los otros, con cinco casos del selftest en rojo.

### Los patrones críticos   `SUITE-R38`

Un patrón puede estar **mal y compilar**: `\b` degradado al byte `0x08`, `\s` a la letra `s`. El
regex resultante es válido y no casa nada, así que el verificador informa «sin errores» porque
no encuentra nada que reprochar — **el fallo es indistinguible del éxito**. Cada patrón viaja
con `casa` y `noCasa`, y `verify-patrones` ejecuta ese contrato. Hacen falta las dos listas:
solo `casa` deja pasar un patrón demasiado laxo; solo `noCasa`, uno que no casa nada.

### CRLF

Todo parseo por líneas usa `split(/\r?\n/)`. En JavaScript el `.` **no** casa `\r` —es
terminador de línea—, así que un regex anclado en `$` sin flag `m` falla en cualquier archivo
guardado en Windows. Ese fallo dejó 25 reglas fuera de `CORE.md` sin avisar. Está declarado en
la cabecera de cada herramienta y normalizado en [.gitattributes](../../.gitattributes) con
`* text=auto eol=lf`.

## Verificación

Siete comprobaciones, todas bloqueantes, sin ninguna «informativa»:

| Comprobación | Qué garantiza |
|:---|:---|
| `verify:patrones` | Ningún escape degradado. **Va primero**: si un patrón está roto, todo lo posterior informa «sin errores» porque no encuentra nada, no porque no haya nada |
| `verify:suite` | Coherencia de la metodología: vocabulario derogado, reglas citadas inexistentes, obligaciones en documentos que solo explican, enlaces rotos, versiones desalineadas |
| `core:check` | Núcleo sincronizado con sus fuentes |
| `audit` | Cobertura por enumeración: 572 elementos, 0 huecos |
| `selftest` | 180 casos: límites bien formados, defectos inyectados, migración, seguridad, coherencia |
| `verify:secretos` | Árbol e historia, con las excepciones firmadas visibles |
| `verify-fdge --all` | Cumplimiento de los artefactos **de este repositorio** |

`audit` y `verify-suite` se complementan y no se solapan: `verify-suite` comprueba lo que se le
enseñó a comprobar; `audit` **enumera** todos los elementos y exige que cada uno tenga lo que un
elemento de su clase debe tener. El problema que resuelve el segundo no era falta de rigor, era
falta de enumeración: cada revisión manual miraba cosas distintas.

## Restricciones

| | |
|:---|:---|
| **No hay `src/`** | Las herramientas viajan dentro del paquete instalado; su sitio es `docs/methodology/tools/`. Declarado en `11-Conventions` como desviación consciente |
| **No hay tests unitarios** | La verificación es de extremo a extremo: el selftest construye un proyecto sintético, le inyecta defectos y comprueba que el verificador los caza. Ver `10-Technical-Debt` |
| **Idioma** | Castellano en documentos, mensajes e identificadores. Los identificadores de la suite (`PT-NNN`, estados) van en inglés por `LEX-R07` |
| **Publicación** | Solo desde `main`, manual, con confirmación literal. Irreversible: npm no permite despublicar salvo en una ventana muy estrecha |
