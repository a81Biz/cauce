# PT-056 — Estrategia   `PHASE 3`

## Objetivo

Que **al retomar** se compruebe que el árbol corresponde a lo que el checkpoint declara, y que una
discrepancia **detenga** en vez de dejar continuar sobre una suposición.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Comparar la **lista de archivos** del checkpoint con la actual | Medido: cambia sin parar mientras se trabaja. La discrepancia sería el estado normal y el aviso se ignoraría desde el primer día |
| Comparar el **contenido** de los archivos, archivo a archivo | Diría *qué* cambió con más detalle y costaría leer el árbol entero en cada arranque — el gasto que este lote existe para reducir |
| Reescribir el checkpoint automáticamente al detectar el desfase | Es **reparar** una discrepancia, y `SUITE-R06` deja en manos humanas lo que no se puede deshacer. Además borraría la única prueba de que hubo una |
| Guardar el árbol entero (`tree` de git) en el checkpoint | El `sha` del commit **ya lo identifica**. Guardarlo aparte sería el mismo hecho en dos sitios (`SUITE-R38`) |
| Avisar y seguir | Es lo que la especificación prohíbe con todas las letras: *«la tarea no debe continuar automáticamente»* |
| **Comparar `sha` y `rama`, y detener si difieren** | Son los dos únicos campos que sostienen una correspondencia, y los dos son baratos |

## Solución

Una función **pura** que compara lo que el checkpoint declara con lo que git dice, y devuelve
**qué** difiere:

```
estadoDelArbol(checkpoint, { sha, rama })
   ->  { corresponde: true }
   ->  { corresponde: false, discrepancias: [ {campo, declarado, real} ] }
```

**Pura y exportada a propósito**: es la parte que un caso puede probar sin repositorio, sin red y
sin fixture — igual que `queSigue` y `checkpointDe`.

Y **dos consumidores**, cada uno donde corresponde:

```
tracker siguiente   AL RETOMAR · bloquea antes de decir que toca
verify-fdge         CUMPLIMIENTO · falla, como ya hace con «sha alcanzable»
```

`siguiente` es el que importa para el objetivo: es lo que `PHASE 0` ejecuta para saber qué toca, y
es donde «no continuar automáticamente» significa algo.

## Qué es y qué no es discrepancia

```
HEAD != sha declarado     SI · el arbol avanzo o retrocedio desde el checkpoint
rama != rama declarada    SI · se esta en otra tarea, o se cambio de rama
arbol sucio               NO · es el estado normal de una tarea en curso
lista de archivos         NO · cambia sin parar mientras se trabaja
```

**`AC-03` es lo que separa esto de una herramienta que molesta.** Un aviso que salta siempre no se
lee, y entonces no protege de nada.

## `STATE_MISMATCH` es un nombre, no un estado de tarea

Se declara en `LEXICON` como **la condición que la comprobación reporta**, no como un `status` del
registro. La tarea sigue `IN_PROGRESS`: lo que está mal es la correspondencia entre el checkpoint y
el árbol, no la tarea.

Es la misma separación que el firmante fijó para los estados de sesión, aplicada aquí.

## `LEX-R26` gana la cláusula que ella misma dejó pendiente

Hoy dice, literalmente: *«Que el **árbol corresponda** a ese `sha` es otra comprobación y no está
aquí.»* Esa frase se sustituye por la exigencia real.

**No se crea una regla nueva.** `LEX-R26` es la regla del contrato del checkpoint, y «el checkpoint
dice la verdad sobre el árbol» es parte de ese contrato. Dos reglas para un contrato serían dos
sitios donde divergir (`SUITE-R38`).

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `tracker siguiente` en un repositorio sin checkpoint | No tenerlo **no** es discrepancia: no hay nada que contrastar. Caso propio |
| `avanzar`, que escribe el checkpoint | Lo deja correspondiendo por construcción. Caso propio tras una transición |
| `verify-fdge` sobre PTs ya cerrados | El checkpoint es **uno** y es de la tarea en curso: no se contrasta contra otras |
| El trabajo normal con el árbol sucio | `AC-03`: no es discrepancia. Caso propio |
| Un checkpoint sin `sha` (`sha: null`) | Ya se avisa desde `PT-052`; no se convierte en discrepancia |

## Criterios de éxito, derivados de los AC

- `AC-01` → al retomar se compara
- `AC-02` → `HEAD` distinto **detiene**
- `AC-03` → árbol sucio **no** detiene
- `AC-04` → la discrepancia dice **cuál** es
- `AC-05` → reanudar con discrepancia es decisión humana

## Autorrevisión

**El riesgo es hacer una herramienta que molesta.** Si la discrepancia salta cada vez que hay un
archivo sin commitear —que es siempre— nadie la lee, y entonces el día que sea real tampoco. La
medida está en el `discovery` y es la que fija `AC-03`.

**El segundo riesgo es repararlo automáticamente.** Reescribir el checkpoint al detectar el desfase
haría desaparecer la única prueba de que hubo divergencia, y decidir si un árbol divergente se
conserva o se descarta es humano (`SUITE-R06`).

Contradicciones: ninguna. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** nada impide que alguien ignore el bloqueo y siga trabajando. Lo que hay es
que el bloqueo **exista y diga qué pasó** — y eso es lo que `PT-059` necesitará para poder confiar
en el estado sobre el que decide.
