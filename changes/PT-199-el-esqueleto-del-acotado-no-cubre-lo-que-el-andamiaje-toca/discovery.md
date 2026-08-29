# `PT-199` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. El defecto

```
docs/methodology/tools/selftest.sh:372-383
```

```bash
build_fixture() {
  # PT-086 · con la seccion inactiva se monta un esqueleto VACIO y barato en vez del fixture.
  # No se devuelve sin mas: el andamiaje que viene detras —perl, cp, printf— opera sobre rutas
  # de $WORK, y sin ellas llenaria la salida de errores sobre archivos que no existen. Con el
  # esqueleto, esas ordenes hacen su trabajo sobre archivos inertes y no dicen nada.
  if [ -n "$ACOTADO" ] && [ -z "$SEC_ACTIVA" ]; then
    rm -rf "$WORK"; mkdir -p "$WORK/docs/implementation" "$WORK/docs/methodology/tools" "$WORK/changes/PT-001-login"
    cd "$WORK"
    : > changes/PT-001-login/intake.md
    echo '{"allocations":[]}' > docs/implementation/REGISTRY.json
    return 0
  fi
```

**La intención está escrita y el resultado la contradice.** El comentario dice «no dicen nada»; la
corrida acotada dice **33 cosas**.

## 2. La medida

```
rutas distintas de $WORK que el arnés toca      174
  parecen archivo (punto en el último segmento)  87
  parecen directorio                             87

el esqueleto monta hoy                            2
cobertura                                        1 %
```

**Dos de ciento setenta y cuatro.** Las dos que fallan visiblemente hoy —`docs/implementation/HISTORY.log`
y `changes/PT-002-pool/discovery.md`— están entre las 172 que no monta.

## 3. Por qué el andamiaje se ejecuta aunque el caso no

El montaje de cada caso vive **fuera** de `chk`:

```bash
build_fixture; perl -0pi -e 's/^Estructural: no\n//m' "$WORK/docs/implementation/HISTORY.log"
chk "falta «Estructural:» en HISTORY"   "FDGE-R44"   V PT-001
```

`sec()` (`:147-159`) marca la sección inactiva y `chk` no ejecuta su comando — **pero el `perl` de la
línea de arriba es código de shell suelto y corre siempre**. Ésa es la razón de que `build_fixture`
monte algo en vez de devolver sin más, y es correcta: el problema es **cuánto** monta.

## 4. Por qué la lista a mano no puede estar completa

Las 174 rutas están repartidas por **9 667 líneas** de arnés y cambian con cada tarea que añade un
caso. Una lista escrita a mano en `:378`:

- nació cubriendo lo que hacía falta **entonces**,
- no tiene nada que la contraste con lo que el andamiaje toca **hoy**,
- y no lo tendrá con lo que toque mañana.

Es la forma que da nombre al lote: **información derivable, escrita a mano, que nadie contrasta**.
Y es la misma que `PT-176` resolvió para los bloques —el `MAJOR` sale del commit que introdujo la
sección, «retroactivo por construcción, sin declarar nada»— y `PT-091` para las cifras del
inventario.

## 5. Lo que NO está roto, y por eso no se toca

- **`sec()` y el acotado.** Saltar secciones funciona: los casos que corren, corren sobre su fixture
  real. Lo que falla es el andamiaje de los que **no** corren.
- **La decisión de `PT-086` de montar un esqueleto** en vez de devolver. Es correcta y se conserva:
  lo que cambia es de dónde sale su contenido.

## 6. Un límite del `grep`, y se dice

Las 174 salen de buscar `$WORK/...` literal en el fuente. **No cubre** rutas construidas en
variables (`local d="$WORK/p191"; … "$d/a.sh"`). Ésas seguirán sin montarse, y por eso `AC-02` no
puede ser «el esqueleto lo monta todo» sino **«si falta algo, se sabe»** (`RULE-06`).
