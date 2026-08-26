# Suite CLAUDE.md — Template de integración

> Copiar al `CLAUDE.md` del proyecto, **después** de sus secciones propias (Project Overview,
> Development Commands, Architecture).
>
> Suite version: **13.2.0** · Referencia: `docs/methodology/`

---

# Part N — Methodology Suite

## Qué carga el agente

**`docs/methodology/CORE.md`** — reglas y procedimiento, y nada más (`SUITE-R15`).
Cualquier otro documento se abre **solo** cuando `CORE.md` lo remite para un caso concreto.

Este bloque **no repite las reglas**. Hasta 4.2.0 llevaba un resumen de ~5 600 tokens que se
cargaba en **cada** sesión, duplicaba `CORE.md` y era una copia más que podía divergir — la
causa raíz que la v4 nació para eliminar (`SUITE-R21`).

```
docs/methodology/CORE.md          ← lo único que se carga por defecto
├── LEXICON.md          nombres: fases, IDs, estados, archivos, triggers
├── RULES.md            reglas de componente, con ID y severidad
├── EXECUTION-MODES.md  compuertas, modos, lotes
└── PHASES.md           procedimiento denso por fase

docs/methodology/CORE-PTSA.md     ← SOLO con [START PTSA] · SUITE-R25
└── PTSA/PTSA-V3-Especificacion-Oficial.md   las 80 reglas de auditoría
```

`SUITE-R25` · Un componente cuyo ruleset propio no cabe en `CORE.md` sin encarecer todas las
sesiones recibe un **overlay**, que se carga solo al invocarlo. Hoy solo PTSA tiene uno: sin
él, `[START PTSA]` auditaría con 23 de sus 80 reglas.

Orden de autoridad ante conflicto (`LEX-R21`):
`LEXICON` → `RULES` → `EXECUTION-MODES` → **este `CLAUDE.md`** → `PHASES` y `*-Prompts` →
`Framework-*` (explican, nunca mandan).

`SUITE-R00` · Este archivo **parametriza**; no legisla. Ninguna regla puede derogarse aquí.

---

## Parametrización del proyecto

**Única sección que se personaliza.** Todo lo demás son punteros.

```yaml
suite_version: 13.2.0
execution_mode: SUPERVISED        # MANUAL | SUPERVISED | AUTONOMOUS
firmantes:                        # quién puede firmar un Intake y resolver una compuerta
  - Nombre Apellido
```

`SUITE-R27` · La lista `firmantes` es la única defensa mecánica que existe contra una firma
inventada. **No prueba que firmara una persona** —el agente escribe el archivo— pero sí
convierte la firma en una afirmación contrastable: un nombre que no está en la lista falla, y
quien aparece en ella responde de lo que lleva su nombre. Mantenerla al día es del humano.

### Declaración de Valor — la produce Foundation, no la instalación   `FND-R24`

**No la rellenes al instalar.** Describir qué entrega el sistema exige haber leído el código, y
eso es `PHASE 0` de Foundation. Ahí el agente la redacta —leyendo `README`, manifiestos, rutas,
entry points y `docs/business/`—, tú la corriges y la firmas, y la primera auditoría PTSA la
contrasta contra los productos reales.

Pedirla antes de saber es pedir generalidades. Deja el marcador tal cual:

```
Dominio de negocio:      PENDIENTE — Foundation PHASE 0
Para quién:              PENDIENTE — Foundation PHASE 0
Productos P-NNN:         PENDIENTE — Foundation PHASE 0
Qué hace VÁLIDO a cada uno:  PENDIENTE — Foundation PHASE 0 · lo confirma el humano

Estado: SIN FIRMAR. PTSA audita contra esta declaración.
Firmada por:
Fecha:
```

Lo único que no puede redactar el agente es **qué hace válido** un producto: describirá lo que
el sistema entrega, pero si eso sirve o no lo sabe quien conoce el negocio.

---

## Lo que nunca se automatiza — `SUITE-R06`

```
a) merge o push a la rama principal      e) modificar docs/methodology/
b) cerrar un ítem de tipo BUG            f) push --force · reescribir historia
c) migrar o borrar datos                 g) rotar o exponer credenciales
d) tocar producción
```

Si un trabajo lo requiere: preparar todo lo demás, detenerse en el punto exacto y
**describir el comando**. No ejecutarlo (`EXEC-R07`).

---

## Verificación

```bash
node docs/methodology/tools/verify-fdge.mjs PT-XXX             # cumplimiento de un PT
node docs/methodology/tools/verify-fdge.mjs --gate G4 PT-XXX   # precondiciones de merge
node docs/methodology/tools/verify-suite.mjs docs/methodology   # coherencia de la metodología
node docs/methodology/tools/build-core.mjs                      # regenerar CORE tras tocar reglas
node docs/methodology/tools/migrate.mjs                          # migrar de versión
```

`FDGE-R34` · `verify-fdge` sin errores es precondición de **G4**. Conviene en CI, junto con
`verify-suite` y `build-core --check`.

---

## Regla de cumplimiento

Si cualquier fase, compuerta o precondición está incompleta: **detenerse**, reportar la
condición bloqueante y no continuar hasta resolverla, o hasta que un humano autorice la
excepción dejando registro de esa autorización.
