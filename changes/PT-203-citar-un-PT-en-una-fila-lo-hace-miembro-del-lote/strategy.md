# `PT-203` · `strategy.md`

## La decisión

**La pertenencia a un lote se deriva de `allocations[].epic`.** El intake deja de definirla.

`SUITE-R08` ya dice quién asigna —el registro— y `allocations[].epic` lo tiene escrito para las
229 allocations. Los dos parches anteriores (`PT-011`, `PT-022`) estrecharon la **heurística de
lectura**; un tercero arreglaría los 7 `FANTASMA` y dejaría los 62 `INVISIBLE` intactos.

## Y lo que la medición obliga a decidir

Al derivar del registro, `INTAKE-R08` —`HARD`, bloquea— empieza a cubrir 62 tareas que nunca cubrió.
Medido antes de escribir una línea de código:

```
firma de lote correcta      : 173
SIN linea de firma de lote  :  23   ← EP-024 (16) y EP-025 (7), todas INTEGRATED
firma con OTRO lote         :   1   ← PT-172: intake dice EP-024, registro dice EP-025
sin carpeta o sin intake    :   2   ← PT-032 (EP-008) · PT-171 (EP-024)
```

**Las 23 son trabajo cerrado e integrado.** Ponerles la línea hoy sería reescribir el pasado para
callar una comprobación: `SUITE-R09` es append-only y `CE-014` nombra justo esto —una regla que
juzga hacia atrás—.

**No se retrofecha: se declara la cifra.** Es lo que este repositorio ya hace, con precedente
citado en la salida de la herramienta:

```
! EXEC-R03   4 PT anteriores a la comprobacion no declaran lote y NO se retrofechan (CE-014)
! LEX-R27   17 lote(s) anteriores al barrido declaran «type» y NO se retrofechan (SUITE-R09)
```

Así que: **lo vivo bloquea, lo terminal se cuenta y se nombra.** Un `PT` en estado terminal cuyo
intake no lleve la línea sale como **aviso con su identificador**; uno vivo sigue siendo error.

## `PT-172` es un hallazgo aparte, y no se tapa

Su intake dice `Firmado por lote: EP-024` y el registro dice `EP-025`. **Hoy nadie lo ve**, porque
`RE_SIGN_BATCH` comprueba que *haya* una línea, no que **nombre el lote correcto**:

```js
const RE_SIGN_BATCH = /Firmado\s+por\s+lote:\s*(EP-\d+)/i;   // verify-fdge.mjs:155
if (!RE_SIGN_BATCH.test(it)) fail(…`no lleva «Firmado por lote: ${ep}»`…)
```

El mensaje **nombra el lote** y la comprobación **no lo compara**: el grupo 1 se captura y se tira.
Es el mismo defecto que `PT-198` acaba de cerrar —un mensaje que afirma más de lo que se comprobó—
y cabe aquí porque es la misma línea de código.

Se compara. Y como `PT-172` está `INTEGRATED`, su divergencia entra en la cifra declarada, no en el
rojo.

## Las tres alternativas descartadas

| | Por qué no |
|:---|:---|
| Un tercer recorte de la heurística | Arregla 7 y deja 62. Es el patrón que ya falló dos veces |
| Declarar una columna «Miembro» en la plantilla | Añade forma al intake y deja la pertenencia en un documento que una persona escribe a mano, teniendo el registro |
| Retro-añadir la línea a las 23 | Reescribir trabajo cerrado para callar una comprobación (`SUITE-R09`, `CE-014`) |

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** de dónde salen los miembros de un lote (`verify-fdge.mjs:1593`), y que la firma nombre
el lote correcto (`:155`, `:1602`).

**Fuera, y consta:**
- **`INTAKE-R09`** —«lista `PT-NNN` y no existe su carpeta»— **sigue leyendo la tabla**: ésa sí es
  una comprobación sobre lo que el intake declara, y es su sitio.
- **No se arregla ninguna de las 23.** Se cuentan y se nombran. Corregirlas es una decisión del
  firmante sobre trabajo cerrado, no un efecto de esta tarea.
- **No se promete que la tabla del intake y el registro coincidan.** Un `PT` citado como origen
  seguirá pudiendo aparecer: pasa a ser aviso con su nombre, que es lo que `FDGE-R55` premia.

## El riesgo, y cómo se acota

El riesgo va al revés del síntoma: **una regla `HARD` que empieza a cubrir 62 sujetos nuevos puede
bloquear el lote entero**. Por eso la cifra se mide **antes** de escribir el arreglo —está arriba— y
por eso el caso pareja no es opcional: un `PT` **vivo** sin la línea tiene que seguir en rojo. Si
sólo se avisara, esto cambiaría un `CE-005` por otro más grande.
