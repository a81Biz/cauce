# PT-086 — La batería corre lo afectado por tarea, y completa sólo al sellar

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-086
type: CHORE
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S2
---
```

## 1. Qué se quiere   `[HUMANO]`

> «La batería de 10 minutos no debería correr en cada `PT`, o no completa: sólo los modificados, y
> correr completa sólo al cierre de versión para que quede sellado.»

## 2. El hallazgo que reordenó la tarea   `[AGENTE]`

**`--solo` no sirve para esto.** Filtra **aserciones**, no **andamiaje**:

```
build_fixture   211 llamadas, TODAS a nivel superior — fuera de los casos
salta()         sólo decide si una aserción se ejecuta

corrida completa            ~600 s · 1118 casos
corrida con --solo, UN caso  171 s · 1 de 1118
```

Una corrida filtrada **reconstruye el fixture las 211 veces igual**. El coste no está en los
casos: está en el andamiaje. Por eso hay que saltarse la **sección entera**.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una sección inactiva se salta **entera** | sus casos y su andamiaje |
| AC-02 | El mapa sección → herramienta se **deriva** | del propio arnés, no de una tabla a mano |
| AC-03 | Una sección sin herramienta corre **siempre** | el lado seguro del desconocimiento |
| AC-04 | La salida dice **`PARCIAL`** y enumera lo que saltó | `RULE-06` |
| AC-05 | Sellar exige la **completa** | `SUITE-R57` |
| AC-06 | Acota de verdad | medido, no estimado |

## 4. Las tres guardas, porque esto es una fábrica de falsos verdes si se hace mal

**El mapa se deriva.** Una tabla de 37 entradas sería un hecho copiado (`RULE-01`) que envejece
con la primera sección nueva.

**Lo que no se sabe, corre.** Una sección que no nombra ninguna herramienta se ejecuta siempre.
Saltarla sería decidir sin dato.

**La salida no puede parecerse a la completa.** Un `OK` idéntico sería el falso verde más caro que
este arnés podría producir — y `PT-085` acaba de escribir que sellar exige la completa,
precisamente antes que esto.

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: una corrida con `--afectados` salta las secciones que no ejercitan lo cambiado
> —andamiaje incluido—, lo dice, y sellar sigue exigiendo la corrida completa.

## 6. Qué NO entra   `[AGENTE]`

- OUT: **Meter `selftest.sh` en el grafo.** `FND-R28` excluye las pruebas a propósito. El grafo
  resuelve el lado herramienta → herramienta; el lado sección → herramienta se deriva del texto.
- OUT: Acelerar la corrida **completa**. Sigue costando lo que cuesta, y al sellar se paga.
- OUT: Cambiar qué comprueba ningún caso.

## 7. Viabilidad   `FDGE-R54`

```
Veredicto: MARGINAL · registrado en REGISTRY.allocations[].viabilidad
```

No hay precedente de un `CHORE/MAJOR` cerrado con el que comparar — el coste típico sale
`SIN EVALUAR`. `MARGINAL` admite trabajo atómico, y así se hizo.

## 8. Firma

```
Firmado por lote: EP-017
```
