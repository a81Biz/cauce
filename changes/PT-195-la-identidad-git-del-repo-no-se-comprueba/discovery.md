# `PT-195` · `discovery.md`

## 1. La herramienta ya existe, y ya acierta

```
$ tracker personas

  Alberto Martínez
    Alberto Martínez <alberto@a81.biz>              628 commits
    a81Biz <albe.mtz@gmail.com>                       9 commits
    Alberto Martínez <albe.mtz@gmail.com>             1 commits

  SIN DECLARAR (1 autor(es) · 10 commit(s))
    T <t@t>                                          10 commits
```

**El dato es correcto, está calculado, y no lo lee ninguna compuerta.** `personaDe`
([patrones.mjs:483](../../docs/methodology/tools/patrones.mjs)) casa por `(nombre, correo)` exactos
y no agrupa por parecido —*«quién es quién lo dice una persona»*, `LEXICON 6.5f`—.

Es `CE-007` en su forma pura: **existe la herramienta y nada la echa en falta.**

## 2. Lo que `verify-fdge` sí lee hoy, y lo que no

```js
const personas = REGISTRO?.personas ?? [];          // verify-fdge.mjs:630
const conRango = personas.filter(…)                  //   → solapes de rango
if ((REGISTRO?.personas ?? []).length && …)          // :2389 → el usuario en el nombre de rama
```

Lee `personas` **dos veces**, y ninguna para lo que importa: **nadie mira la identidad que está
configurada AHORA**, que es la que va a firmar el commit siguiente.

## 3. La distinción que hace falta, y que hoy no existe

| Hecho | Hoy | Debería |
|:---|:---|:---|
| Los commits **pasados** llevan un autor sin declarar | `tracker personas` lo dice | Igual — es histórico y `SUITE-R09` no lo reescribe |
| La identidad **configurada ahora** no es de nadie declarado | **nadie lo mira** | Se dice **antes** de commitear |

Son cosas distintas. Lo primero es una cuenta de lo que ya pasó; lo segundo es una **predicción
contrastable** sobre lo que va a pasar en el commit siguiente, y es lo que `AC-02` pide.

## 4. El estado de la máquina hoy

```
local:    (sin poner)
global:   Alberto Martínez <alberto@a81.biz>
efectiva: Alberto Martínez <alberto@a81.biz>        ← declarada en «personas»
```

**La limpieza ya está hecha** —`git config --local --unset` la devolvió a la global— y el intake ya
lo dice. **Así que el defecto está latente**, como el de `PT-198`: la evidencia no puede ser «ahora
falla», tiene que **plantar** la identidad.

Y el mecanismo para plantarla **ya existe en el arnés**, de `PT-067`:

```sh
GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=user.name GIT_CONFIG_KEY_1=user.email …
```

No toca ninguna configuración de la máquina. Se reutiliza.

## 5. `AC-03` decide la forma, y no es una excepción de conveniencia

En CI la identidad es la del **runner** y **no casa con `personas`** — el arnés ya lo documenta en
`selftest.sh:6549` y `PT-068` se niega deliberadamente a atribuir la sesión de otro. Si esto
**bloqueara**, `verificacion.yml` quedaría en rojo permanente el día que se pusiera, y una compuerta
siempre roja enseña a saltársela.

**De ahí sale la forma correcta: un aviso, no un error.** Y no hace falta detectar CI —lo cual
sería inventar una dependencia de entorno que este marco hoy no tiene (`RULE-06`)—: un aviso no
bloquea en ningún sitio, y `AC-01` pide que **se diga**, no que se impida.

Lo que cambia de verdad no es la severidad: es **quién lo emite**. Pasa de un comando que nadie
invoca a `verify-fdge`, que corre en `npm run verify` **y** en CI.

## 6. Los tres estados que hay que distinguir   `RULE-02`

```
SIN «personas»       no hay contra qué contrastar → se dice, y no se finge que se miró
NO DECLARADA         la identidad configurada no está en la lista → se nombra, con su valor
DECLARADA            se dice a quién se atribuirá el commit siguiente
```

El primero importa: `SUITE-R22` declara soportado el proyecto de una sola persona, y uno que aún no
haya declarado `personas` no puede salir igual que uno cuya identidad **es de nadie**.

## 7. Lo que NO se toca   `SUITE-R26`

- **Los 10 commits de `T <t@t>` no se reescriben** (`SUITE-R06f`, y ya están publicados). Tres de
  ellos son de `EP-025`. `tracker personas` los seguirá contando, que es lo correcto.
- **`T <t@t>` no se declara en `personas`**: sería atribuir a una persona los commits del fixture —
  el error contrario, y peor.
- **No se promete que quien commitee sea quien dice ser.** `SUITE-R27` ya declara que el marco no
  puede garantizarlo. Se promete que la identidad configurada **corresponda a alguien declarado**.
