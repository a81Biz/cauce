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

> **Refirmadas el 2026-08-13.** `PT-005` cambió cómo se calcula la huella de un hallazgo de
> historia: antes incluía el hash del commit, y eso ataba la firma a la profundidad del clon —
> en CI, con un clon superficial, ninguna encajaba nunca. Ahora el ámbito es «la historia», no
> el commit. Las huellas de abajo son las nuevas; las de la sección siguiente quedan como
> registro de lo que se firmó antes (`SUITE-R09`: se corrige añadiendo, no editando).
>
> **Es el mismo secreto y el mismo motivo.** Lo que cambió es la forma de nombrarlo.

| Huella | Firmada por | Fecha | Motivo |
|:---|:---|:---|:---|
| `06fde4781007` | Alberto Martínez | 2026-08-13 | **contraseña en texto plano** · Fixture de `tools/selftest.sh` (`e88a63ba`): contraseña sintética en un `src/` falso bajo `$WORK/`, para probar que el escáner la caza. |
| `c021dba47ee0` | Alberto Martínez | 2026-08-13 | **campo de credencial con valor** · Fixture de `tools/selftest.sh` (`e88a63ba`): campo de credencial sintético en un `.json` falso bajo `$WORK/`. |
| `e6319a7bafbf` | Alberto Martínez | 2026-08-13 | **contraseña en texto plano** · Fixture de `tools/selftest.sh` (`7ef06b42`): contraseña sintética en un archivo de configuración falso bajo `$WORK/`. |
| `3a536d3fda50` | Alberto Martínez | 2026-08-13 | **campo de credencial con valor** · Fixture de `tools/selftest.sh` (`7ef06b42`): campo de credencial sintético en evidencia falsa, para probar que la evidencia también se revisa. |
| `aa6be08bbdf9` | Alberto Martínez | 2026-08-13 | **JWT en una cabecera Authorization** · Fixture de `tools/selftest.sh` (`7ef06b42`): JWT sintético en evidencia falsa. No es un token emitido. |
| `b5c647f7980c` | Alberto Martínez | 2026-08-13 | **contraseña en texto plano** · La nota explicativa de este mismo archivo, en el commit `8507e3ea` que lo creó: citaba los valores de los fixtures. Ya no los cita, pero el commit es inmutable. |
| `031806bb5494` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |
| `3936b3f97476` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |
| `5ffc0945773c` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |
| `80cda2861838` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |
| `99e65d4d8c89` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |
| `cb0ab32cf2fe` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |
| `cbe7920fd6cc` | Alberto Martínez | 2026-08-13 | Volcado del log de CI commiteado por error como evidencia en `07c6cf6f`. El log citaba las líneas de los fixtures de `tools/selftest.sh`; **`FDGE-R45` lo prohíbe** y lo cazó el propio paso de secretos. El archivo se redactó en el commit siguiente, pero el commit es inmutable. Ninguna es una credencial emitida. |

| `08ee900870eb` | Alberto Martínez | 2026-08-15 | **clave de acceso AWS** · Fixture de `tools/selftest.sh` (`976b8bec`), del caso que `PT-015` añadió para comprobar que `revisar-secretos` cita `FND-R29` al bloquear. Es la clave de **ejemplo que documenta AWS**, no una emitida. **La causa ya está corregida**: el fixture la ensambla en dos mitades, así que el fuente no la contiene y no vuelve a aparecer — pero el commit es inmutable. |

> **Las siete de arriba comparten una sola causa** y por eso comparten motivo: son el mismo
> volcado. No se les asigna un tipo fila por fila porque no pude confirmarlo uno a uno, y
> escribir un tipo sin confirmarlo es el error que esta misma tabla cometió en su primera
> versión.

### Constancia de cómo se refirmaron   `FND-R29` · `SUITE-R27`

**Estas seis filas las escribió el agente, no la persona que firma.** La delegación es la misma
que cubrió `G1` y `G2` de este lote —«te autorizo a que firmes a mi nombre», 2026-08-13—, y el
alcance aquí es estrecho a propósito: **no se firma ninguna excepción nueva.** Son las seis ya
firmadas el 2026-08-12, con el mismo motivo, renombradas porque cambió la fórmula de la huella.

Si alguna cubriera un valor distinto, sería una decisión nueva y no entraría aquí.

**Cada fila nombra el tipo de hallazgo que cubre.** La primera versión de esta tabla los
asignó mal —una fila decía «JWT» sobre una contraseña— y las seis seguían eximiendo igual,
porque la huella casa por valor y no por texto. Un motivo que no describe el hallazgo no es una
firma: es una fila. Se corrigió antes de commitear.

### Constancia de la firma del 2026-08-15   `FND-R29` · `SUITE-R27`

**Esta sí es una excepción nueva**, y por eso lleva su propia constancia en vez de ampararse en la
de arriba —que dice explícitamente «no se firma ninguna excepción nueva»—.

La escribió el agente con autorización explícita y citable del firmante, pedida **después** de que
la compuerta bloqueara y **antes** de tocar el archivo:

> «firma la fila a mi nombre, tienes mi vobo y continúa» — Alberto Martínez, 2026-08-15

El agente se detuvo y preguntó en vez de firmar por precedente: las 13 filas anteriores son de la
misma clase, pero una excepción de secretos no estaba en la delegación de `G1`, `G2` y `G3`, y
extenderla sola habría sido el deslizamiento que `SUITE-R27` describe — una firma es una
declaración de responsabilidad, y el agente no puede ampliar de quién.

**Lo que la hace defendible además de autorizada:** la causa está corregida en el mismo commit que
la firma. El valor no vuelve a entrar en el repositorio, y esta fila cubre solo el commit que ya
existe.

### Huellas anteriores — ya no aplican

> Se conservan porque `SUITE-R09` corrige añadiendo, no editando. Ninguna de estas casa ya con
> ningún hallazgo: la fórmula cambió.

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
