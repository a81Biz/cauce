# Tareas — `PT-103`

| # | Qué | Estado |
|:--|:---|:---|
| T-1 | Medir qué escribe `asignar` y qué exige el marco | HECHO · 4 de 9 |
| T-2 | Contar los rodeos de la sesión y declararlos | HECHO · cinco, dos declarados |
| T-3 | Declarar la excepción **antes** de aplicarla | HECHO |
| T-4 | Casos en rojo, con el negativo del tipo inventado | HECHO |
| T-5 | `asignar` acepta los cuatro flags y escribe `phase: 1` | HECHO |
| T-6 | Registrar los flags en `CON_VALOR` | HECHO · quinta vez que se olvida |
| T-7 | `SUITE-R58` en `RULES` y en `RIGE_DESDE` | HECHO |
| T-8 | La comprobación en `verify-fdge`, dentro de su ámbito | HECHO · corregido antes de correr |
| T-9 | Citar la regla en documentos operativos | HECHO · `PHASES` y `FDGE-Prompts` |
| T-10 | Prueba inversa | HECHO · siete, todas con efecto |
| T-11 | Batería completa | HECHO |
| T-12 | Evidencia, autorrevisión y trazabilidad | HECHO |

**`T-10` corrigió `T-4` dos veces.** El primer intento de probar `CON_VALOR` salió en cero
porque el fixture pasaba la ruta explícita; el segundo también, porque el valor elegido ya lo
excluía otro filtro. El único valor que exponía el defecto era `S1`.
