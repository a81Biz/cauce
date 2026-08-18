# PT-049 — El verde se cuenta, no se enumera

> Tarea de la implementación abierta `EP-014` (`FDGE-R51`).

```yaml
---
id: PT-049
type: CHORE
epic: EP-014
track: STANDARD
status: INTEGRATED
created: 2026-08-15
structural: no
suite_version: 8.0.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «cómo reducir el coste de tokens sin perder el contexto»

Que `selftest` y `verify-fdge` puedan decir **qué falló y sobre cuántos**, sin enumerar los
cientos de `✓` que no informan de nada.

Medido en `EP-013`: la batería imprime **541 líneas** y el verificador **454**, y la batería se
ejecutó más de quince veces en una sesión. De cada 541 líneas, 540 decían que todo iba bien.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `-q` reduce la salida a los fallos **y el recuento**, en las dos herramientas | selftest |
| AC-02 | El recuento **nunca** se calla: sin denominador no hay veredicto (`PT-002`) | selftest |
| AC-03 | Con fallos, `-q` los enumera **todos** — no es un modo que además esconda | selftest |
| AC-04 | El código de salida es idéntico con y sin `-q`: el modo no decide, solo imprime | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `bash selftest.sh -q` sobre un árbol sano imprime el recuento y nada más, sobre
> un árbol roto imprime **todos** los fallos y el recuento, y el `exit` coincide con el del modo
> normal en los dos casos.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Reejecutar solo un bloque de la batería | PT-050 |
| Reducir el tamaño de `CORE.md` | — |
| Que `-q` sea el modo por defecto | — |

La tercera fila lleva `—` a propósito: el verde enumerado es lo que hace **creíble** el rojo la
primera vez que alguien lee la salida. Lo que sobra es repetirlo quince veces en una sesión, no
tenerlo.

## 5. Firma

```
Firmado por lote: EP-014
```

## Estado de cierre   `FDGE-R35`

```
INTEGRATED · integrado en la rama por defecto el 2026-08-18
G4 de EP-014 resuelta por Alberto Martinez: «haz el PR y el merge con lo que falte
de G4 para las tareas». El directorio se CONSERVA: es el registro de la propuesta
y de su evidencia.
```
