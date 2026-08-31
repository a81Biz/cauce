# `PT-179` · `test-scenarios.md`

Los tres montan un proyecto sintético completo bajo `$WORK` —con su `REGISTRY.json`, su lote y su
intake firmado— y corren `verify-fdge` **dentro** de él. Nunca sobre el repositorio real: un caso
que corriera sobre el registro de verdad mediría el estado de hoy.

## `TS-01` — evidencia que falta en `PHASE 7` BLOQUEA   → `AC-01`

```
DADO   un PT en PHASE 7, VALIDATION_PENDING, sin manifest.json
CUANDO corre verify-fdge
ENTONCES ✗ FDGE-R23
```

**Es el defecto medido.** Antes decía «normal antes de `PHASE 6`» y devolvía 0 errores.

## `TS-02` — en `PHASE 4` sólo avisa, y dice la fase real   → `AC-02`

```
DADO   el mismo PT en PHASE 4
CUANDO corre verify-fdge
ENTONCES aviso, y el texto dice «el PT esta en PHASE 4»
```

**Sin este caso, el arreglo correcto sería indistinguible de convertir el aviso en error siempre** —
que pondría en rojo a todo `PT` recién abierto y enseñaría a saltarse la compuerta.

Y comprueba algo más: que el mensaje **deja de afirmar lo que no sabe**. El anterior decía «normal
antes de `PHASE 6`» sin haber mirado ninguna fase.

## `TS-03` — sin fase declarada NO se convierte en error   → `AC-03`

```
DADO   el mismo PT sin «phase» ni en el intake ni en el registro
CUANDO corre verify-fdge
ENTONCES no aparece ✗ FDGE-R23
```

`RULE-06`: lo que no se sabe no se supone. `SUITE-R08` ya reporta la fase ausente **una vez**;
repetirlo por artefacto enterraría el único mensaje que hay que leer.

## Lo que NO se cubre, y consta   `SUITE-R26`

**`FDGE-R25` y `FDGE-R29` no tienen caso propio.** Comparten helper, fixture y las tres salidas con
`FDGE-R23`, y añadir dos casos idénticos mediría lo mismo tres veces. Se comprueban **a mano** sobre
el mismo fixture y consta en la evidencia — no se afirman cubiertos por la batería.

**Y no se revisa si otras reglas conceden sin mirar la fase.** Está declarado en el intake §4.
