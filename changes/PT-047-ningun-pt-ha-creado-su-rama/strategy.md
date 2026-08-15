# PT-047 — Estrategia   `PHASE 3`

## La decisión de topología, y el supuesto que asumo

`PHASE 2` dejó abierta la pregunta que de verdad importa: **a dónde mergea una rama de PT**.
Tiene dos respuestas y **cambian cuántas veces decide el firmante**.

| Topología | `G4` pasa a ser | `EP-013` costaría |
|:---|:---|:---|
| `<type>/PT-NNN` → `main` | una **por tarea** | **8 compuertas humanas** |
| `<type>/PT-NNN` → `trabajo` → `main` | una **por lote**, como hoy | 1 compuerta humana |

**Asumo la segunda**, y digo por qué en vez de dejarlo entender:

- `EXEC-R03` dice que un lote existe para que el humano decida **dos veces por lote** en lugar de
  cuatro por PT. Multiplicar `G4` por ocho invierte eso.
- `FDGE-R33` define `G4` como *«el merge a la línea principal»*. `trabajo` no es la línea
  principal: `main` lo es. Un merge de PT a `trabajo` no cae en `SUITE-R06a`.
- El firmante ha resuelto una `G4` por lote en los trece lotes de este repositorio, y en esta
  misma sesión dijo «necesito que estemos limpios» — no «necesito decidir ocho veces».

**Si el supuesto es falso, se corrige aquí y no en `G3`:** cambiar la topología después es
reescribir `SUITE-R42`, `SUITE-R46` y `PHASE 9` otra vez.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Que el `CLAUDE.md` gane y `PHASE 5` ceda | Es la opción que el firmante descartó: «rama por PT, de verdad» |
| Rama por PT que mergea a `main` | Ocho compuertas humanas por lote. Contradice `EXEC-R03` |
| Dejarlo declarado como deuda | También descartada. Y es lo que lleva 46 tareas pasando |
| **Rama por PT sobre `trabajo`, `G4` sigue siendo el merge a `main`** | Cumple `PHASE 5` sin tocar quién decide ni cuántas veces |

## Solución

```
1 · TOPOLOGIA declarada, y en RULES.md porque es una obligacion:
      <type>/PT-NNN-slug   nace de «trabajo»  ·  PHASE 5
      PR a «trabajo»       revision de la tarea · PHASE 9 · NO es G4
      trabajo -> main      G4, humana, una por lote · sin cambios
2 · SUITE-R42 dice PARA QUE RAMA: el PR que G4 necesita es el de la rama
      por defecto. Hoy dice «para la rama» y con dos niveles eso es ambiguo
3 · REGISTRY.allocations[].branch, y verify-fdge REPORTA un PT en PHASE 5+
      que no la declara — que es lo que faltaba: nada miraba la rama
4 · CLAUDE.md deja de contradecir a PHASE 5: declara las dos permanentes
      MAS las efimeras por tarea
```

## Por qué el campo va al registro y no al `HISTORY`

`HISTORY.log` ya declara `Rama:` y **nadie lo comprueba** — es uno de los ocho campos del formato
canónico sin verificación (`PT-016`). Pero `HISTORY` se escribe en `PHASE 8`, y la rama se crea en
`PHASE 5`: comprobarlo ahí llega tres fases tarde.

El registro es donde `PT-044` acaba de poner la fuente de verdad del estado, y donde
`verify-fdge` ya mira en cada fase. La rama es estado.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `SUITE-R42` en `G4`: hoy comprueba un PR «para la rama actual» | Con la aclaración sigue comprobando lo mismo estando en `trabajo`. Caso propio |
| `SUITE-R46`: «la rama por defecto» sigue siendo `main` | No cambia. Caso propio |
| Los 46 PT integrados, todos con `Rama: trabajo` | El aviso solo aplica a PTs **vivos** en `PHASE 5+`, con el mismo criterio que `FDGE-R52` acotó en `PT-044` |
| `FDGE-R22` (`HOTFIX`, rama `hotfix/`) | Encaja: es el mismo patrón `<type>/PT-XXX-slug` |
| El flujo de este mismo lote | `EP-013` pasa a ejecutarse con rama por tarea desde `PT-016`, que es la siguiente |

## Criterios de éxito, derivados de los AC

- `AC-01` → la topología está en `RULES.md`, citada en `PHASES.md` y en `CLAUDE.md`
- `AC-02` → un PT vivo en `PHASE 5+` sin `branch` se reporta
- `AC-03` → el `CLAUDE.md` declara las efímeras y deja de contradecir
- `AC-04` → `G4` sigue siendo una por lote, y está escrito que el PR de `G4` es el de `main`

## Autorrevisión

Contradicciones: ninguna con `EXEC-R04` —`G4` sigue humana— ni con `SUITE-R06a`. `AC` sin cubrir:
ninguno.

**Lo que no resuelve:** que alguien cree la rama. El aviso hace que **no declararla se vea**;
crearla sigue siendo un acto. Es el mismo límite que `SUITE-R54` y `SUITE-R55` declaran de sí
mismas, y conviene decirlo antes de que un revisor lo señale.
