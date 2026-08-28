# `PT-191` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. El defecto, en una línea

```
docs/methodology/tools/sellar-bloques.mjs:68
    const veredicto = process.argv.includes('--verde') ? 'OK' : null;
```

Eso es todo lo que separa «este bloque pasó» de «alguien tecleó cinco caracteres».

## 2. Qué escribe ese veredicto, y quién lo lee después

`sellar-bloques.mjs:104` lo estampa en `docs/implementation/SELLOS.json`, uno por bloque:

```json
"8":  { "sello": "c90b41c01f49", "veredicto": "OK", "fecha": "2026-08-27", "secciones": 29 },
"9":  { "sello": "b6621ea524ce", "veredicto": "OK", "fecha": "2026-08-27", "secciones": 6 },
"10": { "sello": "ca91da55957a", "veredicto": "OK", "fecha": "2026-08-27", "secciones": 8 },
"11": { "sello": "02d18b8bb4b3", "veredicto": "OK", "fecha": "2026-08-27", "secciones": 2 }
```

Lo lee `bloques-sellados.mjs`, que **acota la batería**: lo sellado no se vuelve a correr. Los
cuatro bloques suman 45 secciones — el **95%** de los casos. Un `veredicto` falso no da rojo:
apaga el 95% de la batería en silencio.

`PT-175` introdujo el campo `veredicto` precisamente para que un bloque **no** quedara certificado
por el mero hecho de no haber cambiado. La comprobación que ese campo debía aportar nunca existió.

## 3. El aviso que el propio archivo se da, y no cumple

```
docs/methodology/tools/sellar-bloques.mjs:3
 * sellar-bloques · PT-176 · certifica los bloques cerrados tras una corrida completa en verde.
docs/methodology/tools/sellar-bloques.mjs:9
 *   ejercitan son los mismos que cuando se sello, Y que la corrida que lo sello termino en verde.
```

La cabecera declara «tras una corrida completa en verde». Nada en el archivo lo comprueba. La
distancia entre la línea 9 y la línea 68 es el defecto entero.

## 4. Dónde tiene que nacer el hecho

```
docs/methodology/tools/selftest.sh:9586
    [ "$FAILED" -eq 0 ] && echo "selftest: OK · $_cuantos casos" || echo "selftest: HAY FALLOS · …"
```

Ahí, y sólo ahí, existen a la vez `FAILED` (el resultado), `_cuantos` (el alcance) y el
conocimiento de si la corrida fue `--todo` o acotada (`TODO` en `:43`, `ACOTADO` en `:39`). Es el
único punto del sistema donde el hecho está completo.

## 5. Dos obstáculos que el descubrimiento destapa   —   y sin los cuales el arreglo sale roto

### 5.1 `sellar-bloques` no es apuntable a un árbol de pruebas

```
docs/methodology/tools/sellar-bloques.mjs:28-31        docs/methodology/tools/bloques-sellados.mjs:19
const RAIZ = (() => {                                   const RAIZ = process.env.MTH_RAIZ
  const g = … 'rev-parse', '--show-toplevel' …            || (() => { … })();
  return g || join(AQUI, '..', '..', '..');
})();
```

Su hermano honra `MTH_RAIZ`; él no. Sin eso, un caso que plante un recibo sintético en `$WORK`
**no lo leería nunca**: el sellador miraría el repositorio real. El caso «sin recibo» pasaría por
el motivo equivocado y los otros dos fallarían.

### 5.2 El recuento final se mide por POSICIÓN, no por texto

```
docs/methodology/tools/selftest.sh:7284
chk "el recuento final existe"  'selftest: OK'  sh -c 'tail -4 "$1"' _ "$_st"
```

`$_st` es **el propio archivo fuente**. El caso exige que la línea del recuento esté entre las
**cuatro últimas**. Hoy es la antepenúltima. Cualquier bloque añadido detrás de ella la empuja
fuera y pone el caso en rojo — sin que nada de lo que mide haya cambiado.

Es la familia que el `HANDOFF` declara en `-18`: *«un caso puede fijar el cero de lo prohibido,
nunca el número de lo correcto»*. Es su **cuarta** aparición. `PT-191` no la arregla —no es su
tarea— pero **la esquiva a sabiendas**. Queda registrada como **`PT-192`** (`EP-026`).

**Y hay una segunda ventana, que sólo apareció al ejecutar:** `selftest.sh:7237` extrae con
`tail -40`. El bloque del recibo, puesto detrás del recuento, empujó su objetivo fuera y puso dos
casos en rojo. El comentario de `:7235` ya lo había sufrido —`PT-086` amplió esa ventana de 14 a
40 lineas por lo mismo— y dice literalmente: *«extraer por POSICION es fragil en las dos
direcciones»*. Ampliarla otra vez sería mover el día en que vuelve a pasar.

## 6. Lo que NO está roto, y por eso no se toca

- `bloques-sellados.mjs` — su silencio ya significa «no acotes», y eso es correcto.
- El cálculo del sello por contenido (`sellar-bloques.mjs:70-100`) — detecta que un bloque
  **cambió**. Nunca pretendió detectar que **pasó**; ése es el hueco, no un fallo suyo.
