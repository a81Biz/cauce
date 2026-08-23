# Intake — BUG · `PT-113` · la guía de migración que se publicó incompleta

```yaml
---
id: PT-113
type: BUG
severity: S2
complexity:
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
origin: DIRECT
epic: EP-020
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: un proyecto que instale la versión vigente encuentra en su `CHANGELOG` una línea
> para cada regla que empieza a juzgarle.

---

## 1. Qué está pasando `[HUMANO]`

La `12.0.0` está publicada en npm y su entrada del `CHANGELOG` **no nombra `SUITE-R59`**, una regla
`HARD` que nació dentro del propio lote que esa entrada describe. El paquete la lleva en `RULES.md`
y en `CORE.md`, así que un destino la carga en cada sesión y no encuentra la línea que se la
explica.

npm no se despublica: la única forma de que la corrección llegue es una versión.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

La entrada del `CHANGELOG` de una versión **enumera** todas las reglas que empiezan a juzgar con
ella —las nuevas y las que estrenan `RIGE_DESDE`— y dice qué hacer con cada una al actualizar.

Lo que hoy tiene npm no cumple eso, y el paquete publicado no se puede cambiar. Se corrige
publicando la `12.0.1`.

---

## 3. Comportamiento observado `[HUMANO]`

Sobre el tarball descargado de npm:

```
package/docs/methodology/RULES.md      SUITE-R59   1 vez
package/docs/methodology/CORE.md       SUITE-R59   2 veces
package/docs/methodology/CHANGELOG.md  SUITE-R59   CERO
```

Y en el árbol, `tracker sellar` lo dice sin ambigüedad:

```
guia de migracion  2 regla(s) nueva(s) NO nombradas: LEX-R08, SUITE-R59.
```

La entrada declara además **«Doce tareas»** cuando el registro tiene **diecisiete** en `EP-019`:
una cifra transcrita, que es `H-007` otra vez (`PT-091`).

---

## 4. Reproducción `[HUMANO]`

```
npm pack @a81biz/cauce@12.0.0 && tar -xzf a81biz-cauce-12.0.0.tgz
grep -c "SUITE-R59" package/docs/methodology/CHANGELOG.md    -> 0
grep -c "SUITE-R59" package/docs/methodology/CORE.md         -> 2

node docs/methodology/tools/tracker.mjs sellar --ver
  -> guia de migracion  2 regla(s) nueva(s) NO nombradas: LEX-R08, SUITE-R59.
```

Frecuencia: **siempre**. Es un contenido publicado, no una condición de carrera.

---

## 5. Entorno `[HUMANO]`

```
paquete   @a81biz/cauce@12.0.0 · npm · publicado 2026-08-22T21:39:02Z
corrida   publicar.yml #32600060157 · workflow_dispatch · main · 5b184af
árbol     main @ ee660db · suite_version 12.0.0
```

---

## 6. Impacto `[HUMANO]`

**Afectados:** todo proyecto destino que instale o actualice a la `12.0.0`.

**Qué les pasa:** reciben una regla `HARD` que su `CORE.md` carga en cada sesión, y su guía de
migración no la menciona. `SUITE-R19` existe para que eso no ocurra.

`S2` y no `S1`: la regla es sobre cómo se escribe código y no rompe nada al actualizar — el daño
es que nadie sabe que existe.

---

## 7. Out of scope `[HUMANO]` — obligatorio

```
OUT: arreglar la compuerta que dejó salir la 12.0.0 sin pasar por «sellar». Es L-8 de EP-020:
     un PATCH corrige el texto, no la compuerta que no lo vigiló
OUT: despublicar o modificar la 12.0.0 de npm. No se puede, y se dice
OUT: cambiar ninguna regla, ningún nombre y ninguna herramienta. Es un PATCH
OUT: crear los tags v10.0.0 y v11.0.0 que también faltan. Va con L-9
```

---

## 8. Criterios de aceptación del arreglo `[HUMANO]`

```
AC-01  La entrada 12.0.1 del CHANGELOG nombra SUITE-R59 y LEX-R08, y dice qué hacer con cada una
AC-02  La cifra de cabecera de la 12.0.0 coincide con lo que el registro dice de EP-019
AC-03  «tracker sellar» deja de reportar reglas nuevas no nombradas
AC-04  Las 25 declaraciones de versión —los 21 documentos, CLAUDE.md, package.json y
       REGISTRY.suite_version— declaran 12.0.1, y «version.mjs» lo confirma sin --aplicar
AC-05  CORE.md y CORE-PTSA.md quedan sincronizados con sus fuentes
AC-06  Ninguna regla, nombre ni herramienta cambia: el diff fuera del CHANGELOG y de las
       declaraciones de versión es vacío
