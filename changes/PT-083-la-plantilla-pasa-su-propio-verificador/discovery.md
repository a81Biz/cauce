# PT-083 — Descubrimiento   `PHASE 2`

## El defecto, con archivo y línea

[verify-fdge.mjs:120](docs/methodology/tools/verify-fdge.mjs#L120):

```js
const RE_SEVERITY = /^\s*severity:\s*(S[1-4])\s*$/im;
```

Y las plantillas que **el paquete distribuye**:

```
INTAKE/templates/BUG-REPORT.md:15       severity: S2   # [HUMANO] S1 | S2 | S3 | S4
INTAKE/templates/FEATURE-REQUEST.md:15  severity: S3   # [HUMANO] S1 | S2 | S3 | S4
INTAKE/templates/CHANGE-REQUEST.md:13   severity: S4   # [HUMANO] S1 | S2 | S3 | S4
```

**Las tres.** El `$` exige fin de línea inmediatamente tras `S2`, y el comentario lo rompe.

## Lo que lo convierte en defecto y no en convención

`severity` es el **único de los seis campos** del YAML que ancla en `$`:

| Campo | Regex | ¿Tolera comentario? |
|:---|:---|:---|
| `phase` | `/^\s*phase\s*:\s*(\d+)/im` | sí |
| `status` | `/^\s*status\s*:\s*([A-Z_]+)/im` | sí |
| `type` | `/^\s*type:\s*(BUG\|…)\b/im` | sí |
| `track` | `/^\s*track:\s*(STANDARD\|…)\b/im` | sí |
| `complexity` | `/^\s*complexity:\s*(TRIVIAL\|…)/im` | sí |
| **`severity`** | `/^\s*severity:\s*(S[1-4])\s*$/im` | **no** |

No es que el marco pida «campos limpios» y la plantilla lo incumpla. Es **un campo incoherente
con sus cinco vecinos**, y no hay forma de que quien rellena lo adivine. El mensaje, además,
acusa de no declarar la severidad a quien **sí** la declaró.

## Cómo apareció

Ejecutando `PT-072` sobre un proyecto nuevo real, y sólo **después** de cometer el error de al
lado: escribí el intake a mano, fallé cuatro comprobaciones, y **entonces** copié la plantilla
—que es lo que el `MANUAL` manda— y falló ésta.

Leyendo el regex no se ve. Hay que rellenar la plantilla para que salte.

## Conclusión

El camino que el `MANUAL` describe —instalar el paquete, copiar su plantilla, rellenarla—
**falla**. Y falla en el primer intake que alguien escriba.

Se arregla **quien lee**, no las plantillas: los comentarios en línea son útiles —dicen quién
rellena qué— y quitarlos empeoraría la plantilla para acallar al verificador.

Y el arreglo del regex no es lo que impide la próxima. Lo que la impide es un caso que **rellene
cada plantilla del paquete y la valide**: hoy no existe, y por eso una plantilla pudo divergir de
su verificador sin que nada lo dijera. Es `PT-075` aplicado a los artefactos que viajan dentro
del paquete.
