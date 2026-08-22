# Cambios de especificación — `PT-101`

| | |
|:---|:---|
| Reglas nuevas | **`SUITE-R59`** (HARD) |
| Reglas modificadas | ninguna |
| Reglas derogadas | ninguna |
| `RIGE_DESDE` | `SUITE-R59: [12, 0, 0]` |
| Vocabulario nuevo | ninguno |

## `SUITE-R59` — el escape que no existe no se rompe

Un patrón se escribe como **regex literal**; una secuencia de control con `String.fromCharCode`;
un texto largo **a un archivo**. `new RegExp` sobre una cadena con barra **simple** ante una letra
de clase queda **prohibido**.

**Sube `MAJOR`**, y ya estaba subido: la `12.0.0` entra con cinco reglas `HARD`; esta es la sexta.

## Lo que esta regla no añade

**No añade una obligación nueva de comportamiento**: el repositorio ya escribía así por costumbre,
en cinco archivos, desde hace veintisiete roturas. Lo que añade es que **exista como regla** — y
por tanto que se pueda citar, comprobar y aplicar al caso siguiente.
