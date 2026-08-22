# Descubrimiento — `PT-111`

## Lo que el espejo comparaba

```
compararEspejo(vivas, issues, todas, refExiste, refDurable)

  SUITE-R35   la allocation viva tiene issue
  SUITE-R35   ese issue esta abierto
  SUITE-R35   ningun issue abierto sin allocation que lo reclame
  SUITE-R56   el enlace apunta a un ref que existe
  SUITE-R51   el cuerpo no publica la ruta sin enlace

  el TITULO   no se comparaba
```

## La fila decía menos de lo que había

La `Revisión 1` del cierre lo escribió así: *«que el espejo **reporte** una divergencia de texto —
`L-0` hizo que `abrir --aplicar` la corrija; el espejo compara estado, no cuerpo»*.

**Medido: tampoco el título** — que es lo primero que una persona lee al abrir el tablero.

## Y es la forma que más se repite en el lote

```
EP-007   existe «tracker siguiente»       y nada lo echa en falta   -> PT-104
PT-110   existe «tracker inventario»      y sellar no lo miraba
PT-111   existe «abrir --aplicar»         y el espejo no lo echa en falta
```

**Tres veces la misma distancia**: una herramienta que corrige, y nada que note que hace falta.

## Lo que este descubrimiento NO establece

- **Si Azure tiene el mismo hueco.** Se mide sobre GitHub, que es la plataforma declarada.
