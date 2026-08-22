# Trazabilidad — `PT-102`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | La forma de declarar una version vive en PATRONES | `la forma de declarar una version vive en PATRONES` · `…y trae sus ejemplos` | `selftest.sh:la forma de declarar una version vive en PATRONES` · `selftest.sh:…y trae sus ejemplos` | `salidas/inversa.txt` |
| AC-02 | Reconoce las dos formas y realinea las cuatro muertas | `…y reconoce tambien la segunda forma` | `selftest.sh:…y reconoce tambien la segunda forma` | `salidas/inversa.txt` |
| AC-03 | El marcador X.Y.Z de la plantilla NO se toca | `…y NO casa el marcador de una plantilla` | `selftest.sh:…y NO casa el marcador de una plantilla` | `salidas/inversa.txt` |
| AC-04 | La prosa no se toca: ancla a inicio de linea | `…ni una cifra citada en mitad de una frase` | `selftest.sh:…ni una cifra citada en mitad de una frase` | `salidas/inversa.txt` |
| AC-05 | El CLAUDE.md del proyecto entra en el recorrido | `el CLAUDE.md del proyecto entra en el recorrido` | `selftest.sh:el CLAUDE.md del proyecto entra en el recorrido` | `salidas/inversa.txt` |
| AC-06 | La bateria falla sin el arreglo | `la prueba inversa, retirada a retirada` | `la prueba inversa, retirada a retirada` | `salidas/inversa.txt` |


> **Nota de forma.** Esta tabla se reescribió: la primera versión tenía **cuatro** columnas
> y el parser de `FDGE-R15` exige **cinco** —`AC` · criterio · escenario · test · evidencia—,
> así que **ninguna fila se reconocía**. Seis tareas quedaron con la trazabilidad inservible
> y solo aparece en `verify-fdge --all`, que no se corrió hasta que el firmante preguntó por
> el cumplimiento. El criterio y los tests salen del `manifest.json`, que es la fuente.
