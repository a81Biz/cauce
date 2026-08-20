# PT-077 — La transición mira lo que la consulta bloquea

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-077
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 1
created: 2026-08-19
structural: no
suite_version: 10.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Asegura el uso del marco completo»

Encontrado cumpliéndolo. `tracker siguiente` **bloqueó** una transición de fase y
`tracker avanzar` **la hizo igual**, en la misma orden y con el mismo bloqueo delante:

```
$ tracker siguiente
  PT-075  READY  ·  PHASE 5
  ✗ BLOQUEA:  STATE_MISMATCH · el arbol no corresponde al checkpoint de PT-075 (LEX-R26)
  siguiente:  RESUELVE PRIMERO lo de arriba.

$ tracker avanzar PT-075 --a 6
  · PT-075: PHASE 5 -> 6 Evidencia          <- avanzo
```

## 2. Dónde está, medido

La guarda existe **una sola vez**, en la consulta:

```js
// tracker.mjs:140-143 — dentro de siguienteDe()
// PT-056 · STATE_MISMATCH · el arbol no corresponde al checkpoint.
if (arbol && arbol.corresponde === false) bloqueos.push(textoDiscrepancia(arbol));
```

```
$ awk '/^function avanzar/,/^}/' tracker.mjs | grep -c "corresponde\|STATE_MISMATCH"
0
```

`avanzar` es, por diseño, **la única acción que hace los cinco actos de una transición**
—registro, YAML, checkpoint, espejo y nota—. Es decir: la comprobación que `PT-056` construyó
para impedir trabajar sobre un árbol divergente **no gobierna la única acción que cambia el
estado**.

## 3. Por qué no es cosmético

`LEX-R26` es `HARD` y `PT-056` la construyó con un motivo escrito: *«un checkpoint cuyo commit
es antecesor del actual va por detrás, no miente»* — la discrepancia que sí importa es que el
árbol **no corresponda**. Cuando eso pasa, seguir es una decisión humana (`SUITE-R06`), y la
herramienta lo dice.

Lo dice **y luego lo hace de todas formas** si se le pide por la otra puerta. Un aviso que la
acción siguiente ignora es un aviso que se aprende a saltar.

Es la misma familia que `PT-075`: una comprobación que existe, es correcta, y **no está donde
decide**. En `PT-075` faltaba el verificador; aquí sobra una puerta.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `avanzar` **se niega** con `STATE_MISMATCH` vivo | caso en el fixture: árbol divergente ⇒ `avanzar` no cambia la fase y lo dice |
| AC-02 | Se niega **proponiendo**, no decidiendo | el mensaje remite a `tracker checkpoint PT-NNN`; reescribir el checkpoint solo borraría la prueba de que hubo divergencia (`SUITE-R06`) |
| AC-03 | Sin checkpoint **no** bloquea | `corresponde: null` no es lo mismo que `false`: no tener foto no es tener una mala. Es la distinción que `PT-056` ya dejó escrita |
| AC-04 | La guarda vive en **un solo sitio** | `siguiente` y `avanzar` la consultan de la misma función; dos copias divergirían (`SUITE-R38`) |
| AC-05 | Hay forma de seguir con la discrepancia **declarada** | una decisión humana registrada, no una puerta silenciosa: si se fuerza, queda escrito qué se ignoró |
| AC-06 | Ninguna otra acción que escriba se salta la guarda | revisadas `checkpoint`, `proyectar` y `abrir --aplicar`; las que deban mirarla, la miran, y las que no, se declara por qué |

**`AC-05` es la contención de `AC-01`.** Negarse sin salida convertiría un árbol divergente en
un bloqueo permanente, y la salida sería dejar de usar `avanzar` — que es peor, porque entonces
las transiciones vuelven a hacerse a mano y ninguno de los cinco actos queda garantizado.

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: con un `STATE_MISMATCH` vivo, `tracker avanzar` no cambia la fase salvo que
> una persona lo autorice dejando constancia, y un caso cae si esa guarda desaparece.

## 6. Qué NO entra   `[AGENTE]`

- OUT: reparar automáticamente el checkpoint. `PT-056` lo declaró: reescribirlo borra la única prueba de que hubo divergencia, y decidir si manda el árbol o la foto es `SUITE-R06`.
- OUT: cambiar qué cuenta como discrepancia. Los criterios los fijó `PT-056` y hay casos que los vigilan.
- OUT: `LEX-R26` ni el formato de `CHECKPOINT.json`.

## 7. Firma

```
Firmado por lote: EP-017
```
