# Intake — BUG · `PT-107` · el registro no se reescribe entero

```yaml
---
id: PT-107
type: BUG
severity: S0
complexity:
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: dos comandos que escriben el registro a la vez no pueden perder una allocation
> en silencio.

---

## 1. Qué está pasando `[HUMANO]`

**Ocurrió de verdad, en esta sesión.** `PT-106` se asignó y **desapareció** del registro.

```
t0   abrir --aplicar   carga REGISTRY.json (124 allocations)
t1   asignar           escribe REGISTRY.json (125, con PT-106)
t2   abrir --aplicar   escribe SU copia, la de t0 (124)   <- PT-106 desaparece
```

Sin error, sin aviso. El contador `PT` **retrocedió** de 106 a 105, y eso fue lo único que lo
hizo visible — al ir a leer el estado por otro motivo.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**El único asignador de identificadores no puede perder uno.** `SUITE-R08` llama así a este
archivo. Un asignador que a veces olvida no asigna: reparte.

No hace falta que el registro sea concurrente. Hace falta que **perderse sea imposible sin que
se note**: si el archivo cambió desde que se leyó, no se escribe encima y se **dice**.

---

## 3. Comportamiento observado `[HUMANO]`

```
tracker.mjs:1259   const reg = leerJSON(...)     <- se lee UNA VEZ, al arrancar
tracker.mjs:1671   writeFileSync(... reg ...)    <- se escribe ENTERO
tracker.mjs:1995   writeFileSync(... reg ...)    <- ENTERO
tracker.mjs:2291   writeFileSync(... reg ...)    <- ENTERO
tracker.mjs:2748   writeFileSync(... reg ...)    <- ENTERO
```

**Cuatro escrituras completas y una sola lectura.** Entre esa lectura y cualquiera de las cuatro
cabe otro comando entero.

---

## 4. Reproducción `[HUMANO]`

```
1. lanzar dos «tracker asignar» a la vez sobre el mismo registro
2. leer REGISTRY.json    -> UNA allocation donde deberian estar DOS
3. ningun error, y el contador refleja solo una
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `tracker.mjs` · cualquier par de comandos que escriban el registro |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto · más cuanto más se automatice |
| Volumen estimado | **una** pérdida confirmada, silenciosa |
| ¿Hay pérdida de datos? | **SÍ** — es la tarea |
| ¿Existe workaround? | no ejecutar dos comandos a la vez, que nada impone ni comprueba |
| Impacto de negocio | `SUITE-R08` declara este archivo la única fuente de identificadores, y puede perder uno sin decirlo |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

```
docs/implementation/SESSION_LOG.md   la perdida, con su cronologia y la comprobacion de
                                     que no se perdio nada mas (contra HEAD: 120 + 4)
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: hacer el registro concurrente
     Exigiria un bloqueo, y un bloqueo mal puesto deja el proyecto colgado — peor que el
     defecto. Lo que se arregla es que la perdida sea IMPOSIBLE DE NO VER.

OUT: fusionar dos versiones del registro
     Fusionar sin saber cual gana es como se pierde el dato que esto existe para no perder.
     Se DETIENE y se dice que hay que repetir el comando.

OUT: reintentar automaticamente
     Un reintento a ciegas puede repetir un efecto que ya ocurrio —abrir un issue, escribir
     una nota—. Lo decide quien mira.

OUT: revisar si otros archivos de estado tienen el mismo patron
     CHECKPOINT.json y SESSION.json se escriben igual. Quedan DECLARADOS y sin medir.
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que dos comandos a la vez no puedan perder una allocation en silencio
- que si uno no puede escribir, lo DIGA y no escriba nada
- que el mensaje diga que comando se quedo fuera y que hacer
- que el registro nunca quede a medias ni ilegible
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

> **Base**, escrita por el agente (`INTAKE-R06`): la pérdida real ocurrida el 2026-08-21, su
> cronología medida y la comprobación contra `HEAD` de que no se perdió nada más. `SUITE-R27`:
> contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: las CUATRO escrituras del registro pasan por UNA sola funcion (SUITE-R38). Hoy son
       cuatro writeFileSync sueltos.

AC-02: esa funcion compara el archivo con lo que se leyo al arrancar. Si cambio, NO escribe
       y lanza.

AC-03: el mensaje dice cuantas allocations habia y cuantas hay, que comando se quedo fuera y
       que hacer. Un error que no dice que hacer obliga a leer el codigo.

AC-04: NO fusiona y NO reintenta: las dos cosas pueden perder o duplicar un efecto.

AC-05: el registro nunca queda a medias: o se escribe entero o no se escribe.

AC-06: la bateria REPRODUCE la perdida —dos comandos a la vez— y falla sin el arreglo.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una función y cuatro llamadas. Lo que la hace seria no es el tamaño: es que la
prueba tiene que reproducir una condición de carrera, y una que no se reproduzca no prueba nada.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9) y PT-106. Ninguno toca la escritura del registro
HISTORY.log — PTs similares:  PT-103 hizo que `asignar` escriba la allocation completa; esta
                              hace que no se pierda después. Misma familia, distinto momento
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **Es la única `S0` del lote.** Las demás tareas producen un verde falso; esta **borra un dato**,
  que es la categoría que `SUITE-R06c` dice que nunca se automatiza.

- **La culpa de lanzar dos comandos a la vez es mía.** El defecto no: una herramienta que pierde
  un dato en silencio cuando se la usa de una forma que nada prohíbe es una herramienta con un
  defecto, no un uso incorrecto.

- **El contador retrocedido fue lo único visible**, y por casualidad. Si `PT-106` se hubiera
  perdido sin que yo mirase el registro, la tarea habría seguido con sus archivos en `changes/`
  y **sin allocation** — y `verify-fdge` habría fallado mucho después, con un mensaje que no
  apunta a la causa.

- **Lo que este intake NO establece:** si `CHECKPOINT.json` y `SESSION.json` tienen el mismo
  patrón. Se escriben igual; quedan declarados y sin medir.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S0 · pérdida de datos confirmada
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cuatro entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-107 · con `tracker asignar` completo (SUITE-R58)
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las cinco líneas citadas
DoR-B3 reproducción                      [x]  §4 · tres pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre que dos comandos se solapen
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
