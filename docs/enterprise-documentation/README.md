# enterprise-documentation — paquete de Foundation

> Generado el **2026-08-13** por `[START FOUNDATION]` · suite **5.2.3**
> Alcance: la raíz `C:\DevOps\Desarrollos\cauce`, rama `trabajo`
> Estado: **VALIDADO** el 2026-08-13 por Alberto Martínez (`FND-R06`)

Documentación verificada de este repositorio, hecha por ingeniería inversa del código y de sus
artefactos. Todo hecho cita archivo y línea, o el comando que lo evidencia (`FND-R01`); lo que
no pudo determinarse está declarado como tal en `10-Technical-Debt.md`, no omitido.

Foundation **descubre, no diseña** (`FND-R02`): las recomendaciones viven exclusivamente en
`10-Technical-Debt.md`, separadas de los hechos.

## Documentos

| | Contenido |
|:---|:---|
| [00-Baseline.md](00-Baseline.md) | Inventario del desorden de partida, 8 divergencias, confianza. **Firmado en `G0`** el 2026-08-13 |
| [01-Platform-Overview.md](01-Platform-Overview.md) | Qué es cauce, identidad del paquete, los seis componentes, los dos planos |
| [02-PRD.md](02-PRD.md) | Problema, usuario, 15 requisitos funcionales y 5 no funcionales, cada uno con su comprobación mecánica |
| [03-TRD.md](03-TRD.md) | Stack, contratos de ejecución, integridad del núcleo y de los patrones, verificación, restricciones |
| [04-App-Flow.md](04-App-Flow.md) | Los cuatro flujos reales: instalar, gobernar un trabajo, publicar, evolucionar el marco |
| [06-Backend-Architecture.md](06-Backend-Architecture.md) | Arquitectura: fuentes → núcleo compilado → artefactos → verificación |
| [09-Security-Architecture.md](09-Security-Architecture.md) | Modelo de amenaza de cadena de suministro, compuerta de secretos, frontera del agente, qué prueba una firma |
| [10-Technical-Debt.md](10-Technical-Debt.md) | 7 deudas abiertas, 4 hechos no determinados, 7 deudas saldadas en esta instalación |
| [11-Conventions.md](11-Conventions.md) | Estructura, naming con ejemplos reales, patrones con código y **7 Hard Rules** `RULE-01`..`RULE-07` |
| [inventory/](inventory/) | `services` (las 15 herramientas) · `entities` (artefactos e identificadores) · `components` (los 34 documentos) · `integrations` · `routes` y `endpoints` declarados no aplicables |

## Documentos omitidos, y por qué

Los tres condicionales del paquete no aplican a este sistema. Se declara para que la ausencia no
se lea como un hueco:

| Documento | Por qué no |
|:---|:---|
| `05-UI-UX-Brief.md` | No hay interfaz de usuario. La salida son mensajes de terminal y archivos |
| `07-Database-Architecture.md` | No hay base de datos. El estado vive en el sistema de archivos y el reloj es git |
| `08-API-Catalog.md` | No hay API HTTP ni RPC. Ver [inventory/endpoints.md](inventory/endpoints.md) |

## Grafo   `FND-R14`

`graphify-out/` existe, generado el 2026-08-13 sobre el alcance `bin`: 18 nodos, 20 aristas, 3
comunidades. `REGISTRY.graph` lo registra con `pt_at_generation: 0` y `FDGE-R43` lo evalúa
`FRESH`.

**Cubre 1 de los 16 archivos de código.** El alcance lo calculó `plan-layout` y así se aceptó en
`G0`; la consecuencia está declarada como `TD-01`, no escondida.

## Confianza

**MEDIA-ALTA.** El marco como producto tiene verificación que corre y bloquea —572 elementos
enumerados sin huecos, 180 casos en verde, coherencia sin errores—. Lo que estaba en cero era la
documentación **del repositorio como sistema**: eso es lo que este paquete cierra.

Lo que impide declarar ALTA: el grafo cubre el 6 % del código (`TD-01`), y no hay medición
reproducible del ahorro de contexto que `SUITE-R15` declara (`10-Technical-Debt` §Hechos no
determinados).

## Validación   `FND-R06`

Foundation está completo **solo** tras `[FOUNDATION VALIDATED]`, emitido por una persona que
declare explícitamente haber leído el PRD y el TRD. El agente no puede emitirlo: comparar la
documentación con la intención original exige a alguien que conozca la intención.

```
[FOUNDATION VALIDATED] por: Alberto Martínez
Fecha: 2026-08-13
He leído 02-PRD.md y 03-TRD.md: SÍ
```

Respuesta literal: «`[FOUNDATION VALIDATED]`», emitida después de que la conversación declarara
qué atestigua el trigger — que se han leído el PRD y el TRD (`FND-R06`). La lectura no se deduce
del trigger: se declaró la condición antes de pedirlo, y quien lo emitió responde de lo que
lleva su nombre (`SUITE-R27`).

**Discrepancias señaladas en la validación: ninguna.** No hubo, por tanto, nada que trasladar a
`10-Technical-Debt.md` por esta vía; la deuda que ese documento recoge la encontró Foundation,
no la validación.

Registrado en `REGISTRY.foundation`:

```json
{ "generated": "2026-08-13", "validated_by": "Alberto Martínez", "pt_at_generation": 0 }
```

`pt_at_generation: 0` porque ningún PT se había abierto cuando se generó el paquete. Es lo que
hace computable su antigüedad: pasados 10 PTs, `PHASE 0` degradará la confianza de Foundation y
`FND-R07` recomendará re-ejecutarla.

Con esto, `SUITE-R07` queda satisfecha y el resto de la suite está habilitado.
