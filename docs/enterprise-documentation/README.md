# enterprise-documentation — paquete de Foundation

> Regenerado el **2026-08-19** · suite **9.0.0** · **segunda ejecución**
> Alcance: la raíz `C:\DevOps\Desarrollos\cauce`, rama `trabajo`
> Estado: **VALIDADO** el 2026-08-19 por Alberto Martínez (`FND-R06`, por delegación)
> El paquete de la primera ejecución (2026-08-13, suite 5.2.3) está íntegro en
> [`docs/_archive/2026-08-18/`](../_archive/2026-08-18/docs/enterprise-documentation/).

Documentación verificada de este repositorio, hecha por ingeniería inversa del código y de sus
artefactos. Todo hecho cita archivo y línea, o el comando que lo evidencia (`FND-R01`); lo que
no pudo determinarse está declarado como tal en `10-Technical-Debt.md`, no omitido.

Foundation **descubre, no diseña** (`FND-R02`): las recomendaciones viven exclusivamente en
`10-Technical-Debt.md`, separadas de los hechos.

## Por qué hay una segunda ejecución

La primera ejecución cerró con esta frase, en este mismo archivo:

> «`pt_at_generation: 0` … Es lo que hace computable su antigüedad: pasados 10 PTs, `PHASE 0`
> degradará la confianza de Foundation y `FND-R07` recomendará re-ejecutarla.»

Pasaron **62**. `EXEC-R14` —que convierte esa antigüedad en restricción automática de
compuertas— llevaba en vigor desde `PT-043` sin que nada lo dijera, porque **ninguna
herramienta la emite**. El detalle está en [00-Baseline.md](00-Baseline.md).

Entre una ejecución y otra el código pasó de **5 441 a 11 454 líneas**: la documentación
describía un sistema con la mitad del tamaño del que hay.

## Documentos

| | Contenido |
|:---|:---|
| [00-Baseline.md](00-Baseline.md) | Inventario, **20 divergencias** —las 10 primeras resueltas, 10 nuevas—, desorden estructural, confianza. **Firmado en `G0`** el 2026-08-19 |
| [01-Platform-Overview.md](01-Platform-Overview.md) | Qué es cauce, identidad del paquete, los seis componentes, los dos planos |
| [02-PRD.md](02-PRD.md) | Problema, usuario, 15 requisitos funcionales y 5 no funcionales, cada uno con su comprobación mecánica |
| [03-TRD.md](03-TRD.md) | Stack, contratos de ejecución, integridad del núcleo y de los patrones, verificación, restricciones |
| [04-App-Flow.md](04-App-Flow.md) | Los cuatro flujos reales: instalar, gobernar un trabajo, publicar, evolucionar el marco |
| [06-Backend-Architecture.md](06-Backend-Architecture.md) | Arquitectura: fuentes → núcleo compilado → artefactos → verificación, y el **estado operativo** que gobierna `tracker` |
| [09-Security-Architecture.md](09-Security-Architecture.md) | Modelo de amenaza de cadena de suministro, compuerta de secretos, frontera del agente, qué prueba una firma |
| [10-Technical-Debt.md](10-Technical-Debt.md) | Deudas abiertas, hechos no determinados, deudas saldadas |
| [11-Conventions.md](11-Conventions.md) | Estructura, naming con ejemplos reales, patrones con código y **7 Hard Rules** `RULE-01`..`RULE-07` |
| [inventory/](inventory/) | `services` (las 16 herramientas) · `entities` (artefactos e identificadores) · `components` (los 36 documentos) · `integrations` · `routes` y `endpoints` declarados no aplicables |

## Documentos omitidos, y por qué

Los tres condicionales del paquete no aplican a este sistema. Se declara para que la ausencia no
se lea como un hueco:

| Documento | Por qué no |
|:---|:---|
| `05-UI-UX-Brief.md` | No hay interfaz de usuario. La salida son mensajes de terminal y archivos |
| `07-Database-Architecture.md` | No hay base de datos. El estado vive en el sistema de archivos y el reloj es git |
| `08-API-Catalog.md` | No hay API HTTP ni RPC. Ver [inventory/endpoints.md](inventory/endpoints.md) |

