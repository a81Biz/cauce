---
id: EP-021
slug: el-aplazado-sin-puerta-de-vuelta
type: EPIC
status: DRAFT
phase: 1
suite_version: 13.0.0
---

# Intake — LOTE `EP-021` · el aplazado sin puerta de vuelta

> Nace de una observación del firmante, no de una auditoría: *«`PT-134` como aplazado, ¿de qué
> sirve? ¿cuándo se retoma? el mismo issue no indica cuándo se tomará ni qué pasará con ése»*.
> Medir esa pregunta contra el código abrió las otras seis.

---

## 1. Objetivo común `[HUMANO]`

**Que nada entre al tablero sin puerta de salida.** Hoy un `DEFERRED` es un destino del que no
se vuelve: ni por comando, ni por fecha, ni por condición escrita. Este lote le da las tres —y
de paso arregla los cuatro defectos de herramienta que aparecieron al medirlo.

## 2. La causa, medida `[AGENTE]`

### 2.1 El lazo cerrado

`SUITE-R44` declara que un aplazado queda **exento de artefactos** —no tiene intake— y **vivo
para el espejo**. `integrar`, el único comando que acepta un estado destino arbitrario, exige
que **el intake declare `status:`**:

```
tracker.mjs:4148    if (!m) fail('FDGE-R23', `${id}: su intake no declara «status:»...`)
```

Ningún otro comando escribe ni retira `DEFERRED` — comprobado sobre las cuatro únicas
asignaciones de estado que existen (`tracker.mjs` 3279, 3285, 4214, 4284). **La regla que pone
la tarea en el tablero es la misma que la deja inalcanzable.** Retomar `PT-134` hoy exige
escribir `REGISTRY.json` a mano, que es lo que todo este marco existe para impedir.

### 2.2 Lo que la regla no dice

`SUITE-R44` no exige **condición de reentrada**, ni **fecha de revisión**, ni **dueño**.
Contrastado contra los dos aplazados vivos:

| | `PT-134` #255 | `PT-025` #35 |
|:---|:---|:---|
| Creado | 2026-08-23 | mucho antes |
| Condición de reentrada | — | — |
| Fecha de revisión | — | — |
| Dueño | — | — |

**En el tablero son indistinguibles**, y también lo son de un abandono. La numeración pasó de
`PT-134` a `PT-143` sin que nada lo notara.

### 2.3 Los cuatro defectos de herramienta, medidos

| Dónde | Qué |
|:---|:---|
| `tracker.mjs:1849` | El `catch` de `SUITE-R56` referencia `origen`, inexistente en ese ámbito: el manejador de error **lanza otro error**, tapa el fallo real y deja el comando a medias con el efecto ya aplicado |
| `tracker.mjs:3091` | `proyectar` toma `refs/heads/<rama>` como padre; si falta, commitea **sin `-p`** y la salida es **idéntica** a la del caso bueno |
| `patrones.mjs` · `topologiaDeRamas` | Sólo comprueba que la rama **contenga** un id del registro. `ramaDeTarea` deriva el nombre correcto y se usa **una sola vez**, en `rama`, como propuesta |
| `tracker.mjs` · `asignar` | El prefijo sale de `ARGS.find(a => /^[A-Z]+$/)`, así que `--tipo BUG` sin un `PT` delante crea **`BUG-001`** |

Los tres primeros produjeron daño real en esta sesión: una rama de proyección regenerada desde
cero, un comando que reventó dejando un issue creado, y tres ramas con `type` y slug inventados
que ninguna comprobación nombró.

## 3. Criterio de éxito del lote `[HUMANO]`

1. `PT-134` sale de `DEFERRED` **por comando**, y ese acto es la prueba de que el comando existe.
2. Al cerrar el lote, **el único arrastre es `PT-025` (#35)**.
3. Un `DEFERRED` sin condición de reentrada ni fecha de revisión **bloquea en `G4`**.
4. Los cuatro defectos de herramienta tienen caso en la batería que **puede fallar**.

## 4. Qué NO entra en el lote `[HUMANO]`

| Fuera | Dónde va |
|:---|:---|
| Desarrollar `PT-025` · la guarda de cierre en Azure | `PT-025` — sigue aplazado, y será el primer caso al que se le exija condición y fecha |
| Si un lote `EP` debe declarar `type` | `PT-142` — lo decide ahí, porque es lo que hace derivable su rama |
| Las seis clases `CE` sin regla que las reclame | — |
| Regenerar el grafo | — reservado al firmante (`FDGE-R32`) |
| `npm publish` | — reservado al firmante |

## 5. Firma única `[HUMANO]` — obligatorio

```
Alcance aprobado por: Alberto Martínez
Fecha:                2026-08-24
```

**Firmada por delegación**, y eso se dice: el firmante autorizó al agente a firmar esta compuerta
y las siguientes en su nombre, con la autorización enumerada en `SESSION_LOG.md` del 2026-08-24.
`SUITE-R27` sigue rigiendo — una firma no prueba que firmara una persona; lo que la hace
contrastable es esa entrada.

---

# A partir de aquí lo completa el agente

## 6. PTs que componen el lote `[AGENTE]`

| Orden | Tarea | Tipo | Sev | Qué cierra |
|:---|:---|:---|:--:|:---|
| 1 | `PT-137` #263 | BUG | S1 | `retomar`: un aplazado vuelve **por comando**, no a mano |
| 2 | `PT-138` #264 | BUG | S2 | `SUITE-R44` exige condición de reentrada, fecha de revisión y dueño |
| 3 | `PT-139` #265 | BUG | S2 | Un aplazado **caducado** bloquea en `G4` |
| 4 | `PT-134` #255 | CHORE | S3 | Un `AC` caído se puede **declarar**: hoy o se finge verde o bloquea |
| 5 | `PT-140` #266 | BUG | S2 | `proyectar` **se niega** si falta la rama local |
| 6 | `PT-141` #267 | BUG | S2 | El manejador de error deja de lanzar otro error, y un comando que falla no deja efecto a medias |
| 7 | `PT-142` #268 | BUG | S3 | El nombre de rama se contrasta contra `ramaDeTarea` |
| 8 | `PT-143` #269 | BUG | S3 | `asignar` deja de derivar el prefijo de un argumento suelto |

**El orden no es preferencia.** `PT-137` va primero porque **`PT-134` es su prueba**: sin el
comando, la cuarta fila de esta tabla sólo se puede ejecutar rompiendo el marco. `PT-138` y
`PT-139` van detrás porque le añaden los datos y la compuerta al mecanismo que `PT-137` crea.

**`PT-134` no cambia de lote.** Sigue con `epic: EP-020`, porque ningún comando reasigna la
épica y esta vez **no se escribe a mano**. Entra al trabajo de `EP-021` por su fila aquí, y
`PT-137` decidirá si reasignar la épica forma parte de retomar.

## 7. Lo que este intake NO establece `[AGENTE]`

- **Que `DEFERRED` deba desaparecer.** Aplazar es legítimo; lo que falta es la vuelta.
- **Que la fecha de revisión sea obligatoria siempre.** Lo decide `PT-138`; forzarla sin más
  haría que se inventaran fechas para callar la comprobación, que es peor que no tenerla.
- **Que estos siete defectos sean todos.** Son los que la medición de hoy encontró.

## Cierre del lote

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | pendiente |
| Número de versión | pendiente |
| `PT-134` fuera de `DEFERRED` | pendiente |

## Revisiones

| Fecha | Qué cambió |
|:---|:---|
| 2026-08-24 | Creado. `G1` sin resolver. |
