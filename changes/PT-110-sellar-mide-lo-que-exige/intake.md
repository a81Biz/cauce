# Intake — BUG · `PT-110` · sellar mide lo que exige

```yaml
---
id: PT-110
type: BUG
severity: S2
complexity:
track: STANDARD
status: DONE
phase: 8
created: 2026-08-22
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: ninguna deuda que `sellar` exige al día se descubre **después** de haber
> decidido sellar.

---

## 1. Qué está pasando `[HUMANO]`

`FND-R14` —las cifras de `inventory/services.md`— **ha caído siete veces en este lote**. Cada
tarea que toca una herramienta las desvía, y las siete se reescribieron **a mano**.

**El comando existía desde antes del lote**: `tracker inventario --aplicar`. Nadie lo llamaba.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Lo que el sello exige al día, el sello lo mira.** Si una deuda solo aparece en la batería, se
descubre **después** de decidir sellar — y entonces ya es una interrupción, no una comprobación.

`sellar` ya recorre el grafo, los documentos de entrada y la guía de migración. El inventario
tiene que estar en esa lista.

---

## 3. Comportamiento observado `[HUMANO]`

```
sellar       ->  grafo · documentos de entrada · guia de migracion
                 el INVENTARIO no estaba en la lista

FND-R14      ->  7 caidas en el lote, 7 arreglos a mano
tracker inventario --aplicar  ->  existia, y no lo llamaba nadie
```

---

## 4. Reproducción `[HUMANO]`

```
1. tocar cualquier herramienta de docs/methodology/tools/
2. node tools/tracker.mjs sellar     -> no dice nada del inventario
3. bash tools/selftest.sh            -> FND-R14 en rojo
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `tracker sellar` · `inventory/services.md` |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `12.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-22 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto que selle una versión |
| Volumen estimado | **siete** caídas en un solo lote |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | acordarse de correr el comando, que es lo que falló siete veces |
| Impacto de negocio | una deuda que aparece después de decidir sellar interrumpe el sello en vez de informarlo |

---

## 7. Out of scope `[HUMANO]` — obligatorio

```
OUT: que sellar ARREGLE el inventario
     Sellar informa; arreglar es una decision (EXEC-R07). Y reescribir un documento de
     Foundation dentro de un comando de estado mezcla dos responsabilidades.

OUT: revisar que MAS deberia mirar sellar
     Se añade el inventario, que es el que cayo siete veces. Lo demas queda declarado y
     sin medir: decir «ya no falta nada» seria afirmar sin medir.

OUT: la descripcion en prosa del inventario
     Se miden las CIFRAS. Que la descripcion sea cierta no lo establece nadie, y FND-R14
     ya lo dice en su propio mensaje.
```

---

## 8. Criterios de aceptación del arreglo `[HUMANO]`

```
- que sellar mida las cifras del inventario y lo diga
- que diga SIN EVALUAR si no puede leerlas, en vez de callar
- que no las arregle por su cuenta
- que la bateria falle sin el arreglo
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

> **Base**, escrita por el agente (`INTAKE-R06`): las siete caídas de `FND-R14` medidas en este
> lote y la fila del `## Cierre del lote` que las declaraba sin dueño. `SUITE-R27`: contrastable,
> no probada.

---

---

# A partir de aquí lo completa el agente

## 10. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: `sellar` mide las cifras de inventory/services.md contra el arbol y las publica en su
       informe, junto al grafo y a los documentos de entrada.

AC-02: si no puede leerlas dice SIN EVALUAR (RULE-06): un silencio aqui es indistinguible de
       «todo coincide», que es el defecto que este lote entero persigue.

AC-03: NO las arregla: nombra el comando que lo hace (EXEC-R07).

AC-04: la bateria falla sin el arreglo.
```

## 11. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una medición más en un informe que ya hace tres. Lo que la hace parte del lote es
la causa: la herramienta existía y no se llamaba desde donde se decide.
```

## 12. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101, PT-108, PT-109
HISTORY.log — PTs similares:  ninguno. La fila estaba declarada en el `## Cierre del lote` desde
                              la Revisión 1 y llevaba todo el lote SIN DUEÑO
Roadmap — R-NNN relacionado:  ninguno
```

## 13. Observaciones del agente `[AGENTE]` — obligatorio

- **La herramienta existía y la parcheé a mano siete veces.** `tracker inventario --aplicar`
  estaba ahí desde antes del lote. Es la forma exacta que el firmante lleva señalando toda la
  sesión: **el marco tenía la respuesta y yo no le preguntaba.**

- **La causa no era que faltara la herramienta: era dónde se llama.** Una deuda que solo aparece
  en la batería se descubre **después** de decidir sellar.

- **Lo primero que detectó el arreglo fue la desviación que mi propio cambio acababa de
  producir.** Tocar `tracker.mjs` para añadir la medición desvió su propia cifra.

- **Lo que este intake NO establece:** qué más debería mirar `sellar`. Se añade el que cayó siete
  veces; lo demás queda declarado y sin medir.

## 14. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S2 · interrumpe el sello, no pierde nada
DoR-03 firma humana presente             [x]  §9
DoR-04 out-of-scope declarado            [x]  tres entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-110 · con `tracker asignar` completo
DoR-06 no duplica trabajo vivo           [x]  §12
DoR-07 observaciones registradas         [x]  §13 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las siete caídas medidas
DoR-B3 reproducción                      [x]  §4 · tres pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  cada vez que se toca una herramienta
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
