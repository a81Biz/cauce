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
| `81f93f2cf84b` | | | Fixture de `tools/selftest.sh`: contraseña sintética en un archivo falso bajo `$WORK/` para probar que el escáner la caza. |
| `e108f6a8e526` | | | Fixture de `tools/selftest.sh`: `api_key` sintética en un archivo falso bajo `$WORK/`. |
| `f9d1edd95ed2` | | | Fixture de `tools/selftest.sh`: contraseña sintética en un `.ini` falso bajo `$WORK/`. |
| `887b91972240` | | | Fixture de `tools/selftest.sh`: evidencia falsa con contraseña sintética, para probar que la evidencia también se revisa. |
| `431246f5a380` | | | Fixture de `tools/selftest.sh`: JWT sintético en evidencia falsa. No es un token emitido. |

> Las cinco huellas de arriba están **verificadas y sin firmar**: comprobé que los seis hallazgos
> (dos comparten huella) proceden de `tools/selftest.sh`, que crea archivos bajo `$WORK/` con
> valores inventados —`SuperSecreta123`, `hunter2secret`, `abcd1234efgh5678`— para demostrar que
> el escáner los detecta. Ninguno es una credencial emitida.
>
> **Firmarlas es tuyo, no mío.** Escribe tu nombre y la fecha en cada fila que aceptes. Mientras
> la columna esté vacía, la compuerta sigue bloqueando — que es lo correcto.
