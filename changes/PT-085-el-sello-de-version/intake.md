# PT-085 — El sello de versión: el estado retomable dice la verdad y lo integrado no se acumula

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-085
type: BUG
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Lo que me preocupa y debemos reforzar en esta misma épica es `SUITE-R34` junto con `tracker
> sesion cerrar`. Debemos agregar siempre un cierre de versión que nos obligue a publicar.»

## 2. Los tres defectos, medidos

### `A` · `SUITE-R34` verifica la fecha del archivo, no la verdad de su contenido

[verify-fdge.mjs](docs/methodology/tools/verify-fdge.mjs) compara las **marcas de commit** de
`HANDOFF.md` y de `changes/`:

```js
const tEstado  = fecha('docs/implementation/HANDOFF.md');
const tTrabajo = fecha('changes');
if (tTrabajo && tEstado && tTrabajo > tEstado) { … }
```

Un handoff **obsoleto pero recién tocado pasa**. Y no es teórico: durante `EP-017` el bloque
`ESTADO` decía «`EP-016` CERRADA · lo siguiente es `EP-017`, PROPUESTA y no abierta» mientras
`EP-017` llevaba nueve tareas integradas. Pasaba `SUITE-R34` porque el archivo se había tocado.

### `B` · `tracker sesion cerrar` no commitea su propia entrada

`SESSION_LOG.md` es append-only por `SUITE-R09` — existe para que un rastro no se pierda. Y la
entrada de cierre se queda **sin commitear**: si la máquina muere entre el cierre y el commit
siguiente, se pierde. Encontrado el 2026-08-20 revisando el estado: la entrada del cierre de la
sesión anterior seguía sin commitear a la mañana siguiente.

### `C` · Nada obliga a cerrar versión, y la deuda se acumuló hasta doler

| | |
|:---|:---|
| `main` sin recibir un merge | desde el **2026-08-18** |
| commits de retraso | **53** |
| issues que no podían cerrarse (`SUITE-R46`) | **8** |
| versiones declaradas y nunca publicadas | `9.0.0` — npm sirve `8.2.0` |

Ninguno es un descuido puntual: **no había ningún mecanismo que hiciera visible la deuda.**

### `D` · Sellar sin actualizar lo que lee quien llega

> «Aprovechemos para que el cierre de versión tenga la actualización de manuales, casos de uso,
> README etc., y que quede dicho **desde las instrucciones** para que no se nos pase.»

`EP-017` añadió dos reglas `HARD`, cambió tres herramientas y creó una rama de proyección. El
`MANUAL.md` y `CASOS-DE-USO.md` **sólo se tocaron** porque `PT-079` los puso en su lista de cinco
sitios — es decir, porque una tarea concreta se acordó, no porque nada lo exigiera.

Un marco cuya documentación de entrada envejece calladamente es el mismo defecto que `PT-081`
encontró en la guía de migración de la `9.0.0`: **texto que fue verdad y dejó de serlo**, sin que
nada avisara.

### `E` · el grafo dice `FRESH` y no conoce el código

> «En el marco se indica el uso de graphify… revisa que se use como se indica y que sirva para
> mejorar el desarrollo. También debe entrar su actualización.»

Medido el 2026-08-20:

| | |
|:---|:---|
| Archivos que el grafo describe | **16** |
| Modificados desde generarlo | **12** — 75 % de deriva |
| Tareas integradas desde entonces | **26** |
| Veredicto de `FDGE-R43` | **`FRESH`** |
| Importadores de `patrones.mjs` según el grafo | **2** |
| Importadores reales | **8** |

`FDGE-R43` declara `STALE` si un `PT` integrado **creó, movió, renombró o eliminó** archivos
(`structural: true`). En todo el registro **sólo `PT-034`** lo tiene. Modificar un archivo no
cuenta — así que ocho funciones nuevas y tres herramientas cambiadas dejan el grafo «fresco».

