# PT-150 · `out-of-scope.md` — `PHASE 4` Proposal

```
OUT: corregir las cinco allocations historicas (PT-015, PT-016, PT-017, PT-051 con S4 y
     PT-107 con S0). AC-06 lo prohibe: estan INTEGRATED y SON la evidencia de que el
     defecto existio. Borrarla para que cuadre una cifra es perder el rastro.

OUT: tocar INTAKE/templates/. La plantilla trae severity: S4 por defecto y es CORRECTO —
     LEXICON define S4 como «deuda sin impacto observable, se agrupa en lotes», que es lo
     que un CHORE de lote es. El que esta mal es el comando. Cambiarla a S3 acomodaria el
     documento al defecto.

OUT: anadir S0 a LEXICON. Es la opcion B de discovery.md 7 y es LEGITIMA, pero cambiar la
     escala de severidad de la suite es metodologia, no un arreglo de herramienta, y
     hacerlo desde aqui es la direccion que LEX-R21 prohibe. Si el firmante prefiere el
     peldano, esto se revierte y se abre trabajo sobre LEXICON.

OUT: revisar otras listas canonicas escritas dentro de herramientas. verify-patrones
     comprueba hoy 2 de 7 contratos de patrones.mjs — declarado en la parada de #286 con
     desenlace «declara», candidato a tarea propia fuera de EP-022.

OUT: prometer que una severidad invalida no puede entrar «por ningun camino». REGISTRY.json
     se escribe a mano y asi entraron los cuatro S4. AC-07 se cumple por comando + 
     verificador, y se DICE — prometer la garantia completa seria SUITE-R26.
```

## Lo que se pensó y no se declara fuera de alcance

**El carril `HOTFIX` depende de esta escala.** `FDGE-R22` dice que `HOTFIX` solo es válido con
`S1`, y `EXEC-R11` habla de hotfix vencido. Nada de eso cambia aquí —`S1` sigue siendo `S1`—
pero conviene que quede escrito **por qué** esta tarea no es cosmética: toca el campo que
gobierna el único carril que se salta fases.
