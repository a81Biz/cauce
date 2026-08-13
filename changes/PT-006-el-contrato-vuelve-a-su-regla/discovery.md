# PT-006 — Discovery   `PHASE 2` · análisis `2-R`

El análisis lo hizo `PT-003` y su conclusión propuso esta tarea (`FDGE-R42`). Aquí solo se
verifica que sus hechos siguen siendo ciertos y se acota lo que falta decidir.

## Los hechos, revalidados hoy

```
RULES.md      «milestone» 0 · «pull request» 0
LEXICON.md    «milestone» 0
PHASES.md:250-256   declara los tres, bajo el encabezado [SUITE-R35]
GitHub        milestones en toda la historia: 0 · pull requests: 2 (#1 fusionado, #7 abierto)
```

## Lo que había que decidir, y la decisión

`PT-003` dejó abierto si el mapeo `G4` → pull request **sube** a `RULES.md` o **se borra**.

Se sube. Tres razones, en orden de peso:

1. **La práctica ya existe y es la buena.** Los dos merges a `main` de la historia de este
   repositorio han pasado por un PR. No se está inventando una capacidad: se está escribiendo
   la que se usa.
2. **Es la única transición de la máquina de estados que hoy no comprueba nadie.** `G1` tiene
   su firma verificada, `G2` su propuesta, `G3` su línea en `HISTORY.log`. `G4` tiene `FDGE-R34`
   —CI, evidencia, trazabilidad— pero nada que diga **dónde se propuso el merge**.
3. **Abrir un PR no es automatizar `G4`.** `SUITE-R06a` prohíbe «merge o push a la rama
   principal». Un PR no es ninguna de las dos: es la propuesta, y el botón sigue siendo humano.
   `EXEC-R07` describe exactamente esa figura.

## Lo que la decisión cuesta, y no se disimula

**Añadir una regla vinculante no es «capacidad añadida».** Cambia lo que un proyecto debe tener
para cumplir `G4`, que es el criterio con el que la 5.0.0 subió a `MAJOR`. La versión de este
lote no puede ser `MINOR`, y eso se decide en el cierre.

Se acota el daño condicionándola: la regla **solo rige si el proyecto declara plataforma**, que
es opcional y humano. Un proyecto sin `tracker.plataforma` no gana ninguna exigencia.

## Alternativa evaluada

**Borrar los dos mapeos y no subir nada.** Deja el marco coherente con una línea menos de
trabajo. **Rechazada:** perdería la única comprobación posible sobre dónde ocurre `G4`, y el
motivo para borrarlo sería que es más barato — no que sea mejor. `PT-003` ya midió que la
práctica existe.

## Conclusión

Hechos revalidados. Decisión tomada: el milestone se borra del procedimiento, el pull request
sube a `RULES.md` como regla propia condicionada a plataforma declarada, con comprobación en
`--gate G4`.

Confianzas: RootCause 95 % · Architecture 90 % · Solution 90 %.
