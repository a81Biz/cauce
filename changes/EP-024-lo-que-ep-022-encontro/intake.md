# `EP-024` — lo que `EP-022` encontró y no podía arreglar

```yaml
---
id: EP-024
type: EPIC
status: DRAFT
created: 2026-08-25
suite_version: 13.2.0
origin: hallazgos de EP-022, cada uno enlazado a la parada que lo encontró
---
```

## 1. Objetivo común   `[HUMANO]`

**Cerrar los veinte huecos que `EP-022` midió mientras hacía otra cosa.**

Ninguno se buscó: los veinte salieron de ejecutar el marco contra sí mismo. Y todos comparten una
forma — **el marco afirmaba algo que no comprobaba**, y la afirmación pasaba en verde porque nada
la contrastaba. Es la misma familia que `EP-022` cerró para los componentes, aplicada a lo que
quedó fuera de su alcance.

Diecinueve están **aplazados** con condición de reentrada, fecha y dueño (`LEX-R34`); uno,
`PT-156`, se ejecutó dentro del tramo de `EP-022` por decisión del firmante y ya está
`INTEGRATED`.

## 2. Criterio de éxito del lote   `[HUMANO]`

**Que la batería deje de ser el cuello de botella y que ninguna cifra que el marco publica sea
mayor que lo que de verdad comprueba.**

Dos mitades, y la primera es condición de la segunda:

1. **El instrumento.** Hoy una batería tarda **~10 min en CI y ~15-20 en local**, y `npm run
   verify` **no ejecuta lo que ejecuta CI**. Durante el cierre de `EP-022` eso costó **cuatro
   vueltas de diez minutos**, cada una destapando una causa distinta y real. Un lote de veinte
   tareas paga ese peaje veinte veces.
2. **La medida.** `audit` publica una cobertura que cuenta como verificado lo que ninguna máquina
   distingue de su ausencia (`PT-168`, `S1`). Mientras eso siga, **cualquier cifra que usemos para
   decidir vale menos de lo que parece** — incluida la que diga si `DICTAMEN` está listo.

## 3. Orden, y por qué éste   `[AGENTE]`

**El orden no es por severidad: es por lo que abarata o encarece todo lo que viene detrás.**

### Tanda 1 · El instrumento — se paga una vez y la cobra el lote entero

| | Tarea | Por qué va primero |
|:--|:---|:---|
| 1 | `PT-169` | La batería sólo crece y **nada la poda**. Medido: 8250 líneas, 48 bloques por tarea, **133 funciones de fixture**. Y el coste **no son los casos**: es que cada caso **reinvoca la herramienta** sobre un fixture recién construido — ~1749 arranques de `node` y **diez copias del árbol completo**. Purgar casos muertos ayuda; lo que cambia el orden de magnitud es dejar de reconstruir y reinvocar para cada aserción |
| 2 | `PT-151` | `npm run verify` no es lo que corre CI —CI usa `--all`—, y el `CLAUDE.md` dice que sí. Mientras eso siga, «verde en local» no significa nada y cada tarea lo descubre en la compuerta |
| 3 | `PT-167` | Nada busca **casos invertidos**: los que sólo pasan mientras existe el defecto que vigilan. `EP-022` encontró cuatro, y ninguno por buscarlo |

### Tanda 2 · Lo que el marco afirma verificar y no verifica

`PT-168` (`S1`) · `PT-163` · `PT-164` · `PT-161` · `PT-160` · `PT-155`

Seis comprobaciones que **no pueden fallar** o que **fallan por la razón equivocada**. `PT-168`
abre la tanda: es la única que afecta a la **cifra de cobertura**, y por tanto a la confianza en
todas las demás.

### Tanda 3 · Vocabulario, herramienta y estado

`PT-152` · `PT-153` · `PT-154` · `PT-157` · `PT-158` · `PT-159` · `PT-162` · `PT-165` · `PT-166` ·
`PT-170`

