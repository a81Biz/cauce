# Estrategia — `PT-101`

## La decisión

**A-1 · Regla, normalizador y detección. Las tres, o ninguna sirve.**

| Pieza | Sin ella |
|:---|:---|
| **`SUITE-R59`** | nada lo exige al caso siguiente: se arregla de uno en uno |
| **el normalizador** | el aviso dice qué no hacer y no da con qué hacerlo |
| **`audit`** | se detecta cuando ya rompió, no antes |

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Solo centralizar la cuenta** | una cifra no impide nada |
| **Solo detectar** | detectar sin alternativa repite el error de veintisiete veces |
| **Prohibir `new RegExp`** | hay usos legítimos; la firma del defecto es más precisa |
| **Arreglar las instancias** | es lo que se ha hecho 27 veces |

## La firma del defecto, y por qué es precisa

```
new RegExp('...\s...')     barra SIMPLE   -> compila a «s» · NO CASA NADA
new RegExp('...\\s...')    barra DOBLE    -> correcto · no se marca
```

Una barra simple ante una letra de clase **no sobrevive a la cadena**. El patrón resultante
compila y no casa nada — **el fallo más caro que existe**, porque parece que todo está bien.

## La propiedad del normalizador

**Ninguna de sus funciones lleva una barra invertida escrita dentro de una cadena.** Esa es su
única propiedad y es la que importa: lo que no se escribe no se puede perder al pasar por un
shell, un heredoc, un `replace` o una plantilla transformada.

## Termina cuando

La regla existe y se cita donde se trabaja, el normalizador está disponible, `audit` caza la
construcción frágil sin marcar la correcta ni los comentarios, y el árbol queda limpio.
