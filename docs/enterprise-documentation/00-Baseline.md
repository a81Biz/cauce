# 00-Baseline — línea base de reconciliación

> Foundation `PHASE 1` · 2026-08-13 · suite 5.2.3
> Fotografía del desorden de partida y referencia contra la que se mide si el proyecto mejora
> (`FND-R13`). **Nada se ha movido, archivado ni borrado**: eso espera al ACK humano de `G0`
> (`FND-R10`).

Alcance: la raíz `C:\DevOps\Desarrollos\cauce`. Repositorio git en la raíz, rama `trabajo`,
60 archivos versionados en el momento de la instalación.

---

## Una distinción que decide todo lo demás

En un proyecto normal, `docs/` **describe** el sistema. Aquí `docs/methodology/` **es** el
sistema: 34 documentos y 15 herramientas que se publican como `@a81biz/cauce`
([package.json:22-29](../../package.json#L22-L29) los declara como el contenido del paquete).

La consecuencia para `FND-R12` —«al cerrar Foundation, `docs/enterprise-documentation/` es la
única documentación de arquitectura, dominio y convenciones vigente»— es que **no compite** con
`RULES.md` ni con `LEXICON.md`. Aquellos gobiernan el producto; este paquete describe el
repositorio que lo construye. Aplicar `FND-R12` literalmente subordinaría `LEXICON.md` a
`11-Conventions.md` y contradiría el orden de autoridad de `LEX-R21`.

Solo dos documentos preexistentes describen **este repositorio** y por tanto entran de verdad
en la reconciliación: `README.md` y `CLAUDE.md`.

---

## Inventario documental   `FND-R09`

**Totales:** 37 documentos versionados · 9 creados por la instalación de hoy · 2 archivos de
licencia. Decisión por archivo, sin excepciones; lo que no se decide queda `KEEP` y se declara
como riesgo.

### Producto — el marco que se publica

| Documentos | Decisión | Motivo |
|:---|:---|:---|
| `docs/methodology/` · 34 `.md` (`LEXICON` `RULES` `EXECUTION-MODES` `PHASES` `CORE` `CORE-PTSA` `CHANGELOG` `INSTALL` `README` `Suite-CLAUDE-Template`, los `Framework-*` · `*-Implementation` · `*-Prompts`, y `INTAKE/` `QA/` `PTSA/` `FIDE/` con sus plantillas) | **KEEP** | Es el producto. No documentan este codebase: lo constituyen. `verify-suite` comprueba su coherencia y `audit` su cobertura — 572 elementos, sin huecos. |
| `docs/implementation/SECRETOS-EXCEPCIONES.md` | **KEEP** | Registro vivo de `FND-R29`: 7 huellas firmadas. Borrarlo devolvería la compuerta de secretos al rojo permanente que la regla existe para evitar. |

### Documentación sobre este repositorio

| Archivo | Decisión | Motivo |
|:---|:---|:---|
| [README.md](../../README.md) | **KEEP con subordinación** (`FND-R12`) | Es la portada pública en npm y GitHub: archivarla rompería el paquete. Pero seis de sus secciones describen instalación y estructura, materia de `01-Platform-Overview` y `11-Conventions`. Declara en cabecera a qué documento se subordina, y el procedimiento manual duplicado se recorta — ver Divergencias D1–D5. |
| [CLAUDE.md](../../CLAUDE.md) | **KEEP con subordinación** (`FND-R12`) | Lo carga el agente en cada sesión. Su §«Reglas para evolucionar este framework» es literalmente `11-Conventions`, y su §Estructura es un árbol de directorios desactualizado. Se subordina y se recorta — D6–D8. |
| `LICENSE` · `NOTICE` | **KEEP** | Apache-2.0. No tratan arquitectura ni dominio: `FND-R12` no les aplica. |

### Creado por la instalación de hoy

| Archivo | Decisión | Motivo |
|:---|:---|:---|
| `docs/implementation/` · `LAYOUT.md` `INSTALL.log` `REGISTRY.json` `HANDOFF.md` `SESSION_LOG.md` `BACKLOG.md` y los tres ledgers | **KEEP** | Registro de la instalación. `LAYOUT.md` está firmado; `INSTALL.log` es append-only. |
| `changes/README.md` · `evidence/README.md` · `QA/README.md` · `PTSA/README.md` · `docs/enterprise-documentation/README.md` | **KEEP** | Sostienen espacios que git no versionaría vacíos (`SUITE-R32`). El de `enterprise-documentation` lo sustituye el paquete al cerrar Foundation. |

**`ARCHIVE`: ninguno. `SUPERSEDE`: ninguno. `DELETE`: ninguno.** No hay documentación heredada
ni notas sueltas: el repositorio nunca acumuló el desorden que `FND-R09` suele encontrar. Lo
que hay que reconciliar no es basura acumulada — son **afirmaciones falsas en documentos
vivos**, que es peor, porque se leen.

---

## Divergencias   `FND-R13`

Lo que la documentación **afirma** frente a lo que el código **hace**. Ocho, todas citables.

| # | Dónde | Afirma | Hace |
|:--|:---|:---|:---|
| **D1** | [README.md:130](../../README.md#L130) y [:165](../../README.md#L165) | «La fuente del framework está en `C:/DevOps/claude/docs/methodology/`» | Esa ruta no existe. El repositorio está en `C:\DevOps\Desarrollos\cauce` y se distribuye como `@a81biz/cauce`. Una instrucción para copiar y pegar que apunta a una carpeta inexistente falla en la primera línea. |
| **D2** | [README.md:151-157](../../README.md#L151-L157) | Instruye **ELIMINAR** «documentación antigua… wikis locales obsoletas, notas sueltas» | `FND-R11` es HARD: **nada se borra, se archiva** en `docs/_archive/<fecha>/`, y `DELETE` solo aplica a regenerables. El README de cauce ordena violar una regla HARD de cauce. |
| **D3** | [README.md:176-203](../../README.md#L176-L203) | Lista manual de artefactos a crear: `PTSA/ESTADO_ACTUAL.md`, `audit-scope.yaml`, `QA/QA-PLAN.md`, `playwright.config.ts` en la raíz… | `INSTALL.md` `I3` describe otra estructura, y `SUITE-R29` difiere `playwright` a cuando se use QA. Dos procedimientos de instalación distintos, ambos vigentes, en el mismo repositorio. |
| **D4** | [README.md:235](../../README.md#L235) | El selftest tiene «105 casos» | `grep -cE '^(chk\|chkno) ' docs/methodology/tools/selftest.sh` → **179**. |
| **D5** | [.github/workflows/verificacion.yml:4](../../.github/workflows/verificacion.yml#L4) | «sus 130 casos» | Los mismos 179. Dos cifras distintas para el mismo hecho, en dos archivos, y ninguna correcta: exactamente el defecto de la v3 —el mismo dato escrito a mano en varios sitios— dentro del repositorio que existe para eliminarlo. |
| **D6** | [README.md:305](../../README.md#L305) y [CLAUDE.md:9](../../CLAUDE.md#L9) | «No uses este repositorio como workspace de desarrollo» · «Este no es un proyecto de desarrollo» | Desde `SUITE-R41` cauce se instala sobre sí mismo y se gobierna con sus propias reglas. Este mismo paquete de Foundation lo desmiente. |
| **D7** | [CLAUDE.md:1](../../CLAUDE.md#L1) y [:41](../../CLAUDE.md#L41) | Título «C:/DevOps/claude» · el árbol declara `tools/ verify-suite.mjs · verify-fdge.mjs` | El nombre es una ruta muerta. Y hay **15** herramientas, no 2: el árbol omite `audit` `build-core` `comparar-marco` `migrate` `patrones` `plan-layout` `revisar-secretos` `selftest` `tracker` `verify-patrones` `verify-ptsa` `verify-qa` `version`, y también `CORE.md`, `CORE-PTSA.md`, `PHASES.md` e `INSTALL.md`. |
| **D8** | [CLAUDE.md:102-113](../../CLAUDE.md#L102-L113) | La rama de trabajo es `desarrollo` y «el merge de `desarrollo` a `main` **es** `G4`» | `git branch -a`: existen `main`, `trabajo` local, y `origin/desarrollo` · `origin/main` · `origin/trabajo`. Esta sesión trabajó en `trabajo`. La compuerta `G4` está descrita sobre una rama que no es la que se usa. |

### Divergencias entre reglas y su ejecución mecánica

Dos huecos donde el marco exige algo que su propia integración continua no comprueba. No son
errores de redacción: son compuertas que no existen donde se dice que existen.

| # | Regla | Qué exige | Qué corre en CI |
|:--|:---|:---|:---|
| **D9** | `FND-R29` — «**nada se publica** sin revisar secretos, y la revisión bloquea» | `revisar-secretos.mjs`, con `--historial`, antes de publicar | [verificacion.yml:24-43](../../.github/workflows/verificacion.yml#L24-L43) corre patrones · suite · core:check · audit · selftest. [publicar.yml:69-77](../../.github/workflows/publicar.yml#L69-L77) corre suite · core:check · audit · selftest. **Ninguno de los dos ejecuta `verify:secretos`**, que sí está en `npm run verify` ([package.json:39](../../package.json#L39)). El escáner solo corre si alguien se acuerda — que es la definición de comprobación que no corre. |
| **D10** | `FDGE-R34` — «`verify-fdge` sin errores es precondición de **G4**. Conviene en CI» | `verify-fdge --all` sobre los artefactos del propio repositorio | `verify-fdge` solo se ejecuta contra los *fixtures* del selftest. Contra los artefactos reales de cauce no lo corre nadie automáticamente. Desde que el repositorio se autoaloja, esto significa que su `G4` no tiene comprobación mecánica propia. |

---

## Áreas sin documentación previa

Todo lo que describa **este repositorio como sistema** es área sin documentar: no existe PRD,
TRD, arquitectura ni catálogo de convenciones. Lo que hay es la portada (`README.md`) y las
instrucciones al agente (`CLAUDE.md`). Concretamente, sin ningún documento que lo cubra:

- El contrato del binario `bin/cauce.mjs`: cinco comandos, sus códigos de salida y la detección
  de autoalojamiento por identidad de paquete.
- El pipeline de publicación: quién puede publicar, con qué confirmación literal, y por qué sin
  credencial (OIDC / Trusted Publisher).
- La arquitectura del verificador: qué comprueba cada una de las 15 herramientas, cuál es su
  contrato de códigos de salida (`0` · `1` · `2 = nada que verificar`) y cómo se componen.
- Las convenciones reales del código: castellano en identificadores y mensajes, comentario de
  cabecera «POR QUÉ EXISTE» con el defecto histórico que originó cada herramienta,
  `split(/\r?\n/)` obligatorio por CRLF, patrones críticos centralizados en `patrones.mjs`.

---

## Desorden estructural del código   `FND-R16`

| Hallazgo | Medida | Lectura |
|:---|:---|:---|
| **No existe `src/`** | Todo el código ejecutable vive en `bin/` (1 archivo, 221 líneas) y en `docs/methodology/tools/` (15 archivos, 5 441 líneas) | Deliberado, no desorden: las herramientas **viajan dentro del paquete** que se instala en el proyecto destino, y ahí su sitio es `docs/methodology/tools/`. Un `src/` obligaría a duplicarlas o a construirlas. Es una desviación consciente que hay que **declarar** en `11-Conventions`, no corregir. |
| **Pruebas mezcladas con el código** | `tools/selftest.sh` (1 109 líneas) convive con las herramientas que prueba | Mismo motivo, misma decisión: se declara. |
| **Archivos desproporcionados** | `verify-fdge.mjs` 1 027 líneas · `selftest.sh` 1 109 | Entre los dos, el **39 %** de todo el código. `verify-fdge` concentra la verificación de siete familias de reglas en un único módulo. |
| **Módulos huérfanos** | Ninguno | Las 15 herramientas se invocan desde `package.json`, `bin/cauce.mjs`, `verificacion.yml` o `selftest.sh`. Comprobado tool a tool. |
| **Duplicación** | Resuelta y con historia | `patrones.mjs` existe porque el sello estaba copiado en tres archivos. La corrección de hoy encontró la misma clase de duplicación en la versión: `verify-fdge`, `migrate` y el fixture del selftest la tenían fijada a mano — ver [INSTALL.log](../implementation/INSTALL.log). |
| **Cobertura del grafo** | `graphify-out/` cubre `bin` — 1 de 16 archivos de código | El alcance lo calculó `plan-layout` (`FND-R28`) y se aceptó tal cual en `G0`. `FDGE-R43` queda satisfecha formalmente sobre un grafo que no describe el sistema. Consecuencia declarada, no oculta. |

**No se propone mover nada.** `FND-R18` es explícito: toda propuesta de normalización cita la
estructura declarada en `11-Conventions.md` §Folder Structure, y ese documento no existe
todavía — se escribe en `PHASE 4`. Sin destino declarado, «ordenar» es preferencia personal. Y
`FND-R17`: Foundation no mueve código; cada normalización aprobada se convierte en un PT
`REFACTOR` con `Estructural: sí` y pasa por sus compuertas.

---

## Propuesta de normalización — para `G0`

Solo documentación. Nada de código.

| # | Qué | Por qué |
|:--|:---|:---|
| **N1** | Recortar de `README.md` el procedimiento manual de instalación (§«Aplicar el framework» escenario B, líneas 124-242) y dejar un puntero a `docs/methodology/INSTALL.md` | Resuelve D1, D2 y D3 de una vez. Mientras existan dos procedimientos, uno de los dos está desactualizado y no se sabe cuál. |
| **N2** | Corregir las cifras de D4 y D5, y **derivarlas** en vez de escribirlas | Es el mismo defecto que `SUITE-R40` persigue para la versión, aplicado al número de casos. |
| **N3** | Reescribir en `README.md` y `CLAUDE.md` lo que afirman sobre el uso del repositorio (D6) y el árbol de herramientas (D7) | Un agente que lee `CLAUDE.md` cree que hay dos herramientas. |
| **N4** | Decidir el modelo de ramas (D8) y escribir el que haya | O se renombra `trabajo` a `desarrollo`, o se documenta `trabajo`. Hoy `G4` está descrita sobre una rama que nadie usa. |
| **N5** | Cabecera de subordinación en `README.md` y `CLAUDE.md` (`FND-R12`) | Declara a qué documento del paquete se subordina cada sección que trate arquitectura o convenciones. |
| **N6** | Añadir `verify:secretos` a `verificacion.yml` y a `publicar.yml` (D9) | `FND-R29` dice «nada se publica sin revisar secretos». Hoy se publica sin revisarlos. |
| **N7** | Añadir `verify-fdge --all` sobre el propio repositorio a `verificacion.yml` (D10) | Cierra `FDGE-R34` para el repositorio que ahora se gobierna a sí mismo. |

`N6` y `N7` tocan la integración continua, no `docs/methodology/`: son cambios de este
repositorio como proyecto. `N1`–`N5` tocan documentos que también son producto — `SUITE-R06e`
sigue vigente sobre ellos.

---

## Confianza de partida

**MEDIA.** Se descompone, porque el promedio escondería las dos mitades:

| Ámbito | Confianza | Sustento |
|:---|:---|:---|
| El marco como producto | **ALTA** | Verificación mecánica que corre y bloquea: `verify-suite` sin errores de coherencia · `audit` con 572 elementos cubiertos y sin huecos · 179 casos de selftest en verde · núcleo sincronizado con sus fuentes. No es una declaración: es la salida de `npm run verify`. |
| El repositorio como sistema documentado | **BAJA** | Cero documentos de arquitectura. Ocho divergencias en los dos únicos documentos que lo describen, dos de ellas contradiciendo reglas HARD del propio marco. |
| Las compuertas mecánicas de este repositorio | **BAJA** | D9 y D10: dos reglas que el marco impone a sus proyectos destino y que no se comprueban aquí. La que más pesa es D9 — la revisión de secretos no corre al publicar, y publicar en npm es irreversible. |

La confianza sube a **ALTA** cuando existan `02-PRD`, `03-TRD`, `06-Backend-Architecture` y
`11-Conventions` (que es lo que `FND-R08` mide) y `N6`/`N7` estén en CI.

---

## Compuerta **G0**   `FND-R10`

Nada se mueve, archiva ni borra sin ACK humano sobre este documento. Al recibirlo se ejecuta lo
aprobado y cada decisión se registra en `docs/implementation/RECONCILIATION.log` con su motivo
y la firma del ACK (`FND-R11`).

```
Revisado por: Alberto Martínez
Fecha: 2026-08-13
Las decisiones de este inventario reflejan lo que quiero: SÍ
```

**ACK recibido el 2026-08-13.** Respuesta literal: «ACK · las 7 normalizaciones». Se ejecutan
`N1`–`N7`; cada una queda registrada en
[RECONCILIATION.log](../implementation/RECONCILIATION.log) (`FND-R11`).
