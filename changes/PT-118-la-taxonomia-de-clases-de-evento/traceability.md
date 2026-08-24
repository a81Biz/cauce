# Trazabilidad — `PT-118`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `LEXICON` declara una TERCERA clase de identificador y dice que NO se asigna desde `REGISTRY.json` | `TS-01` `TS-02` `TS-03` `TS-04` | `selftest.sh:LEXICON declara la clase de evento` · `…y dice que NO se asigna desde REGISTRY` · `…declarandose excepcion a LEX-R04` | `salidas/casos-118.txt` |
| AC-02 | El prefijo no colisiona con `E-NNN`, `P-NNN`, `R-NNN`, `H-NNN` ni `U-NNN` | `TS-05` `TS-06` `TS-07` | `selftest.sh:el prefijo CE no colisiona con ningun otro` · `…y ninguna expresion busca «E-NNN» suelto` · `…con el riesgo latente que si existe, declarado` | `salidas/casos-118.txt` |
| AC-03 | Las clases medidas en `EP-020` §2.1 entran como semilla, cada una con su enunciado en una frase | `TS-08` `TS-09` `TS-10` `TS-11` | `selftest.sh:las diecisiete clases estan declaradas` · `…y ninguna se queda sin enunciado` | `salidas/casos-118.txt` |
| AC-04 | `CORE.md` la lleva | `TS-12` | `selftest.sh:la taxonomia llega al nucleo` | `salidas/core-taxonomia.txt` · `salidas/inversa.txt` |

**Cuatro criterios, cuatro con `TS`, cuatro con evidencia ejecutada.** Ningún Orphan Criterion.

`LEX-R32` —el negativo que sostiene a los cuatro— se cubre con `TS-13` y `TS-14`
(`selftest.sh:citar un CE que LEXICON no declara FALLA` · `…y es error, no aviso`).

---

## `AC-03` dice «quince» y son **diecisiete**

El intake se escribió cuando §2.1 tenía quince clases. El firmante señaló dos más —«trabajar sin
allocation» y «la comprobación acusa a quien documenta el hecho»—, y §2.1 las incorporó. La
semilla entra con **las diecisiete que hay medidas**, no con las quince que el criterio nombra.

Se deja escrito porque el número es dato, no redacción: quien lea `AC-03` y cuente diecisiete
tiene que poder saber por qué, en vez de sospechar de la cifra.

## `AC-04` estuvo en rojo, y no de forma trivial

`build-core` compila **reglas**: `LEX-R31` y `LEX-R32` llegaban al núcleo, la tabla no. La primera
medición dio `grep -c '^CE-0' CORE.md` = **0**. El criterio no se dio por bueno por parecido — se
midió, salió cero, y se construyó la derivación.

## Lo que esta trazabilidad **no** establece

- Que las diecisiete clases sean todas las que hay. **No lo son necesariamente**: `PT-125` puede
  encontrar más y eso es la tarea funcionando (`RULE-06`).
- Que ninguna herramienta pueda confundir un `CE-NNN`. Establece que **ninguna busca un `E-\d+`
  suelto hoy**, que es lo medido. `verify-ptsa.mjs:203` usa `/H-\d+/` sin anclar y queda
  declarado: no afecta a `CE`, pero es riesgo latente para un prefijo futuro acabado en `H`.
- Que citar un `CE` correcto sea suficiente para clasificar bien. La clasificación es un juicio,
  y `PT-125` la marcará `DECLARADO`.
