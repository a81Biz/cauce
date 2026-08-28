# `PT-188` — Un `cd` que falla deja al arnés operando sobre el repositorio real

```yaml
---
id: PT-188
type: BUG
severity: S1
epic: EP-025
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.3.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que un fixture que no puede entrar en su directorio **se detenga**, en vez de ejecutar sus órdenes
sobre el árbol de verdad.

## 2. Comportamiento observado, medido

Al medir la independencia de las secciones, el repositorio quedó así:

```
git branch --show-current   →  main
git log -1                  →  a80ee49 Merge pull request #1 from t/rama
REGISTRY.json               →  4 allocations   (había 213)
ramas locales               →  main · trabajo · rama · fix/PT-001-login · cauce/…
```

El `reflog` lo cuenta entero:

```
1a0f9a9 commit: base                          ← el fixture commiteó EN EL REPOSITORIO
cd0a23c commit: trabajo
        checkout: moving from trabajo to rama
a80ee49 merge rama: Merge made by the 'ort' strategy
```

**La causa:**

```sh
git_lote() {
  ( cd "$WORK"          ← SIN «&&»
    git init -q .
    git commit -qm "base del fixture"
    git checkout -q -b "$1"
    ...
    true ) >/dev/null 2>&1
}
```

Si el `cd` falla, **el subshell continúa en el directorio actual** y ahí caen todos los `git`. El
`>/dev/null 2>&1` del final **se traga el mensaje del `cd`**, así que no se ve nada.

**Cinco sitios** tienen el patrón, y **los cinco ejecutan `git` dentro**.

## 3. Qué se perdió, y qué no

**Nada del trabajo.** El remoto estaba intacto —`git ls-remote` daba `9b696ff` en `main` y
`21a6c66` en `trabajo`—. El daño era **local**: el `git init` reescribió las referencias. Un
`fetch` y un `reset --hard origin/trabajo` restauraron las 213 allocations y `EP-024 CLOSED`.

## 4. Por qué es `S1`

`SUITE-R06` reserva a una persona **migrar o borrar datos** y **reescribir historia**. Esto hace
las dos **sin que nadie lo decida ni lo vea**. Un arnés que puede destruir el repositorio que
prueba no es un arnés: es un riesgo con casos de prueba.

Y lleva ahí desde que se escribió: ha funcionado **por casualidad de orden**, porque `$WORK` existía
cuando el fixture lo pidió.

## 5. Alcance

| | |
|:---|:---|
| **IN** | Los cinco `( cd "$VAR"` sueltos pasan a **detenerse** si el `cd` falla |
| **IN** | Una guarda que **rechaza** el patrón: un `cd` sin `&&` ni salida no vuelve a entrar |
| **IN** | El arnés **comprueba al arrancar** que `$WORK` existe y no es la raíz del repositorio |
| **OUT** | Reescribir los fixtures para no usar `git`. Lo necesitan: prueban reglas sobre ramas y commits. |
| **OUT** | Recuperar la bandera `--seccion`. Se perdió sin commitear y se rehace en `PT-173`, que es quien la necesita. |

## 6. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | Un fixture cuyo `cd` falla **no ejecuta** ninguna orden posterior |
| AC-02 | Los cinco sitios quedan protegidos, y no queda ninguno con el patrón |
| AC-03 | Una guarda del propio arnés **falla** si aparece un `( cd "$VAR"` sin `&&` ni salida |
| AC-04 | El arnés se **niega a arrancar** si `$WORK` no existe o es la raíz del repositorio |
| AC-05 | Con `$WORK` correcto, todo sigue pasando — no hay regresión |

## Cómo termina   `FDGE-R53`

> Termina cuando: un `cd` que falla detiene el fixture, ningún sitio del arnés conserva el patrón,
> una guarda lo impide hacia adelante, y la batería completa sigue en verde.

## 7. Riesgo

**Que la guarda cace lo legítimo.** Hay usos de `cd` correctos —`( cd "$d" && … )` ya lo está—, y
una guarda que los rechace hará que se la rodee. Por eso comprueba la **forma exacta**: `cd` como
última orden de su línea, dentro de un subshell, sin `&&` y sin salida. `AC-05` es el caso invertido
que comprueba que no se rompió nada.

## 6. Fuera de lo declarado

`SUITE-R06(e)` cubre `docs/methodology/`. Esta tarea lo modifica **con intake firmado**, que es
como se mantiene este repositorio desde `SUITE-R41`. No hay merge, publicación ni borrado de datos
aquí: lo que toque la rama principal se detiene en `G4`, que es humana por definición.

## `G1` — Definition of Ready

VEREDICTO: PASS

Cada criterio nombra el mecanismo que lo comprueba, y el alcance declara qué **no** toca. Lo que se
afirma del comportamiento observado está **medido**, no supuesto: la medición está en §2 con el
comando que la produjo.

Firmado en `PHASE 1` por Alberto Martínez, 2026-08-26.

## Firma   `INTAKE-R06` · `SUITE-R27`

`EP-024` no está firmado como lote, así que esta tarea **no hereda nada de él**: `INTAKE-R08`
*admite* la firma por lote, no la impone.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para las firmas de
este lote, y consta en `SESSION_LOG.md`. `SUITE-R27` dice lo que esto **no** prueba: que firmara
una persona. Sí lo hace contrastable — el nombre está en `firmantes`, y quien aparece en esa lista
responde de lo que lleva su nombre.
