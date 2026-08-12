# PT-NNN — <título en una línea>

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
>
> Es la ligera. La firma, el veredicto de `G1` y la severidad **los hereda del lote**: ya los
> firmaste al abrir la implementación (`INTAKE-R08`). Aquí solo va lo que cambia de una tarea a
> otra.
>
> Si esto **no** pertenece a la implementación abierta, no uses esta plantilla: aplica
> `FDGE-R50` y abre otra, o usa la plantilla completa del tipo que corresponda.

```yaml
---
id: PT-NNN
type: FEATURE | BUG | CHORE | REFACTOR | INVESTIGATION
epic: EP-NNN            # la implementación abierta — obligatorio en esta plantilla
track: STANDARD | EXPRESS
status: DRAFT
created: AAAA-MM-DD
structural: no
suite_version: X.Y.Z
---
```

## 1. Qué se quiere   `[HUMANO]`

> Literal, entre comillas, lo que pediste. Sin reinterpretar.
>
> Que sea corto no lo hace menos vinculante: es contra esto contra lo que se valida en `G3`.

> «»

## 2. Criterios de aceptación   `[AGENTE]`

> Derivados de lo de arriba **y del criterio de éxito del lote**, que es lo que el humano firmó.
> Cada uno tiene que poder fallar: si no se puede escribir la comprobación que lo tumba, no es
> un criterio, es un deseo.

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | | |
| AC-02 | | |

## 3. Qué NO entra   `[AGENTE]`

> Lo que alguien podría dar por incluido y no lo está. Se escribe aquí para que la discusión
> ocurra ahora y no en `G3`.

- OUT:

## 4. Firma

```
Firmado por lote: EP-NNN
```

> Y nada más. La firma humana está en el intake del lote, con su nombre, su fecha y su
> confirmación (`INTAKE-R08`). Repetirla aquí sería pedir dos veces la misma decisión — y es
> justo el peaje que hacía que un arreglo a media construcción costara noventa líneas.

---

## Lo que esta plantilla NO exime

- **`G3` sigue siendo humano.** La ligereza está en la entrada, no en la salida.
- **La evidencia sigue completa.** `FDGE-R23` no cambia: manifiesto, trazabilidad y pruebas.
- **`G4` sigue siendo un merge humano** (`FDGE-R33`, `SUITE-R06a`).
