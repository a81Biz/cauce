# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-001 · el-marco-se-hace-cumplir · DRAFT · issue #2
tarea:          ninguna en curso · PT-001 #3, PT-002 #4, PT-003 #5 en DRAFT, detenidos en G1
compuerta:      G1 pendiente · Alberto Martínez · VEREDICTO actual FAIL
siguiente:      firmar §4 del intake de EP-001 y declarar la severidad de PT-001, PT-002 y PT-003 en §5; confirmar o corregir las transcripciones [HUMANO] de §1, §2 y §3. Con eso G1 pasa a PASS, EP-001 a IN_PROGRESS y arranca PT-001 en PHASE 2
decisiones:     G0 del terreno y G0 del baseline firmados el 2026-08-13 con las 7 normalizaciones ejecutadas · Declaración de Valor firmada con 4 productos P-001..P-004 · grafo con alcance «bin» por criterio de plan-layout, no ampliado (TD-01) · frontera por .claude/settings.json, no por contenedor · plataforma github · la corrección de SUITE-R40 sigue sin entrada de CHANGELOG, a propósito (TD-05) · el lote se partió en dos por FDGE-R48: EP-001 hace cumplible el marco, la migración del proyecto legado va después y queda en el out-of-scope de EP-001 · orden PT-001 → PT-002 → PT-003 por solapamiento en selftest.sh
no hacer:       avanzar a PHASE 2 sin la firma de G1 (FDGE-R01, FDGE-R05) · escribir la firma o la severidad en nombre del humano (INTAKE-R04, INTAKE-R06) · tocar docs/methodology/ antes de G2 y sin autorización explícita (SUITE-R06e, FDGE-R13) · citar en el intake de EP-001 identificadores de PTs ajenos al lote: el lector de miembros de INTAKE-R08 los toma por miembros · mergear a main sin G4 · publicar sin decidir TD-05 · borrar origin/desarrollo sin confirmar que no cuelga nada (SUITE-R06f)
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
