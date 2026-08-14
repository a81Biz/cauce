# PT-005 — La firma atada al hash, y la historia dada por revisada

> Tarea dentro de la implementación abierta `EP-001` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-005
type: BUG
epic: EP-001
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 5.3.0
phase: 8
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Reabrir EP-001»

Dicho el 2026-08-13 al presentarle la condición bloqueante de `G4` y las dos salidas
posibles. Reabrir el lote con una quinta tarea es la que eligió.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una excepción firmada sigue eximiendo aunque cambie la profundidad del clon | La huella de un hallazgo de historia deja de depender del hash del commit |
| AC-02 | Un valor distinto vuelve a bloquear | Sigue siendo cierto lo que `FND-R29` promete: la firma cubre el valor, no el archivo |
| AC-03 | Un clon superficial **no** se da por historia revisada | Caso de `selftest.sh` sobre un clon `--depth 1`: la salida dice `SIN EVALUAR`, no «revisado» |
| AC-04 | El mensaje dice qué hacer | Nombra `fetch-depth: 0` (`RULE-07`) |
| AC-05 | CI clona la historia entera | `verificacion.yml` declara `fetch-depth: 0` en el `checkout` |
| AC-06 | El PR de `G4` pasa el paso de secretos | Ejecución real sobre el PR #7, no un fixture |
| AC-07 | Un repositorio sin `.git` sigue funcionando | El árbol se revisa igual; la historia se declara no evaluable |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el paso `Ningún secreto sin firmar` del PR #7 pasa en verde, y un clon
> superficial declara la historia `SIN EVALUAR` en vez de darla por revisada.

## 4. Qué NO entra   `[AGENTE]`

- OUT: quitar `--historial` de CI. Se arregla la compuerta, no se apaga
- OUT: firmar las huellas sintéticas del merge de GitHub. Cambian en cada PR: firmar algo que no se puede volver a comprobar es silenciar el escáner
- OUT: cambiar qué se considera un secreto. Los patrones no se tocan
- OUT: reescribir la historia para borrar los fixtures (`SUITE-R06f`)

## 5. Firma

```
Firmado por lote: EP-001
```

---

## Evidencia de que el defecto existe

```
local   node revisar-secretos.mjs . --historial   →  Sin hallazgos sin firmar
CI (PR) el mismo comando                          →  7 hallazgo(s), exit 1
```

Los 7 se atribuyen a `historia 3f8e23db:1`, un commit **que no existe en ningún clon**: es el
merge sintético que GitHub fabrica para el evento `pull_request`.

**Dos defectos, no uno.**

**1 · La huella depende del hash.** `revisar-secretos.mjs:80` calcula
`sha1(qué | dónde | muestra)`, y para la historia `dónde` es `historia ${commit}:${línea}`. Las
seis excepciones firmadas apuntan a `e88a63ba` y `7ef06b42`, los commits reales. Con un clon
superficial el único commit es sintético y **distinto en cada PR**, así que ninguna firma
encaja jamás: la compuerta queda en rojo permanente sobre toda propuesta de merge — que es
como funciona `G4`.

Es el razonamiento que creó `SECRETOS-EXCEPCIONES.md` en la 5.2.2, reproducido dentro de la
compuerta que ese archivo vino a arreglar.

**2 · Y el fallo simétrico, que es peor.** `revisar-secretos.mjs:112` pone
`historialRevisado = true` en cuanto `git log` responde algo. Con `fetch-depth: 1` responde
**un solo commit**, y la herramienta informa de que revisó la historia habiendo visto casi
nada. Un árbol limpio sobre un clon superficial daría **verde sin haber mirado** — el falso
verde por omisión que este marco existe para cazar, en la compuerta que protege lo
irreversible.

`actions/checkout@v4` clona con `fetch-depth: 1` por defecto, y `verificacion.yml` no lo
declara.

**Por qué no salió antes:** es el primer PR desde que `--historial` entró en CI (`309f032`, ya
en `main`). El PR #1 es anterior.
