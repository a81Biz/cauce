# Trazabilidad — `PT-105`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Un no-BUG pasa a DONE al cerrar Validacion | `un no-BUG que cierra Validacion pasa a DONE` · `el peldaño se ata al NOMBRE de la fase, no a un numero` | `selftest.sh:un no-BUG que cierra Validacion pasa a DONE` · `selftest.sh:el peldaño se ata al NOMBRE de la fase, no a un numero` | `salidas/inversa.txt` |
| AC-02 | Un BUG sigue deteniendose en VALIDATION_PENDING | `…pero un BUG NO: se detiene` · `…y sigue parando en Validacion` | `selftest.sh:…pero un BUG NO: se detiene` · `selftest.sh:…y sigue parando en Validacion` | `salidas/inversa.txt` |
| AC-03 | Un estado ya terminal no se toca | `…un estado ya terminal no se toca` · `…tampoco uno ya integrado` | `selftest.sh:…un estado ya terminal no se toca` · `selftest.sh:…tampoco uno ya integrado` | `salidas/inversa.txt` |
| AC-04 | Se dice lo que se escribio y por que | `la nota que emite avanzar` | `la nota que emite avanzar` | `salidas/inversa.txt` |
| AC-05 | La bateria falla sin el arreglo | `la prueba inversa, retirada a retirada` | `la prueba inversa, retirada a retirada` | `salidas/inversa.txt` |

**`AC-04` se verifica en la nota que `avanzar` emite**, no en `estadoDeFase`: la función es
pura y devuelve un estado, y quien lo dice es el comando. La nota distingue explícitamente
que **el comando no firma nada** — escribe el estado que una firma humana ya registrada
implica.


> **Nota de forma.** Esta tabla se reescribió: la primera versión tenía **cuatro** columnas y
> el parser de `FDGE-R15` exige **cinco** —`AC` · criterio · escenario · test · evidencia—, así
> que **ninguna fila se reconocía**. Cuatro tareas quedaron con la trazabilidad inservible y el
> fallo solo aparece en `verify-fdge --all`, que no se corrió hasta que el firmante preguntó por
> el cumplimiento. El criterio y los tests salen ahora del `manifest.json`, que es la fuente.
