# PT-071 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `publicar.yml` corre las mismas comprobaciones que `verificacion.yml` | E1 | `selftest.sh`: ningún comando de `verificacion` falta en `publicar` | `salidas/paridad.txt` | PENDIENTE |
| AC-02 | La invocación es **idéntica**, no equivalente | E1 | el comparador deriva la cadena completa | `salidas/paridad.txt` | PENDIENTE |
| AC-03 | `verify-fdge --all` está, por `FDGE-R34` | E2 | precondición de `G4`, y publicar va después | `salidas/paridad.txt` | PENDIENTE |
| AC-04 | La paridad se comprueba sola | E1 | un caso deriva los comandos de los dos archivos | `salidas/paridad.txt` | PENDIENTE |

## `AC-02` no es pedantería

Escribí `npm run verify:espejo` donde el otro pone `node …/tracker.mjs espejo`. **Hacen lo mismo
hoy** y el comparador las contó como distintas — con razón: el día que `verify:espejo` cambie de
definición en `package.json`, los dos workflows dejarán de correr lo mismo sin que nada lo diga.

## `AC-04` es lo que impide la próxima

`FND-R29` ya había faltado en `publicar.yml` y lo encontró Foundation como divergencia `D9`.
Arreglar el desfase sin dejar quien lo vigile es repetir esa historia con otras tres.
