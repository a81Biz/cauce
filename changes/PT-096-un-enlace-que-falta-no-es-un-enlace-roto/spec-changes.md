# Spec changes — `PT-096`

> `PHASE 4`. Cambios en PRD / TRD / API / esquema / contratos / eventos.

## Ninguno de producto

Este repositorio no tiene backend, esquema ni API de negocio: su producto es el marco
(`CLAUDE.md`, Declaración de Valor, `P-001`…`P-004`). No hay PRD ni TRD que tocar, y decirlo es
mejor que citarlos por cumplir.

## Contratos internos que **sí** cambian

Son contratos de función dentro de `tools/tracker.mjs`. Los tres son **retrocompatibles**.

### 1 · `compararEspejo` acepta un quinto parámetro, opcional

```
antes    compararEspejo(vivas, issues, all, refExiste)
despues  compararEspejo(vivas, issues, all, refExiste, refDurable?)
```

`refDurable` es `(allocation) => string | null`. **Si no viaja, la comprobación nueva no se
hace** y el comportamiento es el de hoy — protegido por `TS-09`. Mismo patrón que `refExiste`
introdujo en `PT-079`, y por el mismo motivo: que la función siga siendo probable sin git ni
credenciales.

Es `export`ada y la consume el arnés. Ningún consumidor externo al repositorio la usa: no viaja
en la API pública del paquete, que es `bin/cauce.mjs`.

### 2 · `cuerpoDeIssue` — el texto de dos ramas

El **contrato** no cambia (misma firma, mismas opciones). Cambia el texto emitido:

```
sin ref durable   antes  «…sin enlace: no hay ref durable que lo contenga»
                         «> El enlace apunta a `null`, que es donde el contenido existe ahora.»
                  ahora  la primera linea se conserva, y la nota dice QUE HACER

lote              antes  cabecera + «Tareas de este lote:» + lista
                  ahora  cabecera, sin lista (SUITE-R51)
```

**Consecuencia sobre datos publicados**, declarada porque se ve al mirar el tablero: 14 issues de
lote **pierden** la lista narrada. No se pierde información —la jerarquía real vive en el árbol de
sub-issues desde `PT-035`— pero el texto de esos 14 cuerpos cambia. Se mide antes y después
(`PT-096.8`).

### 3 · `esCuerpoDelTracker` — función nueva, no exportada al principio

```
esCuerpoDelTracker(cuerpo) -> boolean
```

Reconoce un cuerpo escrito por `cuerpoDeIssue` por el marcador
`Intake, criterios de aceptación y evidencia:`. Se exporta **solo si** el arnés la necesita
directamente; `TS-08` la cubre por su efecto, que es lo preferible.

## Lo que NO cambia

```
REGISTRY.json          ningun campo nuevo, ninguno con otro significado
CHECKPOINT.json        intacto
el formato del intake  intacto
RULES.md               SUITE-R51 y SUITE-R56 se CITAN, no se modifican
LEXICON.md             NO se toca aqui: el hueco del «type» de un lote es de L-3
CORE.md                no se regenera — no cambia ninguna regla (SUITE-R16)
```

**`CORE.md` merece la aclaración**: `build-core` lo genera desde las reglas, y aquí no cambia
ninguna. Si `npm run core:check` reportara deriva sería por otra causa, y se miraría antes de
regenerar.

## Compatibilidad con proyectos destino

Ninguna migración. Un proyecto instalado que actualice recibe un `tracker.mjs` que:

- publica cuerpos **con** enlace donde antes publicaba rutas mudas,
- **repara** los cuerpos mudos que ya tuviera, la primera vez que corra `abrir --aplicar`,
- **retira** la lista en prosa de los cuerpos de sus lotes,
- y **bloquea** en `verify:espejo` si tiene cuerpos mudos con ref durable disponible.

El último punto es el único que puede poner en rojo una CI que hoy está en verde. **Es
intencionado y es el objetivo de la tarea** —un verde que escondía diez cuerpos rotos no era un
verde—, pero se declara aquí y se dirá en la guía de la versión que lo lleve, porque un proyecto
destino no tiene por qué deducirlo.
