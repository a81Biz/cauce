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

## Implementación abierta — `EP-023`

`EP-023` · **DICTAMEN: el septimo componente, y el entregable ejecutivo al dueno del dominio** · `READY` · issue [#287](https://github.com/a81Biz/cauce/issues/287).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|

**0 de 0 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Implementación abierta — `EP-025`

`EP-025` · **La bateria se puede certificar: independencia, cierre y sello** · `READY` · issue [#326](https://github.com/a81Biz/cauce/issues/326).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| PT-172 | CHORE | S2 | DEFERRED | 1 | [#319](https://github.com/a81Biz/cauce/issues/319) | La bateria se empaqueta y se sella: CI solo corre lo que puede haber cambiado |
| PT-173 | CHORE | S2 | DONE | 8 | [#320](https://github.com/a81Biz/cauce/issues/320) | las secciones montan lo que necesitan |
| PT-174 | CHORE | S2 | DONE | 8 | [#321](https://github.com/a81Biz/cauce/issues/321) | la seleccion sigue el grafo de importacion |
| PT-175 | CHORE | S2 | DONE | 8 | [#322](https://github.com/a81Biz/cauce/issues/322) | el sello se deriva de las entradas |
| PT-176 | CHORE | S2 | DONE | 8 | [#323](https://github.com/a81Biz/cauce/issues/323) | CI corre solo los paquetes abiertos |
| PT-182 | BUG | S2 | DONE | 8 | [#330](https://github.com/a81Biz/cauce/issues/330) | El mapa fase-artefacto esta escrito a mano en dos herramientas y nadie consume el del cursor |
| PT-188 | BUG | S1 | DONE | 8 | [#344](https://github.com/a81Biz/cauce/issues/344) | Un cd que falla deja al arnes operando sobre el repositorio real |
| PT-189 | BUG | S2 | DONE | 8 | [#345](https://github.com/a81Biz/cauce/issues/345) | FDGE-R54 bloquea con un pronostico sobre una tarea que ya termino |
| PT-190 | BUG | S2 | DONE | 8 | [#347](https://github.com/a81Biz/cauce/issues/347) | La exencion del escaner de secretos depende de un desplazamiento en bytes |
| PT-191 | BUG | S2 | DONE | 8 | [#348](https://github.com/a81Biz/cauce/issues/348) | El sello se estampa con una bandera, no con una corrida |
| PT-193 | CHORE | S3 | DONE | 8 | [#350](https://github.com/a81Biz/cauce/issues/350) | Los literales de fixture se ensamblan en mitades para no entrar en la historia |

**11 de 11 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Implementación abierta — `EP-026`

`EP-026` · **Lo que da verde sin mirar: verificadores que avisan donde deberian bloquear** · `DRAFT` · issue [#331](https://github.com/a81Biz/cauce/issues/331).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| PT-179 | BUG | — | DRAFT | 1 | [#327](https://github.com/a81Biz/cauce/issues/327) | verify-fdge avisa por evidencia que falta estando la tarea pasada de PHASE 6 |
| PT-181 | BUG | — | DRAFT | 1 | [#329](https://github.com/a81Biz/cauce/issues/329) | La expectativa de un caso se compara como regex y no hay forma de decir literal |
| PT-187 | BUG | S2 | DRAFT | 1 | [#342](https://github.com/a81Biz/cauce/issues/342) | Las versiones no cuadran entre CHANGELOG, tags y npm, y nada lo comprueba |
| PT-192 | BUG | S2 | DRAFT | 1 | [#349](https://github.com/a81Biz/cauce/issues/349) | El final del arnes se mide por POSICION y castiga cualquier anadido |
| PT-194 | BUG | S2 | DRAFT | 1 | [#351](https://github.com/a81Biz/cauce/issues/351) | La declaracion cauce:senuelos exime el arbol y no el escaneo de historia |

**0 de 5 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Aplazado — 3 allocation(s) `DEFERRED`

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| Id | Tipo | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|
| PT-025 | CHORE | [#35](https://github.com/a81Biz/cauce/issues/35) | el adaptador de Azure existe pero no hay proyecto que lo use; escribir la guarda a ciegas seria codigo sin ejecucion |
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
