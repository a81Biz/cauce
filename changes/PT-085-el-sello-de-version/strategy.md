# PT-085 — Estrategia   `PHASE 3`

## `A` · qué se contrasta del bloque `ESTADO`

| Opción | Por qué no |
|:---|:---|
| Generar el bloque entero | `decisiones` y `no hacer` son lo único valioso que no se deriva. Generarlo lo destruiría |
| Exigir que el texto «mencione» las tareas vivas | Una mención no es una afirmación: `PT-067` demostró que contar menciones convierte un comentario en prueba |
| **Derivar los cuatro derivables y contrastar** | ✅ Lo verificable se verifica; lo demás se declara |

**El criterio es la contradicción, no la omisión.** Se falla cuando el handoff **afirma algo que
el registro desmiente** —«`PT-081` está viva» con `PT-081` en `INTEGRATED`—, no cuando omite algo.
Exigir exhaustividad convertiría el bloque en un volcado del registro, que es justo lo que no debe
ser: `SUITE-R38` prohíbe dos fuentes del mismo hecho, y el handoff existe para lo que el registro
**no** puede decir.

## `B` · commitear o no decir que cerró

`sesion cerrar` hace hoy un acto y medio: escribe y no sella. `tracker avanzar` ya resolvió esta
misma forma —hace sus cinco actos o no hace ninguno— y se copia.

Si no puede commitear —árbol sucio con otras cosas, sin identidad de git— **lo dice y falla**. No
cierra a medias, porque un cierre a medias es peor que no cerrar: deja creer que hay rastro.

## `C` · acotar, no cronometrar

Ya argumentado en el intake §5. La forma la da `EXEC-R11`.

**Dónde vive el umbral.** En el `CLAUDE.md` del proyecto, junto a `execution_mode` y `firmantes`,
porque es una decisión de equipo — no una constante del marco. `N = 3` por defecto, que es lo que
el firmante propuso.

**Qué cuenta como «sin sellar».** Una tarea `INTEGRATED` cuyo identificador **no aparece** en el
`RULES.md`… no. Eso sería una heurística sobre prosa, y `PT-081` ya se quemó con una. Lo derivable
y estable es: **su commit de integración no es antecesor del último tag de versión**. Un tag no se
mueve — la lección de `PT-081`, aplicada antes de tropezar.

## `D` · resolver, no actualizar

La forma es la de `FND-R22` con el `LAYOUT`: **cada fila lleva su decisión, y una celda vacía no
pasa**. Se elige esa y no «comprobar que el documento cambió» por dos motivos:

1. **No todo cambio normativo obliga a tocar el manual.** Exigirlo produciría cambios cosméticos
   para acallar la comprobación — el equivalente documental de fabricar un verde.
2. **Lo contrario tampoco vale**: un manual que cambia no prueba que se revisara lo que hacía falta.

Lo que sí se puede derivar es **la señal**: qué documentos normativos cambiaron desde el tag y
cuáles de entrada no. Eso se enumera y ayuda; no juzga.

### Los documentos de entrada, y por qué esos cinco

| Documento | Quién lo lee |
|:---|:---|
| `MANUAL.md` | quien usa cauce por primera vez |
| `CASOS-DE-USO.md` | quien busca su caso concreto |
| `docs/methodology/README.md` | quien abre la suite |
| `README.md` (raíz) | quien llega al repositorio o al paquete |
| `Suite-CLAUDE-Template.md` | quien instala en un proyecto nuevo |

Los cinco son **lo que alguien lee antes de saber nada**. `RULES`, `LEXICON` y `EXECUTION-MODES`
no entran: los lee quien ya está dentro, y su verdad la comprueba `verify-suite`.

## `E` · avisar sin bloquear

El manifiesto ya guarda `mtime` y `ast_hash` por archivo, así que la deriva se deriva —valga— sin
infraestructura nueva.

**La decisión que importa es la severidad.** La tentación es que cualquier edición ponga el grafo
en `STALE`:

| Si la deriva de contenido… | Consecuencia |
|:---|:---|
| bloquea (`STALE`) | como casi toda tarea toca una herramienta, `G2` quedaría bloqueada en todos los `MAJOR` **siempre**. Y una comprobación que bloquea siempre se desactiva |
| **avisa (`SUSPECT`)** | ✅ se ve, se enumera, y `STALE` bloqueante sigue reservado a lo estructural |

Es la misma decisión que en `A` —contradicción y no omisión— y por el mismo motivo: **la
comprobación tiene que poder pasar, o se apaga sola**. `SUITE-R26` lo dice de otra forma: una
regla `HARD` aspira a comprobación mecánica; publicar sí, bloquear no siempre.

**Y sellar sí exige el grafo al día**, porque sellar es el momento en que sí toca pagar la deuda —
igual que la batería completa. `FDGE-R32` deja la regeneración en manos del humano, así que el
sello la **describe** y espera.

## `AC-14` · que lo digan las instrucciones

El firmante lo pidió explícitamente, y `PT-079` ya estableció el patrón: una regla sin fase que la
abra no se cumple. Los sitios son los mismos cinco de aquella tarea, adaptados:

```
RULES.md          la regla, con su ID y severidad
PHASES.md         la fase que sella lo invoca
FDGE-Prompts.md   el prompt de G4 lo pide
CORE.md           regenerado, que es lo único que el agente carga
MANUAL.md         para quien no lee reglas
```

## Orden, y por qué

`A` → `B` → `C` → `D` → `E`. Los cinco son independientes, así que el orden es de menor a mayor riesgo:
`A` y `B` tocan un verificador y una acción existentes; `C` añade una regla nueva; `D` añade un
artefacto nuevo. Si algo tiene que quedarse fuera por presupuesto, que sea lo último y no lo
primero.

## Riesgo declarado

`A` puede volverse ruidoso: si el contraste es demasiado estricto, cada transición de fase dejaría
el handoff «mintiendo» hasta actualizarlo, y acabaría desactivándose. Por eso el criterio es
**contradicción y no omisión**, y por eso `AC-02` existe: un handoff correcto tiene que pasar, o
la comprobación se apaga sola.
