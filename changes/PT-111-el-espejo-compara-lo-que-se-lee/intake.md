# Intake — BUG · `PT-111` · el espejo compara lo que se lee

```yaml
---
id: PT-111
type: BUG
severity: S2
complexity:
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-22
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: una divergencia entre lo que el registro dice y lo que el tablero **muestra**
> la reporta el espejo, y no hay que abrir el issue para verla.

---

## 1. Qué está pasando `[HUMANO]`

Fila del `## Cierre del lote` de `EP-019`, declarada en la `Revisión 1` y **sin dueño todo el
lote**:

> «Que el espejo **reporte** una divergencia de texto — `L-0` hizo que `abrir --aplicar` la
> corrija; el espejo compara estado, no cuerpo.»

**Medido hoy**: el espejo tampoco compara el **título**.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

`SUITE-R35` dice que el registro asigna y la plataforma **espeja**. Un espejo que solo compara el
estado deja pasar la divergencia más visible: **lo que una persona lee al abrir el tablero**.

Si el título o el cuerpo del issue no dicen lo que el registro dice, hay dos versiones del mismo
hecho — y eso es exactamente lo que `SUITE-R35` existe para impedir.

---

## 3. Comportamiento observado `[HUMANO]`

```
espejo compara     estado (open/closed) · que la allocation reclame el issue
NO compara         el TITULO
                   el CUERPO derivado

abrir --aplicar    SI republica el cuerpo cuando difiere (PT-096)
                   pero hay que ACORDARSE de ejecutarlo
```

**Es la misma forma que `EP-007`**: existe un comando que lo arregla y nada que lo **eche en
falta**.

---

## 4. Reproducción `[HUMANO]`

```
1. editar a mano el titulo de un issue en GitHub
2. node tools/tracker.mjs espejo    -> «Sin divergencias»
3. el registro y el tablero dicen cosas distintas, y nada lo dice
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `tracker espejo` · plataforma GitHub |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `12.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-22 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto con plataforma declarada |
| Volumen estimado | **dos** campos sin comparar: título y cuerpo |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | `abrir --aplicar`, y **es** el problema: hay que acordarse |
| Impacto de negocio | el tablero puede decir algo distinto del registro sin que nada lo eche en falta |

---

## 7. Out of scope `[HUMANO]` — obligatorio

```
OUT: que el espejo CORRIJA el titulo o el cuerpo
     Ya lo hace «abrir --aplicar» (PT-096). El espejo REPORTA; corregir es otra accion, y
     mezclarlas haria que consultar el estado modificara el tablero.

OUT: comparar el cuerpo COMPLETO caracter a caracter
     Un issue lleva comentarios y ediciones humanas legitimas. Se compara el CUERPO
     DERIVADO —el que tracker genera— contra el publicado, que es lo que PT-096 ya sabe
     hacer.

OUT: los issues que ninguna allocation reclama
     Eso ya lo reporta el espejo hoy, y lo demostro en este mismo lote cazando dos
     duplicados (#206 y #207).

OUT: otras plataformas
     Se mide sobre GitHub, que es la declarada. Azure queda declarado y sin medir.
```

---

## 8. Criterios de aceptación del arreglo `[HUMANO]`

```
- que el espejo reporte un titulo divergente
- que reporte un cuerpo derivado divergente
- que NO lo corrija: reportar y corregir son acciones distintas
- que no marque divergencia por un comentario humano legitimo
```

---

## 9. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-22
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base**, escrita por el agente (`INTAKE-R06`): la fila del `## Cierre del lote` declarada en la
> `Revisión 1` sin dueño, y la medición de hoy sobre `tracker espejo`. `SUITE-R27`: contrastable,
> no probada.

---

---

# A partir de aquí lo completa el agente

## 10. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: el espejo compara el TITULO publicado con el derivado del registro y reporta la
       diferencia, nombrando los dos.

AC-02: compara el CUERPO DERIVADO con el publicado —el mecanismo que PT-096 ya tiene para
       republicar— y reporta la diferencia.

AC-03: NO corrige: reportar y corregir son acciones distintas, y consultar el estado no
       puede modificar el tablero.

AC-04: un comentario humano en el issue NO cuenta como divergencia: se compara el cuerpo,
       no la conversacion.

AC-05: la bateria falla sin el arreglo, con el negativo de AC-04.
```

## 11. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: dos comparaciones sobre datos que el espejo ya trae. Lo delicado es el negativo:
distinguir una divergencia real de una edición humana legítima.
```

## 12. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9)
HISTORY.log — PTs similares:  PT-096 hizo que «abrir --aplicar» republique el cuerpo cuando
                              difiere. Esta hace que el espejo lo ECHE EN FALTA — misma
                              familia que EP-007: existe el comando y nada lo exige
Roadmap — R-NNN relacionado:  ninguno
```

## 13. Observaciones del agente `[AGENTE]` — obligatorio

- **Llevaba todo el lote declarada y sin dueño.** Apareció en la `Revisión 1` del cierre, salió de
  ejecutar `L-0`, y ninguna de las once tareas la tomó.

- **Y es más grande de lo que la fila decía.** La fila hablaba del **cuerpo**; medido hoy, el
  espejo tampoco compara el **título** — que es lo primero que una persona lee.

- **Misma forma que `EP-007` y que `PT-110`:** existe un comando que lo arregla —`abrir
  --aplicar`— y **nada que lo eche en falta**. Es el patrón que más veces ha aparecido en este
  lote.

- **Lo que este intake NO establece:** si Azure tiene el mismo hueco. Se mide sobre GitHub.

## 14. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S2 · el tablero puede mentir sin que nada lo diga
DoR-03 firma humana presente             [x]  §9
DoR-04 out-of-scope declarado            [x]  cuatro entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-111 · con `tracker asignar` completo
DoR-06 no duplica trabajo vivo           [x]  §12
DoR-07 observaciones registradas         [x]  §13 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · medido hoy
DoR-B3 reproducción                      [x]  §4 · tres pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
