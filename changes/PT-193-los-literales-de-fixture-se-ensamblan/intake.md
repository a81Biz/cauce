# `PT-193` — Los literales de fixture se ensamblan en mitades para no entrar en la historia

```yaml
---
id: PT-193
type: CHORE
severity: S3
epic: EP-025
track: EXPRESS
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`PT-190` añadió el fixture `_sec190`, que escribe una contraseña sintética para comprobar que el
escáner la caza:

```bash
echo "password = REDACTADO"; } > "$d/a.sh"
```

Al **commitear** `fb10d3de`, esa línea entró en la historia y `verify:secretos --historial` la cazó:
`FND-R29`, **1 hallazgo**, huella `397f02076a3e`. `npm run verify` bloqueó.

La declaración `cauce:senuelos` que `PT-190` introdujo exime **el archivo en el árbol**. El escaneo
de historia mira los **hunks añadidos**, donde esa exención no llega.

## 2. Por qué hay DOS cosas aquí, y ésta es sólo una

| | Qué es | Dónde va |
|:---|:---|:---|
| El literal entero en el fuente | **Higiene del fixture.** Evitable, y ya hay precedente | **Esta tarea** |
| Que `cauce:senuelos` no valga en historia | **Defecto de `revisar-secretos`** | `PT-194` (`EP-026`) |

Se separan porque tienen tamaño y riesgo distintos: ensamblar un literal es mecánico y no cambia
ninguna conducta; cambiar el alcance de una exención de seguridad toca la herramienta que decide
qué se publica, y eso no se hace de paso al cerrar un lote.

## 3. Cómo se arregla — y ya está decidido por precedente

`PT-015` tuvo exactamente esto con la clave de ejemplo de AWS, y lo resolvió partiéndola:

```bash
printf 'const k = "AKIA%s";\n' 'IOSFODNN7EXAMPLE'
```

con su motivo escrito al lado: *«si el fuente la contiene entera, el propio escáner la caza en este
archivo y en la historia — y lo hizo, en el primer CI de PT-015»*.

Se aplica la misma técnica. **El fixture sigue escribiendo exactamente el mismo archivo**: lo que
cambia es que el **fuente** ya no contiene el literal.

## 4. Lo que este arreglo NO promete   `SUITE-R26`

- **No arregla el commit `fb10d3de`.** Es inmutable. Su huella queda firmada en
  `SECRETOS-EXCEPCIONES.md` y **seguirá apareciendo en cada revisión**: firmar no es silenciar.
- **No cambia el alcance de la exención.** Eso es `PT-194`.
- ~~**No revisa los demás fixtures.**~~ **Corregido en `PHASE 5`** — ver
  [`spec-changes.md`](spec-changes.md). El eje del alcance es **el VALOR, no el fixture**: el
  mismo literal aparecía **dos** veces, la segunda en el fixture de `FDGE-R45` (`:1369`), y con
  ella en pie `AC-02` era inalcanzable. Se parten las dos. Lo que queda fuera son los **demás
  valores** —la clave de ejemplo de AWS, ya partida por `PT-015`, y los `JWT`—, cuyas huellas
  están firmadas y no vuelven a entrar por este cambio.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Los casos que usan el valor siguen midiendo lo mismo y en verde | `TS-01` |

> `AC-01` decia «los tres casos de `PT-190`». Al pasar el eje del alcance del fixture al
> **valor** (`spec-changes.md`), los casos afectados son **cuatro**: los tres de `PT-190` y
> el de `FDGE-R45`. El criterio no cambia de sentido, cambia el conjunto al que se aplica.
| `AC-02` | El **fuente** de `selftest.sh` ya no contiene el literal entero | `TS-02` |

## Cómo termina   `FDGE-R53`

> Termina cuando: los fixtures escriben los mismos archivos que antes, los **cuatro** casos que
> usan el valor siguen verdes, y `grep` del literal entero sobre `selftest.sh` no devuelve nada.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-025
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
G1 resuelto: 2026-08-28 · Alberto Martínez
```

### Constancia

La decisión se tomó en sesión y de forma explícita: ante el bloqueo de `FND-R29` se ofrecieron dos
caminos —firmar la huella y dejar la causa como tarea, o **firmar y corregir la causa ahora**
asumiendo otra corrida completa de la batería y volver a sellar— y el firmante eligió el segundo,
con el coste declarado por delante.

`SUITE-R27` dice lo que esto **no** prueba: que la escribiera una persona, porque la teclea el
agente. Sí lo hace contrastable — el nombre está en `firmantes`.

> **Redactado** (`FDGE-R45`): el valor de la contraseña sintética se sustituye por
> `REDACTADO`. Citarlo aquí lo devolvería al repositorio y a la historia — que es
> exactamente lo que esta tarea quita. Lo cazó `FDGE-R45` en el `verify` de cierre.
