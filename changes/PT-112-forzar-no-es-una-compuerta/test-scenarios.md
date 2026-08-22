# Escenarios de prueba — `PT-112`

| Caso | Qué establece |
|:---|:---|
| `--forzar` pide quién lo decide | `SUITE-R06e` |
| …y deja constancia en `INSTALL.log` | `EXEC-R04a`, la forma fija |
| …y si no puede registrarlo, **no** sobrescribe | `RULE-06` |
| …y el salto se escribe por código | `SUITE-R59`, aplicada |

## Lo que NO se prueba

- **`INC-007` e `INC-013`**: sin descripción accesible.
- **Si otros flags saltan una compuerta.** Se mide `--forzar`.
- **Que una instalación real con `--forzar` escriba bien el registro**: se comprueba el código y
  su guarda, no una instalación completa sobre un proyecto ajeno.
