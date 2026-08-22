# Foundation — Prompts Operativos

> Método: [Foundation-Protocol.md](Foundation-Protocol.md) ·
> Procedimiento: [Foundation-Implementation.md](Foundation-Implementation.md)
> Reglas: [RULES.md](RULES.md) §Parte 2 · Vocabulario: [LEXICON.md](LEXICON.md)
>
> Suite version: **12.0.1**

---

## PHASE 0 · antes de nada, el terreno                        [FND-R19..R24]

```
node docs/methodology/tools/plan-layout.mjs --write        # FND-R20
```

`FND-R21` · El plan **propone**: no mueve un solo archivo al generarlo. Un `LAYOUT.md` ya
firmado no se sobrescribe — se archiva y se regenera.
`FND-R22` · Cada movimiento se resuelve `ACEPTADO`, `RECHAZADO` con motivo o `MODIFICADO` con
el destino real. La línea del veredicto se edita **en su sitio**: dos veredictos en el archivo
son dos decisiones y nadie sabe cuál vale.

La carpeta que recibe la suite **manda**: es la raíz, sin excepción. Si el código de verdad
vive en un subdirectorio con su propio `.git`, la raíz está fuera del repositorio — y entonces
`G4` no tiene merge que verificar, `PHASE 10` no tiene dónde revertir y la evidencia no se
puede anclar a un commit. Nada de eso da error hasta que lo necesitas.

El plan **propone**; no mueve un archivo. Lo firma una persona en **G0**, movimiento a
movimiento, y lo aceptado se ejecuta después como PT `REFACTOR` con `Estructural: sí`.

`FND-R23` · Mientras `LAYOUT.md` esté sin firmar, `verify-fdge` **no deja abrir trabajo nuevo**.
Los PTs ya en vuelo se terminan. Documentar y auditar una estructura que va a cambiar es
trabajo que hay que rehacer.

### La Declaración de Valor la escribes tú                                    [FND-R24]

Lee `README`, los manifiestos, las rutas, los entry points y los `.md` de negocio, y **redacta
el borrador**: dominio, para quién, productos `P-NNN` y qué hace **válido** a cada uno. El
humano corrige y firma.

Un Intake declara intención futura y solo el humano la tiene (`INTAKE-R01`). La Declaración de
Valor describe lo que **ya existe**, y eso está en el repositorio. Pedírsela en blanco es pedir
trabajo que puedes hacer, y en blanco se responde con generalidades.

## Triggers

| Trigger | Efecto |
|:---|:---|
| `[START FOUNDATION]` | Ingeniería inversa completa. Admite `scope:`. |
| `[FOUNDATION VALIDATED]` | ACK humano. Habilita el resto de la suite. |
| `[START RECONCILE]` | Reconciliación **suelta** sobre un proyecto ya documentado (`FND-R15`). |
| `status FOUNDATION` | Reportar vigencia y cobertura sin regenerar nada. |

---

# `[START FOUNDATION]`

