# `PT-193` · `spec-changes.md` — el alcance cambió en `PHASE 5`, y se declara

`G2` ya estaba resuelta cuando esto apareció. Reinterpretar un `AC` en silencio para que encaje con
lo que se hizo es lo contrario de una compuerta, así que el cambio se escribe aquí.

## Qué destapó el cambio

Ejecutar la comprobación de `AC-02` —el `grep` del literal sobre el fuente— devolvió **1**, no `0`.
La aparición que quedaba no era la de `_sec190`:

```
selftest.sh:1369   printf 'password = REDACTADO\n' >> "$WORK/changes/PT-001-login/intake.md"
                   chk "secreto en el intake ⇒ falla"  "✗ FDGE-R45"
```

**Es el mismo valor**, en un fixture distinto —el de `FDGE-R45`— muy anterior a `PT-190`, con su
huella de historia firmada desde el `2026-08-13`.

## La contradicción que había en el intake, y era mía

El intake decía dos cosas que no podían ser ciertas a la vez:

| Dónde | Qué decía |
|:---|:---|
| `AC-02` | «El **fuente** de `selftest.sh` ya no contiene el literal entero» |
| §4, fuera de alcance | «**No revisa los demás fixtures.** Los que ya estaban firmados desde `2026-08-13` siguen como estaban» |

Con la segunda aparición en pie, `AC-02` era **inalcanzable**. Y con `AC-02` como criterio, el §4
era falso. No es que el alcance fuera pequeño: es que estaba mal escrito, y sólo se vio al
ejecutarlo.

## El cambio

**El eje del alcance pasa a ser el VALOR, no el fixture.**

- **`AC-02` se mantiene tal cual está redactado** —el fuente no contiene el literal— y ahora es
  alcanzable: se parten **las dos** apariciones de ese valor.
- **§4 se corrige**: lo que queda fuera de alcance son los **demás valores** (la clave de ejemplo
  de AWS y los `JWT`, 2 apariciones), no «los demás fixtures».

## Por qué éste y no el contrario

Se consideró acotar `AC-02` a `_sec190`. Se descarta: sería estrechar el criterio hasta el
resultado ya obtenido, que es exactamente la forma de hacer que una comprobación no pueda fallar.
El criterio se escribió para que el fuente no lleve la contraseña, y llevarla en otra línea la
lleva igual.

## Qué NO cambia

- **No se tocan los demás valores.** `AKIA…` ya está partido desde `PT-015`; los `JWT` siguen como
  estaban. Sus huellas están firmadas y no vuelven a entrar por este cambio.
- **No cambia ninguna conducta medida.** Los dos fixtures escriben bajo `$WORK/` exactamente los
  mismos bytes; sus casos —los tres de `PT-190` y el de `FDGE-R45`— miden lo que medían.
- **No cambia la firma de la huella** `397f02076a3e`: el commit `fb10d3de` es inmutable.

## Coste

Ninguno adicional: la segunda línea entra en la misma corrida completa que `PT-193` ya obligaba a
repetir.

---

## Segundo efecto del mismo cambio: `AC-01` cubre CUATRO casos

El intake decía «los tres casos de `PT-190`». Al mover el eje del alcance al **valor**, el fixture
de `FDGE-R45` (`:1369`) también se parte, y su caso —`secreto en el intake ⇒ falla`— queda
afectado.

`AC-01` pasa a leerse **«los casos que usan el valor»**, que son cuatro. No es un criterio nuevo:
es el mismo, aplicado al conjunto que el cambio realmente toca. Dejarlo fuera sería tocar un
fixture y no mirar su caso, que es justo la regresión que `AC-01` existe para descartar.

Queda escrito en [`traceability.md`](traceability.md), con los cuatro casos nombrados.

> **Redactado** (`FDGE-R45`): el valor de la contraseña sintética se sustituye por
> `REDACTADO`. Citarlo aquí lo devolvería al repositorio y a la historia — que es
> exactamente lo que esta tarea quita. Lo cazó `FDGE-R45` en el `verify` de cierre.
