# PT-089 — La divergencia entre el registro y el YAML deja de apagar comprobaciones

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-089
type: BUG
epic: EP-018
track: STANDARD
status: INTEGRATED
phase: 10
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S2
---
```

## 1. Que se quiere   `[HUMANO]`

Origen: [`H-004`](../../PTSA/Findings/H-004.md) · `D3` · **MEDIA**.

## 2. El hallazgo, medido

`verify-fdge --all` sobre 82 tareas: **65 avisos**, de los que **17** son esta forma:

```
! SUITE-R35  PT-076: «status» divergente — el registro dice «INTEGRATED» y su intake dice
   «READY». Se usa el del intake (PT-004: es lo que el PT dice de si mismo), y por eso se
   dice: un YAML que se queda atras apaga comprobaciones sin que nada avise.
```

**El propio mensaje declara el riesgo** y la herramienta sigue usando el valor del intake.

## 3. Lo que esta bien y lo que no

Usar el intake es **defendible**: `PT-004` establecio que el PT es lo que dice de si mismo.

Lo que falla es que **el aviso no escala con la consecuencia**. Un `INTEGRATED` en el registro con
`READY` en el intake no es una diferencia de opinion entre dos fuentes: es un archivo que se quedo
atras, y usar el valor viejo **apaga las comprobaciones de las fases posteriores**.

17 avisos entre 65 se leen como ruido, y `PT-023` ya midio esa frontera: un verificador
equivocado tres de cada cuatro veces se silencia y ocupa el sitio del que haria falta.

## 4. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | Divergencia con **estado terminal** en el registro y no terminal en el YAML: **error**, no aviso |
| `AC-02` | Divergencia entre estados **no terminales**: sigue siendo aviso, y sigue ganando el intake |
| `AC-03` | `tracker avanzar` escribe **las dos** fuentes en el mismo acto atomico, o no escribe ninguna (`FDGE-R52`) |
| `AC-04` | Las 17 divergencias vivas quedan resueltas, o enumeradas con motivo si alguna es legitima |
| `AC-05` | `SUITE-R35` declara su fila en `RIGE_DESDE`: las tareas cerradas antes de la version no fallan por esto |
| `AC-06` | Tras el arreglo, `verify-fdge --all` baja de 65 avisos y ninguno de los que quedan es de esta clase |

## 5. Que NO entra

```
OUT: eliminar el YAML del intake y dejar solo el registro. El YAML es lo que hace que un PT
     sea legible sin abrir REGISTRY.json, y PT-004 lo decidio con motivo.
OUT: los otros 48 avisos. FDGE-R19 (22) son ramas anteriores al formato con usuario y el
     propio mensaje dice que siguen valiendo; SUITE-R44 (15) y SUITE-R43 (6) son otra cosa.
```
## Condicion de cierre   `FDGE-R53`

Termina cuando: una divergencia con estado terminal en el registro falla, `verify-fdge --all` no emite ningun aviso `SUITE-R35` de esa clase, y `tracker avanzar` escribe las dos fuentes en el mismo acto.

## Firma

```
Firmado por lote: EP-018
```
