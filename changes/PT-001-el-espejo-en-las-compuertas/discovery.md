# PT-001 — Discovery   `PHASE 2` · análisis `2-B` (bug)

## Qué

`SUITE-R35` es **HARD**, tiene herramienta y ninguna compuerta la ejecuta. Se puede abrir
trabajo, avanzarlo y llevarlo hasta `G4` sin que nada compruebe que existe en la plataforma —
que es justo lo que la regla existe para garantizar.

## Dónde

| # | Frente | Archivo · línea |
|:--|:---|:---|
| 1 | `verify-fdge` no menciona el espejo | `verify-fdge.mjs` — 0 coincidencias |
| 2 | Ninguna compuerta invoca `tracker` | `package.json` · `.github/workflows/verificacion.yml` · `bin/cauce.mjs:171-178` |
| 3 | `FDGE-R52` solo lee `bitacora.md` | `verify-fdge.mjs:788-795` |
| 4 | `tracker` usa etiquetas que no crea | `tracker.mjs:64-69` |

## Cuándo

Desde que `SUITE-R35` entró en la 5.0.0. La regla y su herramienta se publicaron juntas; el
cableado a las compuertas no llegó nunca.

## Cómo se descubrió

**No lo encontró un verificador: lo encontró una persona mirando.** El 2026-08-13, revisando
el plan de `EP-001`, el humano preguntó por qué el trabajo no aparecía en GitHub. Hasta ese
momento el lote se había planificado entero sin issues y **las siete comprobaciones pasaban en
verde**.

Es el dato más relevante de este análisis: el marco no podía detectar su propio incumplimiento
de `SUITE-R35`, y el único mecanismo que lo detectó fue humano y accidental.

## Por qué — causa raíz

**Una regla se publicó con su herramienta y sin su compuerta.**

La 5.0.0 introdujo `SUITE-R35` y `tracker.mjs` a la vez. `tracker` está completo para lo que
implementa: comprueba el espejo por enumeración en las dos direcciones y sale con `1` si
diverge. Lo que falta es que alguien lo llame.

Esto **no es un descuido aislado**: es el mismo patrón que `PT-004`, ya cerrado, y el mismo
que `PT-002` va a medir. Una comprobación que existe y no se ejecuta, y un informe que no
distingue «comprobado» de «nadie miró».

Los frentes 3 y 4 son consecuencias del mismo hueco:

- **Frente 3** · `FDGE-R52` se escribió con la plataforma en mente —`CORE.md` dice «issue si
  hay plataforma»— pero el verificador se escribió sin ella. La procedimiento conoce la
  plataforma; la comprobación no.
- **Frente 4** · `tracker abrir` asume un terreno que no verifica ni prepara, incumpliendo
  `FND-R30` («los accesos se comprueban antes de necesitarlos») en su propia herramienta.

**Hipótesis descartada:** que el espejo se dejara fuera de CI a propósito por no haber
credenciales en el runner. Descartada: no hay nota, comentario ni entrada de CHANGELOG que lo
declare, y `verificacion.yml` está densamente comentado justo sobre por qué cada paso bloquea.
Una omisión deliberada en este repositorio se escribe.

## Impacto

| | |
|:---|:---|
| Severidad declarada | `S2` |
| Workaround | ejecutar `tracker espejo` a mano y acordarse |
| Alcance | todo proyecto que declare plataforma (`LEX-R25`) |
| Daño observado | `PT-004` quedó en `DONE` con `G4` bloqueada por el frente 3; el lote entero se planificó sin issues sin que nada avisara |

## Lo que queda por determinar — entra en `PHASE 3`

**Dónde se ejecuta el espejo en CI y qué pasa sin token.** La decisión humana de `AC-05` ya
fijó el principio —la credencial es precondición, `FND-R30`— pero quedan dos casos de terreno:

1. `verificacion.yml` dispara también en `pull_request`. Un PR desde un **fork** no recibe los
   secretos del repositorio: ahí no hay token y no lo habrá, por diseño de GitHub.
2. `bin/cauce.mjs verify` corre en la máquina de cualquiera. Si el espejo entra ahí sin más, un
   usuario recién instalado que aún no ha autenticado `gh` ve fallar la verificación entera.

La decisión de `AC-05` dice que la credencial tiene que estar desde antes. `PHASE 3` tiene que
determinar **dónde se comprueba ese «antes»** —al arrancar la verificación, con mensaje
accionable— y si el caso del fork es una excepción declarada o una razón para que el espejo
viva solo en el `push` a `main` y en `G4`.

## Conclusión

Defecto confirmado en cuatro frentes, todos localizados, dos de ellos observados en ejecución
durante esta misma sesión. Causa raíz determinada: una regla HARD publicada con herramienta y
sin compuerta.

La corrección no requiere tocar `SUITE-R35` ni `FDGE-R52` en `RULES.md`: las dos dicen ya lo
correcto. Lo que falta es que las compuertas las ejecuten y que el verificador lea el
procedimiento que ya está escrito.

Confianzas: RootCause 95 % · Architecture 80 % · Solution 75 %.

**Siguiente:** `PHASE 3`, con la decisión de terreno sobre CI y forks. Cero líneas de código
antes de `G2` (`FDGE-R13`).
