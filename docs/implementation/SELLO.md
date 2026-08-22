# SELLO — la `12.0.0`   `SUITE-R57`

Cada documento de entrada queda **`ACTUALIZADO`** o **`NO PROCEDE` con motivo**. Una celda vacía
no pasa: es indistinguible de una que nadie miró (`FND-R22`).

**No se pide que cambien: se pide que se decida.**

| Documento | Decisión | Motivo |
|:---|:---|:---|
| `MANUAL.md` | ACTUALIZADO | `SUITE-R58` cambia **cómo se abre una tarea**: `tracker asignar` acepta `--tipo`, `--severidad`, `--epica` y `--titulo`, y escribir `REGISTRY.json` a mano deja la allocation sin `phase`. Es procedimiento, no regla suelta |
| `CASOS-DE-USO.md` | NO PROCEDE | `EP-019` no abre ni cierra ningún caso de uso: corrige defectos dentro de los que ya están. Los huecos declarados en la `11.0.0` —`FQAGE` sobre un paquete sin interfaz, `FIDE` sin ejecutar— siguen igual |
| `README.md` | NO PROCEDE | Su sección «qué está demostrado y qué no» no cambia: los mismos componentes ejecutados, el mismo pendiente. Lo que este lote añade es **cumplimiento mecánico**, que ya estaba declarado como demostrado |
| `Suite-CLAUDE-Template.md` | ACTUALIZADO | Declaraba `suite_version: 5.2.0` —seis versiones atrás— en el **único** documento que se copia a cada proyecto destino, y `version.mjs` era ciego a esa forma (`PT-102`). Ahora se alinea con las demás |
| `graphify-out/` | ACTUALIZADO | Regenerado el 2026-08-22 sobre `bin/` y `docs/methodology/tools/`: 17 archivos, **776 nodos**, **1214 aristas**, 29 comunidades. Lo pidió el firmante al notar que llevaba `SUSPECT` seis tareas seguidas — declarado en seis `context.md` y usado en **cero** |

## Lo que este acta **no** prueba

Que los cinco se revisaran **bien**. Una fila que dice `NO PROCEDE` con motivo es una afirmación
**contrastable**, no una prueba — el mismo límite que `SUITE-R27` declara sobre las firmas.

## Lo que el grafo dio al regenerarse

No es una nota de higiene. Al mirarlo por primera vez en la sesión, dio el diagnóstico de
`PT-102` que el `grep` no daba:

```
quien depende de patrones.mjs, la fuente unica de los patrones criticos
   68  tracker.mjs     42  verify-fdge     10  verify-suite
    6  audit            3  build-core       2  migrate
    2  version.mjs   <- la herramienta cuyo trabajo ES reconocer una forma escrita
```

La que menos compartía de las siete era exactamente la que tenía un patrón crítico escrito en
local. **La causa estaba en la estructura, no en el texto.**

## Firma

```
Sellado por: Alberto Martínez
Fecha: 2026-08-22
Versión: 12.0.0
Lote: EP-019
```

> Los pasos 7 y 8 de `SUITE-R57` —el **tag** y el **PR a la rama por defecto**— son humanos
> (`SUITE-R06a`). Este acta cubre los seis primeros.
