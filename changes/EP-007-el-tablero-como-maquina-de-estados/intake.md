# EP-007 — El tablero como máquina de estados

```yaml
---
id: EP-007
type: EP
status: DRAFT
created: 2026-08-13
suite_version: 7.1.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que se te pasen las cosas significa que no usas GitHub como máquina de estados, entonces
> estás saltando pasos, fases o ignoras definitivamente el marco de trabajo. Hay que evitar eso
> de forma que **no sepa hacer nada si no consultas directamente a GitHub** para saber qué sigue
> y cómo cerrar. El marco trabaja de forma supervisada y autónoma, **las dos deben tener lo
> mismo**.»

## 2. El diagnóstico, y es sobre mí   `[AGENTE]`

Tiene razón y la evidencia está en esta misma sesión. Cuatro veces di un paso por terminado sin
preguntarle al tablero cuál era el siguiente:

```
· merge ejecutado y dado por bueno sin mirar la compuerta que corre DESPUÉS del merge
· issues cerrados en un orden que ninguna regla decía, porque lo decidí de memoria
· PT-018 declaró un cambio de especificación que no hizo; nadie lo comprobó hasta PT-021
· cuatro puntos muertos entre reglas, todos encontrados EJECUTANDO y ninguno leyendo
```

`tracker` existe y responde «qué está abierto». Lo que no existe es una obligación de
**preguntárselo antes de actuar**: hoy el agente puede recorrer las fases de memoria, y de
memoria es exactamente como se saltan.

## 3. Objetivo común del lote   `INTAKE-R09`

Que el siguiente paso y la condición de cierre se **deriven del tablero**, no del criterio del
agente, y que las tres modalidades de ejecución exijan lo mismo.

## 4. Criterio de éxito del lote   `INTAKE-R09`

Existe un comando que responde «qué sigue y cómo se cierra» leyendo la plataforma, su respuesta
es precondición verificable de avanzar de fase, y `MANUAL`, `SUPERVISED` y `AUTONOMOUS` declaran
las mismas obligaciones —solo cambia quién resuelve las compuertas, no qué se comprueba.

## 5. Análisis de solapamiento   `INTAKE-R09`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-030` | FEATURE | S1 | `tracker siguiente` deriva del tablero qué toca y cómo se cierra |
| `PT-031` | BUG | S1 | Los tres modos de ejecución declaran las mismas obligaciones |

Las dos tocan `tracker.mjs` y `EXECUTION-MODES.md`, pero en piezas distintas: `PT-030` **añade**
una acción de solo lectura; `PT-031` comprueba que la tabla de modos no exima de nada.

Orden obligado: `PT-030` primero. La paridad entre modos no se puede comprobar sin una respuesta
derivada de qué exige cada fase — hoy esa respuesta vive en mi criterio, y comparar mi criterio
consigo mismo no prueba nada.

## 6. Qué NO entra

- OUT: que el tablero asigne identificadores. El registro asigna (`SUITE-R08`)
- OUT: relajar ninguna compuerta para que la derivación sea más fácil

## 7. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «firma y avanza el EP-007, firma con mi nombre», 2026-08-13)
Fecha: 2026-08-13
Severidad declarada: S1 en las dos tareas. El diagnóstico es que el agente recorre las fases de
memoria; de memoria es exactamente como se saltan, y esta sesión tiene cuatro ejemplos.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | HECHO — 7.2.0 |
| Regenerar `CORE.md` | HECHO |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