```

---

## 9. Firma `[HUMANO]` — obligatorio

```
Firmado por lote: EP-020
```

---

---

# A partir de aquí lo completa el agente

## 10. Criterios de aceptación — versión canónica `[AGENTE]`

Los seis de §8 se toman tal cual: son verificables con ✓/✗ observando el árbol y la salida de las
herramientas (`INTAKE-R05`). No se añade ninguno.

## 11. Complejidad propuesta `[AGENTE]`

`TRIVIAL` en riesgo, `STANDARD` en alcance: toca 27 archivos pero 25 de ellos son una línea que
escribe `version.mjs --aplicar`. Se propone **`STANDARD`** y se confirma en `PHASE 2`.

## 12. Verificación de duplicados `[AGENTE]`

No duplica ningún PT vivo —no hay ninguno— ni ítem de `ROADMAP`: `R-001..R-008` son de otra
naturaleza. **Sí tiene precedente**: este trabajo se hizo el 2026-08-22 **sin allocation** sobre la
rama de cierre de `EP-019` y se **revirtió** en `1837c22` por ese motivo. Este intake es el que le
faltaba.

## 13. Observaciones del agente `[AGENTE]` — obligatorio

**O-1 · `LEX-R08` no es una regla nueva y no se puede presentar como tal.** Existe desde hace
versiones; lo que empieza en la `12.0.0` es que **se compruebe**. Su fila en `RIGE_DESDE` es lo que
impide que los 51 `BUG` cerrados antes salgan en rojo sin salida. La guía tiene que decir eso, no
fingir que es nueva.

**O-2 · `sellar` sólo mira la versión vigente.** `reglasNuevasFueraDeLaGuia` filtra por
`RIGE_DESDE === versión actual`, así que en cuanto el árbol declare `12.0.1` **dejará de mirar la
entrada de la `12.0.0`**. El arreglo pasaría la compuerta aunque no se hubiera hecho. Es un hueco
de la comprobación, se declara aquí y su arreglo es de `L-8`, no de esta tarea.

**O-3 · El diff será grande y casi todo mecánico.** 25 de 27 archivos son una línea escrita por
`version.mjs --aplicar`. `AC-06` existe para que eso sea comprobable en vez de tener que confiar.

**O-4 · Publicar no entra en esta tarea.** El `PATCH` deja el árbol listo; `npm publish` es acto del
firmante (`SUITE-R06`, `EXEC-R04`), y `L-8` debería ir antes de volver a pulsarlo.

## 14. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01  tipo declarado: BUG                                          [x]
DoR-02  severidad declarada por el humano: S2                        [x] confirmada con la firma del lote
DoR-03  bloque ## Firma con nombre y fecha                           [x] por lote: EP-020, firmado 2026-08-22
DoR-04  out-of-scope declarado explícitamente                        [x] cuatro líneas
DoR-05  PT-113 asignado desde REGISTRY.json                          [x] tracker asignar
DoR-06  no duplica un PT vivo ni un ítem de roadmap promovido        [x] §12
DoR-07  observaciones del agente registradas                         [x] O-1..O-4
DoR-B1  comportamiento esperado declarado, no deducido del código    [x] confirmado con la firma del lote
DoR-B2  comportamiento observado con detalle observable              [x] tres cifras del tarball
DoR-B3  pasos de reproducción                                        [x] §4
DoR-B4  entorno identificado                                         [x] §5, con corrida y sha
DoR-B5  frecuencia declarada                                         [x] siempre
DoR-B6  impacto y usuarios afectados declarados                      [x] §6

VEREDICTO: PASS
Motivo: la firma única de EP-020 —Alberto Martínez, 2026-08-22— cubre este intake
        (INTAKE-R08), y con ella §1, §2, §6 y §8 dejan de ser borrador. La base de esa
        firma y su límite (SUITE-R27) están declarados en el §5 del intake del lote.
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

### R-1 · Reanclaje: la `12.0.1` no existe, y la corrección viaja en la `13.0.0`

**Fecha:** 2026-08-23 · **Motivo:** el arreglo perdió su versión de destino.

Este intake se escribió para una `12.0.1`. Esa versión **se revirtió** —`1837c22`— porque el
trabajo se había hecho **sin allocation** sobre la rama de cierre de `EP-019`, que es justo lo
que `§12` de este documento ya registraba. Después, `PT-115` llevó el lote a `13.0.0` al
introducir `FDGE-R55`, `LEX-R29` y `LEX-R30`: tres reglas nuevas obligan a `MAJOR`.

**Qué cambia y qué no:**

| | Escrito en el intake | Vigente |
|:---|:---|:---|
| Versión que corrige | `12.0.1` (`PATCH`) | **`13.0.0`** (`MAJOR`, por `PT-115`) |
| `AC-04` — declaraciones de versión | «declaran `12.0.1`» | declaran **`13.0.0`** |
| `AC-06` — el diff es sólo texto | ya no se sostiene | **decae**: la `13.0.0` trae reglas y herramientas |
| `AC-01` `AC-02` `AC-03` `AC-05` | — | **intactos** |

`AC-06` decae y se dice en vez de darlo por cumplido: fue escrito para un `PATCH`, y en un
`MAJOR` que trae `FDGE-R55` y cuatro herramientas tocadas exigir «diff vacío fuera del
`CHANGELOG`» sería exigir lo contrario de lo que el lote hace. Un criterio que ya no puede
evaluarse **no se marca cumplido**: se declara caído con su motivo (`RULE-06`).

**Lo que el reanclaje NO cambia:** el defecto sigue siendo el mismo y sigue vivo. La `12.0.0`
está publicada en npm sin nombrar `SUITE-R59` ni `LEX-R08`, npm no se despublica, y la única
forma de que la corrección llegue a un destino es **una versión**. Ahora es la `13.0.0`.

**`O-2` se agrava y hay que decirlo.** La observación decía que `sellar` sólo mira la versión
vigente, así que en cuanto el árbol declarara `12.0.1` dejaría de mirar la entrada de la
`12.0.0`. Con el árbol en `13.0.0` **eso ya ha ocurrido**: `sellar` dice *«la guía enumera las
reglas que entran con esta versión»* en verde, y las dos reglas que motivan esta tarea **no las
mira nadie**. La compuerta está verde sobre un defecto vivo. Su arreglo sigue siendo `PT-120`
(`L-8`), y ahora tiene una instancia medida en vez de una hipótesis.

