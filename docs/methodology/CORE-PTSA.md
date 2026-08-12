# CORE-PTSA — overlay de auditoría

<!-- GENERADO por tools/build-core.mjs · NO EDITAR A MANO (SUITE-R16) -->
<!-- cuerpo: b91602b4f6fe -->
<!-- fuentes: PTSA/PTSA-V3-Especificacion-Oficial.md:a5394de866f3 -->

Se carga **solo** en sesiones de PTSA, junto a `CORE.md` (`SUITE-R25`). `CORE.md` lleva las
reglas de PTSA que el resto de la suite necesita; aquí están **todas** las de la
especificación, recortadas a su frase imperativa. El porqué y los ejemplos siguen en
[PTSA/PTSA-V3-Especificacion-Oficial.md](PTSA/PTSA-V3-Especificacion-Oficial.md), que solo se
abre si una línea de aquí lo remite.

## Reglas (80)

`PTSA-R01` PTSA DEBE demostrar, con evidencia, que los productos generados por un sistema son legal, operativa y semánticamente válidos para el dominio de negocio declarado en la Fase PHASE 0.
`PTSA-R02` Producir un Health Score reproducible que cuantifique la salud del sistema sobre 5 dimensiones.
`PTSA-R03` Producir un Risk Score que cuantifique la exposición operativa derivada de los hallazgos abiertos.
`PTSA-R04` Producir un Confidence Score que cuantifique cuánto se puede confiar en la auditoría misma.
`PTSA-R05` Mantener una cadena de trazabilidad inversa completa para cada producto: Producto ← Transformación ← Servicio ← Regla ← Fuente de Datos ← Acción del Usuario.
`PTSA-R06` Mantener un registro inmutable y acumulativo de hallazgos, evidencias y operaciones.
`PTSA-R07` Integrarse con el ciclo de desarrollo (CI/CD, delta sync) para detectar regresiones de dominio tempranamente.
`PTSA-R08` Emitir una clasificación de certificación (A/B/C/F) auditable y defendible ante stakeholders.
`PTSA-R09` PTSA V3 SE APLICA a cualquier sistema que genere productos consumibles a partir de transformaciones, reglas y datos, incluyendo —pero no limitado a— sistemas que usan modelos de lenguaje (LLM), pipelines…
`PTSA-R10` La Parte VIII Nivel 4 (Guardrails de IA) y la dimensión D5 se aplican OBLIGATORIAMENTE solo si el sistema usa generación con IA/LLM.
`PTSA-R11` Cada ejecución de auditoría DEBE declarar su alcance explícito (audit-scope.yaml, Parte IX).
`PTSA-R12` El núcleo de PTSA (dimensiones, scoring, fases, evidencia, lifecycle) es agnóstico al dominio.
`PTSA-R13` Todo producto Primario y todo producto Secundario que alimente a un Primario DEBE tener un archivo Products/P-XXX.md (§21).
`PTSA-R14` A1 — Evidencia sobre Opinión — Toda afirmación de la auditoría DEBE estar respaldada por evidencia verificable.
`PTSA-R15` A2 — Producto sobre Implementación — El valor auditado es el producto. El código solo importa en la medida en que afecta al producto. Auditar carpetas o módulos aislados sin trazarlos a un producto está PROHIBIDO.
`PTSA-R16` A3 — Trazabilidad Inversa — Toda investigación inicia en el producto y se mueve hacia atrás: Producto ← Transformación ← Servicio ← Regla ← Fuente de Datos ← Acción del Usuario.
`PTSA-R17` A4 — Supremacía del Dominio (Regla del Agua Potable) — La corrección técnica jamás compensa una falla de dominio.
`PTSA-R18` A5 — Auditoría Autónoma — Si el auditor posee acceso suficiente para obtener evidencia directamente (terminal, shell, BD, logs), DEBE obtenerla él mismo.
`PTSA-R19` A6 — Inmutabilidad — Los hallazgos se cierran, nunca se borran.
`PTSA-R20` A7 — Certificación Continua — La auditoría es un proceso permanente, no un evento.
`PTSA-R21` A8 — Cobertura Declarada — Ningún score es válido sin una declaración explícita de cobertura (qué se auditó) y frescura (cuándo).
`PTSA-R22` Cada hallazgo DEBE imputarse a exactamente una dimensión.
`PTSA-R23` Para sistemas con IA, D5 DEBE evaluarse. Para sistemas determinísticos, D5 se evalúa solo con métricas de estabilidad/reproducibilidad y Hallucination Rate se marca NO_APLICA.
`PTSA-R24` Los umbrales DEBEN declararse en PHASE 0; los de esta tabla son los valores por defecto cuando PHASE 0 no los especifica.
`PTSA-R25` Toda emisión de scores DEBE registrarse en score-history.json (§22) con fecha, sesión y cobertura.
`PTSA-R26` Los pesos son fijos y NO DEBEN alterarse por auditoría.
`PTSA-R27` Cuando el cap aplica, PHASE 12 y RESUMEN.md DEBEN declararlo explícitamente ("Multiplicador Global APLICA").
`PTSA-R28` Las métricas D5 en rojo añaden riesgo bruto: cada métrica crítica de D5 en estado Rojo suma +3 al Risk_bruto (tratada como un hallazgo de impacto Alto/Probable).
`PTSA-R29` Hallazgo sin Impacto/Probabilidad asignados: PROHIBIDO; todo hallazgo activo DEBE tener ambos para computar riesgo
`PTSA-R30` Una certificación con freshness = UNKNOWN NO PUEDE clasificarse por encima de C.
`PTSA-R31` Toda afirmación que sustente un hallazgo o una validación DEBE referenciar al menos una evidencia.
`PTSA-R32` El cuerpo de una evidencia DEBE contener el contenido capturado literal y una observación factual, sin conclusiones de causa (las causas viven en el hallazgo).
`PTSA-R33` El fingerprint DEBE ser recomputable de forma determinista a partir del origen + lineas.
`PTSA-R34` En cada Delta Sync (§ Parte IX) el auditor DEBE, para cada evidencia referenciada por un hallazgo activo: Resolver origen (+lineas).
`PTSA-R35` Una evidencia obsoleta NO DEBE editarse en su lugar.
`PTSA-R36` Para cada producto, PHASE 6 DEBE construir al menos una cadena completa e ininterrumpida: Producto ← Transformación ← Servicio ← Regla ← Fuente de Datos ← Acción del Usuario
`PTSA-R37` Al cierre de la auditoría, ningún producto DEBE permanecer en DRAFT.
`PTSA-R38` Las transiciones de estado de producto DEBEN respetar la tabla siguiente.
`PTSA-R39` La transición a CLOSED desde un estado de fallo NUNCA se hace por inferencia: requiere evidencia post-corrección observada en la fuente real (p.
`PTSA-R40` La severidad determina la penalización al score de su dimensión según esta tabla fija: Severidad → Penalización → Criterio · CRITICA → 30 → El producto es inválido/inutilizable, o hay riesgo de…
`PTSA-R41` Los hallazgos activos se priorizan en este orden estricto para el roadmap de PHASE 12: Dimensión D1 antes que D2/D3/D4 (supremacía del dominio).
`PTSA-R42` La reapertura NO sobrescribe el hallazgo. Se agrega un bloque ## Revisión — <fecha> al final del archivo del hallazgo describiendo por qué se reabre, con nueva evidencia. El estado YAML del frontmatter se…
`PTSA-R43` El tipo de hallazgo determina la vía y autoridad de cierre: Tipo → Estados de cierre permitidos → Autoridad de cierre · BUG → VALIDATION_PENDING → CLOSED → Solo humano valida y cierra · DOMAIN → IN_REVIEW →…
`PTSA-R44` El agente auditor NO DEBE cerrar hallazgos de tipo BUG ni DOMAIN por sí mismo.
`PTSA-R45` PHASE 6 es el hito operativo central. Las fases PHASE 7, PHASE 8, PHASE 9 y PHASE 10 NO PUEDEN iniciarse hasta que PHASE 6 esté 100% completa para todos los productos identificados.
`PTSA-R46` phase_confidence = mínimo de confidence entre todos los hallazgos activos/no resueltos creados durante esa fase.
`PTSA-R47` Acción obligatoria de PHASE 4: crear PTSA/Products/ y un archivo P-XXX_Nombre.md (estado DRAFT) por cada producto.
`PTSA-R48` PHASE 6 está completa solo cuando todos los productos identificados tienen cadena completa.
`PTSA-R49` Mandato BD de PHASE 7: ejecutar comandos de shell para extraer el esquema REAL de la BD en ejecución.
`PTSA-R50` Regla de PHASE 8: NO depender de pruebas unitarias para validar la exactitud del producto.
`PTSA-R51` Mandato de PHASE 10: PROHIBIDO asumir que el logging funciona.
`PTSA-R52` Acción obligatoria de PHASE 11: calcular y documentar: Score_D1_Parcial = 100 − Σ(penalizaciones hallazgos D1 activos) · Score_D2_Parcial = 100 − Σ(penalizaciones hallazgos D2 activos) · Score_D3_Parcial =…
`PTSA-R53` Mandato PHASE 12 — Dossier Ejecutivo (standalone, PROHIBIDO incluir snippets de código raw).
`PTSA-R54` Cálculo y publicación obligatorios en PHASE 12 y RESUMEN.md: Health_calculado = (D1×0.30)+(D2×0.30)+(D3×0.30)+(D4×0.10) · SI D1 < 60: Health = min(Health_calculado, D1) [declarar Multiplicador Global] ·…
`PTSA-R55` El Acid Test se ejecuta sobre la salida real del producto (extraída de BD/archivo), NUNCA sobre tests unitarios ni sobre el código que lo genera.
`PTSA-R56` Si un producto downstream contradice o introduce elementos no declarados en un upstream, toda la cadena se marca IN_REVIEW.
`PTSA-R57` Toda regla de dominio objetiva y repetible identificada en PHASE 0/PHASE 14 DEBE transformarse en un test ejecutable (Domain Rules as Code) para reducir subjetividad y permitir su verificación automática en…
`PTSA-R58` PTSA DEBE integrarse con CI/CD con checkpoints en las dimensiones automatizables: D2 (tests, vulnerabilidades, esquema), D3 (trazabilidad, logging) y D5 (Success/Failure/Hallucination Rate).
`PTSA-R59` Claude actúa como Auditor Principal. Sus responsabilidades: Recopilar evidencia de primera mano (shell/BD/logs en vivo). · Verificar trazabilidad inversa. · Abrir, actualizar y (cuando el tipo lo permite)…
`PTSA-R60` Proceder autónomamente cuando exista evidencia suficiente y certeza de dominio; detenerse solo ante una barrera hard del entorno (§ Condiciones de Halt).
`PTSA-R61` Si posee acceso a terminal/shell/BD, NUNCA pedir al usuario que ejecute comandos diagnósticos en su lugar; ejecutarlos él mismo, capturar el output y continuar (A5).
`PTSA-R62` Toda conclusión se materializa en un artefacto del repositorio PTSA.
`PTSA-R63` Activar el modo PTSA SOLO ante un trigger explícito (ver Triggers abajo).
`PTSA-R64` NO asumir funcionamiento. Toda afirmación requiere observación (A1).
`PTSA-R65` NO cerrar hallazgos de tipo BUG/DOMAIN sin validación humana (PTSA-R44).
`PTSA-R66` NO inferir estados sin observación directa de la fuente real.
`PTSA-R67` NO sobrescribir hallazgos ni evidencias (A6); usar revisiones/append.
`PTSA-R68` NO transitar un producto a CLOSED sin evidencia post-fix en la fuente real.
`PTSA-R69` NO duplicar filas en las tablas de RESUMEN.md; actualizar la fila existente.
`PTSA-R70` NO aceptar migraciones como verdad del esquema (PHASE 7) ni asumir que el logging funciona (PHASE 10).
`PTSA-R71` Antes de afirmar, capturar. Cada afirmación que sustente un hallazgo o validación se respalda con una evidencia (E-XXX.md) con origen, lineas (si aplica), capturada y fingerprint. La evidencia precede a la…
`PTSA-R72` El cierre sigue la matriz de §31.1. Para BUG/DOMAIN: el agente lleva el hallazgo hasta IN_REVIEW/DONE/VALIDATION_PENDING y se detiene; el humano valida y cierra. Para FEATURE_GAP/REFACTOR/INVESTIGATION: el…
`PTSA-R73` El auditor DEBE detenerse y reportar estado bloqueante SOLO si: El entorno niega explícitamente permisos de shell/ejecución.
`PTSA-R74` Una auditoría es completa SOLO cuando: Todo producto tiene estado final (no DRAFT).
`PTSA-R75` Los archivos Products/P-XXX.md son la verdad autoritativa del estado de cada producto.
`PTSA-R76` Universo auditable enumerado. Antes de evaluar nada, PHASE 3 construye el
`PTSA-R77` Matriz de cobertura. El universo × las dimensiones forma una matriz explícita
`PTSA-R78` Una celda NO_EVALUADA no es un aprobado. No penaliza el Health —no hay
`PTSA-R79` Condición de parada por enumeración. La auditoría cierra cuando la matriz está
`PTSA-R80` Verificación mecánica de la matriz. tools/verify-ptsa.mjs comprueba que: todo producto identificado tiene su Products/P-NNN.md · toda celda de COVERAGE.md tiene

## Verificación

```
node docs/methodology/tools/verify-ptsa.mjs      # antes de certificar un score
node docs/methodology/tools/build-core.mjs --check
```
