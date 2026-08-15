# 10-Technical-Debt

> Foundation `PHASE 4` · 2026-08-13 · suite 5.2.3
> **El único documento del paquete donde caben recomendaciones** (`FND-R02`). Todo lo demás
> describe hechos. Aquí van también los hechos **no determinados** (`FND-R01`).

## Deuda abierta

### `TD-01` · El grafo cubre 1 de 16 archivos de código

`plan-layout` calculó el alcance `bin` y así se aceptó en `G0`
([LAYOUT.md](../implementation/LAYOUT.md), propuesta 2). El grafo tiene 18 nodos sobre
`bin/cauce.mjs`; los 5 441 líneas de `docs/methodology/tools/` quedan fuera porque la
herramienta no considera `docs/` como código propio.

**Consecuencia:** `FDGE-R43` se satisface formalmente —el grafo existe y está `FRESH`— sobre un
grafo que no describe el sistema. Un PT `MAJOR` sobre los verificadores resolvería `G2` con un
grafo que no los contiene.

**Recomendación:** o se amplía el alcance a `docs/methodology/tools/`, o se enseña a
`plan-layout` que un `tools/` con `.mjs` es código propio aunque cuelgue de `docs/`. Lo segundo
sirve a todos los proyectos; lo primero, solo a este.

> **RESUELTA por `PT-020` el 2026-08-15** — por la primera vía, la que sirve solo a este
> repositorio. `REGISTRY.graph.scope` pasa a `bin, docs/methodology/tools` y `pt_at_generation`
> de `0` a `48`; el grafo va de **18 nodos** —todos de `bin/cauce.mjs`— a **500 nodos, 635
> aristas y 14 comunidades** sobre los 16 archivos. `FDGE-R43`: `STALE` → `FRESH`. Seis casos
> nuevos en `selftest.sh` (495 → 501) impiden volver al alcance de ayer, y la comprobación
> inversa se ejecutó: revertido el registro, los dos casos que deben caer caen.
>
> **La segunda vía sigue abierta**, y con ella la parte de esta deuda que importa a los demás
> proyectos: `plan-layout` sigue sin reconocer `tools/` con `.mjs` bajo `docs/` como código
> propio, así que **cualquier instalación nueva nace con este mismo defecto** y hay que
> corregirlo a mano. Aquí se arregló el síntoma en un repositorio; la causa está en la
> herramienta que calcula el alcance.
>
> Y lo que `PT-020` midió abre una pregunta que no existía: **13 de las 14 comunidades son un
> archivo cada una**, y 8 de los 16 archivos no comparten una sola arista. El grafo describe
> bien y dice poco, porque hay poco que decir — 16 CLI casi autónomos. Queda medido en
> [`changes/PT-020-ampliar-el-grafo-a-tools/self-review.md`](../../changes/PT-020-ampliar-el-grafo-a-tools/self-review.md),
> junto con las **dos de tres** expectativas que no se cumplieron como estaban escritas.

### `TD-02` · `verify-fdge.mjs` concentra siete familias de reglas en 1 027 líneas

Junto a `selftest.sh` (1 110) son el 39 % del código. `verify-fdge` verifica `SUITE-*`, `FND-*`,
`FDGE-*`, `INTAKE-*`, `LEX-*`, `EXEC-*` y la instalación.

**Consecuencia:** cada regla nueva lo hace más grande, y no hay frontera natural donde partirlo.

**Recomendación:** no partirlo por tamaño. Si se parte, que sea por **artefacto verificado**
—registro, terreno, PT, evidencia— y solo cuando haya un cambio que lo pida. Partir por partir
crea cinco archivos que se importan entre sí y un fallo de composición nuevo.

### `TD-03` · No hay pruebas unitarias

La verificación es de extremo a extremo: `selftest.sh` construye un proyecto sintético, inyecta
un defecto y comprueba que el verificador lo caza. 180 casos.

**Consecuencia:** una función interna puede estar mal sin que ningún caso la señale, si su fallo
no cambia el veredicto. El caso «versión desalineada ⇒ restringido» estuvo así: pasaba sin
comprobar nada, porque el fixture y el verificador tenían la misma versión escrita a mano.

**Recomendación:** mantener el enfoque de extremo a extremo —es el que prueba lo que importa— y
añadir el contrato `casa`/`noCasa` de `patrones.mjs` a cualquier función pura nueva que sea
crítica. No introducir un framework de test: contradiría `RULE-04`.

### `TD-04` · `QA/` y `qa/` no pueden coexistir en Windows ni en macOS

`INSTALL.md` `I3` enumera dos espacios que se distinguen solo por la caja: `QA/` (casos,
defectos, informes) y `qa/` (las pruebas que `verify-qa` busca en `qa/tests/`). Comprobado en
este host: se creó `QA/` y `qa/` resolvió al mismo directorio.

**Consecuencia:** en Windows y macOS el instalador crea uno solo, y qué contiene depende de en
qué orden se escribieron los archivos. En Linux y en CI son dos. El mismo proyecto tiene dos
estructuras según dónde se instaló.

