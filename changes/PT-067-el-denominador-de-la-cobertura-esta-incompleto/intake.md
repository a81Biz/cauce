# PT-067 — El denominador de la cobertura está incompleto

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-067
type: BUG
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que `audit` mida sobre todas las reglas del marco. Hoy publica «112 / 181» y el marco define 222: quedan fuera las 15 `EXEC-*` y las 26 `LEX-*`. Y `SUITE-R22` figura como cubierta porque el caso de selftest que demuestra que NO lo está la nombra.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El denominador incluye los tres documentos propietarios | `audit` informa sobre 222 reglas, no 181 |
| AC-02 | El mapa de propietarios no se escribe dos veces | sale del mismo sitio que usa `regla.mjs` (`DUENO`), no de una copia — `SUITE-R38` |
| AC-03 | `selftest.sh` no cuenta como verificador | `SUITE-R22` vuelve a aparecer en `--sin-verificar` |
| AC-04 | La cifra publicada cambia y se dice por qué | la salida distingue lo que cambió por ampliar el universo de lo que cambió por dejar de contar el arnés |
| AC-05 | Ninguna regla se pierde por el camino | la suma de cubiertas y sin verificador es exactamente 222 |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `audit` mide sobre las 222 reglas que el marco define, no cuenta `selftest.sh` como verificador, y `SUITE-R22` vuelve a la lista de las que no lo tienen.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Escribir los verificadores que faltan: la cifra subirá o bajará, y esta tarea sólo arregla **la medida**.
- OUT: Cambiar `SUITE-R26` («aspira, no exige»).
- OUT: Los otros 16 tipos de elemento que `audit` enumera: sólo se toca el universo de **reglas**.

## 5. Firma

```
Firmado por lote: EP-017
```
