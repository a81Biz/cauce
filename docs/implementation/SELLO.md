# SELLO — la `10.0.0`   `SUITE-R57`

Cada documento de entrada queda **`ACTUALIZADO`** o **`NO PROCEDE` con motivo**. Una celda vacía
no pasa: es indistinguible de una que nadie miró, por lo mismo que no pasa en `LAYOUT.md`
(`FND-R22`).

**No se pide que cambien: se pide que se decida.** Exigir que cambien produciría retoques
cosméticos para acallar la comprobación, y un manual que cambia tampoco prueba que se revisara lo
que hacía falta.

| Documento | Decisión | Motivo |
|:---|:---|:---|
| `MANUAL.md` | ACTUALIZADO | Sección 6 lleva ahora el paso 0 —sellar— con sus ocho pasos, y la §7 las **cinco fricciones reales** que `PT-072` midió instalando el marco de verdad. Ninguna se me habría ocurrido escribir en agosto. |
| `CASOS-DE-USO.md` | ACTUALIZADO | El hueco «varios agentes a la vez» se estrecha a lo que sigue abierto —la coordinación del reparto—; entran los dos que `PT-019` declaró y `HL-1`; y se añade qué dejó de ser promesa porque se ejecutó. |
| `README.md` | ACTUALIZADO | Dice ahora **qué está demostrado y qué no**, con las dos pruebas y su resultado — incluida la limitación real: `migrate --apply` no se ejecutó. |
| `Suite-CLAUDE-Template.md` | NO PROCEDE | `EP-017` no cambió **qué parametriza** un proyecto destino. `SUITE-R57` trae `umbral_sellado`, que vive en `REGISTRY.tracker` y no en la plantilla; el resto son verificadores y herramientas. `CLAUDE.md` regla 7 dice que sólo se toca si cambia la parametrización. |
| `graphify-out/` | ACTUALIZADO | Regenerado el 2026-08-20 sobre el alcance declarado (`bin`, `docs/methodology/tools`): **17 archivos, 692 nodos, 1041 aristas, 27 comunidades**. `FDGE-R43` pasa de `SUSPECT · 12 de 16` a **al día**, y `REGISTRY.graph` queda anclado en `pt_at_generation: 86`. El grafo obsoleto contestaba **2 importadores de `patrones.mjs`**; el regenerado contesta **8**, que es lo que dice el código. |

## Lo que este acta **no** prueba

Que los cinco se revisaran **bien**. Una fila que dice `NO PROCEDE` con motivo es una afirmación
contrastable, no una prueba — el mismo límite que `SUITE-R27` declara sobre las firmas: hay un
nombre asociado a la decisión, no una garantía de voluntad.

## El grafo era la única fila que bloqueaba

`tracker sellar` no daba el sello por completo mientras `REGISTRY.graph` siguiera desactualizado.
No era un descuido del acta: era la fila haciendo su trabajo — y lo hizo hasta que se resolvió.

La regeneración la autorizó el firmante el 2026-08-20 como **excepción declarada** (`EXEC-R07`),
registrada en [SESSION_LOG.md](SESSION_LOG.md). `FDGE-R32` reserva el disparo a una persona; el
agente ejecutó la instrucción y actualizó `REGISTRY.graph` a continuación.

## Firma

```
Resuelto por: Alberto Martínez
Fecha: 2026-08-20
Confirmo que los cinco documentos de entrada están decididos, y que «graphify-out/» quedó
resuelto tras autorizar la regeneración del grafo: SÍ
```