**Mide un proxy en vez de la cosa**, igual que `A`. Y es peor, porque `FDGE-R43` **bloquea `G2` en
los `PT` `MAJOR`**: una tarea grande se aprueba contra un grafo que no conoce el código.

El dato para arreglarlo **ya existe**: `graphify-out/manifest.json` guarda `mtime` y `ast_hash`
por archivo. Nadie lo consulta.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La parte **derivable** del bloque `ESTADO` se contrasta con el registro | un handoff que declare viva una tarea `INTEGRATED` **falla** |
| AC-02 | …y un handoff correcto **pasa** | el complemento: sin él, un verificador que no valide nada también cumpliría `AC-01` |
| AC-03 | Lo **no derivable** se declara, no se finge verificado | `decisiones` y `no hacer` siguen siendo prosa, y consta quién no las mira |
| AC-04 | `sesion cerrar` deja su entrada **commiteada** | tras ejecutarlo, `git status` no muestra `SESSION_LOG.md` |
| AC-05 | …o **no dice que cerró** | si no puede commitear, lo dice y falla — no cierra a medias |
| AC-06 | `SUITE-R57`: pasado el umbral, `G2` se bloquea | caso con `N+1` tareas integradas sin sellar |
| AC-07 | …y por debajo del umbral no molesta | el complemento |
| AC-08 | El umbral es **declarable**, no una constante escondida | `CLAUDE.md` del proyecto, con `N = 3` por defecto |
| AC-09 | El acto de **sellar** está definido y es ejecutable | una orden que enumera los pasos y se detiene en los humanos |
| AC-10 | Sellar exige **batería completa** | la corrida parcial de `PT-086` no basta, y consta desde ya |
| AC-11 | Sellar exige **resolver** cada documento de entrada | `MANUAL` · `CASOS-DE-USO` · los dos `README` · `Suite-CLAUDE-Template`: cada uno **actualizado** o **«no procede, porque…»** |
| AC-12 | Una celda vacía **no pasa** | igual que `FND-R22` con los movimientos del `LAYOUT`: sin decisión no hay sello |
| AC-13 | El sello **avisa de lo que probablemente cambió** | si `RULES`, `LEXICON` o `EXECUTION-MODES` cambiaron desde el tag y los documentos de entrada no, lo enumera |
| AC-14 | Está dicho **desde las instrucciones**, no sólo en la regla | `PHASES` · el prompt de `G4` · `CORE` · `MANUAL` · `CASOS-DE-USO` |
| AC-15 | `FDGE-R43` detecta **deriva de contenido** | si un archivo que el grafo describe cambió desde su generación, lo dice y lo enumera |
| AC-16 | …y la deriva **avisa, no bloquea** | `SUSPECT`; `STALE` bloqueante se reserva a lo estructural |
| AC-17 | Sellar exige el grafo **al día** | el sello no avanza con el grafo en `SUSPECT` o `STALE` sin resolver |

## 3b. `AC-11` no se cumple actualizando: se cumple **resolviendo**

La tentación es «al sellar, actualiza el manual». Eso no es verificable y, peor, empuja a tocar
los documentos para que la comprobación calle.

Lo que sí es verificable es la forma que `FND-R22` ya usa para el `LAYOUT`: **cada fila lleva una
decisión**. Al sellar, cada documento de entrada queda `ACTUALIZADO` o `NO PROCEDE` **con motivo**.
Una celda vacía es indistinguible de una que nadie miró, y por eso no pasa (`AC-12`).

`AC-13` es la ayuda, no el juez: enumera lo que probablemente haya que tocar comparando qué
cambió desde el tag anterior. **No decide** — decidir si una regla nueva obliga a reescribir el
manual lo sabe quien la escribió.

## 3c. `AC-16` evita que `FDGE-R43` se suicide

La tentación es que cualquier edición ponga el grafo en `STALE`. Sería **correcto y letal**: como
casi toda tarea toca una herramienta, `G2` quedaría bloqueada en todos los `MAJOR` de forma
permanente, y una comprobación que bloquea siempre se termina desactivando.

