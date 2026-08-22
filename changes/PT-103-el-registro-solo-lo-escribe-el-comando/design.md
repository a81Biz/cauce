# Diseño — `PT-103`

## Las dos mitades

### 1 · El comando permite obedecer

```
tracker asignar PT --slug <x> --tipo BUG --severidad S1 --epica EP-019 --titulo "..."
```

- `phase: 1` **siempre**, con flags o sin ellos. Es el campo cuya ausencia bloqueaba `avanzar`.
- `--tipo` y `--severidad` se validan contra lo que `LEXICON` declara. Un valor inventado falla.
- `--epica` se valida con `esLote`, el helper que `patrones.mjs` exporta desde `PT-096`.
- Se **dice** qué campos no se declararon. Un campo ausente que nadie nombra es el que luego se
  escribe a mano.

### 2 · Algo lo comprueba

`SUITE-R58`, verificada en `checkPT`. **Avisa**, no falla:

```
PT-NNN: la allocation no declara phase, severity — se escribio sin «tracker asignar»,
        que ahora los escribe. Sin «phase» no se puede avanzar nunca.
```

## Dónde va la comprobación, y por qué ahí

Después de la línea que define `rige`.

La primera versión la puse al **principio** de `checkPT`, donde `rige` todavía no existe. Es la
**décima** vez en este lote que una comprobación se coloca donde su ámbito no llega — en
`PT-096` el mismo error hizo que 21 casos reportaran «la herramienta reventó», que **no es un
rojo**. Esta vez se comprobó antes de ejecutar.

## El flag que rompió la raíz del proyecto

`CON_VALOR` declara qué flags llevan valor. Sin registrar `--severidad` ahí, su valor `S1` se
tomaba por la **ruta del proyecto** y la herramienta buscaba el registro dentro de un directorio
llamado `S1`.

El comentario contiguo ya lo avisaba: «es la **cuarta** vez en dos lotes que un argumento nuevo
se cuela por aquí». La mía fue la quinta.

> Un tipo en mayúsculas no lo exponía: `ES_ETIQUETA` ya lo excluía. Solo un valor con dígito
> —`S1`— llegaba a la comparación. La inversa lo descubrió saliendo en cero **dos veces**.

## Termina cuando

`asignar` crea una allocation completa, rechaza valores inventados, `verify-fdge` avisa de las
incompletas sin juzgar las antiguas, y la batería falla sin el arreglo.
