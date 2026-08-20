# PT-088 — Descubrimiento   `PHASE 2`

> **Todo lo de aquí está medido antes de escribir una sola línea de verificador.** Es la lección
> de `PT-085`, que midió `SUITE-R57` antes de definirla y descubrió que la definición ingenua
> daba 13 contra un umbral de 3 — un candado con la llave dentro.

---

## `A` · `SUITE-R09` — el ledger es append-only y nada lo comprueba

### Dónde está, con archivo y línea

`RULES.md` la define. Y `regla.mjs` responde:

```
$ node docs/methodology/tools/regla.mjs SUITE-R09
  la comprueba  ningún verificador la emite con su nombre.
```

**Es la base de evidencia de todo el marco.** `HISTORY.log` tiene 4 036 líneas, `SESSION_LOG.md`
2 637, y el `no hacer` del `HANDOFF` dice literalmente que `SUITE-R09` es lo que hace permanentes
los hechos. Nada detecta que se reescriban.

### Es mecánicamente comprobable — **medido, no supuesto**

```
$ git diff v9.0.0 HEAD -- <archivo>   ->  contar lineas que empiezan por «-»

docs/implementation/HISTORY.log          lineas borradas desde v9.0.0: 0
docs/implementation/SESSION_LOG.md       lineas borradas desde v9.0.0: 0
docs/implementation/INCIDENTS.log        lineas borradas desde v9.0.0: 0
```

### Y se vio **en rojo** antes de escribirla   `FDGE-R17`

Se borraron cuatro líneas de en medio de `HISTORY.log`, se midió, y se restauró:

```
simulada una reescritura: 4 lineas borradas
lineas borradas detectadas: 4 · anadidas: 0
ROJO — la comprobacion CAZA la reescritura
restaurado · git status: (vacio = intacto)
```

**La comprobación funciona y se vio funcionar.** No es una inferencia sobre lo que git haría.

### Lo que esta comprobación NO establece — y va en su sujeto

Mira **líneas borradas**, no contenido. Un ledger cuyo texto se altere **conservando el número de
líneas** pasaría. Es más fuerte que nada y más débil que un hash encadenado.

Se dice aquí y se dirá en el sujeto de la regla, porque no declararlo sería la séptima instancia
del patrón que `PT-087` cierra: una comprobación que mira un proxy —el recuento— y se presenta
como si estableciera el hecho —la inmutabilidad—.

---

## `B` · `EXEC-R04` — `G4` es humana y nada deja rastro comprobable

### Dónde está

```
$ node docs/methodology/tools/regla.mjs EXEC-R04
  la comprueba  ningún verificador la emite con su nombre.
```

Lo que **sí** existe, en `verify-fdge.mjs:762`, es `SUITE-R06`: toda entrada `INTEGRATED` de
`HISTORY.log` debe llevar el nombre de quien integró. Es un control **por tarea**, no por merge.

### El dato que decide la forma de la regla

```
$ git log --merges --first-parent origin/main
merges a main:  18

$ git log --merges --first-parent v9.0.0..origin/main
merges a main desde v9.0.0:  1
  78d64e9 | 2026-08-20 | Merge pull request #152 from a81Biz/trabajo
```

**18 merges históricos y uno solo desde el último tag** — y ése tiene su constancia:
`SESSION_LOG.md`, entrada *«`G4` autorizado al agente — excepción declarada»* del 2026-08-19.

Una regla que exigiera constancia para **todos** los merges nacería con **17 fallos** sobre
trabajo de agosto. Es exactamente el defecto de `PT-081`, y por eso `AC-07` pide su fila en
`RIGE_DESDE` — no como formalidad, sino porque **sin ella esta regla es inaplicable**.

### La forma que sí funciona

Comprobar los merges a la rama por defecto **posteriores a la versión en que la regla entra**, y
exigir para cada uno una entrada de autorización cuyo nombre esté en `firmantes`.

---

## `C` · `SUITE-R01` — «Evidence Before Action», y es irreducible tal cual

### El texto

> Toda decisión técnica se apoya en evidencia verificable en un artefacto o en la ejecución
> observada. Nunca en memoria del agente, intuición, suposición ni contexto conversacional.

```
$ node docs/methodology/tools/regla.mjs SUITE-R01
  la comprueba  ningún verificador la emite con su nombre.
```

### Por qué no se puede verificar como está

**El sujeto de la regla es una negación sobre el origen de una creencia.** «Se apoyó en evidencia»
y «se apoyó en intuición y luego se buscó evidencia» producen **artefactos idénticos**. No hay
observable en el repositorio que los distinga.

Lo que sí se puede comprobar son sus **consecuencias**, y el marco ya las comprueba una por una:
`FDGE-R23` (cada `AC` con su evidencia), `FDGE-R24` (evidencia real capturada), `PTSA-R14`
(afirmación sin respaldo es hallazgo), `SUITE-R11` (score sin cobertura es nulo).

### La conclusión de este descubrimiento

`SUITE-R01` es una **regla sombrilla**: no se verifica, se **instancia**. Y `PT-078` dejó montado
exactamente el mecanismo para decirlo — `docs/implementation/NO-VERIFICABLES.md`, cinco reglas ya
declaradas con motivo y firma.

**La vía de la declaración no es una rendición.** Forzar un verificador que compruebe «hay
artefactos» y llamarlo `SUITE-R01` sería la séptima instancia del patrón: mediría cumplimiento de
formato y afirmaría haber medido honestidad epistémica.

---

## Lo que el descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| `SUITE-R09` | «git sabe si los bytes anteriores cambiaron» | Cuenta **líneas borradas**, no bytes. Más débil, y se declara |
| `EXEC-R04` | «todo merge tiene entrada con nombre humano» | **Todo merge posterior a la versión de entrada.** 18 históricos vs 1 desde `v9.0.0` |
| `SUITE-R01` | «descomponerla, o declararla» | **Descomponerla no procede**: sus consecuencias ya están verificadas por cuatro reglas. Va a `NO-VERIFICABLES.md` |

Las tres van en la misma dirección: **la comprobación es más estrecha de lo que la regla promete**,
y en los tres casos eso se declara en vez de disimularse.

Es el banco de pruebas que `EP-018` §6 dice que estas tres son para `PT-087`: **las tres necesitan
declarar qué NO establecen**, y ninguna forma de decirlo existe todavía.
