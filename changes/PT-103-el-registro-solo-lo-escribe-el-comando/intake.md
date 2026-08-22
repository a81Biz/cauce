# Intake — BUG · `PT-103` · el registro solo lo escribe el comando

```yaml
---
id: PT-103
type: BUG
severity: S1
complexity:
track: STANDARD
status: DONE
phase: 8
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: cumplir el marco no exige saltarse la herramienta, y algo puede fallar cuando
> el registro se escribe sin ella.

---

## 1. Qué está pasando `[HUMANO]`

Lo señaló el firmante, y con razón. Cita literal:

> «el problema fundamental es que no haces nada de lo que ya dice que debes hacer… ya todo se
> solucionó antes y sigues sin apegarte al marco de trabajo. Se supone que hay agente específico
> más metodología más sesion y nada de eso te obliga a que sigas el marco, inventas cosas y te
> saltas muchas»

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Cumplir el marco no puede exigir saltarse la herramienta.** Si un comando no permite escribir
lo que las reglas exigen, la regla no se cumple: se rodea.

Y **algo tiene que poder fallar** cuando el procedimiento no se sigue. `CLAUDE.md`, `CORE.md`, la
sesión y el agente **no son compuertas**: describen, recuerdan y orientan, pero ninguno puede
ponerse rojo.

---

## 3. Comportamiento observado `[HUMANO]`

```
tracker asignar PT --slug <x>     escribe:  id · slug · created · status
                                  NO escribe:  type · severity · epic · phase · title
```

**Cuatro campos de nueve.** Un `BUG` del lote `EP-019` con severidad `S1` no se podía registrar
con el comando, y el marco exige los cuatro que faltan:

- sin `phase`, `Number(undefined)` es `NaN` y **`avanzar` no puede mover la tarea nunca**;
- sin `type`, **las comprobaciones de `BUG` no se activan**.

Así que cada tarea nueva **obligaba** a escribir `REGISTRY.json` a mano. En este lote ocurrió
**cinco veces** —`PT-096`, `PT-100`, `PT-101`, `PT-102` y `PT-103`— y **solo la primera quedó
declarada**.

Y ninguna comprobación mira eso. Las compuertas miran los **productos**: que el intake tenga
firma, que exista trazabilidad, que haya entrada en `HISTORY`. **Nadie mira el procedimiento.**

---

## 4. Reproducción `[HUMANO]`

```
1. node docs/methodology/tools/tracker.mjs asignar PT --slug lo-que-sea
2. mirar la allocation recien creada en REGISTRY.json
3. no tiene «phase», ni «type», ni «severity»
4. node docs/methodology/tools/tracker.mjs avanzar PT-NNN --a 2   -> no puede
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | las herramientas de la suite |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto que registre una tarea nueva |
| Volumen estimado | **cinco** rodeos en un solo lote, uno declarado |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | sí, y **es** el problema: escribir el JSON a mano |
| Impacto de negocio | el marco existe para que ninguna decisión se salte una compuerta, y su propio registro se escribe sin pasar por ninguna |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

```
docs/implementation/SESSION_LOG.md   la excepcion declarada ANTES de aplicarla,
                                     con la medicion y el alcance
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: retrofechar las allocations anteriores
     SUITE-R09 · se escribieron cuando el comando NO PERMITIA otra cosa. La regla nueva
     AVISA, no falla, y va con RIGE_DESDE como hizo PT-095

OUT: impedir toda escritura manual del registro
     No se puede y no se debe: un arreglo de emergencia a veces exige tocarlo. Lo que se
     arregla es que no sea la UNICA forma, y que se NOTE cuando ocurre

OUT: hacer de CLAUDE.md una compuerta
     No lo es ni puede serlo (SUITE-R00: parametriza, no legisla). Lo que falta no es que
     el documento obligue: es que una HERRAMIENTA pueda ponerse roja

OUT: revisar si otros comandos tienen el mismo hueco
     Se mide «asignar», que es por donde entra todo. Los demas quedan declarados
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que «asignar» pueda crear una allocation completa
- que no acepte un tipo ni una severidad inventados
- que algo se ponga rojo —o al menos avise— cuando una allocation nace incompleta
- que no juzgue lo escrito antes de la regla
```

---

## 10. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base**, escrita por el agente (`INTAKE-R06`): la observación literal del firmante del
> 2026-08-21, la medición de `asignar` y la excepción declarada en `SESSION_LOG.md`.
> `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: «tracker asignar» acepta --tipo, --severidad, --epica y --titulo, y escribe siempre
       «phase: 1». Una allocation nace completa o dice que campos le faltan.

AC-02: NO acepta un tipo ni una severidad inventados: los valores los declara LEXICON, y un
       campo que admite cualquier cadena no decide nada.

AC-03: SUITE-R58 existe y verify-fdge la comprueba: una allocation sin «phase» o sin «status»
       —y sin «severity» si es un BUG— AVISA y dice que campo falta.

AC-04: AVISA y no falla, con RIGE_DESDE: lo anterior a la regla se escribio cuando el comando
       no permitia otra cosa, y SUITE-R09 no retrofecha.

AC-05: la bateria falla SIN el arreglo, con el negativo del tipo inventado.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: cuatro flags en un comando, una regla nueva y una comprobación. Lo que la hace
delicada no es el tamaño: es que la tarea que arregla el arranque en frío necesita el arranque
en frío para existir.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9) y PT-102 (L-4). Ninguno toca «asignar»
HISTORY.log — PTs similares:  PT-096 topó con esto y lo dejó declarado para L-1. PT-098 cerró
                              L-1 por otra vía y este hueco siguió abierto
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **La causa no es que yo eligiera rodear el comando: es que el comando no permitía obedecer.**
  Pero **callarlo cuatro de las cinco veces sí es mío**, y es lo que convierte un defecto de
  herramienta en un defecto de procedimiento.

- **`PT-096` topó con esto y lo dejó declarado para `L-1`.** `L-1` se cerró con `PT-098` por otra
  vía —el estado terminal— y **este hueco siguió abierto**. Un hallazgo declarado para otra tarea
  puede perderse si la otra tarea resuelve algo distinto con el mismo nombre.

- **Lo que el firmante señala es más grande que el flag.** Las compuertas comprueban los
  **productos**; el **procedimiento** no lo comprueba nadie. Esta tarea cierra un hueco concreto
  y **no cierra el general**: `SUITE-R58` mira `asignar`, no todos los comandos.

- **Y esta tarea necesitó el rodeo para existir.** Se declaró **antes** de aplicarlo, con su
  alcance y su condición de cierre, que es lo que no se hizo las otras cuatro veces.

- **Un error propio, corregido en el acto:** al abrirla afirmé que `PT-100` había dejado
  `FDGE-R52` apuntando a un archivo inexistente. **Es falso.** La regla nombra las dos ramas
  —issue si hay plataforma, `TRANSICIONES.log` si no— y el archivo no existe aquí porque **sí**
  hay plataforma. Lo comprobé después de escribirlo. Corregido en `SESSION_LOG.md`.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · el registro se escribe sin pasar por nada
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cuatro entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-103
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cinco
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con la medición
DoR-B3 reproducción                      [x]  §4 · cuatro pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
