# `PT-195` — Nada comprueba que la identidad git del repositorio sea de una persona declarada

```yaml
---
id: PT-195
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

```
git config --local  user.name  T                  user.email  t@t
git config --global user.name  Alberto Martínez   user.email  alberto@a81.biz
```

La configuración **local del repositorio real** era la identidad del **arnés de pruebas**.

**Alcance:** los 13 commits de restos del arnés en `main` local, y **los tres commits de `EP-025`**
—`fb10d3de`, `ff166bf`, `7e5ac32`— salieron firmados como `T <t@t>` en vez de como el firmante.

## 2. De dónde salió, y por qué nadie lo vio   `[HUMANO]`

```
selftest.sh:528-529
  ( cd "$WORK" || { echo "FIXTURE SIN TERRENO: …" >&2; exit 90; }
    git config user.email t@t; git config user.name T
```

La guarda `|| exit 90` la puso `PT-188`. **Antes no estaba**, y cuando ese `cd` fallaba el
`git config` se ejecutaba en el repositorio real. `PT-188` impidió que se repita; nadie revirtió lo
que ya había dejado puesto.

**Y `tracker personas` lo decía**: «`T <t@t>` · 10 commits · SIN DECLARAR». Información correcta,
calculada, **y ninguna compuerta la leía**. Es la forma que `PT-087` cierra en otros sitios.

La consecuencia es de las caras: `SUITE-R27` dice que lo que hace contrastable una firma es que el
nombre esté en `firmantes`. **Un commit atribuido a `T <t@t>` no es contrastable contra nada.**

## 3. Cómo se arregla, y cómo NO

La limpieza de la máquina **ya está hecha**: `git config --local --unset` devolvió la identidad a la
global, declarada en `personas`. Eso no era la tarea.

**No** declarando `T <t@t>` en `personas`: sería atribuir a una persona los commits del fixture, el
error contrario. **No** reescribiendo la historia (`SUITE-R06f`, y ya está publicada).

**Sí** haciendo que alguna compuerta **lea** lo que `tracker personas` ya calcula.

## 4. Lo que NO promete   `SUITE-R26`

No promete que quien commitee sea quien dice ser —eso `SUITE-R27` ya declara que el marco no puede
garantizarlo—. Promete que **la identidad configurada corresponda a alguien declarado**, que es
contrastable.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Una identidad no declarada **se dice**, y no sólo en un comando que nadie invoca | `TS-01` |
| `AC-02` | El aviso llega **antes** de commitear, no después de firmar tres commits | `TS-02` |
| `AC-03` | En CI, donde la identidad es la del runner, **no** se bloquea por eso | `TS-03` |

`AC-03` no es una excepción de conveniencia: es el mismo límite que `selftest.sh:6393` ya documenta
—en CI `git config user.name` es del runner y no casa con `personas`—.

## Cómo termina   `FDGE-R53`

> Termina cuando: un repositorio no puede firmar trabajo con una identidad que no es de nadie sin que
> algo lo diga a tiempo.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
