# Tareas — `PT-107`

| # | Qué | Estado |
|:--|:---|:---|
| T-1 | Reconstruir la cronología de la pérdida | HECHO |
| T-2 | Comprobar contra `HEAD` que no se perdió nada más | HECHO · solo `PT-106` |
| T-3 | Restaurar `PT-106` | HECHO · mismo identificador |
| T-4 | Registrar la pérdida en `SESSION_LOG` | HECHO |
| T-5 | Localizar todas las escrituras del registro | HECHO · cuatro |
| T-6 | `guardarRegistro` con la huella al leer | HECHO |
| T-7 | Las cuatro escrituras pasan por ella | HECHO |
| T-8 | Prueba inversa que **reproduce** la carrera | HECHO · dos retiradas, dos con efecto |
| T-9 | Batería completa | PENDIENTE |
| T-10 | Evidencia, autorrevisión y trazabilidad | HECHO |

**`T-6` se escribió dos veces.** La primera versión llevaba `export` y quedó **dentro** del bloque
`EJECUTADO_DIRECTO`, donde `export` no es válido. Es la forma correcta —quien importa el módulo
no escribe el registro— y el error fue la palabra, no el sitio.
