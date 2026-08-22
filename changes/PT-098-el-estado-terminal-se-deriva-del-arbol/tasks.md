# Tasks — `PT-098`

## `PT-098.1` · los tests en rojo
| | |
|:---|:---|
| **Objetivo** | que la batería falle por el defecto |
| **Output** | `TS-01`…`TS-06` |
| **Validación** | cada caso falla por su aserción |
| **Estado** | PENDIENTE |

## `PT-098.2` · `integradoEnPrincipal` `D-1` `D-4`
| | |
|:---|:---|
| **Objetivo** | `AC-01` `AC-03` · tres valores, sin depender de la rama declarada |
| **Archivos** | `tools/tracker.mjs` |
| **Estado** | PENDIENTE |

## `PT-098.3` · `avanzar` escribe lo cierto `D-2`
| | |
|:---|:---|
| **Objetivo** | `AC-04` |
| **Validación** | con el árbol sosteniéndolo → `INTEGRATED`; sin él → `DONE`, y lo dice |
| **Archivos** | `tools/tracker.mjs` |
| **Estado** | PENDIENTE |

## `PT-098.4` · `verify-fdge` reporta `D-3`
| | |
|:---|:---|
| **Objetivo** | `AC-02` `AC-03` `AC-05` |
| **Validación** | los 91 actuales en verde · un falso en rojo · un `SIN EVALUAR` en aviso |
| **Archivos** | `tools/verify-fdge.mjs` |
| **Estado** | PENDIENTE |

## `PT-098.5` · la prueba inversa
| | |
|:---|:---|
| **Objetivo** | `AC-06` · ninguna retirada en cero |
| **Estado** | PENDIENTE |

## Rama propuesta — **NO se crea aquí**
```
bug/alberto-martinez/PT-098-el-estado-terminal-se-deriva-del-arbol
```
