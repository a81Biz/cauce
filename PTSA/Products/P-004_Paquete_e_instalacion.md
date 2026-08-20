---
id: P-004
nombre: Paquete e instalacion
clase: Primario
estado: IN_REVIEW
auditoria: PTSA-2026-08-20
criterio_de_validez: "instalar deja el marco anclado a una version y sincronizar a ciegas es imposible en las dos direcciones"
hallazgos: [H-001, H-006]
---

# P-004 — Paquete e instalacion

> Producto **Primario** · estado `IN_REVIEW`
> Hallazgos activos: [[H-001]] · [[H-006]]

## Criterio de validez   `FND-R24`

> «instalar deja el marco anclado a una version y sincronizar a ciegas es imposible en las dos direcciones»

Redactado por quien conoce el negocio y firmado el 2026-08-13. **No lo fija el auditor**: el
auditor mide contra él.

## Qué entrega

`@a81biz/cauce` · `bin/cauce.mjs` con siete comandos · `publicar.yml`.
**Cero dependencias** declaradas: `dependencies` y `devDependencies` están ambas vacías.

## Acid Test   `PTSA-R55`

**(a) instalar deja el marco anclado a una versión**

```
SUITE-R13  Todo proyecto destino declara suite_version en REGISTRY.json y en su CLAUDE.md.
           la comprueba  verify-fdge.mjs · verify-suite.mjs   (BLOQUEA)
```

El anclaje no es una convención: dos verificadores lo bloquean. **PASA.**

**(b) sincronizar a ciegas es imposible en las dos direcciones**

```
paquete -> destino   cauce.mjs:143  si el destino difiere y no hay --forzar:
                     «El destino ya tiene una copia del marco y NO es identica a la de cauce X»
                     enumera los archivos que difieren, explica que sobrescribir puede revertir
                     correcciones hechas alli, y sale con codigo 2.
destino -> paquete   tools/comparar-marco.mjs — demostrado en PT-019 sobre un legado real:
                     36 de 39 archivos distintos y 13 ausentes.
```

Las dos direcciones guardadas. **PASA.**

## Y sin embargo, `IN_REVIEW`

**`H-001` toca este producto en el acto que lo define.** El tarball incluye
`bin/graphify-out/cache/ast/*.json`, un artefacto local no versionado con rutas absolutas del disco
del mantenedor. Publicar desde CI produce 57 archivos; desde esta máquina, 58.

Una versión anclada que **cambia de contenido según quién la publique** es la negación exacta del
criterio (a). Es el hallazgo que bloquea publicar, y no por el score.

`H-006` es menor y del mismo material: `CLAUDE.md` anuncia cuatro comandos y el binario expone
siete.

## Cadena de trazabilidad inversa

```
Producto        el tarball de npm, y el arbol que deja en un destino
  ← Transformacion   npm pack / npm publish --provenance  ·  copiarCarga() del binario
  ← Servicio         bin/cauce.mjs · .github/workflows/publicar.yml
  ← Regla            SUITE-R13 versionado · SUITE-R31 nadie sincroniza a ciegas · SUITE-R06a
  ← Fuente de datos  package.json (files, bin, engines) · docs/methodology/ · CHANGELOG.md
  ← Accion de usuario  npx @a81biz/cauce install  ·  el disparo manual de publicar.yml
```
