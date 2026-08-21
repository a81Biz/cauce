# PT-091 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Las cifras se **generan**: un comando las recalcula | E8 · E11 | `selftest.sh`: «inventario enumera la cifra desviada» · «…y con la marca la reescribe» | `salidas/inventario.txt` | VERIFICADO |
| AC-02 | Una cifra transcrita que no coincide **se reporta** | E1 · E2 | `selftest.sh`: «una cifra que coincide no se reporta» · «…y una desviada si, con las dos cifras» | `salidas/inventario.txt` | VERIFICADO |
| AC-03 | El recuento de `CLAUDE.md` entra en la misma comprobación | E6 · E7 | `selftest.sh`: «el recuento de herramientas se lee» · «…y el de comandos tambien» | `salidas/claude.txt` | VERIFICADO |
| AC-04 | El inventario declara su **ancla** | E12 | `selftest.sh`: «el arbol real tiene sus cifras al dia» | `salidas/inventario.txt` | VERIFICADO |
| AC-05 | Las 8 cifras quedan corregidas **por el generador** | E10 · E11 | `selftest.sh`: «…y sin la marca NO ha escrito nada» · «…y con la marca la reescribe» | `salidas/inventario.txt` | VERIFICADO |
| AC-06 | El generador declara su **sujeto**: recuenta, no valida la prosa | E3 · E5 | `selftest.sh`: «…y una herramienta retirada se nombra aparte» · «…y una linea que no es fila no cuenta» | `salidas/inventario.txt` | VERIFICADO |

## `AC-02` avisa donde `PT-089` falla, y la diferencia está medida

```
PT-089   la divergencia APAGA comprobaciones      ->  ERROR
PT-091   la cifra desviada no cambia ningun       ->  AVISO, con el comando que lo arregla
         resultado
```

**La consecuencia decide la severidad**, no la gravedad aparente. Es la tercera decisión de este
tipo en el lote, y las tres van en direcciones distintas por el mismo criterio.

## `AC-06` es el límite honesto

Que `services.md` diga bien cuántas líneas tiene `tracker.mjs` **no dice nada** sobre si describe
bien lo que hace. Va en el mensaje, no en un comentario — `PT-087` lo hace obligatorio.
