# Diseño — `PT-109`

## La tabla y la envoltura

```
AVISA_AHORA_FALLA_EN = { SUITE-R35: G4, FDGE-R19: G4, FDGE-R52: G4, FDGE-R54: G2 }

warn(rule, msg)  ->  msg + « · AVISO AHORA, ERROR EN <G>.»   si la regla esta en la tabla
                     msg                                      si no
```

Va en la **envoltura** de `warn` y no en cada llamada: repetir la coletilla en cuatro sitios sería
cuatro copias que divergen (`SUITE-R38`).

## `FPGE-R01`

Reconoce la **fila**: la línea empieza por `|` y el identificador va en su primera celda. Una cita
en prosa no lo es.
