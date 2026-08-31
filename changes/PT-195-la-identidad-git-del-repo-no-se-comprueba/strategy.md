# `PT-195` · `strategy.md`

## La decisión

**`verify-fdge` comprueba la identidad `git` configurada contra `personas`, y lo dice como aviso.**

Dos piezas, y ninguna nueva:

| Pieza | Dónde | Qué hace |
|:---|:---|:---|
| `personaDe` | `patrones.mjs:483` — **ya existe** | Casa `(nombre, correo)` exactos contra `personas` |
| El aviso | `verify-fdge` — nuevo, ~15 líneas | Lee `git config user.name/email` y lo pasa por `personaDe` |

**No se escribe ningún patrón nuevo.** `personaDe` es exactamente esta comprobación, escrita y con
sus casos; lo que falta es que alguien la invoque desde donde se mira.

## Por qué aviso y no error

`AC-03` lo impone y no es conveniencia: en CI la identidad es la del **runner** y no casa con
`personas` — está documentado en `selftest.sh:6549` y `PT-068` se niega a atribuir la sesión de
otro **a propósito**. Un error dejaría `verificacion.yml` en rojo permanente, y una compuerta
siempre roja enseña a saltársela.

**Y no se detecta CI.** Detectarlo sería inventar una dependencia de entorno que este marco no
tiene, para decidir algo que un aviso ya resuelve en los dos sitios (`RULE-06`).

Lo que cambia de verdad **no es la severidad: es quién lo emite.** Pasa de `tracker personas`
—que hay que invocar a mano y nadie invoca— a `verify-fdge`, que corre en `npm run verify` **y** en
CI. Ése es el `CE-007` que la tarea cierra.

## Tres estados, no dos   `RULE-02`

```
SIN «personas»    → aviso: no hay contra qué contrastar. No se finge que se miró
NO DECLARADA      → aviso: se nombra la identidad, con su valor
DECLARADA         → ok: se dice a quién se atribuirá el commit siguiente
```

El primero no es un detalle: `SUITE-R22` declara soportado el proyecto de una sola persona, y uno
que aún no ha declarado `personas` no puede salir igual que uno cuya identidad **es de nadie**.

El tercero tampoco: un `ok` que **nombra a la persona** convierte la comprobación en contrastable
—quien lo lea ve el nombre y sabe si es el suyo—, en vez de en un silencio.

## Lo que se descarta, y por qué

| | Por qué no |
|:---|:---|
| Un hook de `pre-commit` | Llega antes, sí — y no corre en CI, se salta con `--no-verify`, y hay que instalarlo. `SUITE-R06` no automatiza lo que el marco no controla |
| Declarar `T <t@t>` en `personas` | Atribuir a una persona los commits del fixture: el error contrario, y peor |
| Reescribir la historia | `SUITE-R06f`, y ya está publicada |
| Bloquear en local y avisar en CI | Requiere detectar CI. Inventa una dependencia de entorno para una distinción que el aviso ya resuelve |

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** la identidad **configurada ahora**, que es la que firmará el commit siguiente.

**Fuera, y consta:**
- **Los commits pasados.** `tracker personas` ya los cuenta y `SUITE-R09` no los reescribe. Los 10
  de `T <t@t>` —tres de ellos de `EP-025`— se quedan como están y se seguirán diciendo.
- **Quién commitea de verdad.** `SUITE-R27` ya declara que el marco no puede garantizarlo. Se
  promete que la identidad configurada **corresponda a alguien declarado**, que sí es contrastable.
- **Agrupar autores por parecido.** `LEXICON 6.5f`: quién es quién lo dice una persona.

## El riesgo, y cómo se acota

El riesgo es que un aviso más se pierda entre los demás. Por eso el caso pareja no es opcional:
**el `ok` tiene que nombrar a la persona**. Un aviso que sólo aparece cuando algo va mal es
indistinguible de una comprobación que no corrió — `CE-005`, que es el nombre de este lote.
