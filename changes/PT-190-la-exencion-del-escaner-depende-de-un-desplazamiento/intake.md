# `PT-190` — La exención del escáner de secretos depende de un desplazamiento en bytes

```yaml
---
id: PT-190
type: BUG
severity: S2
epic: EP-025
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`revisar-secretos` decide si un archivo entero es **señuelo** —y por tanto no se revisa— buscando
`señuelo|fixture|a propósito` en sus **primeros 4000 caracteres**:

```js
revisarTexto(txt, rel(p), RE_SEÑUELO.test(txt.slice(0, 4000)));
```

`selftest.sh` contiene por diseño contraseñas, JWT y claves sintéticas: son los fixtures con que se
prueba que el escáner funciona. Su exención dependía de que la palabra `fixture` cayera en el
carácter **3208**.

`PT-188` añadió la guarda del terreno cerca de la cabecera. La palabra pasó al carácter **4242**.

| | carácter de la primera aparición | ¿exime? |
|:---|---:|:---|
| `origin/main` | 3208 | sí |
| esta rama, antes del arreglo | 4242 | **no** |

Resultado: **ocho hallazgos** y `FND-R29` bloqueando `G4`. **Ninguna de las ocho líneas cambió** —
cambió cuánto texto hay **encima** de ellas.

## 2. Por qué es un defecto y no un descuido   `[HUMANO]`

- **No es contrastable.** Nada en el archivo declara «aquí hay señuelos». Quien edite la cabecera
  no tiene forma de saber que está desactivando la exención de todo el fichero.
- **Falla en la dirección cara.** El rojo aparece en `G4`, sobre un PR ya escrito, y el mensaje
  habla de contraseñas — no de que el archivo dejó de eximirse. La lectura natural, «hay un
  secreto», es **falsa**.
- **Es universal.** Todo destino con un archivo de fixtures hereda la misma trampa, y ninguno lo
  sabe hasta que alguien añade un párrafo arriba.

## 3. Cómo se arregla, y cómo NO

**No** ampliando la ventana: cualquier número es igual de arbitrario.
**No** buscando la palabra en todo el archivo: eso eximiría a cualquiera que mencione «fixture» de
pasada, que es la dirección peligrosa.

**Sí** con una declaración **explícita** —`cauce:senuelos`— que vale **esté donde esté**: una línea
que alguien pone a propósito, no un accidente de maquetación.

## 4. Lo que este arreglo NO promete   `SUITE-R26`

**La heurística de los 4000 caracteres se queda.** Los destinos ya instalados dependen de ella y
retirarla los dejaría en rojo sin haber tocado nada (`CE-014`). Queda como lo que siempre fue —una
heurística— con una declaración explícita al lado. El caso `TS-02` la deja **visible**: no la
arregla, la documenta ejecutándola.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | La heurística sigue eximiendo igual que antes | `TS-01` |
| `AC-02` | El defecto queda **visible**: la misma palabra más abajo deja de eximir | `TS-02` |
| `AC-03` | Una declaración explícita exime a cualquier altura | `TS-03` |

## Cómo termina   `FDGE-R53`

> Termina cuando: un archivo con la declaración explícita queda exento **a cualquier altura**, uno
> sin ella se comporta exactamente como antes, y el límite de la heurística está fijado por un caso
> que lo **ejecuta** en vez de describirlo.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-025
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para este lote
—*«tienes mi VoBo y firma para lo que necesites hasta terminar»*—. `SUITE-R27` dice lo que esto
**no** prueba: que firmara una persona. Sí lo hace contrastable — el nombre está en `firmantes`.
