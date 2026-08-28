# `PT-193` · `strategy.md` — `PHASE 2 + 3 + 4` condensadas   `TRACK EXPRESS`

`EXEC-R10` · Condensar no es colapsar: aquí están el descubrimiento, la estrategia y la propuesta.
Si deja de ser trivial, se para y se vuelve a `PHASE 2` en `STANDARD`.

## `PHASE 2` · Dónde está, con archivo y línea

```
docs/methodology/tools/selftest.sh:9547
    echo "password = REDACTADO"; } > "$d/a.sh"
```

Dentro de `_sec190()`, el fixture que `PT-190` añadió. El **archivo generado** bajo `$WORK/` es lo
que el caso necesita; el problema es que el **fuente** contiene el literal, y el fuente se
commitea.

Medido: `revisar-secretos . --historial` → `FND-R29`, 1 hallazgo, huella `397f02076a3e`,
`historia fb10d3de:1`. `npm run verify` bloqueó en `verify:secretos`.

## `PHASE 3` · El camino, y los descartados

**Elegido: partir el literal**, exactamente como `PT-015`:

```bash
printf 'const k = "AKIA%s";\n' 'IOSFODNN7EXAMPLE'      # selftest.sh:821, precedente
```

El motivo ya está escrito allí, en `:817`: *«si el fuente la contiene entera, el propio escáner la
caza en este archivo y en la historia — y lo hizo, en el primer CI de `PT-015`»*. No hay que
inventar un criterio: hay uno, con su cicatriz.

### Descartados

| Camino | Por qué no |
|:---|:---|
| Retirar el fixture | Dejaría a `PT-190` sin sus tres casos. Quitar la prueba para que no salte el escáner es taparlo |
| Ampliar `cauce:senuelos` al escaneo de historia | **Es otro defecto y otro riesgo.** Toca la herramienta que decide qué se publica; no se hace de paso al cerrar un lote. Es `PT-194` (`EP-026`) |
| Reescribir la historia para sacar el commit | `SUITE-R06f`: no se automatiza, y el rastro no se retira |
| Sólo firmar la huella | Era la otra opción ofrecida al firmante, y eligió corregir la causa **además** de firmar |

## `PHASE 4` · La propuesta

Una línea. `_sec190()` pasa de `echo` a `printf` con el literal partido:

```bash
printf 'pass%s = REDACTADO\n' 'word'
```

El archivo escrito bajo `$WORK/` es **byte a byte el mismo**, así que los tres casos de `PT-190`
miden exactamente lo que medían.

### Escenarios

| | Escenario | `AC` |
|:---|:---|:---|
| `TS-01` | Los tres casos de `PT-190` corren y siguen en verde | `AC-01` |
| `TS-02` | `grep` del literal entero sobre `selftest.sh` no devuelve nada | `AC-02` |

`TS-02` **no lleva caso de batería**, y se dice: un caso que busque el literal entero dentro del
arnés **tendría que contener el literal entero** para buscarlo, y volvería a meterlo en el fuente y
en la historia. Es la misma trampa que este arreglo quita. Se comprueba con `grep` en la evidencia,
que es exactamente donde `PT-015` la dejó también.

## Fuera de alcance   `out-of-scope`

- Los fixtures firmados el `2026-08-13`: tocarlos generaría huellas nuevas sin arreglar nada.
- El alcance de la exención en historia: `PT-194`.
- El commit `fb10d3de`: inmutable, con su huella firmada.

> **Redactado** (`FDGE-R45`): el valor de la contraseña sintética se sustituye por
> `REDACTADO`. Citarlo aquí lo devolvería al repositorio y a la historia — que es
> exactamente lo que esta tarea quita. Lo cazó `FDGE-R45` en el `verify` de cierre.
