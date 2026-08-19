# PT-076 — Descubrimiento   `PHASE 2-B`

## Causa raíz

`selftest.sh` define **dos** formas de invocar `tracker`:

```bash
TR()  { node "$WORK/docs/methodology/tools/tracker.mjs"  "$@" "$WORK";      }  # el fixture
TRR() { node "$SUITE/tools/tracker.mjs"                  "$@" "$RAIZ_REAL"; }  # el repo REAL
```

`TRR` **no es un error**. Existe porque tres acciones necesitan historial de verdad:

```
15 casos  TRR coste        una mediana de cuatro tareas de mentira no es una mediana
12 casos  TRR viabilidad   compara contra lo ya completado en sesiones reales
 4 casos  TRR personas     reconcilia identidades del historial de git
 4 casos  TRR rama
 4 casos  TRR sesion       (solo lectura)
```

El defecto es que **tres invocaciones escriben**:

| Acción | Casos | Qué escribe en el repositorio real |
|:---|:--:|:---|
| `sesion abrir` | 3 | `SESSION-<persona>.json` — pisa la marca de la sesión en curso |
| `sesion cerrar` | 6 | `SESSION_LOG.md` — apila una entrada, y es **append-only** |
| `asignar` | 6 | **nada**: lleva `--ver` |

`asignar` es la prueba de que **el patrón seguro ya se conocía**: alguien vio que asignar contra
el registro real quemaría identificadores y le puso `--ver`. Nadie hizo lo mismo con `sesion`.

## Reproducido

```
$ node -p "require('./docs/implementation/SESSION-alberto-martinez.json').desde.slice(0,7)"
78fbcd9

$ bash selftest.sh --solo "sesion abrir escribe la marca"
  ✓ sesion abrir escribe la marca

$ node -p "require('./docs/implementation/SESSION-alberto-martinez.json').desde.slice(0,7)"
a6913da        <- movida
```

Un solo caso. La batería completa la mueve tres veces y apila seis entradas.

## Daño acumulado, contado

```
$ grep -c "· sesion abierta en\|· sesion cerrada" SESSION_LOG.md
140

$ grep -oE "sesion abierta en \`[0-9a-f]{7}\`" SESSION_LOG.md | sort | uniq -c | sort -rn
     14 sesion abierta en `258be16`
      8 sesion abierta en `37392ac`
      6 sesion abierta en `e4c8cb1`
      6 sesion abierta en `daa057e`
      6 sesion abierta en `d61a241`
```

Catorce aperturas sobre el mismo commit no son catorce sesiones: son catorce pasadas de la
batería. `SUITE-R09` hace el ledger append-only, así que **no se pueden limpiar**.

## Por qué no es ruido en un log

Es la **base de cálculo** de tres cosas encadenadas:

```
SESSION-<persona>.json
   └── tracker sesion        lo que la sesion lleva movido
   └── tracker viabilidad    el «mayor hecho» -> SAFE | MARGINAL | UNSAFE
          └── FDGE-R54       que REGISTRA ese veredicto en el registro
```

`FDGE-R54` la creó `PT-075` hace unas horas. Es decir: **la batería de pruebas corrompe el dato
sobre el que una compuerta recién creada decide.** Los catorce veredictos de `EP-017` se
registraron con `medido_en: 258be16` — una sesión cerrada el día anterior.

## Familia

El `HANDOFF` ya declara el patrón: «correr un caso del arnés que lea el `REGISTRY` real sin
pasar el `ROOT` explícito». Aquí el `ROOT` **se pasa a propósito** y el problema es el
contrario: no que lea, sino que **escriba**. Es la versión grave del mismo descuido.
