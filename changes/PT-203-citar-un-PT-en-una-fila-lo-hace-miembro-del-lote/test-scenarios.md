# `PT-203` · `test-scenarios.md`

## `TS-01` — citar un `PT` como origen **no** lo hace miembro   → `AC-01`

```
DADO   un lote cuyo intake cita «← PT-178» en una columna «Origen»
Y      PT-178 NO esta en el registro con epic = ese lote
CUANDO corre verify-fdge
ENTONCES no se le exige la firma de lote
```

## `TS-02` — los miembros reales se siguen detectando   → `AC-02`

```
DADO   un PT que el REGISTRO asigna al lote y cuyo intake NO lleva la linea
Y      ese PT esta VIVO
CUANDO corre verify-fdge
ENTONCES falla con INTAKE-R08
```

**Es la pareja que impide arreglarlo en la dirección peligrosa.** Sin `TS-02`, `TS-01` lo cumple un
verificador que no exija nada — y aquí eso apagaría una regla `HARD`.

## `TS-03` — el `PT` que el intake **no** lista tampoco se escapa   → `AC-02`

```
DADO   un PT que el registro asigna al lote y que el intake NO menciona
CUANDO corre verify-fdge
ENTONCES se le exige la firma igual
```

Éste es el defecto **grande**: 62 tareas invisibles. `TS-02` solo no lo cubre —el intake podía
listarlas—; es `TS-03` quien prueba que la fuente cambió.

## `TS-04` — lo terminal se cuenta, no se rejuzga   → `AC-03`

```
DADO   un PT INTEGRATED del registro cuyo intake no lleva la linea
CUANDO corre verify-fdge
ENTONCES sale como AVISO con su identificador, y NO bloquea
```

## `TS-05` — la firma nombra **el** lote, y se compara   → `AC-03`

```
DADO   un PT que el registro asigna a EP-025 y cuyo intake dice «Firmado por lote: EP-024»
CUANDO corre verify-fdge
ENTONCES lo dice, nombrando los dos
```

Hoy no lo dice: `RE_SIGN_BATCH` captura el grupo 1 y lo tira, mientras el mensaje **nombra** el
lote que no comprobó. Es lo mismo que `PT-198` acaba de cerrar, en la misma línea de código.

## `TS-06` — el mensaje distingue los dos hechos   → `AC-03`

```
DADO   un PT citado y no miembro, y uno miembro sin firma
CUANDO los dos aparecen
ENTONCES el primero no genera nada sobre INTAKE-R08 y el segundo lo nombra por lo que es
```

## Lo que NO se cubre, y consta   `SUITE-R26`

- **Las 23 sin línea no se arreglan.** Se cuentan y se nombran. Corregir trabajo cerrado es una
  decisión del firmante (`SUITE-R09` es append-only, `CE-014`).
- **`INTAKE-R09` sigue leyendo la tabla**: «lista `PT-NNN` y no existe su carpeta» es una
  comprobación sobre lo que el intake declara, y ése es su sitio.
- **No se promete que la tabla y el registro coincidan.** Citar un origen sigue siendo legítimo.
