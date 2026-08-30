# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-18 al cerrar `PT-060` en `PHASE 8`.
> mano. Este archivo llevó ocho lotes sin regenerarse y llegó a declarar un estado de tres
> versiones atrás; y `REFACTOR_SCOPE.md`, editado a mano, acabó con catorce filas pegadas en una
> línea. La conclusión de los dos casos es la misma: **un índice que se escribe a mano diverge, y
> solo hace falta tiempo.**

> **Lo de dentro de las marcas lo escribe `tracker indices --aplicar`** y se reescribe entero
> (`PT-123`). Lo de fuera es prosa humana: el **porqué** del orden y del solapamiento, que no
> sale de ningún campo y es lo más valioso que tiene este archivo (`LEX-R26`).

<!-- BACKLOG:DERIVADO -->

## Implementación abierta — `EP-026`

`EP-026` · **Lo que da verde sin mirar: verificadores que avisan donde deberian bloquear** · `READY` · issue [#331](https://github.com/a81Biz/cauce/issues/331).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| PT-179 | BUG | — | DONE | 8 | [#327](https://github.com/a81Biz/cauce/issues/327) | verify-fdge avisa por evidencia que falta estando la tarea pasada de PHASE 6 |
| PT-181 | BUG | — | DONE | 8 | [#329](https://github.com/a81Biz/cauce/issues/329) | La expectativa de un caso se compara como regex y no hay forma de decir literal |
| PT-187 | BUG | S2 | DRAFT | 1 | [#342](https://github.com/a81Biz/cauce/issues/342) | Las versiones no cuadran entre CHANGELOG, tags y npm, y nada lo comprueba |
| PT-192 | BUG | S2 | DONE | 8 | [#349](https://github.com/a81Biz/cauce/issues/349) | El final del arnes se mide por POSICION y castiga cualquier anadido |
| PT-194 | BUG | S2 | DRAFT | 1 | [#351](https://github.com/a81Biz/cauce/issues/351) | La declaracion cauce:senuelos exime el arbol y no el escaneo de historia |
| PT-195 | BUG | S2 | DRAFT | 1 | [#353](https://github.com/a81Biz/cauce/issues/353) | Nada comprueba que la identidad git del repositorio sea de una persona declarada |
| PT-196 | BUG | S2 | DONE | 8 | [#355](https://github.com/a81Biz/cauce/issues/355) | Lo que ocurre DESPUES de G4 no tiene dueno en el protocolo de cierre de lote |
| PT-197 | FEATURE | S2 | DRAFT | 1 | [#356](https://github.com/a81Biz/cauce/issues/356) | DICTAMEN: el septimo componente y el entregable ejecutivo al dueno del dominio |
| PT-198 | BUG | S3 | DONE | 8 | [#357](https://github.com/a81Biz/cauce/issues/357) | Un comentario en linea hace invisible el status del intake, y el mensaje dice que no existe |
| PT-199 | BUG | S2 | DONE | 8 | [#361](https://github.com/a81Biz/cauce/issues/361) | El esqueleto de la corrida acotada no cubre las rutas que el andamiaje toca |
| PT-200 | BUG | S2 | DONE | 8 | [#362](https://github.com/a81Biz/cauce/issues/362) | verify-fdge revisa los 198 PT cada vez, y 189 estan en estado terminal |
| PT-201 | BUG | S2 | DONE | 8 | [#363](https://github.com/a81Biz/cauce/issues/363) | Hay comprobaciones que no pueden correr en local y el marco no lo declara |
| PT-202 | BUG | S3 | DRAFT | 1 | [#364](https://github.com/a81Biz/cauce/issues/364) | publicar.yml viaja al proyecto destino, donde npm publish no aplica |
| PT-203 | BUG | S3 | DONE | 8 | [#365](https://github.com/a81Biz/cauce/issues/365) | Citar un PT en una fila del intake del lote lo convierte en miembro |
| PT-204 | INVESTIGATION | S2 | DRAFT | 1 | [#377](https://github.com/a81Biz/cauce/issues/377) | 124 de 244 reglas no las ejecuta nada, y audit lo dice en cada corrida |
| PT-205 | BUG | S2 | DONE | 8 | [#378](https://github.com/a81Biz/cauce/issues/378) | Cumplir SUITE-R34 exige un acto fuera del comando |

**10 de 16 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Implementación abierta — `EP-027`

`EP-027` · **Saldar la deuda que PT-203 hizo visible: 26 firmas de lote certificadas** · `DRAFT` · issue [#375](https://github.com/a81Biz/cauce/issues/375).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|

**0 de 0 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Aplazado — 4 allocation(s) `DEFERRED`

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| Id | Tipo | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|
| PT-025 | CHORE | [#35](https://github.com/a81Biz/cauce/issues/35) | el adaptador de Azure existe pero no hay proyecto que lo use; escribir la guarda a ciegas seria codigo sin ejecucion |
| EP-023 | — | [#287](https://github.com/a81Biz/cauce/issues/287) | — |
| PT-171 | BUG | [#318](https://github.com/a81Biz/cauce/issues/318) | Aplazado desde PT-159 el 2026-08-26 |
| PT-172 | CHORE | [#319](https://github.com/a81Biz/cauce/issues/319) | Aplazado desde PT-155 el 2026-08-26 |

<!-- /BACKLOG:DERIVADO -->

---

## El porqué — lo que no se deriva

`EP-022` · **Los componentes se declaran, no se escriben a mano** · `READY` · `G1` firmada **por
delegación** el 2026-08-24 (`SESSION_LOG.md`). **Ninguna tarea iniciada, por instrucción explícita
del firmante.**

**Orden y solapamiento** (`FDGE-R40`): **un solo par**, `PT-144 ↔ PT-150` en `tools/patrones.mjs`
→ **serializados**. Los cuatro del medio tocan cada uno un archivo que ningún otro toca, porque la
descomposición es **por herramienta**. `PT-145` junta `verify-suite.mjs` y `comparar-marco.mjs`
**a propósito** —los dos `Set(['FIDE'])` son el mismo hecho— porque partirlos habría dejado la
mitad derivando y la mitad escribiendo durante una integración entera. Ejecución **secuencial**
(`EXEC-R08`).

```
1. PT-144   contrato    2. PT-150   BUG    3. PT-145 · 4. PT-146 · 5. PT-147   herramientas
6. PT-148   documentación                  7. PT-149   la prueba
```

**`PT-144` va primera y no es preferencia**: nadie puede derivar de un contrato que todavía no
existe.

**`PT-150` va segunda y no al final.** Es el único `BUG` del lote, y estrena sobre un hecho
pequeño y aislado —la escala de severidad— el mismo mecanismo que las cuatro herramientas van a
usar después. Si el contrato de `PT-144` no sirve, se sabe aquí y no en la quinta tarea. Entró al
lote **por decisión del firmante**: el borrador lo declaraba fuera de alcance.

**`PT-148` va la sexta y no la primera.** Documentar el procedimiento antes de construirlo
describiría el mecanismo **planeado**, y el planeado y el construido divergen — que es el defecto
de origen de toda la v3.

**`PT-149` es la única que puede cerrar el criterio de éxito del lote.** Las seis anteriores
construyen el mecanismo; solo ella lo **ejecuta**: alta, las cuatro comprobaciones, baja, y el
árbol byte a byte como estaba. Un lote que terminara en `PT-148` habría entregado una promesa.

**Por qué existe este lote**: se derivó investigando un componente nuevo (`DICTAMEN`, `EP-023`) y
el hallazgo fue que **el séptimo componente no se puede añadir hoy sin que su verificación nazca
apagada** — `verify-suite.mjs:250` filtra las reglas por prefijos literales, así que un prefijo
nuevo es invisible y **pasa en verde**.

---

`EP-023` · **`DICTAMEN`** · `READY` · **`G1` resuelta como `CHALLENGE`**, aceptado por el firmante
el 2026-08-24. **No es un `PASS`, y la diferencia importa.**

Su Intake recoge las **quince decisiones** del firmante sobre el séptimo componente y el diseño
propuesto. Su tabla de `PT` está vacía porque el lote **no está descompuesto**: `DoR-E6` no se
puede satisfacer sin tareas, y `DoR-E7` depende de él.

El agente desafió la admisión por eso (`INTAKE-R07`); el firmante, informado, ordenó firmarla
igualmente para no perder lo decidido. **El hueco no se borró: sigue en rojo en su §9**, con el
nombre de quien decidió proceder con él delante. Es para lo que existe la línea
`CHALLENGE aceptado por` de la plantilla.

**Lo firmado es el alcance, no un plan.** Las tareas que se abran bajo `EP-023` llevarán su
`Firmado por lote: EP-023` y esta firma las cubrirá desde que existan (`INTAKE-R08`). Qué cierra
el hueco, sin volver a firmar: `EP-022` cerrado → las cuatro decisiones de diseño abiertas → la
descomposición.

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

## Lotes cerrados

`EP-001` a `EP-014`. **`EP-014` en `main` desde `abab74b` (8.1.0)**, con `G4` resuelta el
2026-08-18 y **sin una sola excepción declarada** — a diferencia de `EP-013`, cuyo `G4` se integró
con un rojo dicho y dejó `PT-055` abierto.

`EP-013` en `main` desde `2c20db8` (**8.0.0**) · `EP-012` desde `c983b05` (**7.7.0**) · `EP-011`
desde `af79c6b` (**7.6.0**).

## Lo siguiente

**`PT-144` · `PHASE 1` → `PHASE 2`.** Es lo primero de `EP-022`, y arranca en cuanto el firmante
lo diga: pidió aviso antes de empezar.

```bash
node docs/methodology/tools/tracker.mjs avanzar PT-144 --a 2 --nota "..."
```

**El terreno ya está puesto**: `G1` de los dos lotes resuelta, espejo publicado —diez allocations
vivas y diez issues, cuadra— y `npm run verify` en verde.

**Pendientes que estos lotes no tocan**, arrastrados de antes:

- Fusionar el viaje de vuelta de `EP-021` a `main` — `trabajo` va por delante.
- `npm publish`, **reservado al firmante** (`SUITE-R06g`), sostenido a lo largo de seis lotes.
- Regenerar el grafo (`FDGE-R32`). Sigue `SUSPECT`.
- `PT-025` (`#35`), el arrastre aceptado.
- La pregunta abierta sobre `FDGE-R19` —si el trabajo de lote puede citar el `EP`—, que ya lleva
  cuatro lotes rodeándose con una excepción declarada.
