# PT-120 — publicar.yml no ejecuta sellar, y verify-fdge corre sin GH_TOKEN

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-120
type: BUG
epic: EP-020
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que la compuerta que autoriza lo único irreversible del marco compruebe de verdad lo que dice comprobar.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `publicar.yml` ejecuta `tracker sellar` y bloquea si el sello no está resuelto | la corrida falla sobre un árbol con la guía de migración incompleta |
| AC-02 | El paso `verify-fdge --all` recibe `GH_TOKEN` en `publicar.yml` Y en `verificacion.yml` | la corrida deja de emitir «sin acceso a la plataforma ... SIN EVALUAR» para SUITE-R43 |
| AC-03 | Un paso que no puede evaluar una regla NO cierra con «Sin errores» sin decir cuántas quedaron `SIN EVALUAR` | un caso que cuenta los SIN EVALUAR y exige que aparezcan en el resumen |
| AC-04 | `sellar` deja de derivar «tag anterior» del CHANGELOG y lo lee de los tags reales, o declara que no puede | hoy imprime «tag anterior v12.0.0» y ese tag no existe |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: ninguna corrida puede autorizar una publicación declarando verde una regla que no llegó a mirar.

## 4. Qué NO entra   `[AGENTE]`

- OUT: crear los tags que faltan: es acto humano (SUITE-R06a) y va con PT-121
- OUT: cambiar qué comprueba verify-fdge. Aquí sólo se le da acceso a lo que ya intenta mirar
- OUT: republicar la 12.0.0. No se puede y se dice

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Medido en la corrida `32600060157`**: 108 avisos `SUITE-R43 ... SIN EVALUAR` sobre 108 PT, y el paso cerró con «Sin errores. PTs verificados: 108». `FDGE-R34` llama a esa comprobación precondición de `G4`.
- **No se afirma que con token hubiera fallado**: sobre el estado de `main` la divergencia de `SUITE-R35` no existía. Se afirma que `SUITE-R43` **nunca** se ha evaluado en CI, en ninguna de las dos corridas, desde que existe.
- **Va inmediatamente después de `PT-113`** y antes de volver a publicar: arreglar la compuerta que dejó salir el defecto es lo que impide repetirlo.

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

### R-1 · `AC-04` partía de un hecho falso, y el hecho falso lo escribí yo

**Fecha:** 2026-08-23

`AC-04` dice: *«hoy imprime `tag anterior v12.0.0` y ese tag no existe»*. **El tag existe.**
También `v10.0.0` y `v11.0.0`:

```
git tag -l "v1*" | sort -V   ->   v10.0.0   v11.0.0   v12.0.0
```

El error fue mío y viene de ordenar los tags **lexicográficamente**: así `v10`, `v11` y `v12`
caen *antes* que `v4.13.0`, y un `tail` los deja fuera. Se corrigió en `PT-121`, `PT-122` y el
intake de `EP-020` con una entrada `CORRIGE` en `HISTORY.log`, **y aquí sobrevivió**: la
corrección alcanzó a los documentos donde la busqué, no a todos los que lo afirmaban.

Es la misma clase que esta tarea persigue, del otro lado: **una corrección que se da por hecha
sin nada que la contraste**. Nadie comprueba que un dato retractado no siga vivo en otro
archivo.

**Qué pasa con `AC-04`.** No decae: **cambia de motivo, y el motivo real es peor**. `sellar`
imprimía «tag anterior» derivándolo del `CHANGELOG` en vez de leer los tags. Que acertara con
`v12.0.0` fue **casualidad** —la versión anterior y el último tag coincidían—, no que funcionara.
Un dato correcto por coincidencia es indistinguible de uno correcto por construcción hasta el
día que dejan de coincidir, y ese día no avisa.

`AC-04` se reformula así, sin tocar los otros tres:

> `sellar` lee el tag anterior de los **tags reales**, ordenados por versión y no por texto, o
> declara `SIN EVALUAR` si no puede leerlos. Y **ningún caso lo asserta contra un valor
> escrito a mano**, que es lo que dejó pasar el error original.

### R-2 · `R-1` también partía de un hecho falso. `AC-04` decae entero

**Fecha:** 2026-08-23 · **Corrige:** `R-1` de este mismo documento.

`R-1` afirma que `sellar` *«imprimía «tag anterior» derivándolo del `CHANGELOG` en vez de leer
los tags»*. **Es falso.** `sellar` lee los tags reales, y los ordena **por versión**:

```js
gitDe(['tag', '--list', 'v*', '--sort=-v:refname'])   // tracker.mjs · sellar
```

```
--sort=-v:refname   ->   v12.0.0   v11.0.0   v10.0.0        correcto
sin --sort         ->   … v5.2.0   v8.2.0   v9.0.0          la trampa
```

**`sellar` ya hacía exactamente lo que `AC-04` pedía que hiciera.** El criterio se escribió
contra un defecto que no existe, y `R-1` lo «reformuló» contra otro defecto que tampoco existe.

`AC-04` **decae**, y su evidencia es esta revisión — el mismo tratamiento que `AC-06` en
`PT-113`, aplazado en `PT-134` por la misma razón: el marco no tiene vocabulario para un
criterio firmado que deja de aplicar.

#### Lo que hay que decir de las dos revisiones juntas

El error original —creer que `v12.0.0` no existía— salió de ordenar tags **por texto**. Lo
corregí en tres documentos y **aquí sobrevivió**. Al venir a arreglarlo escribí `R-1`, que
diagnostica mal la causa: **acusé al código de cometer el error que había cometido yo**, y lo
escribí sin abrir la función.

`R-2` existe porque **sí** la abrí, dos pasos después. La diferencia entre `R-1` y `R-2` no es
cuidado ni intención: es **haber ejecutado `git tag --sort=-v:refname` y haber leído las cuatro
líneas de la función**. Es la misma distinción que `PT-133` midió —comprobar que la rama existe
contra ejecutarla— y la que lleva ya seis instancias en este lote.

Queda escrito y no se borra (`SUITE-R09`): un error retractado en tres sitios y vivo en un
cuarto es la prueba de que **corregir no es un acto que se pueda dar por completo sin algo que
lo contraste**. Eso no lo cubre `AC-01`..`AC-03` de esta tarea, y se declara como hueco.