```
[START FOUNDATION]
(opcional) scope: src/ + docker-compose.yml + migrations/

Ejecuta el Foundation Protocol completo, PHASE 0 a PHASE 5.

## REGLA CENTRAL — nada se inventa                                          [FND-R01]
Todo hecho documentado CITA SU FUENTE: ruta de archivo y línea, o el comando que lo
evidencia. Un hecho que no puedas citar NO se documenta: se registra como «No determinado»
en 10-Technical-Debt.md.

Foundation DESCUBRE, no diseña.                                             [FND-R02]
Las recomendaciones van EXCLUSIVAMENTE a 10-Technical-Debt.md, claramente separadas de los
hechos observados. Este documento es una fotografía del sistema, no una sesión de diseño.

## Scope
Sin scope declarado: analiza desde la raíz priorizando src/, configuración y migraciones.
Excluye siempre: node_modules/ · dist/ · build/ · venv/ · .git/ · binarios.

## PHASE 0 — Reconnaissance
NO escribas nada todavía. Esta fase produce comprensión, no output.

Lee en este orden:
  1. README.md raíz
  2. CLAUDE.md — la intención declarada del proyecto
  3. package.json / go.mod / requirements.txt / Cargo.toml → stack
  4. docker-compose.yml / Dockerfile → infraestructura
  5. .env.example → variables de entorno
  6. migraciones o schema de BD → modelo de datos
  7. entry points (src/index.ts, main.go, app.py…)
  8. estructura de carpetas completa
  9. rutas y controllers
  10. tests — revelan el comportamiento esperado

Determina qué documentos condicionales aplican:
  ¿frontend?          → 05-UI-UX-Brief.md
  ¿BD o migraciones?  → 07-Database-Architecture.md
  ¿API HTTP?          → 08-API-Catalog.md

Si ya existe una ejecución previa: lee 11-Conventions.md para conservar sus Hard Rules
manuales y su Delta Log.

## PHASE 1 — Reconciliation · Compuerta G0

Documentación: inventariar TODO lo preexistente con decisión por archivo
KEEP | SUPERSEDE | ARCHIVE | DELETE → 00-Baseline.md                         [FND-R09]
Nada se mueve sin ACK humano [FND-R10]. Nada se borra: se archiva en
docs/_archive/<fecha>/ conservando la ruta; DELETE solo para regenerables    [FND-R11]
Al cerrar, enterprise-documentation es la ÚNICA fuente de arquitectura, dominio y
convenciones [FND-R12]. Línea base de divergencia código ↔ doc previa        [FND-R13]

### Desorden estructural del CÓDIGO                                          [FND-R16]
Cataloga también el código, no solo la documentación:
  · código fuera de src/                · módulos duplicados o casi duplicados
  · módulos huérfanos, sin importadores · configuración dispersa
  · tests mezclados con el código       · archivos desproporcionados
  · rutas que contradicen 11-Conventions §Folder Structure

La estructura OBJETIVO se cita de 11-Conventions. Si esa sección no existe o no cubre el
caso, defínela PRIMERO —es parte del paquete— y solo después propongas mover nada: sin
destino declarado, «ordenar» es preferencia personal.                        [FND-R18]

### NO MUEVAS CÓDIGO                                                          [FND-R17]
Foundation diagnostica y propone; ejecuta FDGE. Cada normalización aprobada en G0 se
convierte en un PT REFACTOR con «Estructural: sí», con sus compuertas, sus tests de
regresión y su rollback. Mover código sin red de tests es exactamente lo que el marco
prohíbe: permitírselo aquí abriría la puerta trasera de todas sus reglas.

La documentación SÍ se mueve en esta fase: no tiene tests que romper, y su desorden
bloquea a PHASE 2.

---

## PHASE 2 — Contexto · PHASE 3 — Técnicos · PHASE 4 — Conventions
Nombres de archivo EXACTOS, los de LEXICON §6.1. Otra grafía es un defecto.  [FND-R03, LEX-R10]

docs/enterprise-documentation/
  01-Platform-Overview.md      06-Backend-Architecture.md
  02-PRD.md                    07-Database-Architecture.md   (condicional)
  03-TRD.md                    08-API-Catalog.md             (condicional)
  04-App-Flow.md               09-Security-Architecture.md
  05-UI-UX-Brief.md (cond.)    10-Technical-Debt.md
                               11-Conventions.md
  inventory/  routes.md · endpoints.md · entities.md · components.md ·
              services.md · integrations.md
  README.md   índice, fecha de generación y scope analizado

## 11-Conventions.md — el documento más crítico                              [FND-R05]
Es lo que permite a todo agente futuro operar sin romper el sistema. Debe contener,
como mínimo:
  - Lógica y reglas de la estructura de carpetas
  - Convenciones de naming (archivos, clases, funciones, tablas, columnas, tests)
    CON EJEMPLOS REALES extraídos del código
  - Patrones arquitectónicos en uso, con ejemplo de código y la regla que el agente
    debe seguir
  - AL MENOS 3 Hard Rules en formato RULE-nn: qué NO hacer, por qué, y ejemplos de
    código correcto e incorrecto
  - Archivos que requieren cuidado extra antes de modificarse
  - Delta Log, para las adiciones incrementales entre ejecuciones completas

Menos de 3 Hard Rules indica que el análisis fue superficial y BLOQUEA la validación.

## Re-ejecución                                                              [FND-R04]
Si docs/enterprise-documentation/ ya existe, una ejecución nueva SOBRESCRIBE el paquete
completo. No es un merge: es una fotografía nueva. La única excepción incremental es el
Delta Log de 11-Conventions.md.

## PHASE 5 — Inventario y grafo
inventory/: routes · endpoints · entities · components · services · integrations
El grafo FORMA PARTE del paquete: generarlo sobre src/ (NUNCA la raíz) y registrar en
REGISTRY.graph {generated, scope, pt_at_generation}.                          [FND-R14]
Sin grafo: cerrar con confianza BAJA declarada; FDGE-R43 bloqueará los PT MAJOR.

## PHASE 6 — Human Validation · STOP
Presenta el índice de lo generado y DETENTE.
Reporta explícitamente:
  - Documentos generados y cuáles se omitieron por no aplicar
  - Hechos que NO pudiste citar y que fueron a 10-Technical-Debt.md como «No determinado»
  - Nº de Hard Rules detectadas en 11-Conventions.md
  - Áreas del código que quedaron fuera del scope

Solicita al humano el ACK `[FOUNDATION VALIDATED]`.
No puedes emitirlo tú.                                                       [FND-R06]
```

