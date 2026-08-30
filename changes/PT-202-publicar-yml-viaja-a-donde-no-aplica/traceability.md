# `PT-202` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una instalación limpia **no** recibe un workflow que publique un paquete ajeno | TS-01 | selftest §EP-026 | evidence/PT-202/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Este repositorio **sigue** pudiendo publicar | TS-02 | selftest §EP-026 | evidence/PT-202/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Lo que es de la fuente y lo que es del destino queda **declarado** | TS-03 · TS-04 · TS-05 | selftest §EP-026 | evidence/PT-202/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-01` ya se cumplía, y el caso sigue haciendo falta

El intake afirmaba que `publicar.yml` **viaja dentro del paquete**. `discovery.md` §1 lo desmiente
midiendo: `npm pack` da 61 archivos y **cero** de `.github/`, y no lo copia ni el instalador ni
`plan-layout` ni `migrate`.

**Que un `AC` ya se cumpla no lo deja sin caso**: sin `TS-01`, nada impide «arreglar» el problema
imaginario añadiendo `.github/` al paquete, que sobrescribiría los workflows del destino. El caso
fija el **cero de lo prohibido**, que es lo único que un caso puede fijar (`HANDOFF -18`).

## `AC-03` es donde está el trabajo, y lleva tres escenarios

El defecto real no es un archivo que sobra: es que **la documentación que sí viaja describe un
recorrido que el destino no tiene** —`CASOS-DE-USO.md:283` le da un caso de uso completo—. `TS-03`
declara la frontera, `TS-04` impide que la corrección se deshaga, y `TS-05` impide que su lista
caduque.

## Lo que la tarea deja nombrado y sin hacer

`verificacion.yml` **tampoco viaja**, y el intake dice —con razón— que sí tiene sentido en el
destino. El destino se queda **sin la compuerta que necesita y con la documentación de una que no**.
Se declara en `test-scenarios.md`, con su motivo y su tamaño.
