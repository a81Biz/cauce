# 02-PRD — requisitos de producto, tal como están implementados

> Foundation `PHASE 2` · 2026-08-19 · suite 9.0.0 · segunda ejecución
> Foundation **descubre, no diseña** (`FND-R02`): esto no es lo que el producto debería hacer,
> es lo que hace, con la cita que lo evidencia. Las recomendaciones están en
> [10-Technical-Debt.md](10-Technical-Debt.md).

## Problema

El problema no es que los agentes escriban mal el código. Es que **el trabajo asistido por IA no
deja rastro**: la decisión vive en el chat, la sesión se comprime, y la siguiente empieza
reconstruyendo qué se estaba haciendo. Cuando algo sale mal, no hay a qué volver.

El `CHANGELOG` documenta la avería concreta que originó la v4: la misma regla escrita a mano en
cuatro documentos, divergiendo, hasta producir *«ocho defectos críticos, incluido un ruleset que
ordenaba destruir datos»* ([CLAUDE.md §Reglas para evolucionar](../../CLAUDE.md)). El producto
existe para que ese modo de fallo sea imposible, no improbable.

## Usuario

Quien construye software con agentes y necesita trazabilidad auditable. `SUITE-R22` declara
explícitamente soportado el caso del **equipo de una sola persona asistida por IA**: no se exige
que las cuatro compuertas las resuelvan personas distintas —eso haría el marco inaplicable ahí—
sino que quede registrado **quién** resolvió cada una.

## Requisitos funcionales

Cada uno con su comprobación mecánica. Un requisito sin script es una recomendación
(`SUITE-R26`).

| ID | Requisito | Implementado en | Comprobado por |
|:---|:---|:---|:---|
| **RF-01** | Un solo asignador de identificadores: todo ID sale de `REGISTRY.json`, nunca de contar entradas | `SUITE-R08` · `LEX-R06` | `verify-fdge` — contador por debajo del ID ya asignado ⇒ falla |
| **RF-02** | Toda decisión irreversible requiere firma humana, sobre una lista **cerrada** de siete acciones | `SUITE-R05` · `SUITE-R06` | `verify-fdge --gate G4` · confirmación literal en [publicar.yml:40-45](../../.github/workflows/publicar.yml#L40-L45) |
| **RF-03** | Ninguna sesión depende de la memoria del agente: el estado retomable cabe en una pantalla y es más reciente que el trabajo | `SUITE-R03` · `SUITE-R33` · `SUITE-R34` | `verify-fdge` — bloque `ESTADO` completo y comparado contra `git log` |
| **RF-04** | El agente carga un núcleo compilado, no la suite entera: ~16 000 tokens en vez de ~59 500 | `SUITE-R15` · [build-core.mjs:4-19](../methodology/tools/build-core.mjs#L4-L19) | `build-core --check` — sello del contenido normalizado |
| **RF-05** | El núcleo es **generado**, nunca editado a mano | `SUITE-R16` | `verify-suite` · caso «CORE.md editado a mano ⇒ falla» |
| **RF-06** | Una regla se define en exactamente un documento; los demás la citan por ID | `SUITE-R14` · `LEX-R23` | `verify-suite` — definición duplicada bloquea |
| **RF-07** | Instalar ancla la versión y hace imposible sincronizar a ciegas en cualquier dirección | `SUITE-R31` · [bin/cauce.mjs:137-155](../../bin/cauce.mjs#L137-L155) | `cauce compare` · selftest «destino que ES cauce ⇒ no se instala» |
| **RF-08** | Nada se publica sin revisar secretos, en el árbol **y en la historia** | `FND-R29` · [revisar-secretos.mjs](../methodology/tools/revisar-secretos.mjs) | Paso bloqueante en `verificacion.yml` y `publicar.yml` |
| **RF-09** | Un falso positivo de secretos se firma por huella, con nombre y motivo; firmar no silencia | `FND-R29` · [SECRETOS-EXCEPCIONES.md](../implementation/SECRETOS-EXCEPCIONES.md) | selftest: «fila sin firmante NO exime» · «firmada ⇒ se ve y no bloquea» |
| **RF-10** | El terreno se enumera y se firma antes de documentar nada; sin firma no se abre trabajo | `FND-R20`..`FND-R23` | `verify-fdge` — `LAYOUT.md` sin firmar bloquea |
| **RF-11** | La instalación deja registro de lo **ejecutado**, no solo de lo decidido, y cada decisión aceptada tiene su rastro | `SUITE-R30` | `verify-fdge` — decisión sin etiqueta `[Ln]` ⇒ falla · etiqueta sin decisión ⇒ falla |
| **RF-12** | El estado vivo puede consultarse fuera del repositorio: el registro asigna, la plataforma espeja | `SUITE-R35` · [tracker.mjs](../methodology/tools/tracker.mjs) | `tracker espejo` — enumeración en las dos direcciones |
| **RF-13** | La versión vigente se **deriva** del `CHANGELOG`; ninguna herramienta la fija | `SUITE-R40` | `verify-suite` · `version.mjs` · selftest «sin CHANGELOG ⇒ no evaluable» |
| **RF-14** | Un patrón crítico vive en un sitio y viaja con lo que debe y no debe casar | `SUITE-R38` · [patrones.mjs](../methodology/tools/patrones.mjs) | `verify-patrones` — «escape degradado ⇒ falla su ejemplo» |
| **RF-15** | Cauce no se instala sobre sí mismo, y se reconoce por **identidad de paquete**, no por ruta | `SUITE-R41` · [bin/cauce.mjs:55-60](../../bin/cauce.mjs#L55-L60) | selftest: «destino que ES cauce ⇒ no se instala» · «un proyecto normal NO es cauce» |

## Requisitos no funcionales

| ID | Requisito | Evidencia |
|:---|:---|:---|
| **RNF-01** | Cero dependencias, de producción y de desarrollo | [package.json](../../package.json) no declara `dependencies` ni `devDependencies` |
| **RNF-02** | Portable entre Windows, macOS y Linux: todo parseo por líneas usa `split(/\r?\n/)` | Declarado en la cabecera de cada herramienta · `RULE-03` |
| **RNF-03** | El coste por sesión es un requisito, no una consecuencia: núcleo < 6 000 tokens | [build-core.mjs:12-14](../methodology/tools/build-core.mjs#L12-L14) |
| **RNF-04** | La verificación corre sin intervención y bloquea | [verificacion.yml](../../.github/workflows/verificacion.yml) en push, PR y `workflow_dispatch` |
| **RNF-05** | El fallo tiene que ser distinguible del éxito | `SUITE-R38` · `revento()` en el selftest invalida un caso si la herramienta lanza una excepción |

## Fuera de alcance

- **Ejecutar el software del proyecto destino.** Cauce verifica artefactos y procedimiento; QA
  ejecuta un navegador, pero el marco no compila, despliega ni prueba el código ajeno.
- **Generar contenedores.** `SUITE-R39`: inventar un `Dockerfile` para un stack que no conoce es
  imponer terreno, que es lo que `FND-R25` prohíbe.
- **Sustituir la decisión humana.** El marco puede garantizar que hay un nombre concreto
  asociado a cada decisión irreversible y que ese nombre estaba autorizado; **no** puede
  garantizar la voluntad detrás (`SUITE-R27`).
