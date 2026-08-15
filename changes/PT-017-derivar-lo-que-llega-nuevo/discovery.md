# PT-017 — Descubrimiento   `PHASE 2` · `2-R`

## Dónde está, con archivo y línea

```js
// tools/migrate.mjs:245-247
need('lo que llega nuevo en tools/: tracker (espejo con la plataforma) · revisar-secretos '
  + '(árbol e historia, FND-R29) · comparar-marco · verify-patrones · version · patrones. '
  + 'Y los documentos de FIDE/ más INTAKE/templates/TAREA.md.');
```

## Ya está vieja, y se puede medir

```
la lista nombra    6 herramientas
tools/ tiene      16
no menciona        audit.mjs · regla.mjs · verify-ptsa.mjs · verify-qa.mjs
                   build-core.mjs · plan-layout.mjs · verify-fdge.mjs · verify-suite.mjs
                   migrate.mjs · selftest.sh
```

`regla.mjs` nació en `PT-041`, hace dos lotes. `audit.mjs` es anterior. **Ninguna de las dos
aparece**, y nadie lo notó porque nada compara la lista con el directorio.

Es exactamente el hecho copiado que `RULE-01` describe: escrito a mano una vez, envejeciendo
solo, y con la particularidad de que **quien lee esa lista es quien menos puede detectar que
está incompleta** — está migrando, no conoce la suite.

## Lo que hay para derivarlo

`migrate.mjs` ya conoce los dos lados:

```
CAMBIOS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md')
          → el paquete que se instala, de donde sale este script
ROOT     → el proyecto destino
```

Comparar `<paquete>/tools/` con `<destino>/docs/methodology/tools/` es una resta de conjuntos, y
los dos caminos ya están resueltos. **No falta información: falta usarla.**

## Lo que este descubrimiento NO puede afirmar

Que la lista derivada sea útil sin más. Si el destino no tiene `docs/methodology/tools/` —un
proyecto en `3.x`— la resta da «todo», y eso es cierto pero inútil como aviso. `PHASE 3` tiene que
decidir qué hacer en ese caso, y `RULE-06` obliga a decirlo en vez de imprimir dieciséis nombres.