**Recomendación:** unificar la caja en `LEXICON.md` §6 — `QA/cases/`, `QA/tests/`,
`QA/reports/` bajo un único directorio— y ajustar `verify-qa`. Toca `docs/methodology/`, así que
es `SUITE-R06e`: se decide, no se hace de paso.

### `TD-05` · La corrección de `SUITE-R40` está sin versionar   ✅ RESUELTA 2026-08-13

`verify-fdge`, `migrate` y el fixture del selftest dejaron de fijar la versión en una constante
([INSTALL.log](../implementation/INSTALL.log), corrección posterior). El cambio está en el árbol
de trabajo **sin entrada en `CHANGELOG.md`**.

**Consecuencia:** ninguna hoy — `package.json` y el `CHANGELOG` siguen alineados en 5.2.3. Pero
`publicar.yml` publica desde `main`: si el merge ocurre sin decidirlo, se publica un contenido
que no corresponde a lo que su `CHANGELOG` describe.

**Recomendación:** decidir antes del merge si lleva entrada y con qué número, y ejecutar
`version.mjs --aplicar`. Es `PATCH`: corrige comportamiento sin romper compatibilidad.

**Resuelta el 2026-08-13.** Entró en la entrada de `5.3.0` del `CHANGELOG` junto al cierre de
`EP-001`, y `version.mjs --aplicar` alineó los 21 documentos y `package.json`. Se decidió
`MINOR` y no `PATCH` porque la entrada cubre además tres capacidades nuevas; la corrección de
`SUITE-R40` por sí sola habría sido `PATCH`, como decía esta recomendación.

### `TD-06` · `origin/desarrollo` sobra

Este documento y `CLAUDE.md` describían `desarrollo` como la rama de trabajo mientras el trabajo
ocurría en `trabajo` (divergencia `D8`). Se corrigió la documentación; la rama remota sigue ahí.

**Recomendación:** `git push origin --delete desarrollo` cuando se confirme que no cuelga nada.
Es `SUITE-R06f` — borrado de ramas remotas, humano.

### `TD-07` · El adaptador de Azure DevOps declara su contrato y no lo implementa

```js
azure: { abiertos() { throw new Error('El adaptador de Azure DevOps declara el contrato y no
  lo implementa todavía. Se escribe contra un caso real, no contra ninguno…'); } }
```
[tools/tracker.mjs:75-85](../methodology/tools/tracker.mjs#L75-L85)

**No es deuda accidental**, y por eso está aquí y no en un hallazgo: es una decisión declarada.
Escribirlo contra ningún caso real es lo que evitó que el de GitHub naciera con suposiciones.

**Recomendación:** implementarlo cuando exista un proyecto que use Azure DevOps, no antes.

## Hechos no determinados   `FND-R01`

Lo que no pudo verificarse con una fuente citable en este repositorio:

| | Por qué no se determinó |
|:---|:---|
| Cuántos proyectos destino tienen cauce instalado y en qué versión | No hay telemetría ni registro de instalaciones. `cauce compare` responde por proyecto, uno a uno |
| Si el ahorro declarado de contexto (~59 500 → ~16 000 tokens) se cumple en la práctica | La cifra está en `SUITE-R15` y en la cabecera de `build-core`; no hay medición reproducible en el repositorio |
| Cuántas de las 209 reglas se violan en la práctica y cuáles | `audit` mide **cobertura mecánica**, no cumplimiento observado en proyectos reales |
| Si el Trusted Publisher de npm está configurado | `publicar.yml:64-72` documenta que hay que configurarlo una vez en npmjs.com. Eso vive fuera del repositorio y no es verificable desde aquí |

## Deuda saldada durante esta instalación

Se registra para que una auditoría posterior distinga lo que arregló la instalación de lo que
arregló alguien después.

| Qué | Dónde |
|:---|:---|
| `*.log` en `.gitignore` se tragaba los ledgers append-only (`SUITE-R37`) | [INSTALL.log](../implementation/INSTALL.log) `[L3]` |
| La versión fijada en constante en `verify-fdge`, `migrate` y el fixture (`SUITE-R40`) | [INSTALL.log](../implementation/INSTALL.log) · corrección posterior |
| El procedimiento de instalación duplicado en `README.md`, divergente y ordenando borrar documentación contra `FND-R11` | [RECONCILIATION.log](../implementation/RECONCILIATION.log) `N1` |
| Cuatro cifras del número de casos escritas a mano, las cuatro erróneas | `N2` |
| `revisar-secretos` no corría en ningún workflow, con `FND-R29` declarándolo bloqueante | `N6` |
| `verify-fdge` no corría sobre los artefactos propios, con `FDGE-R34` pidiéndolo para `G4` | `N7` |
| `audit.mjs` tomaba el `README` de la raíz como «el instalador» | Consecuencia de `N1`, corregida en el mismo acto |
