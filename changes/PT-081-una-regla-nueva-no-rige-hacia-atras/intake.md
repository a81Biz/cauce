# PT-081 — Una regla nueva no rige hacia atrás, y la versión lo dice

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-081
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 9
created: 2026-08-19
structural: no
suite_version: 10.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Dudo mucho que esto sea la 9.0.0.»

Lo es en `package.json` y en el `CHANGELOG`, y **no debería serlo**. Esta tarea lo demuestra con
dos defectos medibles, no con una opinión sobre numeración.

## 2. Defecto 1 · una sola ancla para reglas nacidas en versiones distintas

[verify-fdge.mjs:991](docs/methodology/tools/verify-fdge.mjs#L991):

```js
const DESDE = [5, 1, 0];
```

`rigeAqui` se calcula **una vez** contra esa constante y decide la aplicabilidad de **cinco**
comprobaciones. Pero las reglas que gobierna no nacieron a la vez:

| Regla | Versión en que nace | ¿`DESDE = 5.1.0` es correcto? |
|:---|:---|:---|
| `FDGE-R53` — la tarea declara cómo termina | **5.1.0** (`CHANGELOG` §5.1.0) | sí |
| `FDGE-R54` — la viabilidad consta antes de `G2` | **esta sesión**, `PT-075` | **no** |

Consecuencia exacta: un proyecto instalado en `8.2.0` que actualice a `9.0.0` verá
`verify-fdge --gate G2` **fallar** en toda tarea en vuelo que no tenga `viabilidad` en su
registro — una regla que no existía cuando esas tareas se escribieron.

## 3. Defecto 2 · la guía de migración de `9.0.0` afirma lo contrario

`CHANGELOG.md` §9.0.0 dice, literalmente:

> **Ningún proyecto instalado tiene que hacer nada.** Todo lo que entra es **opcional** y todo lo
> que existe sigue funcionando.

Era cierto cuando se escribió: `9.0.0` es el lote `EP-016`, y su único cambio no opcional era un
**aviso**. Ha dejado de serlo porque `EP-017` está metiendo en esa misma versión **dos reglas
`HARD` nuevas** —`FDGE-R54` y `SUITE-R56`— con verificadores que **fallan**.

`SUITE-R19` exige guía de migración; existe y **ahora miente**. No por descuido de quien la
escribió, sino porque nadie comprueba que siga siendo verdad cuando la versión sigue abierta.

## 4. Qué versión es entonces

`9.0.0` **no está publicada**: npm sirve `8.2.0`. Doblar trabajo nuevo en una versión sin publicar
sería legítimo — pero aquí no lo es, por dos motivos:

1. La entrada `9.0.0` es el **registro fechado y firmado de `EP-016`**. Reescribirla para que
   además signifique `EP-017` borra el rastro de qué lote trajo qué: exactamente la enfermedad
   que esta épica combate.
2. Las reglas nuevas **rompen compatibilidad**. `CLAUDE.md` regla 6: «Si el cambio rompe
   compatibilidad: subir `MAJOR` y escribir la guía de migración».

> **`EP-017` es la `10.0.0`.**

## 5. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Cada regla lleva **su propia** versión de entrada | el ancla deja de ser una constante única |
| AC-02 | `FDGE-R54` no rige sobre una tarea anterior a su versión | caso con `suite_version: 8.2.0` |
| AC-03 | …y sí sobre una posterior | caso con `10.0.0` |
| AC-04 | `FDGE-R53` conserva su comportamiento | los casos de `5.1.0` siguen en verde |
| AC-05 | `EP-017` sale como `10.0.0` | `CHANGELOG`, `package.json` y los 21 documentos alineados por `version.mjs` |
| AC-06 | La guía de migración `9.0.0 → 10.0.0` existe y **enumera lo que rompe** | nombra `FDGE-R54`, `SUITE-R56` y qué hacer |
| AC-07 | La entrada `9.0.0` no se reescribe | conserva su texto: es el registro de `EP-016` |
| AC-08 | Una regla `HARD` nueva sin versión de entrada **se detecta** | comprobación mecánica, no disciplina |

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: cada comprobación de `verify-fdge` conoce la versión en que nació su regla, la
> `9.0.0` conserva intacto el registro de `EP-016`, y `EP-017` sale como `10.0.0` con una guía de
> migración que enumera lo que rompe.

## 7. Qué NO entra   `[AGENTE]`

- OUT: **Publicar.** Reservado al firmante, y no autorizado (`SUITE-R06a`).
- OUT: Revisar la aplicabilidad de las reglas de otros componentes (`QA-*`, `PTSA-*`, `FPGE-*`).
  Aquí sólo las cinco que cuelgan de `DESDE`. Si hay más, es otra tarea.
- OUT: Cambiar `SUITE-R19`. La regla está bien; lo que faltaba es quien compruebe que su
  producto sigue siendo cierto.

## 8. Firma

```
Firmado por lote: EP-017
```
