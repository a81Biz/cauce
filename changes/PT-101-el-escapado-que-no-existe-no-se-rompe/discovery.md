# Descubrimiento — `PT-101`

## Lo medido

```
comentarios que llevan la cuenta, cada uno con la suya:
  build-core.mjs:463       «ha fallado CINCO veces aqui»
  revisar-secretos.mjs:36  «ha fallado SIETE veces en este proyecto»
  verify-ptsa.mjs:108      «ha fallado CINCO veces en este proyecto»
  verify-qa.mjs:63         «ha fallado SEIS veces en este proyecto»
  verify-suite.mjs:526     «ha fallado CUATRO veces en este»
                            ────
                             27, y ninguno lo sabe

reglas sobre esto:
  RULES.md          0
  LEXICON.md        0
  PHASES.md         0
  EXECUTION-MODES   0
```

**Veintisiete fallos del mismo tipo y ninguna regla.**

## Por qué los arreglos eran de uno en uno

Lo dijo el firmante y es exacto: *«el tropiezo más recurrente, y no se ve en ningún lado; sólo
está en las conversaciones, y las reparaciones son una vez por vez»*.

Un defecto que solo vive en comentarios **no tiene nada que lo exija al caso siguiente**. Cada
arreglo cierra su instancia y el siguiente vuelve a escribirse a mano.

## Y detectar no basta

El intake proponía que `audit` **detectara** la construcción frágil. Al ejecutarlo apareció lo
que faltaba: durante veintisiete roturas el marco decía «no montes patrones desde cadenas» y
**no daba con qué hacerlo**.

Un aviso sin alternativa es un aviso que se incumple.

## Las ocho de esta sesión, por vía

```
heredoc de bash con comilla simple      3   el archivo NO se escribe · falla visible
replace de Python sobre un regex        2   queda un regex sin cerrar · no compila
plantilla de texto transformada         1   comillas invertidas rotas · no compila
saltos escapados -> saltos reales       2   el fixture cambia de forma · falla el caso
```

**Ninguna la cazó nada**, porque rompieron en la **vía** —el camino por el que se escribe— y no
en el destino.

## Lo que este descubrimiento NO establece

- **Cuántas roturas ha habido en total.** Se cuentan las declaradas en comentarios y las de esta
  sesión. Un total histórico sería afirmar sin medir.
