# PT-159 — una parada que declara un hallazgo no está obligada a nada

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera**.

```yaml
---
id: PT-159
type: BUG
epic: EP-024
track: STANDARD
status: DEFERRED
phase: 8
created: 2026-08-25
structural: no
suite_version: 13.1.0
origen_parada: EP-022
---
```

## 1. Comportamiento esperado   `[HUMANO]`

Que un hallazgo declarado **no pueda quedarse suelto**. O abre trabajo y lo cita, o declara
cuándo se revisa y quién responde — y un `declara` sin ninguna de las dos **se nombra**.

## 2. Comportamiento observado

`FDGE-R55` gobierna la parada y es explícita sobre lo que **no** promete:

> *«Una parada cuyo desenlace es `continua` **no la puede exigir ningún script desde el
> repositorio** — no deja rastro contra el que contrastar. Lo mecanizable es el desenlace que sí
> lo deja: toda allocation nueva cita la parada que la produjo.»*

Cubre `abre`. Admite `continua`. **Y deja `declara` sin gobernar.**

**Pero `declara` sí deja rastro**: se publica en el issue, con fecha y explicación. La pregunta
«¿este hallazgo abrió trabajo?» es contestable — **el criterio que la propia regla usa** para
decidir qué es mecanizable.

## 3. Lo que ha costado, medido

```
PT-157   «contradiceElRegistro no reconoce INTEGRATED»
         declarado en EP-021, con «merece tarea propia» escrito en el HANDOFF
         UN LOTE ENTERO despues, seguia sin tarea

EP-022   SIETE paradas publicadas con «declara» diciendo «candidato a tarea propia».
         Las siete huerfanas hasta que lo senalo el firmante.
```

**Lo señaló una persona, no un verificador** — literalmente la misma frase con la que nació
`FDGE-R55`, sobre el mismo objeto, un lote después.

## 4. El precedente da la forma

`SUITE-R44` cerró **este mismo problema** para el trabajo apartado:

> *«La columna “Dónde va” es **vocabulario cerrado**: o `—` —no aplaza nada, queda fuera y punto—
> o la cita de un identificador del registro. Cualquier otra cosa —una frase, una celda vacía,
> “pendiente”— **falla: no se interpreta**.»*

Y `PT-138`/`PT-139` le añadieron la puerta de vuelta: un `DEFERRED` declara `reentrada`, `revision`
y `dueno`, y uno **sin bloque o con la revisión vencida se nombra**.

**Un `declara` es un hallazgo apartado; un `DEFERRED` es trabajo apartado.** Misma avería, mismo
remedio. «Candidato a tarea propia» es exactamente el «pendiente» que `SUITE-R44` decidió no
interpretar.

## 5. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una parada con desenlace `declara` **o cita un identificador del registro, o declara `revision` y `dueno`** | vocabulario cerrado, como `SUITE-R44`: una frase **falla, no se interpreta** |
| AC-02 | Un `declara` sin ninguna de las dos **se nombra** | caso con una parada huérfana |
| AC-03 | Un `declara` con la revisión **vencida** se nombra, y **dice cuántos días** | caso con fecha pasada · el precedente de `PT-139` |
| AC-04 | Fuera de `G4` **avisa**; en `G4` **bloquea** | los dos casos |
| AC-05 | **Lo anterior no se retrofecha** (`RIGE_DESDE`): las paradas ya publicadas con `declara` no ponen nada en rojo | caso con `suite_version` previa |
| AC-06 | La regla nueva tiene **ID, severidad y propietario único**, y `regla.mjs` la resuelve | `verify-suite` sin duplicados |

**`AC-01` es la decisión de diseño**, y sigue a `SUITE-R44` a propósito: **quitar la prosa en vez
de mejorar el detector**. Ampliar una lista de palabras es perseguir el idioma, y el sinónimo que
falte no se ve hasta que algo ya se perdió.

**`AC-05` importa más de lo que parece**: `EP-022` publicó siete `declara` que ahora sí tienen
tarea, pero hay paradas anteriores que no. Retrofecharlas pondría en rojo lotes cerrados.

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: una parada que declara un hallazgo y no cita un identificador ni una fecha de
> revisión **hace fallar** a `verify-fdge`, y en `G4` bloquea.

## 7. Qué NO entra   `[AGENTE]`

- OUT: **exigir algo de `continua`.** `FDGE-R55` ya declara que no es mecanizable, y sigue sin
  serlo. Esta tarea no lo finge.
- OUT: reabrir las paradas ya publicadas. Son append-only (`SUITE-R09`) y las siete de `EP-022`
  ya tienen tarea por la vía normal.
- OUT: el vigilante del arnés. **Es del arnés, no del marco**: lo que cae en cada parada es esta
  regla, no un temporizador.
- OUT: cambiar las listas cerradas de `LEXICON` §8.5. Los cinco desenlaces están bien; lo que
  falta es qué se **exige** de uno de ellos.

## 8. Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **Nace de un fallo del agente, y conviene que se lea así.** Durante `EP-022` publiqué siete
  hallazgos con `declara` y la frase «candidato a tarea propia», y los dejé ahí. El firmante lo
  corrigió dos veces —*«que no sea candidato, haz la tarea»*, *«no puede quedar nada suelto»*—
  antes de que se enlazaran. La regla existe para que la corrección no dependa de que alguien mire.

- **Es la misma historia que `FDGE-R55`, un lote después y sobre el mismo objeto.** Aquella nació
  porque seis tareas de `EP-020` se cerraron con sus hallazgos sólo en la conversación, y **lo
  señaló el firmante, no un verificador**. Ahora los hallazgos sí se publican — y se quedan sin
  destino. El defecto se movió un paso, no desapareció.

- **Por qué esto toca el marco y el vigilante no.** Se descartó añadir a cauce un campo «cuánto
  lleva parado»: sería estado nuevo con un solo consumidor. Esto **no añade estado** —usa el
  desenlace, la fecha y el issue que la parada ya publica— y no tiene un solo consumidor: es una
  compuerta sobre un objeto que el marco ya define.

- **Toca `RULES.md` y `verify-fdge`** (`SUITE-R06e`). La regla nueva la escribe esta tarea; su ID
  y severidad se fijan al escribirla, y si su chequeo no llega, sale `HARD` y no `CHECK` — marcar
  `CHECK` lo que ningún script verifica es una promesa falsa.
