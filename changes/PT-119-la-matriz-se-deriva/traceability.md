# Trazabilidad — `PT-119`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `tools/matriz.mjs` escribe `MATRIZ.md` con clase · veces · primera y última · tareas · regla dueña · si tiene verificador | `TS-01` `TS-02` `TS-08` | `selftest.sh:la fila lleva clase, veces y fechas` · `…y las tareas donde ocurrio` · `tener regla no es tener verificador` | `salidas/casos-119.txt` · `salidas/MATRIZ-al-cerrar.md` |
| AC-02 | Todas las cifras se DERIVAN de `EVENTOS.jsonl` cruzado con `REGISTRY` y con las reglas: ninguna se transcribe | `TS-03` `TS-04` | `selftest.sh:alterar el jsonl cambia la cifra` · `una MENCION no suma como instancia` | `salidas/casos-119.txt` · `salidas/inversa.txt` |
| AC-03 | Lo que no puede leerse sale `SIN EVALUAR` y es distinguible de «cero» | `TS-09` `TS-10` `TS-11` `TS-12` | `selftest.sh:un jsonl ilegible NO es un jsonl vacio` · `…y un jsonl vacio SI produce matriz, con ceros` · `sin fuentes NO escribe una matriz vacia` | `salidas/casos-119.txt` |
| AC-04 | «Regla dueña» y «tiene verificador» se derivan de `RULES.md` y de los `fail()` reales, no de una tabla escrita a mano | `TS-05` `TS-06` `TS-07` `TS-08` | `selftest.sh:la regla dueña sale de que la regla cite la clase` · `…tambien en la forma suelta` · `…y sin cita, la clase sale SIN DUEÑO` | `salidas/casos-119.txt` · `salidas/inversa.txt` |
| AC-05 | `npm run matriz` existe y la frescura se comprueba: un `.md` derivado desincronizado falla | `TS-13` `TS-14` `TS-15` `TS-16` `TS-17` | `selftest.sh:npm run matriz existe` · `…y la frescura entra en verify` · `la matriz publicada esta al dia` | `salidas/casos-119.txt` · `salidas/matriz.txt` |

**Cinco criterios, cinco con `TS`, cinco con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-02` dice «cruzado con `REGISTRY.json`» y se cruza con `RULES.md`

El criterio nombra el registro. La matriz no lo necesita: `EVENTOS.jsonl` ya trae la tarea y la
fecha de cada evento, derivadas por `eventos.mjs` del ledger. Lo que sí hace falta cruzar —y el
criterio no lo dijo— es `RULES.md`, para la regla dueña, y los `fail()` reales, para el
verificador.

Se deja escrito en vez de dar el criterio por cumplido con una lectura elástica.

## `AC-04` dice `RULES.md` y se leen **dos** documentos

`RULES.md` y `LEXICON.md`, porque las reglas `LEX-R` se definen ahí (`LEX-R23`). Mirar sólo
`RULES.md` habría dejado a `LEX-R22` sin poder reclamar ninguna clase.

Y queda un límite declarado: `RULE-06` vive en `11-Conventions.md`, que **no** se lee. Por eso
`CE-005` sale sin dueño aunque el ledger se la atribuya. Está en `out-of-scope.md`.

## Lo que esta trazabilidad **no** establece

- **Que las nueve clases huérfanas deban tener regla.** La matriz dice que no la tienen. Decidir
  cuáles la merecen es `PT-126`.
- **Que `CE-002` esté desprotegida.** Dice que **nada emite bajo `SUITE-R59`**. `audit` detecta
  construcciones frágiles, pero bajo su propio recuento de huecos, no bajo la regla — y por eso la
  columna dice «la regla existe y nada emite por ella» y no «sin vigilancia».
- **Que el recuento sea de ocurrencias.** Es de entradas que nombran la clase, con el denominador
  que `EVENTOS.jsonl` declara en su cabecera.
