# `PT-168` · `design.md` — `PHASE 4`

## 1. `seccionDe(txt)`

Busca `## <nombre>` o `## <sigla>` y devuelve hasta el siguiente `##`. **Devuelve `null`** si el
documento no tiene sección para ese componente — y entonces la búsqueda genérica **no se hace**:
`RULE-06`, no saber dónde mirar no es permiso para mirar en todas partes.

## 2. `cubre(txt, propio)`

`propio` marca el archivo **del** componente —`FDGE-Prompts.md` es entero de FDGE, no tiene un
`## FDGE` dentro—. Ahí el ámbito es el documento completo.

**Sin ese matiz, la primera versión produjo 46 huecos falsos**: el mismo error que se estaba
arreglando, cometido al arreglarlo. Mirar donde no toca y mirar de menos son el mismo defecto con
el signo cambiado.

## 3. El formato compacto

```
## PTSA   →  PHASE 0  CARGA CORE-PTSA.md …
## FPGE   →  1 FRESHNESS  PTSA STALE|UNKNOWN → …
```

Las dos son una fase con su nombre. Leer sólo la primera dejaba **seis** huecos falsos en `FPGE`.

**Y ahí estaba el defecto original en miniatura**: `FPGE PHASE 1` pasaba porque su sección cita
*«Entrega a FDGE `PHASE 1` (Intake)»* — la fase de **otro** componente, dentro de la sección
correcta.

## 4. Lo que este diseño NO resuelve

Las otras dimensiones de `audit`. **No está medido** si tienen el mismo patrón.