Diez huecos donde **un hecho tiene dos nombres** o **una operación no existe por comando** y hay
que rodear la herramienta. Es `CE-008` y el patrón que `PT-103` nombró: *«una regla que sólo se
puede cumplir saltándose la herramienta no se cumple: se rodea»*.

## 4. Qué NO entra   `OUT`

| Qué | Por qué | Dónde va |
|:---|:---|:---|
| `DICTAMEN` — el séptimo componente | Tiene su propio lote firmado, y `PT-149` ya dejó **probado** que un componente se da de alta sin tocar herramienta, que era su precondición | `EP-023` |
| Publicar la `13.2.0` en npm | El firmante lo reservó expresamente, y una autorización amplia posterior **no lo deroga** | — |
| Reescribir la batería entera | `PT-169` **poda y ordena**; rehacer el arnés es otro trabajo y otra medición | — |
| Normalizar las cinco allocations con severidad fuera de escala | Sería rejuzgar trabajo ya integrado, y esa decisión se tomó en `EP-022` | — |
| Las 21 allocations sin `suite_version` | Anterior a que el campo existiera; `RIGE_DESDE` dice que no se juzga hacia atrás | — |

## 5. Análisis de solapamiento   `SUITE-R45`

**Tres pares se tocan, y cada uno se resuelve declarando quién manda:**

- **`PT-169` y `PT-167`** comparten el arnés. `PT-167` **busca** casos invertidos; `PT-169`
  **retira** casos muertos y evita que se dupliquen. Si `PT-169` va primero, `PT-167` corre sobre
  una batería ya podada y su barrido es más barato. **`PT-169` manda sobre el arnés**; `PT-167`
  añade un criterio, no reorganiza.
- **`PT-165` y `PT-152`** tocan los dos `build-core`: el mapa de fases uno, los triggers el otro.
  `PT-149` ya les puso un **colador** común, así que ninguno de los dos puede dejar algo fuera en
  silencio. **Van juntos o el segundo hereda el bloque del primero.**
- **`PT-160` y `PT-161`** son el mismo patrón —un documento afirma un contrato de cobertura y nada
  lo comprueba— sobre `traceability.md` y sobre `CASOS-DE-USO.md`. **El segundo reutiliza lo que
  escriba el primero**, o se declara por qué no puede.

**Y uno que NO se solapa aunque lo parezca:** `PT-151` (qué ejecuta `verify`) y `PT-168` (qué mide
`audit`) suenan a lo mismo y no lo son. El primero es **qué comprobaciones se corren**; el segundo,
**qué establece una de ellas**. Arreglar uno no toca al otro.

## 6. Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | PENDIENTE |
| Número de versión | PENDIENTE — `MINOR` esperado si sólo se añaden reglas y comprobaciones; **`MAJOR` si `PT-168` obliga a cambiar lo que `audit` declara cubierto**, porque eso cambia una cifra que los proyectos destino ya usan |
| La regla de mantenimiento de la batería que `PT-169` escriba | PENDIENTE — su ID y severidad se fijan al escribirla |
| Cuánto bajó el tiempo de la batería | PENDIENTE — se mide antes y después, y se publica la cifra, no un adjetivo |
| Cuántos casos se retiraron y por cuál de los tres patrones | PENDIENTE — `superado`, `invertido`, `hueco` |
| Lo que `PT-168` destape sobre la cobertura real | PENDIENTE — se declara al cerrar; si la cifra baja, **baja**, y se dice |

## 7. Firma   `INTAKE-R06` · `SUITE-R27`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído el Intake de cada PT listado en §3 y confirmo que todos reflejan mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión el 2026-08-26 —
*«tienes mi VoBo, comienza con la EP-024 y no pares hasta terminar»*—, que incluye autorización
para el merge hasta `main`. `SUITE-R27` dice lo que esto **no** prueba: que firmara una persona.
Sí lo hace contrastable — el nombre está en `firmantes`.

**Lo que la firma NO cubre**, y sigue reservado: `npm publish`.
