# PT-002 — Escenarios de test   `PHASE 4`

En `selftest.sh`, sobre el árbol real de la suite, que es lo que `audit` audita.

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | `audit` sobre la suite | imprime la cobertura con **denominador**: `/ 167` |
| `TS-02` | `AC-02` | ídem | aparecen los **tres** estados, no dos |
| `TS-03` | `AC-03` | ídem | **no** aparece «Cobertura completa» a secas |
| `TS-04` | `AC-04` | `audit --sin-verificar` | enumera identificadores de reglas |
| `TS-05` | `AC-01` | ídem `TS-01` | la cifra de «ejecutadas» **no** es 0 ni el total: se derivó de verdad |
| `TS-06` | `AC-01` | árbol sin `package.json` ni workflows legibles | `SIN EVALUAR`, y **no** 0 ni el total |
| `TS-07` | `AC-05` | fixture con un componente cuyas reglas no cita ninguna herramienta | sigue apareciendo el hueco por componente |

## Los inversos, y por qué no son opcionales

- **`TS-05`** — sin él, «85/167» podría producirse contando cero o contándolo todo, y los
  cuatro primeros pasarían igual. Es el caso que distingue *derivado* de *inventado*.
- **`TS-06`** — es `RULE-06`. Sin él, la salida podría asumir un valor cómodo cuando no puede
  saberlo, que es exactamente el defecto que este PT corrige.
- **`TS-07`** — sin él, «medir por regla» podría implementarse **quitando** la medición por
  componente, y los demás pasarían.

## Lo que no se prueba con número exacto

Los casos comprueban **forma y rangos**, no el valor `85`. Fijar la cifra convertiría el arnés
en algo que hay que actualizar cada vez que se escriba una regla o una comprobación — un hecho
copiado más (`RULE-01`), dentro de la batería que existe para cazar hechos copiados.

## Regresión

Los 202 casos existentes. `audit` corre en `npm run verify` y en CI: si su código de salida
cambia por la cifra nueva, el cambio ha convertido una medida en una compuerta, que está
explícitamente rechazado en `strategy.md`.
