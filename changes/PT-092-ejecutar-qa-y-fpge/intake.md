# PT-092 — Ejecutar QA y FPGE, los dos componentes que nunca han corrido

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-092
type: CHORE
epic: EP-018
track: STANDARD
status: READY
phase: 1
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S2
---
```

## 1. Que se quiere   `[HUMANO]`

Origen: [`H-008`](../../PTSA/Findings/H-008.md) · `D1` · **MEDIA** · estado `IN_REVIEW`.

## 2. El hallazgo

`TD-15` declaraba **tres** componentes nunca ejecutados. La auditoria `PTSA-2026-08-20` cerro uno.
Quedan **dos**:

```
$ node docs/methodology/tools/verify-qa.mjs
No hay QA/ ni docs/implementation/ROADMAP.md: nada que verificar.
```

`P-002` declara valido que *«un agente puede ejecutar una fase completa sin abrir un documento que
`CORE.md` no le remita»*. Demostrado para `Foundation`, para `FDGE` con 82 tareas y desde ayer
para `PTSA`. **No para `QA` ni `FPGE`**, que son un tercio del ciclo que el marco publica.

## 3. Por que ejecutar y no leer

Ejecutar `PTSA` por primera vez revelo **dos fricciones que ningun documento anticipaba**:

1. `verify-ptsa` exige que cada elemento con `NO_APLICA` aparezca **literalmente** en la seccion de
   justificacion. Correcto, y solo se descubre leyendo el verificador.
2. La plantilla de `COVERAGE` no menciona `components.md` entre las fuentes del universo. Para un
   sistema cuyo producto son documentos, hay que decidir si los documentos son filas.

**Ese es el motivo de esta tarea, no un efecto secundario.** `QA` y `FPGE` van a tener las suyas y
no se conocen hasta ejecutarlas.

## 4. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | `QA` ejecutado sobre algo real y `verify-qa` sin errores |
| `AC-02` | `FPGE` ejecutado: `ROADMAP.md` con items `R-NNN` trazables a evidencia |
| `AC-03` | El roadmap de `FPGE` **consume** los hallazgos abiertos de `PTSA` — es el ciclo declarado `PTSA -> FPGE -> FDGE PHASE 1` |
| `AC-04` | `FPGE-R05`: si el score de `PTSA` esta `STALE`, el roadmap lo declara en su encabezado |
| `AC-05` | Las fricciones de las dos ejecuciones quedan escritas, como `MANUAL` §7 recoge las cinco de `PT-072` |
| `AC-06` | `TD-15` se retira o queda con `FIDE` como unico pendiente, con su motivo |

## 5. El problema de `QA` en este repositorio, declarado antes de empezar

**`FQAGE` verifica en un navegador real que el usuario puede usar el sistema.** Aqui no hay
navegador: `inventory/routes.md` y `endpoints.md` declaran «no aplica» porque no hay servidor HTTP
ni interfaz.

Ejecutar `QA` obliga por tanto a decidir **que es «usar el sistema»** para un paquete de linea de
comandos: instalar en un destino limpio, correr un `PT` completo, `cauce verify`. Es una decision
de alcance y va en `PHASE 1` de esta tarea, no improvisada a mitad.

**Si la conclusion es que `QA` no aplica**, esa es una salida legitima — pero entonces se declara
en `CASOS-DE-USO.md` como hueco, y **no** se deja `TD-15` diciendo «nunca ejecutado», que es
indistinguible de «no se pudo».

## 6. Que NO entra

```
OUT: FIDE. Incuba un proyecto desde una idea de negocio y no hay proyecto que incubar.
     Forzar uno es el proyecto-de-prueba-configurado-para-que-salga-bien que PT-072 rechazo.
OUT: actuar sobre lo que QA o FPGE encuentren. Encontrarlo es esta tarea; arreglarlo entra
     por FDGE PHASE 1 como cualquier otro hallazgo.
```

## 7. Riesgo declarado

**Si `QA` y `FPGE` encuentran lo que encontro `PTSA` —nueve hallazgos—, el score BAJA antes de
subir.** Eso no es un riesgo del lote: es el lote funcionando, y esta dicho en `EP-018` §8 para
que no se lea como una regresion cuando ocurra.
## Condicion de cierre   `FDGE-R53`

Termina cuando: `verify-qa` sin errores sobre un `QA/` real, `ROADMAP.md` con items `R-NNN` que consumen los hallazgos abiertos de PTSA, y `TD-15` retirado o con `FIDE` como unico pendiente. Si la conclusion es que QA no aplica a un paquete CLI, termina igualmente: con ese hueco declarado en `CASOS-DE-USO.md`.

## Firma

```
Firmado por lote: EP-018
```
