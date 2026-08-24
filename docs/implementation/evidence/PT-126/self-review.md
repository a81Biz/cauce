# Autorrevisión — `PT-126`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

El último tramo del bucle. `PT-118` nombró las clases, `PT-125` las aplicó a 163 entradas,
`PT-119` las contó — y la matriz existía **sin que nada la mirara**. Ahora:

- `sellar` la mide, junto a la deuda, el inventario, el grafo y los documentos de entrada.
- El umbral vive en el registro **con su motivo**.
- `verify-fdge` **avisa** cuando una entrada nueva no declara su clase.
- `FPGE` la recoge desde `MATRIZ.md`, sin que nadie transcriba la cifra.

## Por qué dentro de `sellar` y no en un comando nuevo

Un comando nuevo habría sido la **octava** instancia de `CE-007` —«existe la herramienta y nada la
echa en falta»— construida dentro del lote que las cuenta. Es el patrón que `PT-110` estableció:
se mide **donde ya se mira**, y `sellar` se ejecuta antes de una versión, que es el momento en que
conviene saber qué se repite.

## Dos situaciones, no una

```
sin regla que la reclame            6 clases
con regla y NADA EMITE por ella     1 clase — CE-002 / SUITE-R59
```

La segunda es **peor**, porque parece cubierta. `AC-03` las junta en una frase; la implementación
las separa y se dice aquí, en vez de fundirlas para que el criterio encaje sin roce.

## Lo que el umbral selecciona hoy

Seis candidatos y un séptimo caso, **y ninguno lo eligió nadie**:

```
CE-004  8x  ·  CE-001  7x  ·  CE-003  7x  ·  CE-005  5x  ·  CE-015  4x  ·  CE-007  3x
CE-002      tiene regla y nada emite por ella
```

Salen de la evidencia. Decidir cuáles se convierten en trabajo es del firmante (`FPGE-R04`), y el
propio mensaje de `sellar` lo dice.

## Los dos defectos que aparecieron construyéndolo

**1 · `rige` no estaba en ámbito.** El aviso de `LEX-R31` usaba `rige(...)`, que no existe en esa
función: `ReferenceError`, y `verify-fdge` **entero** reventaba. La corrección —`rigeGlobal`— es
además la **correcta**: la clase la exige la suite desde la `13.0.0`, no cada tarea desde su
propia versión.

**2 · Los casos colgaban la batería contra GitHub.** La primera versión llamaba a `sellar` sobre
el **repositorio real**, y `sellar` termina consultando la plataforma: el bloque estuvo más de
tres minutos sin imprimir una línea, y hubo que matarlo.

**Un arnés que depende de la red no es un arnés.** Daría rojo el día que GitHub esté lento, y ese
rojo no diría nada sobre el marco. Rehechos sobre el proyecto de mentira, con una `MATRIZ.md`
**sintética**: si usara la real, los casos caducarían en cuanto la matriz cambiara — `CE-010`
cometido en el arnés que la publica.

## Lo que esta tarea NO establece

- **Que las seis huérfanas deban tener regla.** Son candidatos.
- **Que declarar la clase sea obligatorio.** Es opcional a propósito: exigirla siempre haría que
  se inventara una clase para callar el aviso, y eso es peor que no tener aviso.
- **Que el umbral 3 sea el correcto.** Es un juicio, declarado con su motivo y parametrizable.
- **Que `FPGE` haya corrido con esta fuente.** Establece que la recolección la **declara**.

## Estado

| | |
|:---|:---|
| Escenarios | 17 de 17 |
| Prueba inversa | 4 supresiones, 4 escenarios distintos |
| Orphan Criterion | ninguno |
