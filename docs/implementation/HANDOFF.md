# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: ninguna abierta · EP-011 (#59) CLOSED · el marco se usa a si mismo · 7.6.0 sellada, sin publicar
tarea:          ninguna en curso · PT-039 a PT-043 INTEGRATED · PT-044 (#65), PT-045 (#66) y PT-046 (#67) DEFERRED con su issue, las tres encontradas ejecutando
compuerta:      G4 RESUELTA por Alberto Martinez el 2026-08-14 sobre el PR #68 · G4 de PT-043 con todas sus precondiciones en verde · G4 de PT-039..PT-042 integrada CON EXCEPCION DECLARADA: su FDGE-R34 falla por el formato de HISTORY y no hay regla que permita corregirlo (PT-046)
siguiente:      decidir PT-046 —es lo que bloquea cerrar bien lo anterior y lo que impide que la proxima tarea nazca sobre un ledger que no se puede corregir—. Luego PT-044 y PT-045. NO PUBLICAR: decision humana explicita, «no publicamos aun porque nos falta algo mas»
decisiones:     G4 de EP-011 resuelta el 2026-08-14 por Alberto Martinez: «Firma a mi nombre y cierra el trabajo, realiza el merge correctamente y verifica que la epica en la que trabajamos este correctamente cerrada» · en el mismo acto autorizo integrar PT-039..PT-042 con su FDGE-R34 en rojo, declarado y abierto como PT-046 — no se toco ninguna entrada de HISTORY · el proyecto legado «Inteligencia de Mercados Energeticos Mexicanos» es el CASO DE PRUEBA del marco, no un proyecto donde trabajar: su migracion se cierra cuando el firmante vaya a trabajar ahi, y hasta entonces solo se ejecuta migrate SIN --apply · 6.0.1 PUBLICADA en npm el 2026-08-13 y verificada desde un directorio limpio: el paquete trae SUITE-R42, SUITE-R43 y las funciones de tracker · en ESTE repositorio no hay paquete que instalar: es cauce, y SUITE-R41 lo prohíbe explícitamente · 6.0.1 decidida el 2026-08-13, PATCH: dos correcciones y ninguna regla nueva ni modificada · la delegación se AMPLIÓ a G3 el 2026-08-13 por decisión del firmante, con constancia en la Revisión 1 del intake de EP-003: SUITE-R06b lo pone en la lista de lo que ningún MODO automatiza, y esto es una persona autorizando una excepción con registro, que es lo que la regla de cumplimiento admite · G4 y la publicación siguen sin delegar · 6.0.0 decidida el 2026-08-13, MAJOR porque SUITE-R42 y SUITE-R43 son reglas vinculantes nuevas — el criterio con el que la 5.0.0 subió · la 5.3.0 nunca se publicó y su contenido va dentro de la 6.0.0 · la 6.0.0 nunca se publicó: la sustituyó la 6.0.1, que corrige los dos defectos que habrían llegado a npm con ella · EP-001 y EP-002 CLOSED, en main desde 9ecb1d3 (PR #7), con GitGuardian resuelto como falso positivo · el registro ASIGNA y GitHub ESPEJA: todo el estado publicado se deriva de REGISTRY.json y ninguna lectura de la plataforma lo alimenta · G1 y G2 se firman por delegación con constancia; G3 de un BUG, G4 y la publicación NO se delegan · los .md se quedan: verify-fdge lee archivos, un issue no está versionado y declarar plataforma es opcional · TD-05 resuelta en la entrada de 5.3.0
no hacer:       relajar SUITE-R43 para que el mensaje de cierre no cuente: se arregla quien escribe, no la regla que lo detecta · copiar el intake al issue (SUITE-R35) · consolidar varias transiciones en un solo comentario: una nota por transición, al cerrar cada fase · commitear volcados de logs como evidencia sin redactar (FDGE-R45 — ya pasó una vez) · escribir guardas de CI para casos que no se pueden probar desde aquí · fabricar artefactos para poner una compuerta en verde · mergear a main ni publicar sin decisión humana (SUITE-R06, EXEC-R04) · borrar origin/desarrollo sin confirmar que no cuelga nada (SUITE-R06f)
actualizado:    2026-08-14 · EP-011 completo, 7.6.0 sellada, G4 preparada y sin resolver
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

## Lo que EP-011 dejó abierto, con su issue

Tres defectos, los tres encontrados **ejecutando** y ninguno leyendo. Están en el tablero
(`SUITE-R44`) porque aplazar algo lo pone a la vista, no lo saca.

1. **`PT-044` (#65)** — el YAML de `PT-039`…`PT-042` declara `phase: 1` y `status: DRAFT`
   mientras el registro dice `phase: 8` y `VALIDATION_PENDING`. El YAML manda sobre el registro
   en `verify-fdge`, así que `FDGE-R52` **nunca se evaluó** en esos cuatro. Sincronizarlo es una
   línea por archivo, pero entonces la regla exige siete notas de reanclaje por tarea que nadie
   escribió, y fabricarlas ahora sería un rastro falso.
2. **`PT-045` (#66)** — `npx @a81biz/cauce start`, el arranque que `MANUAL.md` y
   `CASOS-DE-USO.md` documentan, **no arranca**. Dentro del repositorio `npx` resuelve el paquete
   local y no encuentra el binario; fuera, la publicada más alta es `7.1.0` y no tiene `start`.
3. **`PT-046` (#67)** — una entrada de `HISTORY.log` mal formada bloquea `G4` y **ninguna regla
   permite corregirla**: `SUITE-R09` prohíbe editarla, `FDGE-R29` prohíbe una segunda, y la
   comprobación lee la primera. Afecta a las cuatro entradas de este lote anteriores a `PT-043`.

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
