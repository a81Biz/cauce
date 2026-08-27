# PT-151 — `npm run verify` no es lo que corre CI, y el `CLAUDE.md` dice que sí

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera**.

```yaml
---
id: PT-151
type: BUG
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-25
structural: no
suite_version: 13.1.0
origen_parada: EP-022
---
```

## 1. Comportamiento esperado   `[HUMANO]`

El `CLAUDE.md` del repositorio publica el comando como la batería de CI:

```
npm run verify    # todo lo anterior, como en CI
```

Lo esperado es que un `EXIT=0` en local signifique que CI va a pasar.

## 2. Comportamiento observado

Medido el 2026-08-25 durante `EP-022`: **`verify` en verde y el check `marco` en rojo, con ocho
errores bloqueantes.**

```
npm run verify = verify:patrones && verify:suite && core:check && matriz:check
                 && audit && verify:secretos && verify:espejo && selftest

CI · «marco»   = lo anterior + verify-fdge sobre TODOS los PT
```

`verify-fdge` **no está en `npm run verify`**. Lo que sólo vio CI:

```
FDGE-R55 x7   ninguna de las siete allocations citaba la parada que la produjo
SUITE-R34     el bloque ESTADO no reflejaba el trabajo en changes/
```

Los dos son **bloqueantes** y habrían llegado al PR sin que nada local avisara.

## 3. Por qué importa más de lo que parece

`SUITE-R01` apoya toda decisión en **evidencia verificable**. Un comando que promete equivaler a
CI y no equivale produce el fallo que este marco persigue: **creer que se verificó lo que no se
verificó**.

Y no es teórico: sobre esa base se declaró «todo verde» durante `EP-022`, y el primer PR lo
desmintió.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `npm run verify` incluye **todo** lo que corre el check `marco` | comparación mecánica script ↔ workflow |
| AC-02 | La equivalencia **se comprueba**: un paso añadido a `verificacion.yml` y no a `verify` **falla** | caso que añade un paso al workflow |
| AC-03 | El `CLAUDE.md` puede decir «como en CI» **porque es cierto** | lectura, tras `AC-02` |
| AC-04 | Se declara cuánto tarda la batería ahora | medición antes/después |

**`AC-02` es el criterio real.** Igualar las dos listas hoy las deja iguales hoy; sin una
comprobación que las contraste, divergen a la primera adición — que es literalmente lo que pasó.

**`AC-04` no es cosmético**: `verify-fdge` sobre todos los PT no es gratis y la batería ya tarda
unos 25 minutos. Alargarla sin decirlo empuja a saltársela, y una batería que se salta no
verifica nada.

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: añadir un paso a `verificacion.yml` sin añadirlo a `npm run verify` **hace
> fallar** una comprobación, y el `CLAUDE.md` puede decir «como en CI» sin mentir.

## 6. Qué NO entra   `[AGENTE]`

- OUT: cambiar **qué** comprueba CI. Se iguala lo local a lo remoto, no al revés.
- OUT: partir la batería en perfiles rápidos. Es razonable y es otra tarea.
- OUT: las otras ocho de `EP-024`.

## 7. Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **Va la primera del lote a propósito.** Mientras `verify` no equivalga a CI, cualquier otra
  tarea puede declararse verde en local y descubrir el rojo en el PR — que es como se descubrió
  esto.
- **Es `CE-008` con un giro:** no son dos copias del mismo dato divergiendo, es **una copia y una
  promesa sobre ella**. El `CLAUDE.md` afirma una equivalencia que nada comprueba.
- **Toca `package.json` y `CLAUDE.md`.** El segundo es el archivo que `SUITE-R00` declara que
  parametriza y no legisla: aquí no se cambia ninguna regla, se corrige una afirmación falsa
  sobre una herramienta.
