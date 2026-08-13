# PT-007 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Cada issue vivo lleva ahora `fase: N` y, si una compuerta espera, `G1`..`G4`. Las dos se
**derivan** del registro. El espejo comprueba que coincidan. `tracker estado` imprime el tablero
leyendo solo el registro.

## El resultado, tal como se ve en GitHub

```
#12 PT-008 · leer-lo-que-el-humano-escribe   [tarea, fase: 1, G1]
#11 PT-007 · el-issue-lleva-la-fase          [tarea, fase: 4, G2]
#10 PT-006 · el-contrato-vuelve-a-su-regla   [tarea, fase: 8]
```

Eso responde «qué va cuándo» sin abrir el repositorio, que era la petición.

## Lo que un revisor debería atacar

**1 · La compuerta se deriva de un mapa escrito en `tracker.mjs`.** `COMPUERTA_DE_FASE` copia lo
que `CORE.md` §Fases declara. Es un hecho en dos sitios —justo lo que `RULE-01` persigue— y lo
elegí igualmente porque leer el mapa de `CORE.md` en tiempo de ejecución significaría parsear
prosa. **Es la deuda más clara que dejo aquí**, y si el mapa de fases cambia, esto se queda
atrás en silencio.

**2 · `estado` se salta la compuerta de acceso.** Es deliberado y probado, pero significa que
`tracker` tiene ahora una acción que no pasa por `decidirSalida`. Con dos, sería un patrón; con
una, es una excepción y hay que mirarla.

**3 · La sincronización quita etiquetas.** `--remove-label` sobre las derivadas que sobran. Si
alguien pusiera a mano una etiqueta con forma `fase: N`, se la borraría sin avisar. Es coherente
—el estado se deriva— pero es destructivo y no lo dice antes de hacerlo.

**4 · Un issue por PT y una llamada a `gh` por issue al sincronizar.** Con nueve va sobrado; con
doscientos, no.

## Lo que NO he verificado

- **Un proyecto con muchos issues.** El espejo pide `--limit 500` y la sincronización hace una
  llamada por allocation viva. No se ha probado con más de nueve.
- **Qué pasa si dos agentes sincronizan a la vez.** No hay bloqueo. Fuera de alcance y sin caso
  real que lo pida.

SELF_REVIEW_COMPLETE
