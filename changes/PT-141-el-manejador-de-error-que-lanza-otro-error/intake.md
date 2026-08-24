# PT-141 — el manejador de error lanza otro error y tapa el real

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-141
type: BUG
epic: EP-021
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

En `tracker.mjs:1849`, el `catch` que debía reportar el fallo referencia `origen`, que **no existe
en ese ámbito** — la variable se llama `ref`:

```js
catch { fail('SUITE-R56', `${a.id}: su issue #${a.issue} tiene el enlace ${origen} y no se pudo reescribir.`); }
```

**El manejador de error lanza un error distinto**, tapa el real, y el comando muere. Se vio al
ejecutar `tracker abrir --aplicar`: reventó con `origen is not defined` **y aun así había creado
el issue**. Un comando que falla y deja efecto es lo contrario de lo que este marco promete.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El `catch` reporta el fallo **real** en vez de lanzar uno nuevo | un caso que fuerza el fallo de la republicación |
| AC-02 | Se enumeran **todos** los `catch` del árbol que referencian identificadores fuera de ámbito | una comprobación que los busca, con archivo y línea |
| AC-03 | El enumerador se ejecuta en la batería: no es un barrido de una vez | un caso que lo corre sobre el árbol real |
| AC-04 | Un comando que falla a mitad **dice qué llegó a hacer** | el texto del mensaje nombra lo ya escrito |
| AC-05 | Lo no mecanizable se declara con su número (`SUITE-R26`) | `design.md` §límites |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: forzar el fallo de la republicación produce el mensaje de `SUITE-R56` con el
> enlace real, y un caso de la batería enumera los manejadores rotos del árbol.

## 4. Qué NO entra   `[AGENTE]`

- OUT: hacer atómico `abrir`. `PT-132` ya trabajó eso, y el orden «validar todo → escribir lo
  reversible → publicar lo irreversible» es el contrato. Aquí se arregla el **manejador**.
- OUT: un linter general de JavaScript. Añadir una dependencia para esto sería desproporcionado y
  el marco no la tiene; se busca **este** patrón.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **Un error dentro de un `catch` es invisible hasta que se ejecuta esa rama**, y esa rama sólo
  corre cuando algo ya ha ido mal. Es la ruta menos probada del código y la que más importa.
- **`AC-02` es lo que convierte esto en algo más que un arreglo puntual.** Arreglar una línea deja
  las otras que haya; enumerarlas dice cuántas son. Si son cero, también es un dato.
- Es `CE-005` otra vez —verde por no haber mirado—: nada ejecutaba ese `catch`.
