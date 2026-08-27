# `PT-167` — un caso que afirma cobertura buscando la línea del hueco sólo pasa mientras hay defecto

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-167
type: CHORE
epic: EP-024
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué pasa

`PT-147` escribió tres casos para afirmar que los seis componentes entran en la auditoría de fases,
buscando la cadena «`FIDE PHASE`» en la salida de `audit`.

**`audit` sólo emite esa línea cuando el componente tiene un hueco.** Los tres pasaban **porque
`FIDE`, `FPGE` y `Foundation` fallaban**, y se pusieron en rojo el día en que dejaron de fallar.
Estuvieron en verde todo `EP-022` afirmando **lo contrario** de lo que ocurría.

Es `RULE-02` por el reverso: la regla dice que un fallo debe distinguirse de un éxito, y aquí **el
éxito del caso era el fallo del sistema**. No es un verificador débil: es un **indicador
invertido**, que avisa mientras el defecto se arregla.

## 2. Por qué nadie lo caza

Los cuatro que aparecieron en `EP-022` salieron de **un cambio de conducta ajeno**, no de buscarlos.
Mientras el defecto exista, el caso es verde y **nada lo distingue** de uno correcto.

## 3. Criterios de aceptación

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | Existe un barrido que **señala** los casos sospechosos de estar invertidos | ejecutarlo sobre el árbol real |
| `AC-02` | El barrido **caza los cuatro** que `EP-022` encontró, reintroducidos como fixture | cuatro casos negativos |
| `AC-03` | El barrido **no caza** un caso legítimo que asierta sobre un mensaje de error | casos negativos permanentes |
| `AC-04` | Lo que el barrido **no puede** decidir sale como lista de candidatos, no como fallo | `SUITE-R26` |

## 4. El criterio, y por qué no puede ser automático del todo

**La pista mecánica**: un `chk` cuyo patrón esperado coincide con el texto de un `gap(...)` o un
`fail(...)` **de la herramienta que invoca** está, casi con seguridad, afirmando un hueco en vez de
una cobertura.

**Casi.** Hay casos legítimos que asertan exactamente eso: los que comprueban que **una regla puede
fallar** —`PT-149` tiene tres— y ésos son lo contrario de un defecto: son la prueba de que la
comprobación no es decorativa. `AC-03` existe para que el barrido no los mate.

Por eso `AC-04`: lo que salga es una **lista para mirar**, no un rojo. Un barrido que se equivoca
sobre esta clase se desactiva en la primera corrida, y un verificador desactivado es peor que
ninguno — es la lección de `SUITE-R60`.

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: el barrido caza los cuatro invertidos conocidos, no caza los tres casos
> legítimos de `PT-149`, y lo que no puede decidir sale declarado como candidato.

## 6. Qué NO entra

- **OUT**: podar la batería. Es `PT-169`, y **corre antes**: este barrido debe ejecutarse sobre el
  árbol ya podado, o señalará casos que van a desaparecer igualmente.
- **OUT**: arreglar los casos que el barrido encuentre. Señalar y arreglar son dos cosas, y la
  segunda depende de qué aparezca.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-03` es el que decide si esto sirve.** Sin él, el barrido cazaría los tres casos de `PT-149`
  que prueban que una regla **puede fallar** — es decir, mataría exactamente los casos que hacen
  que la batería no sea decoración. La diferencia entre «afirma un hueco» y «prueba que el hueco
  se caza» es de **intención**, y la intención no está en el texto.
