# 01-Platform-Overview

> Foundation `PHASE 2` · 2026-08-19 · suite 9.0.0 · segunda ejecución
> Hechos observados con su fuente (`FND-R01`). Lo no citable está en `10-Technical-Debt.md`.

## Qué es

`cauce` es un **marco de gobernanza para desarrollo asistido por IA** que se distribuye como
paquete npm y se instala dentro de otros repositorios. No es una librería que el software
importe: es un cuerpo de documentos normativos más un conjunto de verificadores que se ejecutan
sobre los artefactos del proyecto que lo instaló.

La tesis está en [README.md:13-15](../../README.md#L13-L15): *«Un cauce no empuja el agua:
decide por dónde puede ir. Ninguna regla escrita en un documento obliga a un modelo a
obedecerla — lo que este marco consigue es que lo correcto salga barato y lo incorrecto quede
visible.»* Todo lo que sigue es la mecánica de esa frase.

## Identidad del paquete

| | | Fuente |
|:---|:---|:---|
| Nombre | `@a81biz/cauce` | [package.json:2](../../package.json#L2) |
| Versión | 9.0.0 | [package.json:3](../../package.json#L3) · derivada del `CHANGELOG` (`SUITE-R40`) |
| Binario | `cauce` → `bin/cauce.mjs` | [package.json:19-21](../../package.json#L19-L21) |
| Contenido publicado | `bin`, `docs/methodology`, `README.md`, `LICENSE`, `NOTICE` · excluye `docs/methodology/.claude` | [package.json:22-29](../../package.json#L22-L29) |
| Licencia | Apache-2.0 | [LICENSE](../../LICENSE) · [NOTICE](../../NOTICE) |
| Runtime | Node ≥ 18 · sin dependencias de producción ni de desarrollo | [package.json:30-32](../../package.json#L30-L32) |

El ámbito `@a81biz` es de propiedad, no de uso: npm rechaza `cauce` a secas por parecerse a
paquetes existentes ([README.md:84-86](../../README.md#L84-L86)). El binario sigue llamándose
`cauce`.

## Los seis componentes

Cada uno se activa por su trigger explícito y ninguno se auto-activa (`SUITE-R12`).

| Componente | Trigger | Función |
|:---|:---|:---|
| **FIDE** | `[START FIDE]` | Incuba un proyecto desde una idea de negocio. Instala la suite y se retira. |
| **Foundation** | `[START FOUNDATION]` | Ingeniería inversa del codebase → `docs/enterprise-documentation/`. Este documento es su salida. |
| **FDGE** | `[START PT]` · `[START EP]` | Gobierna cada sesión de desarrollo: Intake → Análisis → Estrategia → Propuesta → Implementación → Evidencia → Validación → Persistencia → Integración → Rollback. |
| **FQAGE** | `[START QA]` | Verifica en un navegador real que el usuario puede usar el sistema. |
| **PTSA** | `[START PTSA]` | Audita los productos generados contra la Declaración de Valor firmada. |
| **FPGE** | `[START FPGE]` | Prioriza qué construir a continuación, con evidencia trazable. |

## Dos planos, y por qué se distinguen

Este repositorio contiene **el marco** y, desde `SUITE-R41`, también **un proyecto gobernado
por el marco** — él mismo.

| Plano | Qué es | Dónde vive |
|:---|:---|:---|
| Producto | Los 36 documentos y las 16 herramientas que se publican | `docs/methodology/` · `bin/` |
| Proyecto gobernado | El registro, el terreno firmado, la evidencia y este paquete de Foundation | `docs/implementation/` · `docs/enterprise-documentation/` · `changes/` · `evidence/` |

La distinción no es formal: decide a qué documento obedece cada cosa. `RULES.md` y `LEXICON.md`
gobiernan **el producto**; este paquete describe **el repositorio**. Confundirlos llevaría a
subordinar `LEXICON.md` a `11-Conventions.md`, contra el orden de autoridad de `LEX-R21` — está
razonado en [00-Baseline.md](00-Baseline.md#una-distinción-que-decide-todo-lo-demás).

## Cómo llega a un proyecto destino

```
npm i -D @a81biz/cauce      →  npx cauce install   →  «instala el framework» en Claude Code
   el paquete se ancla         copia docs/methodology/    las nueve fases de INSTALL.md,
   a una versión               y genera el núcleo         conversacionales y con firma humana
```

`cauce install` **no decide nada** ([bin/cauce.mjs:15-18](../../bin/cauce.mjs#L15-L18)): pone
archivos y ejecuta verificadores. El terreno, los movimientos, las dependencias y la Declaración
de Valor se deciden en conversación (`SUITE-R28`), y quedan firmados en artefactos que
sobreviven a la sesión.

## Estado de esta plataforma

| | |
|:---|:---|
| Verificación propia | `verificacion.yml` bloquea en cada push y PR: patrones · coherencia · núcleo · cobertura · batería de casos · secretos · `verify-fdge` sobre artefactos propios |
| Publicación | Manual, solo desde `main`, con confirmación literal `PUBLICAR` y sin credencial almacenada (OIDC) |
| Cobertura mecánica | 572 elementos enumerados, 0 huecos (`npm run audit`) |
| Autoalojamiento | Instalado sobre sí mismo el 2026-08-13 · [INSTALL.log](../implementation/INSTALL.log) |