Por eso la deriva de contenido produce **`SUSPECT`** —avisa y enumera— y `STALE` bloqueante se
reserva a lo estructural, que es lo que hoy ya hace. Es la misma decisión que en `A`: la
comprobación tiene que poder pasar, o se apaga sola.

## 4. `AC-10` existe antes que `PT-086`, a propósito

`PT-086` hará que la batería corra sólo lo afectado en cada tarea. **El contrato que exige la
corrida completa al sellar se escribe aquí, antes**, para que no exista ninguna ventana en la que
haya corridas parciales sin un sello que reclame la completa.

Al revés sí habría ventana, y sería exactamente la fábrica de falsos verdes que este lote lleva
diecisiete tareas persiguiendo.

## 5. Por qué acotar la deuda y no imponer una cadencia   `[AGENTE]`

El firmante propuso «cada tres `PT`, o al final de la épica». **Se propone acotar en vez de
cronometrar**, y el motivo es que una cadencia fija obliga a cerrar versión en mitad de un lote
coherente — que es cuando peor se documenta.

`SUITE-R57` deja acumular hasta `N` y entonces **bloquea `G2`**. Tiene precedente exacto:
`EXEC-R11` bloquea abrir `PT` nuevos mientras un hotfix deba documentación retroactiva. Misma
forma, mismo motivo: la deuda no se prohíbe, se hace imposible de ignorar.

Si prefieres la cadencia fija, es un cambio de una línea en la regla y la tarea no cambia de forma.

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: un handoff que miente sobre el registro **falla**, `sesion cerrar` deja su
> entrada commiteada o no dice que cerró, acumular más de `N` tareas integradas sin sellar
> **bloquea `G2`**, y el acto de sellar exige batería completa y una decisión escrita sobre cada
> documento de entrada — todo ello dicho también en `PHASES`, el prompt de `G4` y el `MANUAL`.

## 7. Qué NO entra   `[AGENTE]`

- OUT: **La batería parcial.** Es `PT-086`, y va después por el motivo de §4.
- OUT: **Verificar la prosa** de `decisiones` y `no hacer`. No sé comprobar que un texto sea
  cierto; lo que se puede es verificar lo derivable y **declarar** el resto (`AC-03`).
- OUT: **Publicar y etiquetar.** `SUITE-R06a`. El sello los **describe** (`EXEC-R07`).
- OUT: Cambiar `SUITE-R46`. La regla está bien; lo que faltaba era que sellar ocurriera.
- OUT: **Regenerar el grafo.** `FDGE-R32` dice que lo dispara el humano (`/graphify`); esta tarea
  hace que el sello lo **exija** y lo **describa** (`EXEC-R07`), no que lo ejecute.
- OUT: **Meter `selftest.sh` en el grafo.** `FND-R28` excluye las pruebas a propósito, y esa
  decisión no se toca aquí. Lo que implica —que el grafo resuelve el lado herramienta→herramienta
  pero no sección→herramienta— es dato para `PT-086`.
- OUT: **Reescribir el `MANUAL`, `CASOS-DE-USO` o los `README`.** Esta tarea hace que sellar
  obligue a **resolverlos**; escribirlos con lo que `EP-017` enseñó es `PT-073`, y va al final
  del lote a propósito: escritos antes describen lo que uno cree que pasa.

## 8. Viabilidad   `FDGE-R54`

```
Veredicto: MARGINAL · registrado en REGISTRY.allocations[].viabilidad
```

No dice «es demasiado grande»: dice que **no hay precedente con qué comparar** —el coste típico
sale `SIN EVALUAR`— y se niega a aprobar por omisión y a prohibir sin evidencia. `MARGINAL` admite
**trabajo atómico**, y así se ejecuta: `A`, `B` y `C` son tres cambios independientes con sus
casos, no una refactorización.

## 9. Firma

```
Firmado por lote: EP-017
```
