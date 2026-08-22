# Descubrimiento — `PT-105`

## Dónde está, con archivo y línea

```
tracker.mjs:1205   estadoDeFase()
  :1213   BUG + fase de validacion          -> VALIDATION_PENDING     PT-099
  :1219   ctx.esFinal (PHASE 10)            -> DONE o INTEGRATED      PT-098
          no-BUG saliendo de Validacion     -> nada                   <- el hueco

RULES.md:231       FDGE-R34   «estado del PT en DONE» como precondicion de G4
FASES              9 = Integracion (G4)   ·   10 = Cierre
```

## La medición del histórico

```
FEATUREs en el registro:  16
  PT-041 · PT-042 · PT-043   phase 9   INTEGRATED
  PT-069 · PT-078            phase 10  INTEGRATED
  PT-104                     phase 8   DRAFT       <- el que lo destapo
```

Los quince anteriores llegaron a `INTEGRATED`. **Ninguno pasó por un `DONE` escrito por un
comando**: o se escribió a mano, o se saltó.

## Por qué es la misma familia que `PT-103`

`PT-103` lo enunció así: *cumplir el marco no puede exigir saltarse la herramienta*. Aquí la
compuerta pide un estado que ninguna herramienta escribe — y la única salida era editar
`REGISTRY.json`.

**Y `PT-103` es lo que lo hizo visible.** Mientras rodear el registro era rutina, este hueco no
podía notarse.

## Lo que este descubrimiento NO establece

- **Si hay más estados sin comando.** Se midió este.
- **Que los quince históricos estén mal.** Llegaron a `INTEGRATED` y eso es un hecho del árbol.
