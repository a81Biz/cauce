# `PT-199` — El esqueleto de la corrida acotada no cubre las rutas que el andamiaje toca

```yaml
---
id: PT-199
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

La batería acotada escupe **33 líneas de error por corrida**, justo tras el banner del acotado:

```
Can't open /tmp/tmp.6rHSjhOX4P/mth-selftest/docs/implementation/HISTORY.log: No such file or directory.
Can't open /tmp/tmp.6rHSjhOX4P/mth-selftest/changes/PT-002-pool/discovery.md: No such file or directory.
```

El montaje de cada caso vive **fuera** de `chk`:

```bash
build_fixture; perl -0pi -e 's/^Estructural: no\n//m' "$WORK/docs/implementation/HISTORY.log"
chk "falta «Estructural:» en HISTORY"   "FDGE-R44"   V PT-001
```

Con la sección inactiva `chk` no ejecuta, **pero el `perl` de arriba sí**.

## 2. Por qué es un defecto y no ruido   `[HUMANO]`

`build_fixture` **ya previó esto** (`selftest.sh:373`) y monta un esqueleto barato para que esas
órdenes operen sobre archivos inertes. Su comentario lo dice:

> *«…sin ellas llenaría la salida de errores sobre archivos que no existen. Con el esqueleto, esas
> órdenes hacen su trabajo sobre archivos inertes **y no dicen nada**».*

**El esqueleto se quedó corto.** Crea `REGISTRY.json` y `changes/PT-001-login/intake.md`, y no crea
`HISTORY.log` ni `changes/PT-002-pool/discovery.md`. La intención está escrita y el resultado la
contradice 33 veces.

- **Enseña a ignorar la salida.** Un verde que escupe 33 errores entrena a no leerlos, y el día que
  uno sea real nadie mirará. Es el mismo razonamiento con que `SECRETOS-EXCEPCIONES.md` justifica su
  existencia: *«una compuerta siempre roja enseña a saltársela»*.
- **La lista es a mano, y por eso se queda corta.** Nada contrasta lo que el esqueleto crea con lo
  que el andamiaje toca, así que la próxima ruta nueva volverá a fallar en silencio.

Lo señaló el firmante: *«¿cómo confiar en algo que no se puede leer?»*

## 3. Cómo se arregla, y cómo NO

**No** añadiendo las dos rutas que faltan hoy: sería la misma lista a mano, corta otra vez mañana.

**Sí** haciendo que lo que el esqueleto monta se **derive** de lo que el andamiaje toca, o que la
corrida **falle** si el andamiaje escribe fuera de lo montado. Cuál de las dos, lo decide la tarea.

## 4. Lo que NO promete   `SUITE-R26`

No se afirma que los casos acotados midan mal: los que corren lo hacen sobre su fixture real. Lo que
falla es el andamiaje de los que **no** corren. Distinguirlo es parte del trabajo (`RULE-06`).

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Una corrida acotada no emite **ninguna** línea de error de andamiaje | `TS-01` |
| `AC-02` | Si el andamiaje toca una ruta que el esqueleto no monta, **se sabe** — no pasa en silencio | `TS-02` |
| `AC-03` | Los casos que sí corren siguen midiendo lo mismo | `TS-03` |

`AC-02` es el que impide que esto vuelva: `AC-01` lo satisface añadir dos rutas a mano.

## Cómo termina   `FDGE-R53`

> Termina cuando: la corrida acotada está **limpia** y, además, una ruta nueva no montada **no puede
> pasar desapercibida**.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
