# EP-012 — El marco se cierra a sí mismo

```yaml
---
id: EP-012
created: 2026-08-14
status: IN_PROGRESS
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común   `[HUMANO]`

> «hazlos en orden. Revisa que tú mismo estés usando correctamente el marco de trabajo, estés
> usando github de forma correcta y estés siguiendo todas las fases como se indica»

Los tres defectos que `EP-011` encontró **ejecutando** y no pudo cerrar dentro de sí mismo. Se
hacen juntos porque los tres son la misma avería vista en tres sitios: **el marco no puede
arreglar lo que él mismo escribió mal**. El ledger no admite corrección, el YAML del intake
puede mentirle al verificador sin que nada avise, y el arranque que el manual documenta no
arranca.

`EP-011` cerró diciendo que el marco no se aplicaba a sí mismo. Este lote es la factura.

## 2. Criterio de éxito del lote   `[HUMANO]`

No es la suma de los tres. Es esto: **cualquier artefacto que este marco escriba mal se puede
corregir sin desactivar una regla**, y el camino que un recién llegado sigue —`npx cauce start`—
funciona.

Hoy, si una entrada de `HISTORY.log` sale mal, la tarea queda inmóvil para siempre; y si el YAML
de un intake se queda atrás, el verificador da verde sobre comprobaciones que no ejecutó. Las dos
convierten un error de escritura en un fallo silencioso.

## 3. Qué NO entra en el lote   `[HUMANO]`

```
OUT: publicar la 7.6.0 — decisión humana explícita: «no publicamos aún porque nos falta algo más»
OUT: cambiar ninguna compuerta. G4 sigue siendo humana en los tres modos (EXEC-R04)
OUT: rehacer el trabajo de EP-011. Lo integrado se queda integrado
OUT: la contradicción rama-por-PT vs las dos ramas de este repositorio → PT-047
OUT: el enlace 404 de los issues DEFERRED → PT-048
OUT: el alcance del grafo, que describe «bin» y no las herramientas → PT-020 (TD-01)
```

## 4. Firma única   `[HUMANO]`

```
Solicitado por: Alberto Martínez (delegada — «hazlos en orden», 2026-08-14; delegación de
                G1, G2 y G3 vigente desde 2026-08-14: «Tienes mi VoBo para firmar a mi nombre
                G1, G2 y G3. G4 y publicar son míos.»)
Fecha: 2026-08-14
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
Severidad declarada: S2 en las tres. Ninguna tumba el marco hoy; las tres hacen que un error
futuro sea irreparable o invisible, que es peor.
Estado: FIRMADA · G1 PASS
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote   `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | `PT-046` | BUG | S2 | Una entrada de `HISTORY.log` mal formada bloquea `G4` y ninguna regla permite corregirla | `RULES.md` · `PHASES.md` · `FDGE-Prompts.md` · `FDGE-Implementation.md` · `tools/verify-fdge.mjs` · `tools/selftest.sh` · `CORE.md` | — |
| 2 | `PT-044` | BUG | S2 | El YAML del intake declara una fase y un estado que el registro contradice | `tools/verify-fdge.mjs` · `tools/selftest.sh` · `changes/PT-039..PT-042/intake.md` · `HISTORY.log` | `PT-046` |
| 3 | `PT-045` | BUG | S2 | `npx @a81biz/cauce start` no arranca: el punto de entrada documentado falla | `bin/cauce.mjs` · `MANUAL.md` · `CASOS-DE-USO.md` · `tools/selftest.sh` | — |

## 6. Análisis de solapamiento   `[AGENTE]`

```
Pares que comparten archivos:
  PT-046 ↔ PT-044   tools/verify-fdge.mjs · tools/selftest.sh   → SERIALIZADOS
  PT-045            no comparte ningún archivo con los otros dos

Orden de ejecución resultante:
  1. PT-046   abre la vía para corregir un ledger mal escrito
  2. PT-044   la USA: sincronizar los cuatro YAML deja FDGE-R52 en rojo, y sin PT-046
              la única salida sería fabricar notas de reanclaje que nadie escribió
  3. PT-045   independiente, y el único que un usuario ve

Motivo del orden: dependencia real, no preferencia. PT-044 no tiene solución honesta
sin PT-046 — es el orden que el humano pidió, y coincide.
```

## 7. Supuestos compartidos   `[AGENTE]`

```
- HISTORY.log sigue siendo append-only. Ninguna de las tres tareas lo reescribe:
  SUITE-R09 no se toca, se le añade una salida.
- Lo ya integrado de EP-011 se queda. Ninguna corrección reabre un PT cerrado.
- `verify-fdge` es la autoridad de las precondiciones de G4. Si una comprobación
  está mal, se arregla la comprobación; si el artefacto está mal, se arregla el
  artefacto. Lo que no vale es relajar la regla para que el verde llegue.
```

## 8. Observaciones del agente   `[AGENTE]`   `INTAKE-R07`

```
- PT que no encaja con el objetivo común: ninguno.
- Solapamiento que hace inviable el orden propuesto: ninguno.
- Supuesto compartido que no está verificado: ninguno.
- Lote demasiado grande para una sola firma: no. Tres tareas, dos de ellas de una
  sola comprobación.

DESAFÍO al lote: PT-046 NO es un hallazgo nuevo. Es el primer caso concreto de
PT-029 (#40), abierto hace tres lotes con estas palabras: «una comprobación que hace
imposible el estado que otra obliga a atravesar». Estuvo en el tablero sin un solo
ejemplo hasta ahora. Y PT-044 es el caso concreto de PT-016 (#23), «decidir si phase
pasa a ser obligatoria».
Consecuencia: al cerrar PT-046 y PT-044 hay que decidir qué pasa con PT-029 y PT-016
— o los absorben, o siguen abiertos con su alcance reducido y dicho. Va a la sección
de cierre del lote, que es donde SUITE-R45 obliga a responderlo.
```

## 9. Resultado de la compuerta `G1`   `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]
DoR-E5 EP asignado desde REGISTRY.json             [x]
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | pendiente |
| Regenerar `CORE.md` | pendiente |
| Qué pasa con `PT-029` (#40) y `PT-016` (#23), de los que estas tareas son el primer caso concreto | pendiente |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
