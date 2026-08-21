# PT-088 — Autorrevisión   `PHASE 6`

## Tres reglas, y sólo dos se podían verificar

`H-002` nombraba `SUITE-R01`, `SUITE-R09` y `EXEC-R04` como «las tres reglas que sostienen el
dominio y nadie comprueba». Medidas una a una: **dos salieron, una no**, y decir cuál y por qué es
el trabajo.

**`SUITE-R01` es una regla sombrilla.** Su sujeto es una negación sobre el *origen de una
creencia*: «se apoyó en evidencia» y «se apoyó en intuición y luego buscó evidencia» producen
artefactos idénticos. No se verifica, se **instancia** — y sus cuatro instancias sí se comprueban.

Va a `NO-VERIFICABLES.md`, **en último lugar a propósito**. Declararla antes de intentar las otras
dos habría sido declarar sin haber medido.

---

## Lo que la propia batería me cazó, y era el defecto de este lote

Escribí la aserción del caso positivo así:

```sh
chkno "un ledger que solo CRECE pasa"   "SUITE-R09"   V PT-004 "$WORK"
```

**Falló.** Porque en verde la comprobación emite `✓ SUITE-R09`, así que el ID aparece igual.

Yo estaba comprobando **que no apareciera el identificador** cuando lo que quería establecer es
**que no apareciera el fallo**. Es la misma forma que `PT-087` cierra —el proxy en vez del hecho—
escrita por mí dentro del lote que existe para cerrarla, y a las horas de haber documentado seis
instancias.

Corregido a `"desaparecida"`, que es el hecho.

---

## El `ReferenceError` que mi propio `grep` escondió

`verify-fdge` ya tenía un `rige(id)`, **dentro de `checkPT`**. Mis dos comprobaciones son globales
y lo usaron sin tenerlo en alcance:

```
$ node verify-fdge.mjs PT-088 2>&1 | grep -E "SUITE-R09|EXEC-R04|✗"
  if (!rige('SUITE-R09')) return;         <- la unica linea: el CODIGO FUENTE, no la salida
exit=0
```

La herramienta reventaba y yo leí «no emite nada todavía». **Filtrar antes de mirar es la versión
de consola del mismo patrón.** Y `exit=0` porque la tubería devuelve el código del `grep`.

Se vio ejecutando sin filtro. `rigeGlobal` usa la versión del **registro**, que es de quien es el
hecho.

---

## La prueba inversa que no disparó, y por qué eso estaba bien

Borré cuatro líneas de `HISTORY.log` y la comprobación siguió verde. Primer impulso: el
verificador está mal.

**No lo estaba.** `git diff tag HEAD` compara **commits**, y mi borrado estaba sin commitear. Una
reescritura sólo *cuenta* cuando entra en la historia — que es exactamente lo que `SUITE-R09`
protege.

Rehecha en una rama temporal con el borrado commiteado: **roja**, con las cuatro líneas.

Y me costó el susto de la sesión: borré la rama temporal con `git branch -D` y se llevó el commit
que contenía **todo el trabajo de la tarea**. Recuperado del reflog, y **sólo los tres artefactos**
— no `HISTORY.log`, que en ese commit estaba mutilado a propósito.

---

## Y el tercero: declaré un límite que no había medido

Escribí, en cinco documentos y en el mensaje de la propia comprobación, que **una alteración de
igual recuento pasaba**. Y monté un caso que lo ejercitaba esperando **verde**.

Salió **rojo**. `git` representa una modificación como `-vieja` más `+nueva`, así que la línea `-`
está en el diff y `SUITE-R09` **sí la caza**.

**La comprobación era más fuerte de lo que su autor creía**, y lo que estaba mal era mi
descripción de ella. Es la misma forma que este lote existe para cerrar —afirmar sin medir— y la
cometí *describiendo el límite* de la comprobación que la combate. La midió el caso, no yo.

El límite real, ya escrito donde corresponde: **no distingue una corrección legítima de una
falsificación**. En un append-only las dos están prohibidas, así que un `fail` acusa de haber
reescrito, no de mala fe.

## Dos decisiones para que las comprobaciones no digan de más

| | Por qué |
|:---|:---|
| El mensaje de `SUITE-R09` **declara qué no distingue** | Sin eso, su rojo se leería como acusación de falsificar |
| El mensaje de `EXEC-R04` **declara que no prueba** que la autorización fuera real | El agente escribe la constancia. Es `H-009`, y lo declara `PT-093` |

Y hay **dos casos que asertan sobre esas frases**. Sin ellos, alguien las borraría por ruidosas y
el verde pasaría a decir más de lo que mide.

---

## Y un cuarto, que es el más limpio de los cuatro

Escribí en un comentario de `verify-fdge.mjs` la frase *«reventaba con TypeError»*. **Trece casos
de la batería empezaron a reportar «la herramienta reventó»** — trece casos que hacen `cat` de ese
archivo, y ninguna herramienta había reventado.

```sh
revento() { printf '%s' "$1" | grep -qE 'SyntaxError|ReferenceError|TypeError|…'; }
```

**Perseguí el fantasma durante tres reproducciones** —tres repositorios sintéticos, ninguno
reventaba— antes de mirar dónde estaba de verdad: en el texto que yo mismo había escrito.

El `no hacer` del `HANDOFF` ya avisaba de esta forma exacta para las emisiones: *«escribir en un
comentario el patrón literal de una emisión: `fallosPosibles` lo cuenta como emisión real»*. El
mismo defecto vivía en el detector de crashes y nadie los había relacionado.

**Es la séptima instancia del patrón**, registrada en `PT-087` y como revisión de `H-003`. Aquí se
resolvió reescribiendo el comentario, que es un parche: el sujeto de `revento()` es «el proceso
terminó de forma anómala» y su observable —el código de salida— existe y la función no lo mira.

---

## La ventana, que es la mitad de `EXEC-R04`

```
merges a main            18
merges desde v9.0.0       1     y tiene su constancia
```

Sin `RIGE_DESDE`, la regla nace con **17 fallos** sobre trabajo de agosto. No «menos elegante»:
**inaplicable**, porque una comprobación que nace roja se apaga y entonces no protege el día que
tiene razón — `PT-023` lo midió.

---

## Lo que no se verifica, y está declarado

**Que la autorización de `G4` fuera real.** El agente escribe la constancia y el agente podría
ejecutar el merge. Aquí se construye el rastro; `PT-093` dirá lo que vale.

**Que `SUITE-R01` sea de verdad inverificable.** Es una decisión con firma, no una constatación.
Si el firmante ve un observable que se me escapó, la fila sale y la deuda vuelve.

`AC-01`..`AC-09`, los nueve.
