# Intake — BUG · `PT-102` · la versión es un contenido, no un número

```yaml
---
id: PT-102
type: BUG
severity: S1
complexity:
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: `version.mjs` no puede decir «todo declara la vigente» dejando fuera una
> declaración que no supo leer, y la forma de declarar una versión vive donde este repositorio
> pone los patrones críticos.

---

## 1. Qué está pasando `[HUMANO]`

Causa `C-3` del lote (`INC-004`, `FDGE-R02`):

> «La versión es un CONTENIDO, no un número. `version.mjs` alinea veintiún documentos y da por
> alineado lo que no mira.»

Y es peor de lo que la entrada describía. **`version.mjs` termina diciendo «Todo declara
11.0.0» mientras cuatro documentos declaran otra**, porque la declaran con **otra forma**.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

Una herramienta que alinea versiones **no puede dar por alineado lo que no sabe leer**. Si hay
dos formas de declarar una versión, o mira las dos, o dice cuál no mira.

Y la forma de declararla es un **patrón crítico**: su sitio es `patrones.mjs`, con sus ejemplos
de lo que casa y de lo que no, como los otros veintitantos.

---

## 3. Comportamiento observado `[HUMANO]`

```
$ node docs/methodology/tools/version.mjs
version — vigente segun el CHANGELOG: 11.0.0
Todo declara 11.0.0.            <- FALSO

Suite version: **X.Y.Z**    21 documentos, alineados     <- la unica forma que mira
suite_version: X.Y.Z         5 sitios, CUATRO muertos    <- invisible

  CLAUDE.md:208                 10.0.0   el propio repositorio
  Suite-CLAUDE-Template:49       5.2.0   el que VIAJA a cada proyecto destino
  README.md:690                  5.2.0
  MANUAL.md:72                   7.4.0
  INTAKE/templates/TAREA:22      X.Y.Z   plantilla: correcta, NO se toca
```

La forma que sí mira vive en un `RE_DECLARA` **local** a `version.mjs` (`:61`). El grafo lo
enseña sin ambigüedad: de las siete herramientas que dependen de `patrones.mjs`, `version.mjs`
es la que **menos** comparte —dos aristas, frente a las sesenta y ocho de `tracker`—. El patrón
no está donde se contrasta, así que nadie pudo notar que faltaba una forma.

---

## 4. Reproducción `[HUMANO]`

```
1. node docs/methodology/tools/version.mjs                -> «Todo declara 11.0.0»
2. grep -n "suite_version:" docs/methodology/MANUAL.md    -> 7.4.0
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | las herramientas de la suite |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto destino: la plantilla que se les copia declara `5.2.0` |
| Volumen estimado | **cuatro** declaraciones muertas, una de ellas en el documento que viaja |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | mirar a mano, que es lo que la herramienta existe para evitar |
| Impacto de negocio | un verde que afirma más de lo que comprueba — la clase de defecto que este lote entero persigue |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

```
version.mjs:61   RE_DECLARA — una sola forma, y local al archivo
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: el marcador «X.Y.Z» de INTAKE/templates/TAREA.md  -> es una PLANTILLA y esta bien asi.
     Es el caso NEGATIVO: el arreglo no debe «alinearlo»

OUT: las frontmatter de las tareas ya cerradas en changes/  -> SUITE-R09, lo terminado no se
     retrofecha. Cada una declara la version bajo la que se hizo, y eso es correcto

OUT: la cita en prosa del CHANGELOG                    -> es historia y un EJEMPLO. El patron
     debe anclarse a inicio de linea para no tocarla

OUT: rediseñar como se numera la suite                 -> se arregla la LECTURA, no el esquema

OUT: la lista «firmantes: - Nombre Apellido» de la plantilla -> es un hecho DISTINTO, y se
     declara al cierre del lote para que no se pierda
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que version.mjs no pueda decir «todo alineado» sobre algo que no leyo
- que la forma de declarar una version viva en patrones.mjs, con sus ejemplos
- que el marcador de la plantilla NO se toque
- que la prosa del CHANGELOG NO se toque
```

---

## 10. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base**, escrita por el agente (`INTAKE-R06`): el reparto del lote (`L-4`, causa `C-3`,
> `INC-004`) y la delegación autónoma del 2026-08-21. `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: la forma de declarar una version vive en PATRONES, con su «para», su «casa» y su
       «noCasa» — como los otros veintitantos patrones criticos (SUITE-R38).

AC-02: version.mjs reconoce las DOS formas y realinea las cuatro declaraciones muertas.

AC-03: el marcador «X.Y.Z» de la plantilla NO se toca, y hay un caso que lo comprueba.

AC-04: la cita en prosa del CHANGELOG NO se toca: el patron va anclado a inicio de linea.

AC-05: el CLAUDE.md del proyecto entra en el recorrido. Hoy queda fuera del arbol que
       version.mjs camina, y es donde vive la parametrizacion que SUITE-R00 declara.

AC-06: la bateria falla SIN el arreglo, con el negativo que impide que «aceptar cualquier
       cosa» pase.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: un patrón que se mueve a su sitio y un recorrido que se amplía. No cambia
ninguna regla ni el esquema de versiones.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9) está en PHASE 1 y no toca version.mjs
HISTORY.log — PTs similares:  PT-096 y PT-100 movieron patrones a patrones.mjs. Mismo remedio
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **El grafo dio el diagnóstico, no el `grep`.** `version.mjs` es la herramienta que menos
  depende de `patrones.mjs` —dos aristas frente a sesenta y ocho— y es exactamente la que tenía
  el patrón crítico escrito en local. La causa se ve en la **estructura**, no en el texto. Y el
  grafo llevaba `SUSPECT` toda la sesión sin que nadie lo mirara: `FDGE-R43` no bloquea, y eso
  se convirtió en permiso para ignorarlo.

- **El caso de la plantilla es el que viaja.** `Suite-CLAUDE-Template.md` es el único documento
  que se copia a cada proyecto destino, y declara `5.2.0`. La herramienta que alinea veintiún
  documentos es ciega justo al que sale del repositorio.

- **Y ese mismo archivo declara `firmantes: - Nombre Apellido`** — una lista sin firmante real
  en el documento contra el que `SUITE-R27` contrasta las firmas. **No entra aquí**: es un hecho
  distinto, y se declara al cierre del lote para que no se pierda.

- **Lo que este intake NO establece:** cuántas formas más de declarar una versión existen. Se
  conocen dos y se miden cinco sitios; un `grep` no encuentra lo que no sabe buscar.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · un verde que afirma más de lo que comprueba
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cinco entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-102
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con la medición
DoR-B3 reproducción                      [x]  §4
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
