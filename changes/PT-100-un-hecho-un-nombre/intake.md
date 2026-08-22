# Intake — BUG · `PT-100` · un hecho, un nombre

```yaml
---
id: PT-100
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

> Termina cuando: ninguna verificación decide si corre en función de **cómo se escribió** un
> nombre, y las grafías que hoy discrepan quedan reducidas a una, con su comprobación.

---

## 1. Qué está pasando `[HUMANO]`

Causa `C-2` del lote (`FDGE-R02`, `INTAKE-R01`):

> «Un hecho, varios nombres — la enfermedad de la v3, dentro de las herramientas.
>
> `INC-008` · dónde vive una nota de reanclaje: `avanzar` escribe `TRANSICIONES.log`, `CORE.md`
> dice `bitacora.md`.
> `INC-012` · los tipos de caso `QA`: `verify-qa.mjs` espera `EDGE|NEG`, `CORE.md` dice `EC|EF`.
> `TD-04` · dónde vive el espacio de `QA`: el verificador busca `QA/`, git guardó `qa/`.
>
> `TD-04` es el que más asusta: en Linux `QA/` y `qa/` **no** son el mismo directorio, así que la
> verificación del ciclo entero se saltaría **en silencio y en verde**.»

Y lo que `L-0` dejó declarado para esta tarea: el `type` canónico de un lote —`LEXICON` no lo
declara y el registro escribe `EP` ×16, ausente ×2, `EPIC` ×1— y los **seis** `type === 'EP'` de
`verify-fdge.mjs`, medidos y hoy latentes.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Un hecho se llama de una sola forma, y esa forma la declara `LEXICON`.** Si dos herramientas
discrepan, una de las dos está mal — y mientras discrepan, lo que decide qué se verifica es el
azar de qué grafía usó quien escribió el archivo.

Y una verificación que no encuentra su objeto **no puede salir en verde**.

---

## 3. Comportamiento observado `[HUMANO]`

```
INC-008   avanzar          ->  docs/implementation/TRANSICIONES.log
          CORE.md:337      ->  «bitacora.md del PT»

INC-012   verify-qa.mjs:52 ->  tipo(HP|REG|EDGE|NEG)
          CORE.md:1003     ->  tipo(HP|EC|EF|REG)

TD-04     verify-qa.mjs:36 ->  const QA    = join(ROOT, 'QA')
          verify-qa.mjs:37 ->  const SPECS = join(ROOT, 'qa', 'tests')
```

**Las dos grafías de `TD-04` están en líneas consecutivas del mismo archivo.** Y si no encuentra
el espacio de `QA`, la herramienta sale con código `2` diciendo «nada que verificar»: **en verde**.

---

## 4. Reproducción `[HUMANO]`

```
1. en un sistema sensible a mayusculas, con el espacio de QA en «qa/»
2. node docs/methodology/tools/verify-qa.mjs
3. «No hay QA/…: nada que verificar» · codigo 2 · el ciclo entero sin verificar
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

**En Windows no se reproduce porque el sistema de archivos no distingue**, y eso es parte del
defecto: se escribió y se probó donde no se nota.

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | las herramientas de la suite · medido aquí y en la calculadora |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto destino en Linux o macOS sensible a mayúsculas |
| Volumen estimado | **cinco** hechos con nombre doble · uno apaga un ciclo entero |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | sí, y es el problema: que el sistema no distinga mayúsculas |
| Impacto de negocio | `FQAGE` —lo que comprueba que una persona puede usar el sistema— puede no correr nunca sin que nada lo diga |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

```
36:const QA = join(ROOT, 'QA');
37:const SPECS = join(ROOT, 'qa', 'tests');
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: renombrar el directorio en los proyectos destino -> no se toca el arbol de nadie. Se
     arregla la HERRAMIENTA para que encuentre las dos y DIGA cual uso

OUT: arreglar la calculadora ni el legado             -> tienen sus ramas y su firmante

OUT: rehacer el vocabulario de QA entero              -> se unifican los DOS conjuntos que
     discrepan, no se rediseña la taxonomia

OUT: los seis type === 'EP' de verify-fdge            -> ENTRAN. L-0 los midio y los dejo
     declarados para esta tarea: son el mismo hecho con otro nombre
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que una verificacion que no encuentra su objeto NO salga en verde
- que las grafias que discrepan queden en una, y que algo lo compruebe
- que el «type» de un lote tenga un nombre declarado, o que nadie dependa de el
- que no rompa los proyectos que ya escribieron una de las dos formas
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

> **Base**, escrita por el agente (`INTAKE-R06`): el reparto del lote (`L-3`, causa `C-2`), lo que
> `L-0` le dejó declarado, y la delegación autónoma del 2026-08-21. `SUITE-R27`: contrastable, no
> probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: verify-qa encuentra el espacio de QA escrito de CUALQUIERA de las dos formas y DICE
       cual encontro. Una verificacion que no encuentra su objeto no sale en verde: sale
       diciendo que no lo encontro.

AC-02: los tipos de caso QA son UN conjunto. CORE.md se regenera desde el documento que los
       declara, y verify-qa acepta ese y no otro.

AC-03: la nota de reanclaje tiene UN destino declarado, y CORE.md lo cita en vez de enunciar
       otro.

AC-04: el «type» de un lote no decide nada: los seis «type === 'EP'» de verify-fdge pasan al
       helper que patrones.mjs ya exporta —esLote, derivado del ID— como hizo L-0 con los
       ocho de tracker.mjs.

AC-05: LEXICON declara el valor canonico, o declara que un lote NO lleva «type». Las dos
       respuestas valen; lo que no vale es que la pregunta no tenga respuesta.

AC-06: la bateria falla SIN el arreglo, con un caso por grafia y el NEGATIVO que impide que
       «aceptar cualquier cosa» pase.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: cinco hechos con nombre doble en tres archivos, más LEXICON y la regeneración
de CORE.md. No cambia ninguna regla: hace que las que hay se puedan aplicar.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       ninguno. PT-096..PT-099 están DONE
HISTORY.log — PTs similares:  PT-096 arregló los OCHO de tracker.mjs con el mismo helper
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **`TD-04` es peor de lo que su entrada describe.** No es que el verificador busque una grafía y
  git guardara la otra: es que **el mismo archivo usa las dos en líneas consecutivas** (`:36` y
  `:37`). Nadie eligió mal; nadie eligió.

- **Y el fallo es silencioso por diseño.** Salir con «nada que verificar» es correcto para un
  proyecto que no usa `QA`, e **indistinguible** de uno que sí lo usa y escribió la otra grafía.
  Es la forma de `PT-096`: una salida escrita para un caso legítimo cubriendo uno que no lo es.

- **En Windows no se reproduce**, y eso es parte del defecto: se escribió y se probó donde no se
  nota. Décima instancia del patrón «probar donde trabajo, no donde se decide».

- **`AC-04` y `AC-05` vienen de `L-0`** con su medición hecha: `esLote` ya está exportado en
  `patrones.mjs` y los ocho sitios de `tracker.mjs` ya lo usan. Faltan los seis de `verify-fdge` y
  la declaración en `LEXICON`.

- **Lo que este intake NO establece:** cuántos hechos más tienen nombre doble. Se conocen cinco; un
  `grep` no puede encontrar lo que no sabe buscar.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · apaga un ciclo de verificación entero
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cuatro entradas, una de ellas AMPLÍA el alcance
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-100
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cinco
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las líneas citadas
DoR-B3 reproducción                      [x]  §4 · y por qué NO se reproduce aquí
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre, en sistemas sensibles a mayúsculas
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
