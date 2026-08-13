# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: ninguna abierta · EP-001, EP-002 y EP-003 en CLOSED, las tres en main
tarea:          ninguna · las diez tareas de los tres lotes en INTEGRATED o CLOSED
compuerta:      ninguna pendiente · G4 de EP-003 resuelta por Alberto Martínez con el merge del PR #16 (018e791) y 6.0.1 publicada en npm
siguiente:      lo que queda del objetivo original de la sesión: MIGRAR el proyecto «Inteligencia de Mercados Energéticos Mexicanos» de 4.12.0 a 6.0.1. Ahí sí hay paquete que instalar, y el tramo 4.12→5.x de migrate.mjs SIGUE SIN ESCRIBIRSE — se apartó al out-of-scope de EP-001 y nunca volvió
decisiones:     6.0.1 PUBLICADA en npm el 2026-08-13 y verificada desde un directorio limpio: el paquete trae SUITE-R42, SUITE-R43 y las funciones de tracker · en ESTE repositorio no hay paquete que instalar: es cauce, y SUITE-R41 lo prohíbe explícitamente · 6.0.1 decidida el 2026-08-13, PATCH: dos correcciones y ninguna regla nueva ni modificada · la delegación se AMPLIÓ a G3 el 2026-08-13 por decisión del firmante, con constancia en la Revisión 1 del intake de EP-003: SUITE-R06b lo pone en la lista de lo que ningún MODO automatiza, y esto es una persona autorizando una excepción con registro, que es lo que la regla de cumplimiento admite · G4 y la publicación siguen sin delegar · 6.0.0 decidida el 2026-08-13, MAJOR porque SUITE-R42 y SUITE-R43 son reglas vinculantes nuevas — el criterio con el que la 5.0.0 subió · la 5.3.0 nunca se publicó y su contenido va dentro de la 6.0.0 · la 6.0.0 sigue SIN PUBLICAR y conviene que siga así hasta cerrar EP-003: publicar ahora deja en npm una versión cuyo verify-fdge sale en rojo · EP-001 y EP-002 CLOSED, en main desde 9ecb1d3 (PR #7), con GitGuardian resuelto como falso positivo · el registro ASIGNA y GitHub ESPEJA: todo el estado publicado se deriva de REGISTRY.json y ninguna lectura de la plataforma lo alimenta · G1 y G2 se firman por delegación con constancia; G3 de un BUG, G4 y la publicación NO se delegan · los .md se quedan: verify-fdge lee archivos, un issue no está versionado y declarar plataforma es opcional · TD-05 resuelta en la entrada de 5.3.0
no hacer:       relajar SUITE-R43 para que el mensaje de cierre no cuente: se arregla quien escribe, no la regla que lo detecta · copiar el intake al issue (SUITE-R35) · consolidar varias transiciones en un solo comentario: una nota por transición, al cerrar cada fase · commitear volcados de logs como evidencia sin redactar (FDGE-R45 — ya pasó una vez) · escribir guardas de CI para casos que no se pueden probar desde aquí · fabricar artefactos para poner una compuerta en verde · mergear a main ni publicar sin decisión humana (SUITE-R06, EXEC-R04) · borrar origin/desarrollo sin confirmar que no cuelga nada (SUITE-R06f)
actualizado:    2026-08-13 · suite 6.0.0
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