---

# `[FOUNDATION VALIDATED]`

```
[FOUNDATION VALIDATED]
PRD revisado: ✓ / ✗ [notas]
TRD revisado: ✓ / ✗ [notas]
Conventions revisado: ✓ / ✗ [notas]
Discrepancias encontradas: [lista o «ninguna»]
Validado por: [nombre] · Fecha: [YYYY-MM-DD]

## Qué hace el agente al recibirlo
1. Registra el ACK en docs/enterprise-documentation/README.md con fecha y firma.
2. Convierte cada discrepancia en una entrada de 10-Technical-Debt.md.
3. Actualiza REGISTRY.json con la fecha de Foundation y el PT vigente en ese momento,
   para poder calcular después su antigüedad.
4. Declara que la suite queda habilitada.

## Por qué este ACK no lo puede dar el agente                                 [FND-R06]
El agente puede verificar que cada hecho cita su fuente. Lo que NO puede hacer es comparar
la documentación con la intención original del proyecto — porque esa intención no está en
el código. Si el PRD generado dice algo que no encaja con lo que se pretendía construir,
eso es una discrepancia REAL entre el código y la intención, y es información valiosa.
Detectarla es exactamente el trabajo de este ACK.
```

---

# `[START RECONCILE]` — reconciliación suelta

```
[START RECONCILE]

Ejecuta SOLO la PHASE 1 (Reconciliation) sobre un proyecto que YA tiene Foundation.
NO regenera el paquete de documentación.                                     [FND-R15]

## Cuándo se usa
- El proyecto instaló 4.0.x, donde esta fase no existía.
- El proyecto se migró desde v3 y arrastra documentación sin decisión.
- La documentación ha vuelto a divergir tras meses de desarrollo.

## Qué lee
docs/enterprise-documentation/00-Baseline.md   ← si existe, es la línea base anterior
docs/implementation/RECONCILIATION.log         ← decisiones ya tomadas: NO se re-preguntan
todo el árbol del repositorio

## Qué hace
1. Inventaría la documentación preexistente que NO tenga ya una decisión registrada en
   RECONCILIATION.log. Lo ya decidido se respeta: una reconciliación no reabre lo cerrado.
2. Decisión por archivo nuevo: KEEP | SUPERSEDE | ARCHIVE | DELETE.        [FND-R09]
3. Mide la divergencia actual entre lo que la documentación afirma y lo que el código hace.
4. Reescribe 00-Baseline.md con la foto de HOY, conservando la sección
   «## Línea base anterior» con los totales de la ejecución previa — así se ve si el
   proyecto mejora o empeora.                                               [FND-R13]

## COMPUERTA G0                                                              [FND-R10]
Nada se mueve, archiva ni borra sin ACK humano sobre 00-Baseline.md.
Tras el ACK: ejecutar, y registrar cada movimiento en RECONCILIATION.log con su motivo
y la firma.                                                                  [FND-R11]

## Qué NO hace
- NO regenera 01..11: para eso está [START FOUNDATION].
- NO toca código.
- NO revierte decisiones anteriores registradas en RECONCILIATION.log.

## Reporta
Documentos nuevos inventariados · decisiones propuestas · divergencias nuevas ·
comparación con la línea base anterior · qué queda pendiente de ACK.
```

---

# `status FOUNDATION`

```
status FOUNDATION

Reporta, SIN regenerar nada:

1. ¿Existe el paquete? Verifica los ARCHIVOS DEL NÚCLEO, no la carpeta:      [FND-R08]
   02-PRD.md · 03-TRD.md · 06-Backend-Architecture.md · 11-Conventions.md
   Si falta alguno → el paquete cuenta como AUSENTE, aunque la carpeta exista.

2. Fecha de generación y scope analizado (del README.md del paquete).

3. Antigüedad (FND-R07 — cuándo procede re-ejecutar):
   - PTs integrados desde entonces (HISTORY.log). Más de 10 → confianza BAJA.
   - Días transcurridos. Más de 90 en proyecto activo → se recomienda re-ejecutar.

4. Origen del paquete: Foundation (observado) o FIDE (previsto).             [FIDE-R06]
   Si es de FIDE y todavía no se ha ejecutado Foundation, decláralo: sus afirmaciones son
   decisiones de diseño, no hechos verificados contra el código.

5. Estado del ACK: ¿se emitió [FOUNDATION VALIDATED]? ¿cuándo y por quién?

6. Hard Rules detectadas en 11-Conventions.md (mínimo exigido: 3).

7. Documentos condicionales presentes y ausentes, con el motivo de la ausencia.

8. Discrepancias registradas en 10-Technical-Debt.md que siguen sin atender.
```