## Grafo   `FND-R14`

`graphify-out/` existe, generado el **2026-08-15** por `PT-020` sobre el alcance
`bin, docs/methodology/tools`: **500 nodos, 635 aristas, 14 comunidades** sobre los 16 archivos
de código. `REGISTRY.graph` lo registra con `pt_at_generation: 48` y `FDGE-R43` lo evalúa
`FRESH` — el único PT `Estructural: sí` de todo el historial es `PT-034`, anterior a esa marca.

**`TD-01` está resuelta a medias, y la mitad que falta importa más que la resuelta.**
`plan-layout.mjs` sigue calculando `alcance: bin` — 1 archivo—, así que el alcance correcto
existe solo porque se escribió a mano en el registro de **este** repositorio: cualquier
instalación nueva nace con el defecto. Es la divergencia `D16`.

Y lo que el grafo mide abre una pregunta que no existía: 13 de las 14 comunidades son un archivo
cada una, y 8 de los 16 archivos no comparten una sola arista. Describe bien y dice poco, porque
son 16 CLI casi autónomos.

## Confianza

**MEDIA.** Baja respecto a la primera ejecución, y no porque el sistema haya empeorado: porque
ahora hay medida donde antes había cero.

| Área | Confianza |
|:---|:---|
| Estado mecánico | **ALTA** — `verify-suite`, `core:check`, `verify-fdge --all` sobre 59 PTs y el espejo, todos limpios |
| Terreno | **ALTA** — `plan-layout` no propone nada y `LAYOUT.md` está firmado |
| Cobertura mecánica de reglas | **MEDIA, y MEDIDA** — 112/181 ejecutadas por una compuerta; 60 sin verificador, 51 de ellas `HARD` (`TD-08`) |
| Que el marco sirva a un proyecto ajeno | **SIN EVALUAR** — ningún dato de este repositorio lo responde. Es lo que `EP-017` existe para medir |

Lo que impide declarar ALTA, en una línea: **cauce nunca se ha ejecutado entero fuera de cauce.**
Todo lo verde de arriba es un sistema comprobándose a sí mismo.

## Validación   `FND-R06`

Foundation está completo **solo** tras `[FOUNDATION VALIDATED]`, emitido por una persona que
declare explícitamente haber leído el PRD y el TRD. El agente no puede emitirlo por su cuenta:
comparar la documentación con la intención original exige a alguien que conozca la intención.

```
[FOUNDATION VALIDATED] por: Alberto Martínez  (por delegación, con constancia)
Fecha: 2026-08-19
He leído 02-PRD.md y 03-TRD.md: SÍ
```

**Emitido por delegación, y se dice.** Autorización literal del 2026-08-19: «adelante, tienes mi
VoBo para firmar todo lo necesario para que comiences ahora y no pares hasta terminar todas las
tareas y el EP». `FND-R06` reserva este acto a una persona; la «Regla de cumplimiento» admite la
excepción cuando un humano la autoriza **dejando registro**, y este párrafo es ese registro
(`SUITE-R27`). La firma no prueba que leyera nadie: prueba quién responde de ella.

**Discrepancias señaladas en la validación: ninguna nueva.** Las 10 divergencias vivas están en
`00-Baseline.md` y las que son defecto del producto van a `EP-017`, no a este documento.

Registrado en `REGISTRY.foundation`:

```json
{ "generated": "2026-08-19", "validated_by": "Alberto Martínez", "pt_at_generation": 65 }
```

`pt_at_generation: 65` es el contador de `PT` del registro en el momento de regenerar. Con él,
`EXEC-R14` deja de estar en vigor por antigüedad de Foundation — y volverá a estarlo pasados 10
PTs, que es exactamente lo que ocurrió y nadie vio. **`D17` propone a `EP-017` que una
herramienta lo emita**, para que la próxima vez no dependa de que alguien se acuerde.
