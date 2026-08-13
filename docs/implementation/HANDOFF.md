# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-001 · el-marco-se-hace-cumplir · IN_PROGRESS · issue #2 · G1 PASS
tarea:          ninguna en curso · las cuatro de EP-001 cerradas — PT-004 (#6) y PT-001 (#3) en DONE esperando el G4 del lote · PT-003 #5 en READY
compuerta:      G4 del lote pendiente · Alberto Martínez · humana sin excepción en los tres modos (EXEC-R04, SUITE-R06a)
siguiente:      revisar el PR de trabajo→main y apretar el merge. Tras el merge: los tres PT DONE pasan a INTEGRATED, EP-001 a CLOSED, y publicar 5.3.0 desde main con publicar.yml, que es manual
decisiones:     versión 5.3.0 decidida el 2026-08-13, MINOR con guía de migración explícita: el único cambio que puede poner en rojo algo que antes pasaba es el espejo en G4 para quien declare plataforma y nunca haya espejado · TD-05 RESUELTA, entró en la misma entrada · PENDIENTE ACEPTADO 2026-08-13, candidato a EP-002: llevar el CONTENIDO COMPLETO de cada fase al issue de GitHub —hoy va un resumen y el detalle enlazado— y añadir una comprobación que impida cerrar fase con comentarios humanos sin responder. NO se quitan los .md: el diagnóstico se aceptó — verify-fdge lee archivos, un issue no está versionado y declarar plataforma es opcional · el espejo bloquea donde la credencial es exigible (npm run verify, push a main, G4) y sale SIN EVALUAR donde no puede estarlo (PR desde fork, máquina sin gh auth login) · VIVOS incluye ahora DONE y VALIDATION_PENDING: un PT que espera el merge es lo más abierto que hay · G0 del terreno y G0 del baseline firmados el 2026-08-13 con las 7 normalizaciones ejecutadas · Declaración de Valor firmada con 4 productos P-001..P-004 · grafo con alcance «bin», no ampliado (TD-01) · frontera por .claude/settings.json · plataforma github · TD-05 sigue sin entrada de CHANGELOG, a propósito · el trabajo se partió en dos implementaciones por FDGE-R48: EP-001 hace cumplible el marco, la migración del proyecto legado va después y está en el out-of-scope de EP-001 · G1 firmada POR DELEGACIÓN el 2026-08-13, con constancia en §4 del intake del lote: INTAKE-R06 se levantó por autorización humana explícita y quedó registrada · severidades declaradas por la misma delegación · PT-004 admitido en el lote tras aparecer al ejecutar PHASE 1 · orden PT-004 → PT-001 → PT-002 → PT-003
no hacer:       consolidar varias transiciones en un solo comentario de issue: una nota por transición, escrita AL CERRAR cada fase y no al final · mergear a main hasta que el lote entero esté cerrado: mandar a main es desplegar una versión, y la versión no está completa · escribir guardas de CI para casos que no se pueden probar desde aquí (la del fork se retiró por eso) · llevar PT-004 a DONE sin G3 humana: SUITE-R06b no lo levanta ninguna delegación · tocar docs/methodology/ fuera del alcance de tasks.md de PT-004: la delegación de G2 cubre ese PT y ese alcance, no el lote entero · modificar docs/methodology/ sin autorización explícita para ESTE lote: la firma de G1 cubre la intención, no SUITE-R06e · escribir traceability.md, discovery.md ajenos o bitacora.md solo para poner verify-fdge en verde: fabricar artefactos para satisfacer una compuerta es el falso verde que este lote existe para eliminar · duplicar el reanclaje en el issue Y en bitacora.md (SUITE-R35: dos copias divergen) · citar en el intake de EP-001 identificadores de PTs ajenos al lote · mergear a main sin G4 · borrar origin/desarrollo sin confirmar que no cuelga nada (SUITE-R06f)
actualizado:    2026-08-13 · suite 5.3.0
<!-- /ESTADO -->

---

## Qué se hizo en esta sesión

Dos cosas, en este orden:

1. **Instalación autoalojada** de la suite 5.2.3 sobre el propio repositorio (`SUITE-R41`: el
   destino ES cauce, no se copió nada). Registro, terreno, estado, estructura y grafo.
   Detalle en [INSTALL.log](INSTALL.log); decisiones y firmas en [LAYOUT.md](LAYOUT.md).
2. **Foundation completo**, `PHASE 0` a `PHASE 6`. Paquete en
   [docs/enterprise-documentation/](../enterprise-documentation/): 9 documentos más
   `inventory/`. Reconciliación firmada en `G0` con 7 normalizaciones ejecutadas
   ([RECONCILIATION.log](RECONCILIATION.log)).

`verify-fdge --all`: **sin errores**. `npm run verify`: en verde.

3. **`[FOUNDATION VALIDATED]`** el 2026-08-13, sin discrepancias. `REGISTRY.foundation` escrito
   con `pt_at_generation: 0`. `SUITE-R07` satisfecha: el resto de la suite queda habilitado.

## Lo que queda abierto

1. **`TD-05` · la corrección de `SUITE-R40` sin versionar** — está en el árbol de trabajo sin
   entrada en `CHANGELOG.md`. `publicar.yml` publica desde `main`: hay que decidirlo antes del
   merge. `package.json` y el `CHANGELOG` siguen alineados en 5.2.3, así que nada miente hoy.
2. **`TD-01` · el grafo cubre 1 de 16 archivos** — `FDGE-R43` se satisface formalmente sobre un
   grafo que no describe el sistema.
3. **`TD-04` · `QA/` y `qa/`** son el mismo directorio en Windows y macOS. Corregirlo toca
   `LEXICON.md`: `SUITE-R06e`.
4. **`TD-06` · `origin/desarrollo`** sobra. Borrar una rama remota es `SUITE-R06f`.

La lista completa, con su evidencia, está en
[10-Technical-Debt.md](../enterprise-documentation/10-Technical-Debt.md).
