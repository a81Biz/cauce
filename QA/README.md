# QA — espacio de trabajo de FQAGE

**Sin ciclo ejecutado.** Este archivo sostiene el espacio (`SUITE-R32`).

`[START QA]` lo puebla: `QA/cases/QA-NNN.md`, `QA/QA-DEFECTS.md`, `QA/reports/QR-NNN/` y las
pruebas ejecutables. `playwright` no está instalado todavía: se instala cuando vaya a usarse
QA, no al instalar la suite (`SUITE-R29`).

## `QA/` y `qa/` son el mismo directorio en este host

`I3` enumera **dos** espacios que se distinguen solo por la caja: `QA/` (casos, defectos e
informes) y `qa/` (las pruebas ejecutables que `verify-qa` busca en `qa/tests/`). En Windows y
en macOS por defecto el sistema de archivos no distingue mayúsculas: aquí **no pueden coexistir**
— se comprobó creando `QA/` y listando `qa/`, que resolvió al mismo directorio.

Las pruebas van por tanto en `QA/tests/`, que es la misma ruta que `verify-qa` abre como
`qa/tests/`. En un host sensible a la caja —Linux, y la integración continua— serían dos
directorios distintos y esta equivalencia dejaría de sostenerse.

Está registrado como hallazgo del marco en `docs/implementation/INSTALL.log`. La corrección
—unificar la caja en `LEXICON.md`— toca `docs/methodology/` y es `SUITE-R06e`: se decide, no se
hace de paso.
