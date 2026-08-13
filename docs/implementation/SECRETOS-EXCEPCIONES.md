# Excepciones firmadas del escáner de secretos   `FND-R29`

> **Firmar no es silenciar.** Cada excepción de aquí **sigue apareciendo** en cada revisión, con
> quién la firmó y por qué. Lo único que cambia es que deja de bloquear la compuerta.
>
> La firma cubre **una huella concreta**, que incluye el valor encontrado. Si el valor cambia, la
> huella cambia y vuelve a bloquear — una excepción no es un permiso permanente sobre un archivo.

## Por qué existe este archivo

La herramienta exigía firmar la excepción por escrito y **no existía dónde firmarla**. En este
mismo repositorio el escáner caza los fixtures del selftest —archivos falsos con contraseñas
falsas, creados precisamente para probar que el escáner funciona— y la compuerta quedaba en rojo
permanente.

Una compuerta siempre roja enseña a saltársela. Eso es peor que no tenerla: el día que aparezca
un secreto de verdad, nadie mirará.

## Cómo se firma

1. Ejecuta la revisión y copia la **huella** de 12 caracteres del hallazgo.
2. Añade una fila abajo con tu nombre, la fecha y el motivo.
3. Vuelve a ejecutar: el hallazgo aparece como firmado y ya no bloquea.

Una fila sin firmante no es una firma. La plantilla sin rellenar **no exime**.

## Excepciones

| Huella | Firmada por | Fecha | Motivo |
|:---|:---|:---|:---|
| `81f93f2cf84b` | Alberto Martínez | 2026-08-12 | Fixture de `tools/selftest.sh` (commit e88a63ba): contraseña sintética en un `src/` falso bajo `$WORK/`, para probar que el escáner la caza. |
| `e108f6a8e526` | Alberto Martínez | 2026-08-12 | Fixture de `tools/selftest.sh` (commit e88a63ba): campo de credencial sintético en un `.json` falso bajo `$WORK/`. |
| `f9d1edd95ed2` | Alberto Martínez | 2026-08-12 | Fixture de `tools/selftest.sh` (commit 7ef06b42): JWT sintético en una cabecera `Authorization` de evidencia falsa. No es un token emitido. |
| `887b91972240` | Alberto Martínez | 2026-08-12 | Fixture de `tools/selftest.sh` (commit 7ef06b42): campo de credencial sintético en evidencia falsa, para probar que la evidencia también se revisa. |
| `431246f5a380` | Alberto Martínez | 2026-08-12 | Fixture de `tools/selftest.sh` (commit 7ef06b42): contraseña sintética en un archivo de configuración falso bajo `$WORK/`. |
| `7df736f055f2` | Alberto Martínez | 2026-08-12 | La nota explicativa de este mismo archivo, en el commit 8507e3ea que lo creó: citaba los valores de los fixtures. Ya no los cita, pero el commit es inmutable. |

> **Firmadas el 2026-08-12 por Alberto Martínez.** Las seis apariciones (dos comparten huella) proceden
> de `tools/selftest.sh`, que crea archivos bajo `$WORK/` con valores inventados para demostrar
> que el escáner los detecta. Ninguno es una credencial emitida.
>
> **Este archivo no cita los valores.** Al hacerlo, el escáner lo cazaba a él —el documento que
> explica los falsos positivos se convertía en uno— y cada commit generaba una huella nueva. Se
> describen; no se reproducen.
>
> Siguen apareciendo en cada revisión. Si alguno cambiara de valor, su huella cambiaría y
> volvería a bloquear.
