# PT-045 — `npx @a81biz/cauce start` no arranca

> Tarea de la implementación abierta `EP-012` (`FDGE-R51`).

```yaml
---
id: PT-045
type: BUG
epic: EP-012
track: STANDARD
status: DONE
created: 2026-08-14
structural: no
suite_version: 7.6.0
phase: 9
---
```

## 1. Qué se quiere   `[HUMANO]`

> «hazlos en orden»

Que el comando con el que el manual dice que se empieza, empiece.

## 2. Comportamiento esperado y observado   `[HUMANO]`

**Observado.** `MANUAL.md` §4 y `CASOS-DE-USO.md` `A5` documentan `npx @a81biz/cauce start` como
el punto de entrada. Ejecutado:

```
$ npx @a81biz/cauce start
"cauce" no se reconoce como un comando interno o externo
```

Dos causas distintas, y las dos reales:

```
dentro del repositorio   npx resuelve el nombre del paquete LOCAL —este repositorio ES
                         @a81biz/cauce— y no encuentra un binario enlazado
fuera del repositorio    la version publicada mas alta es 7.1.0, que NO tiene el
                         subcomando «start»: nacio en la 7.3.0
```

**Esperado.** Que el arranque funcione, o que **diga por qué no** y cuál es el comando que sí.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un subcomando desconocido —incluido el caso «versión vieja»— **dice qué pasa y qué hacer**, no «no se reconoce» | selftest |
| AC-02 | Dentro del repositorio de cauce, el arranque documentado funciona o remite al que funciona | ejecución |
| AC-03 | El manual y el catálogo declaran el comando que **de verdad** funciona hoy en cada caso | selftest |
| AC-04 | `SUITE-R50` sigue en pie: el tablero antes que el núcleo, sin forma de obtener lo segundo sin lo primero | selftest |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: ejecutar el arranque documentado desde este repositorio y desde un directorio
> limpio produce, en los dos casos, o el tablero o un mensaje que dice qué hacer — nunca «no se
> reconoce el comando».

## 5. Qué NO entra   `[AGENTE]`

- OUT: **publicar** la `7.6.0`. Es lo que haría que la causa de fuera desapareciera, y es
  decisión humana explícita: «no publicamos aún porque nos falta algo más»
- OUT: instalar cauce como dependencia de sí mismo. `SUITE-R41` lo prohíbe
- OUT: cambiar el nombre del paquete o del binario

## 6. Firma

```
Firmado por lote: EP-012
```
