# Trazabilidad — `PT-104`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | El cuerpo publica la FASE actual con su nombre | `el cuerpo dice en que PASO esta` | `selftest.sh:el cuerpo dice en que PASO esta` | `salidas/inversa.txt` |
| AC-02 | Publica la regla de SALIDA y su compuerta | `…que tiene que pasar para SALIR` | `selftest.sh:…que tiene que pasar para SALIR` | `salidas/inversa.txt` |
| AC-03 | Publica la regla de ENTRADA | `…de donde VIENE` | `selftest.sh:…de donde VIENE` | `salidas/inversa.txt` |
| AC-04 | Publica a donde va | `…y a donde va DESPUES` | `selftest.sh:…y a donde va DESPUES` | `salidas/inversa.txt` |
| AC-05 | Publica que artefactos EXISTEN, derivado del arbol | `…y CUALES de sus artefactos existen ya` · `…distinguiendo los que faltan` · `…y DICE cuando no pudo mirar el arbol` | `selftest.sh:…y CUALES de sus artefactos existen ya` · `selftest.sh:…distinguiendo los que faltan` · `selftest.sh:…y DICE cuando no pudo mirar el arbol` | `salidas/inversa.txt` |
| AC-06 | Publica los bloqueos que queSigue ya deriva | `…y que le impide avanzar` | `selftest.sh:…y que le impide avanzar` | `salidas/inversa.txt` |
| AC-07 | NO copia contenido de changes/ | `un lote no lleva maquina de estados` | `selftest.sh:un lote no lleva maquina de estados` | `salidas/inversa.txt` |
| AC-08 | La bateria falla sin el arreglo | `la prueba inversa, retirada a retirada` | `la prueba inversa, retirada a retirada` | `salidas/inversa.txt` |

**`AC-07` se verifica por construcción y por un caso.** `maquinaDeEstados` no lee ningún
archivo de `changes/`: recibe la **lista de nombres** y publica cuáles hay. No hay ruta por
la que el contenido pueda llegar al issue.


> **Nota de forma.** Esta tabla se reescribió: la primera versión tenía **cuatro** columnas y
> el parser de `FDGE-R15` exige **cinco** —`AC` · criterio · escenario · test · evidencia—, así
> que **ninguna fila se reconocía**. Cuatro tareas quedaron con la trazabilidad inservible y el
> fallo solo aparece en `verify-fdge --all`, que no se corrió hasta que el firmante preguntó por
> el cumplimiento. El criterio y los tests salen ahora del `manifest.json`, que es la fuente.
