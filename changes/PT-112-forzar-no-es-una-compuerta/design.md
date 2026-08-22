# Diseño — `PT-112`

```
cauce install --forzar "Nombre Apellido"

  sin nombre        -> error, no sobrescribe, y dice como se usa
  con nombre        -> escribe en docs/implementation/INSTALL.log:
                         fecha · quien · version de cauce
                         cuantos archivos difieren y cuantos sobran
                         los primeros 20 de cada lista
                         la cita de SUITE-R31
  no puede escribir -> error, NO sobrescribe (RULE-06)
  instalacion nueva -> no entra: no hay divergencia que decidir
```

**El salto de línea va por `String.fromCharCode`** (`SUITE-R59`), que es la regla que `PT-101`
acaba de crear. Primera vez que se aplica en la tarea siguiente sin que nadie la recuerde.

## Por qué en `INSTALL.log` y no en un archivo nuevo

Ya existe y ya guarda lo que pasó al instalar. Un archivo nuevo sería otro sitio que mirar.
