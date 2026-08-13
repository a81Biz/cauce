# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-001 · el-marco-se-hace-cumplir · IN_PROGRESS · issue #2 · G1 PASS
tarea:          PT-004 · DONE · PHASE 8 completa · issue #6 — siguiente en el orden: PT-001 #3. PT-002 #4 y PT-003 #5 en READY
compuerta:      G4 de PT-004 BLOQUEADA por FDGE-R52, que es el defecto de PT-001 · G1, G2 y G3 resueltas por Alberto Martínez el 2026-08-13 (G1 y G2 por delegación con constancia; G3 en persona)
siguiente:      arrancar PT-001 en PHASE 2. Es lo que desbloquea G4 de PT-004: su AC-07 arregla el FDGE-R52 que hoy bloquea la compuerta, y con ello cierra el AC-06 que PT-004 dejó PARCIAL
decisiones:     G0 del terreno y G0 del baseline firmados el 2026-08-13 con las 7 normalizaciones ejecutadas · Declaración de Valor firmada con 4 productos P-001..P-004 · grafo con alcance «bin», no ampliado (TD-01) · frontera por .claude/settings.json · plataforma github · TD-05 sigue sin entrada de CHANGELOG, a propósito · el trabajo se partió en dos implementaciones por FDGE-R48: EP-001 hace cumplible el marco, la migración del proyecto legado va después y está en el out-of-scope de EP-001 · G1 firmada POR DELEGACIÓN el 2026-08-13, con constancia en §4 del intake del lote: INTAKE-R06 se levantó por autorización humana explícita y quedó registrada · severidades declaradas por la misma delegación · PT-004 admitido en el lote tras aparecer al ejecutar PHASE 1 · orden PT-004 → PT-001 → PT-002 → PT-003
no hacer:       escribir bitacora.md de PT-004 para poner FDGE-R52 en verde: el reanclaje está en el issue #6 donde CORE.md manda, y duplicarlo es lo que SUITE-R35 prohíbe · llevar PT-004 a DONE sin G3 humana: SUITE-R06b no lo levanta ninguna delegación · tocar docs/methodology/ fuera del alcance de tasks.md de PT-004: la delegación de G2 cubre ese PT y ese alcance, no el lote entero · modificar docs/methodology/ sin autorización explícita para ESTE lote: la firma de G1 cubre la intención, no SUITE-R06e · escribir traceability.md, discovery.md ajenos o bitacora.md solo para poner verify-fdge en verde: fabricar artefactos para satisfacer una compuerta es el falso verde que este lote existe para eliminar · duplicar el reanclaje en el issue Y en bitacora.md (SUITE-R35: dos copias divergen) · citar en el intake de EP-001 identificadores de PTs ajenos al lote · mergear a main sin G4 · publicar sin decidir TD-05 · borrar origin/desarrollo sin confirmar que no cuelga nada (SUITE-R06f)
actualizado:    2026-08-13
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
