# PT-012 — Estrategia   `PHASE 3`

## Solución

Un tramo `lt('5.0.0')` y otro `lt('6.0.0')` que **comprueban el proyecto** y solo listan lo que
le falta:

| Se comprueba | Se pide si falta | Regla |
|:---|:---|:---|
| `HANDOFF.md` abre con `<!-- ESTADO -->` | escribir el bloque, con sus campos | `SUITE-R33` |
| las allocations vivas declaran `phase` | declararla | `FDGE-R15`, `FDGE-R42` |
| `docs/implementation/SECRETOS-EXCEPCIONES.md` | se menciona solo si el escáner tiene algo que firmar | `FND-R29` |
| `REGISTRY.tracker.plataforma` | se **ofrece**, no se exige: declararla es opcional y humano | `SUITE-R35` |
| si está declarada: issues, etiquetas y PR | los comandos que lo resuelven | `SUITE-R35`, `SUITE-R42` |

Y en los dos tramos, la lista de **qué llega nuevo** enumerada, no contada.

## Alternativas evaluadas

**A · Imprimir siempre la guía completa.** Más simple. **Rechazada:** una lista de nueve pasos
de los que te aplican dos enseña a no leerla, y el resto de `migrate` ya detecta.

**B · Automatizar el bloque `ESTADO`.** Tentador: la herramienta podría escribirlo. **Rechazada
y es importante:** el bloque declara *qué compuerta espera y a quién*, *la siguiente acción
concreta*, *las decisiones vivas*. Eso no lo sabe la máquina, y rellenarlo con plantilla
produciría un estado que miente — que es exactamente lo que `SUITE-R33` existe para impedir.
`SUITE-R19` lo dice: lo que exige criterio humano **nunca se inventa**.

**C · Bloquear la migración hasta que exista el bloque.** **Rechazada:** `migrate` sella la
versión y deja al proyecto en modo restringido con la lista pendiente; ese ya es el mecanismo.
Bloquear además dejaría al proyecto sin poder ni migrar.

## Regresión

| Qué | Riesgo | Mitigación |
|:---|:---|:---|
| Un proyecto ya en 6.x ve el tramo | Medio | Caso del arnés: `lt()` lo excluye |
| Un proyecto sin plataforma recibe instrucciones de plataforma | Bajo | Solo se ofrece; los comandos aparecen si la declara |
| Los tramos de 3.x y 4.1 | Bajo | No se tocan; batería completa |

## Criterios de éxito

Los seis `AC`. El que manda es `AC-01`: el bloque `ESTADO` deja de ser algo que hay que
descubrir leyendo un `CHANGELOG` de dos versiones atrás.
